import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';

// Returns available filter options (tags, brands, conditions, price range)
// for a given category or globally

export const revalidate = 60; // Cache these heavy aggregate queries for 60 seconds

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const categorySlug = searchParams.get('category');

        let categoryId: number | null = null;
        if (categorySlug) {
            const cat = await db.select().from(categories)
                .where(eq(categories.slug, categorySlug)).limit(1);
            if (cat.length > 0) categoryId = cat[0].id;
        }

        const conditions: any[] = [eq(products.isActive, true)];
        if (categoryId) {
            // Also include child categories
            const childCats = await db.select({ id: categories.id })
                .from(categories)
                .where(eq(categories.parentId, categoryId));
            const catIds = [categoryId, ...childCats.map(c => c.id)];

            if (catIds.length === 1) {
                conditions.push(eq(products.categoryId, catIds[0]));
            } else {
                conditions.push(sql`${products.categoryId} IN (${sql.join(catIds.map(id => sql`${id}`), sql`, `)})`);
            }
        }

        const whereClause = and(...conditions);

        // Get unique tags
        const tagResults = await db
            .selectDistinct({ tags: products.tags })
            .from(products)
            .where(and(whereClause, sql`${products.tags} IS NOT NULL AND ${products.tags} != ''`));

        const tagCounts = new Map<string, number>();
        tagResults.forEach(row => {
            if (row.tags) {
                row.tags.split(',').forEach(t => {
                    const tag = t.trim();
                    if (tag) tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
                });
            }
        });
        const tags = [...tagCounts.entries()]
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        // Get unique brands
        const brandResults = await db
            .select({
                brand: products.brand,
                count: sql<number>`COUNT(*)`,
            })
            .from(products)
            .where(and(whereClause, sql`${products.brand} IS NOT NULL AND ${products.brand} != ''`))
            .groupBy(products.brand)
            .orderBy(sql`COUNT(*) DESC`);

        const brands = brandResults.map(r => ({
            name: r.brand!,
            count: Number(r.count),
        }));

        // Get unique conditions
        const conditionResults = await db
            .select({
                condition: products.condition,
                count: sql<number>`COUNT(*)`,
            })
            .from(products)
            .where(and(whereClause, sql`${products.condition} IS NOT NULL AND ${products.condition} != ''`))
            .groupBy(products.condition)
            .orderBy(sql`COUNT(*) DESC`);

        const conditionsList = conditionResults.map(r => ({
            name: r.condition!,
            count: Number(r.count),
        }));

        // Get price range
        const priceRange = await db
            .select({
                minPrice: sql<number>`MIN(CAST(${products.price} AS DECIMAL(10,2)))`,
                maxPrice: sql<number>`MAX(CAST(${products.price} AS DECIMAL(10,2)))`,
            })
            .from(products)
            .where(whereClause);

        return NextResponse.json({
            tags,
            brands,
            conditions: conditionsList,
            priceRange: {
                min: Number(priceRange[0]?.minPrice || 0),
                max: Number(priceRange[0]?.maxPrice || 1000),
            },
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
            }
        });
    } catch (error) {
        console.error("Failed to fetch filters:", error);
        return NextResponse.json({ error: 'Failed to fetch filters' }, { status: 500 });
    }
}
