import { db } from "@/db";
import { blogCategories } from "@/db/schema";
import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const categories = await db.select()
            .from(blogCategories)
            .orderBy(asc(blogCategories.name));

        return NextResponse.json(categories);
    } catch (error) {
        console.error("Error fetching blog categories:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name } = await req.json();

        if (!name || typeof name !== 'string') {
            return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
        }

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

        const [result] = await db.insert(blogCategories).values({ name, slug });

        return NextResponse.json({ id: result.insertId, name, slug }, { status: 201 });
    } catch (error) {
        console.error("Error creating blog category:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
