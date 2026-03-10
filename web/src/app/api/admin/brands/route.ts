import { NextResponse } from 'next/server';
import { db } from '@/db';
import { brands } from '@/db/schema';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();

        const result = await db.insert(brands).values({
            name: body.name,
            slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            logo: body.logo || null,
            isPopular: body.isPopular || false,
            isActive: body.isActive !== undefined ? body.isActive : true,
            sortOrder: body.sortOrder || 0,
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
        });

        return NextResponse.json({ success: true, id: result[0].insertId });
    } catch (error: any) {
        console.error("Failed to create brand:", error);
        return NextResponse.json({ error: 'Failed to create brand', details: error.message }, { status: 500 });
    }
}
