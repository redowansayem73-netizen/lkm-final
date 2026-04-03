import { NextResponse } from 'next/server';
import { db } from '@/db';
import { settings } from '@/db/schema';
import { inArray } from 'drizzle-orm';

// Public keys that can be read without authentication
const PUBLIC_KEYS = [
    'site_name',
    'site_tagline',
    'site_logo',
    'site_favicon',
    'site_icon_16',
    'site_icon_32',
    'site_icon_192',
    'site_icon_512',
    'site_apple_touch_icon',
    'business_phone',
    'business_address',
    'business_email',
    'business_hours_open',
    'business_hours_close',
    'business_days',
    'color_primary',
    'color_secondary',
    'social_facebook',
    'social_instagram',
    'social_tiktok',
    'social_youtube',
    'social_twitter',
    'social_whatsapp',
    'whatsapp_button_enabled',
    'whatsapp_default_message',
    'seo_default_title',
    'seo_default_description',
    'seo_og_image',
];

export async function GET() {
    try {
        const rows = await db
            .select()
            .from(settings)
            .where(inArray(settings.key, PUBLIC_KEYS));

        const map: Record<string, any> = {};
        for (const s of rows) {
            try {
                if (s.type === 'json' && s.value) {
                    map[s.key] = JSON.parse(s.value);
                } else if (s.type === 'boolean') {
                    map[s.key] = s.value === 'true';
                } else if (s.type === 'number') {
                    map[s.key] = Number(s.value);
                } else {
                    map[s.key] = s.value || '';
                }
            } catch {
                map[s.key] = s.value || '';
            }
        }

        return NextResponse.json(map, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            },
        });
    } catch (error: any) {
        console.error('Failed to fetch public settings:', error);
        return NextResponse.json({}, { status: 500 });
    }
}
