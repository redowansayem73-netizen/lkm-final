import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { services } from '@/db/schema';
import { desc, like, eq, and, or, count } from 'drizzle-orm';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '20');
        const search = searchParams.get('search') || '';

        const conditions = [];
        if (search) {
            conditions.push(
                or(
                    like(services.title, `%${search}%`),
                    like(services.slug, `%${search}%`)
                )
            );
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const [countResult] = await db.select({ count: count() }).from(services).where(whereClause);
        const total = Number(countResult?.count) || 0;

        const offset = (page - 1) * pageSize;
        const items = await db
            .select()
            .from(services)
            .where(whereClause)
            .orderBy(desc(services.createdAt))
            .limit(pageSize)
            .offset(offset);

        return NextResponse.json({
            services: items,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        });
    } catch (error: any) {
        console.error('Error fetching services:', error);
        return NextResponse.json({ error: 'Failed to fetch services', details: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        const result = await db.insert(services).values({
            title: body.title,
            slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            icon: body.icon || null,
            heroDescription: body.heroDescription || null,
            heroImage: body.heroImage || null,
            content: body.content || null,
            turnaroundTime: body.turnaroundTime || null,
            modelsList: body.modelsList ? JSON.stringify(body.modelsList) : null,
            faqData: body.faqData ? JSON.stringify(body.faqData) : null,
            metaTitle: body.metaTitle || null,
            metaDescription: body.metaDescription || null,
            focusKeyword: body.focusKeyword || null,
            isActive: body.isActive !== undefined ? body.isActive : true,
        });

        return NextResponse.json({ success: true, id: result[0].insertId });
    } catch (error: any) {
        console.error('Error creating service:', error);
        return NextResponse.json({ error: 'Failed to create service', details: error.message }, { status: 500 });
    }
}
