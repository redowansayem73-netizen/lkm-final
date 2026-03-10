import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { services } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const [service] = await db.select().from(services).where(eq(services.id, parseInt(params.id))).limit(1);
        if (!service) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }
        return NextResponse.json(service);
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

        await db.update(services)
            .set({
                title: body.title,
                slug: body.slug,
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
                isActive: body.isActive,
            })
            .where(eq(services.id, parseInt(params.id)));

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Failed to update service:", error);
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
        await db.delete(services).where(eq(services.id, parseInt(params.id)));
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Failed to delete service:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
