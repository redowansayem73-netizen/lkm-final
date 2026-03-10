import { NextResponse } from 'next/server';
import { db } from '@/db';
import { repairQuotes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PUT endpoint for Admin to update an existing quote
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { brand, model, issue, price, time } = body;

        await db.update(repairQuotes)
            .set({ brand, model, issue, price, time })
            .where(eq(repairQuotes.id, parseInt(params.id)));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating repair quote:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE endpoint for Admin to remove a quote
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await db.delete(repairQuotes).where(eq(repairQuotes.id, parseInt(params.id)));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting repair quote:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
