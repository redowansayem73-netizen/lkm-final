import type { MetadataRoute } from 'next';
import { db } from '@/db';
import { services, brands, blogPosts, products, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

const BASE_URL = 'https://lakembamobileking.com.au';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/shop`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/services`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/repair`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/brands`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
    ];

    // Dynamic pages from DB
    let dynamicPages: MetadataRoute.Sitemap = [];

    try {
        // Services
        const allServices = await db
            .select({ slug: services.slug, updatedAt: services.updatedAt })
            .from(services)
            .where(eq(services.isActive, true));

        dynamicPages = dynamicPages.concat(
            allServices.map((s) => ({
                url: `${BASE_URL}/services/${s.slug}`,
                lastModified: s.updatedAt || new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }))
        );

        // Brands
        const allBrands = await db
            .select({ slug: brands.slug, updatedAt: brands.updatedAt })
            .from(brands)
            .where(eq(brands.isActive, true));

        dynamicPages = dynamicPages.concat(
            allBrands.map((b) => ({
                url: `${BASE_URL}/brands/${b.slug}`,
                lastModified: b.updatedAt || new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            }))
        );

        // Products
        const allProducts = await db
            .select({ slug: products.slug, updatedAt: products.updatedAt })
            .from(products)
            .where(eq(products.isActive, true));

        dynamicPages = dynamicPages.concat(
            allProducts.map((p) => ({
                url: `${BASE_URL}/products/${p.slug}`,
                lastModified: p.updatedAt || new Date(),
                changeFrequency: 'daily' as const,
                priority: 0.7,
            }))
        );

        // Blog posts
        const allPosts = await db
            .select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt })
            .from(blogPosts)
            .where(eq(blogPosts.status, 'published'));

        dynamicPages = dynamicPages.concat(
            allPosts.map((p) => ({
                url: `${BASE_URL}/blog/${p.slug}`,
                lastModified: p.updatedAt || new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.6,
            }))
        );

        // Categories
        const allCategories = await db
            .select({ slug: categories.slug, updatedAt: categories.updatedAt })
            .from(categories)
            .where(eq(categories.isActive, true));

        dynamicPages = dynamicPages.concat(
            allCategories.map((c) => ({
                url: `${BASE_URL}/shop?category=${c.slug}`,
                lastModified: c.updatedAt || new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.6,
            }))
        );
    } catch (error) {
        console.error('Sitemap generation error:', error);
    }

    return [...staticPages, ...dynamicPages];
}
