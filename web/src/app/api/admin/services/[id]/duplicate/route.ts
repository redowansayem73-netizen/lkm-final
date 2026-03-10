import { NextResponse } from 'next/server';
import { db } from '@/db';
import { services } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const [original] = await db.select().from(services).where(eq(services.id, parseInt(params.id))).limit(1);
        if (!original) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        const newSlug = `${original.slug}-copy-${Date.now()}`;
        const newTitle = `${original.title} (Copy)`;

        const [inserted] = await db.insert(services).values({
            title: newTitle,
            slug: newSlug,
            icon: original.icon,
            heroDescription: original.heroDescription,
            heroImage: original.heroImage,
            content: original.content,
            turnaroundTime: original.turnaroundTime,
            modelsList: original.modelsList,
            faqData: original.faqData,
            metaTitle: original.metaTitle,
            metaDescription: original.metaDescription,
            focusKeyword: original.focusKeyword,
            isActive: false, // Start as inactive so admin can edit before publishing
        });

        return NextResponse.json({ success: true, id: inserted.insertId });
    } catch (error: any) {
        console.error("Failed to duplicate service:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
