import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products, productVariants, productImages, categories } from '@/db/schema';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { eq, and, gte, lte, inArray, like, exists, or, sql } from 'drizzle-orm';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const brand = searchParams.get('brand');
        const categorySlug = searchParams.get('category');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const condition = searchParams.get('condition');
        const storage = searchParams.get('storage'); // Comma separated
        const search = searchParams.get('search');
        const tags = searchParams.get('tags');
        const limit = parseInt(searchParams.get('limit') || '20');
        const page = parseInt(searchParams.get('page') || '1');
        const offset = (page - 1) * limit;

        let categoryIds: number[] = [];
        if (categorySlug) {
            const slugs = categorySlug.split(',').map(s => s.trim()).filter(Boolean);
            if (slugs.length > 0) {
                const foundCategories = await db.select().from(categories).where(inArray(categories.slug, slugs));
                if (foundCategories.length > 0) {
                    const parentIds = foundCategories.map(c => c.id);
                    // Also include all child categories so parent categories show all their children's products
                    const childCats = await db.select({ id: categories.id })
                        .from(categories)
                        .where(inArray(categories.parentId, parentIds));
                    categoryIds = [...parentIds, ...childCats.map(c => c.id)];
                }
            }
        }

        const conditions = []; // Default active check or handled below

        if (brand) {
            conditions.push(eq(products.brand, brand));
        }
        if (categoryIds.length > 0) {
            if (categoryIds.length === 1) {
                conditions.push(eq(products.categoryId, categoryIds[0]));
            } else {
                conditions.push(inArray(products.categoryId, categoryIds));
            }
        }
        if (minPrice) {
            conditions.push(gte(products.price, minPrice.toString()));
        }
        if (maxPrice) {
            conditions.push(lte(products.price, maxPrice.toString()));
        }
        if (condition) {
            // Handle multiple conditions if comma separated, e.g. "New,Used"
            if (condition.includes(',')) {
                conditions.push(inArray(products.condition, condition.split(',')));
            } else {
                conditions.push(eq(products.condition, condition));
            }
        }

        // Advanced Search filter (name, SKU, brand, tags)
        if (search) {
            // Stop words that do not add value to the product search
            const stopWords = ['for', 'the', 'and', 'with', 'in', 'of', 'a', 'an', 'to', 'type', 'types', 'phone'];

            // Clean, split, and basic-stem the search string into meaningful terms
            const searchTerms = search
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, ' ') // Remove special chars but keep hyphens/spaces
                .split(/\s+/)
                .filter(term => term.length > 0 && !stopWords.includes(term))
                .map(term => {
                    // Simple, broad stemming for plurals
                    if (term.length > 4 && term.endsWith('es')) return term.slice(0, -2);
                    if (term.length > 3 && term.endsWith('s')) return term.slice(0, -1);
                    return term;
                });

            if (searchTerms.length > 0) {
                // For each term, it must be found in at least one of these columns (AND of ORs)
                const termConditions = searchTerms.map(term =>
                    or(
                        like(products.name, `%${term}%`),
                        like(products.sku, `%${term}%`),
                        like(products.brand, `%${term}%`),
                        like(products.tags, `%${term}%`)
                    )
                );
                // Push the AND condition enclosing all terms
                conditions.push(and(...termConditions));
            }
        }

        // Tags filter (exact matches)
        if (tags) {
            const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
            if (tagList.length > 0) {
                const tagConditions = tagList.map(tag => like(products.tags, `%${tag}%`));
                conditions.push(and(...tagConditions));
            }
        }

        // Total count for pagination
        const totalResult = await db.select({ count: db.$count(products) }).from(products)
            .where(and(eq(products.isActive, true), ...conditions));
        const totalCount = totalResult[0]?.count || 0;

        const allProducts = await db.select().from(products)
            .where(and(eq(products.isActive, true), ...conditions))
            .limit(limit)
            .offset(offset);

        // Fetch variants for all products
        let allVariants: any[] = [];
        try {
            if (allProducts.length > 0) {
                const productIds = allProducts.map(p => p.id);
                allVariants = await db.select().from(productVariants).where(inArray(productVariants.productId, productIds));
            }
        } catch (e) {
            console.warn('Could not fetch variants:', e);
        }

        // Fetch images for all products
        let allImages: any[] = [];
        try {
            if (allProducts.length > 0) {
                const productIds = allProducts.map(p => p.id);
                allImages = await db.select().from(productImages).where(inArray(productImages.productId, productIds));
            }
        } catch (e) {
            console.warn('Could not fetch images:', e);
        }

        // Group variants by productId
        const variantsByProduct = allVariants.reduce((acc: any, variant: any) => {
            if (!acc[variant.productId]) {
                acc[variant.productId] = [];
            }
            acc[variant.productId].push(variant);
            return acc;
        }, {});

        // Group images by productId and find primary image
        const imagesByProduct = allImages.reduce((acc: any, image: any) => {
            if (!acc[image.productId]) {
                acc[image.productId] = [];
            }
            acc[image.productId].push(image);
            return acc;
        }, {});

        // Add variants and primary image to each product
        const productsWithData = allProducts.map(product => {
            const images = imagesByProduct[product.id] || [];
            const primaryImage = images.find((img: any) => img.isPrimary) || images[0];

            return {
                ...product,
                variants: variantsByProduct[product.id] || [],
                primaryImage: primaryImage?.imageUrl || null
            };
        });

        return NextResponse.json({
            products: productsWithData,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
            }
        });
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const result = await db.insert(products).values(body);
        const insertId = (result as any)[0].insertId;

        return NextResponse.json({ success: true, id: insertId }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
