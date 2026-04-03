import { db } from "./src/db";
import { categories, products } from "./src/db/schema";
import { eq, sql, and } from "drizzle-orm";

async function main() {
    try {
        const results = await db
            .select({
                id: categories.id,
                name: categories.name,
                slug: categories.slug,
                parentId: categories.parentId,
                isActive: categories.isActive,
                productCount: sql<number>`(SELECT COUNT(*) FROM products WHERE products.category_id = ${categories.id} AND products.is_active = 1)`,
            })
            .from(categories)
            .orderBy(categories.parentId, categories.name);

        console.log("\n=== ALL CATEGORIES IN DATABASE ===\n");
        console.log("ID | Name | Slug | ParentID | Active | Products");
        console.log("-".repeat(80));
        results.forEach(r => {
            const indent = r.parentId ? "  └─ " : "";
            console.log(`${r.id} | ${indent}${r.name} | ${r.slug} | parent:${r.parentId || 'ROOT'} | ${r.isActive ? '✓' : '✗'} | ${r.productCount} products`);
        });
        console.log(`\nTotal: ${results.length} categories`);
        
        // Show only root categories with their product counts (including children)
        const roots = results.filter(r => !r.parentId);
        console.log("\n=== ROOT CATEGORIES ===\n");
        for (const root of roots) {
            const children = results.filter(r => r.parentId === root.id);
            const totalProducts = root.productCount + children.reduce((sum, c) => sum + c.productCount, 0);
            console.log(`${root.name} (${root.slug}) - ${totalProducts} total products, ${children.length} subcategories`);
            children.forEach(c => console.log(`  └─ ${c.name} (${c.productCount} products)`));
        }
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
main();
