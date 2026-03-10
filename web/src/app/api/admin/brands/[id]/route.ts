import { NextResponse } from 'next/server';
import { db } from '@/db';
import { brands } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const [brand] = await db.select().from(brands).where(eq(brands.id, parseInt(params.id))).limit(1);
        if (!brand) {
            return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
        }
        return NextResponse.json(brand);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();

        await db.update(brands)
            .set({
                name: body.name,
                slug: body.slug,
                logo: body.logo,
                isPopular: body.isPopular,
                isActive: body.isActive,
                sortOrder: body.sortOrder,
                heroTitle: body.heroTitle || null,
                heroDescription: body.heroDescription || null,
                heroImage: body.heroImage || null,
                content: body.content || null,
                turnaroundTime: body.turnaroundTime || null,
                modelsList: body.modelsList ? JSON.stringify(body.modelsList) : null,
                faqData: body.faqData ? JSON.stringify(body.faqData) : null,
                metaTitle: body.metaTitle || null,
                metaDescription: body.metaDescription || null,
                focusKeyword: body.focusKeyword || null,
            })
            .where(eq(brands.id, parseInt(params.id)));

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Failed to update brand:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await db.delete(brands).where(eq(brands.id, parseInt(params.id)));
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Failed to delete brand:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
