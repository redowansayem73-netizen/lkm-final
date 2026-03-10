import { NextResponse } from 'next/server';
import { db } from '@/db';
import { settings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET all settings
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const allSettings = await db.select().from(settings);

        // Convert to a key-value map for easier frontend consumption
        const settingsMap: Record<string, any> = {};
        for (const s of allSettings) {
            try {
                if (s.type === 'json' && s.value) {
                    settingsMap[s.key] = JSON.parse(s.value);
                } else if (s.type === 'boolean') {
                    settingsMap[s.key] = s.value === 'true';
                } else if (s.type === 'number') {
                    settingsMap[s.key] = Number(s.value);
                } else {
                    settingsMap[s.key] = s.value || '';
                }
            } catch {
                settingsMap[s.key] = s.value || '';
            }
        }

        return NextResponse.json(settingsMap);
    } catch (error: any) {
        console.error("Failed to fetch settings:", error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

// PUT - Upsert a batch of settings
export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        // body is { entries: [{ key, value, type, description }] }
        const entries: { key: string; value: string; type: string; description?: string }[] = body.entries || [];

        for (const entry of entries) {
            // Check if key already exists
            const existing = await db.select().from(settings).where(eq(settings.key, entry.key));

            if (existing.length > 0) {
                await db.update(settings)
                    .set({
                        value: entry.value,
                        type: entry.type,
                        description: entry.description,
                    })
                    .where(eq(settings.key, entry.key));
            } else {
                await db.insert(settings).values({
                    key: entry.key,
                    value: entry.value,
                    type: entry.type,
                    description: entry.description,
                });
            }
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Failed to save settings:", error);
        return NextResponse.json({ error: 'Failed to save settings', details: error.message }, { status: 500 });
    }
}
