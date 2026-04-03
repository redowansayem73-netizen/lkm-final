'use client';

import { useEffect, useState } from 'react';

/**
 * DynamicFavicon - Reads site_favicon and site_icon from admin settings
 * and dynamically injects the appropriate <link> tags into the <head>.
 * Falls back to /favicon.ico if no custom icon is set.
 */
export function DynamicFavicon() {
    const [icons, setIcons] = useState<{ favicon?: string; icon16?: string; icon32?: string; icon192?: string; icon512?: string; appleIcon?: string } | null>(null);

    useEffect(() => {
        async function loadIcons() {
            try {
                const res = await fetch('/api/public/settings');
                if (!res.ok) return;
                const data = await res.json();

                setIcons({
                    favicon: data.site_favicon || '',
                    icon16: data.site_icon_16 || data.site_favicon || '',
                    icon32: data.site_icon_32 || data.site_favicon || '',
                    icon192: data.site_icon_192 || data.site_favicon || '',
                    icon512: data.site_icon_512 || data.site_favicon || '',
                    appleIcon: data.site_apple_touch_icon || data.site_favicon || '',
                });
            } catch {
                // Silently fail – static favicon.ico will be used
            }
        }
        loadIcons();
    }, []);

    useEffect(() => {
        if (!icons) return;

        // Helper to upsert a <link> element
        function upsertLink(rel: string, href: string, sizes?: string, type?: string) {
            if (!href) return;
            const selector = sizes
                ? `link[rel="${rel}"][sizes="${sizes}"]`
                : `link[rel="${rel}"]`;
            let link = document.querySelector(selector) as HTMLLinkElement | null;
            if (!link) {
                link = document.createElement('link');
                link.rel = rel;
                if (sizes) link.setAttribute('sizes', sizes);
                document.head.appendChild(link);
            }
            link.href = href;
            if (type) link.type = type;
        }

        if (icons.favicon) {
            upsertLink('icon', icons.favicon, undefined, icons.favicon.endsWith('.svg') ? 'image/svg+xml' : 'image/x-icon');
        }
        if (icons.icon16) upsertLink('icon', icons.icon16, '16x16', 'image/png');
        if (icons.icon32) upsertLink('icon', icons.icon32, '32x32', 'image/png');
        if (icons.icon192) upsertLink('icon', icons.icon192, '192x192', 'image/png');
        if (icons.appleIcon) upsertLink('apple-touch-icon', icons.appleIcon, '180x180');
    }, [icons]);

    return null; // This component renders nothing – it only injects <link> tags
}
