export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { repairQuotes } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Public endpoint for the frontend Quick Quote form
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const includeAll = searchParams.get('all') === 'true';

        // Admin check if they want all data without cache
        if (includeAll) {
            const session = await getServerSession(authOptions);
            if (session && (session.user as any).role === 'admin') {
                const quotes = await db.select().from(repairQuotes).orderBy(desc(repairQuotes.id));
                return NextResponse.json(quotes);
            }
        }

        // Public fetch - we return all so the frontend can filter fast without hitting DB repeatedly
        const quotes = await db.select().from(repairQuotes);
        return NextResponse.json(quotes);
    } catch (error) {
        console.error('Error fetching repair quotes:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST endpoint for Admin to add a new quote
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { brand, model, issue, price, time } = body;

        const [result] = await db.insert(repairQuotes).values({
            brand, model, issue, price, time
        });

        return NextResponse.json({ success: true, id: result.insertId });
    } catch (error) {
        console.error('Error creating repair quote:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
