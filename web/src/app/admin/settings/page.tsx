'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Save, Loader2, Settings, Globe, Code, Share2, Palette, Store,
    BarChart3, Search, Tag, Facebook, Instagram, MessageCircle,
    Youtube, Twitter, Link2, AlertCircle, CheckCircle, Image as ImageIcon, X
} from 'lucide-react';

type SettingsState = Record<string, any>;

// ──────────────── Section Config ────────────────
const SECTIONS = [
    { id: 'general', label: 'General', icon: Store },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'google', label: 'Google Services', icon: Globe },
    { id: 'tracking', label: 'Tracking & Pixels', icon: BarChart3 },
    { id: 'seo', label: 'SEO Defaults', icon: Search },
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'scripts', label: 'Custom Scripts', icon: Code },
    { id: 'ecommerce', label: 'E-Commerce', icon: Tag },
] as const;

export default function AdminSettingsPage() {
    const [data, setData] = useState<SettingsState>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeSection, setActiveSection] = useState('general');
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [uploading, setUploading] = useState(false);

    // Fetch
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/admin/settings');
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Toast auto-dismiss
    useEffect(() => {
        if (toast) {
            const t = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(t);
        }
    }, [toast]);

    const set = useCallback((key: string, value: any) => {
        setData(prev => ({ ...prev, [key]: value }));
    }, []);

    // Save routine — builds entries array
    const handleSave = async () => {
        setSaving(true);
        try {
            const entries = Object.entries(data).map(([key, value]) => {
                let type = 'string';
                let stringValue = String(value ?? '');
                if (typeof value === 'boolean') {
                    type = 'boolean';
                    stringValue = String(value);
                } else if (typeof value === 'number') {
                    type = 'number';
                    stringValue = String(value);
                } else if (typeof value === 'object') {
                    type = 'json';
                    stringValue = JSON.stringify(value);
                }
                return { key, value: stringValue, type };
            });

            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ entries }),
            });

            if (res.ok) {
                setToast({ type: 'success', message: 'Settings saved successfully!' });
            } else {
                throw new Error('Save failed');
            }
        } catch (e) {
            setToast({ type: 'error', message: 'Failed to save settings.' });
        } finally {
            setSaving(false);
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'settings');
        try {
            const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
            if (!res.ok) throw new Error('Upload failed');
            const d = await res.json();
            set(key, d.imageUrl);
        } catch {
            setToast({ type: 'error', message: 'Upload failed' });
        } finally {
            setUploading(false);
        }
    };

    // ─────────── Helpers ───────────
    const Field = ({ label, settingKey, placeholder, type = 'text', helpText }: {
        label: string; settingKey: string; placeholder?: string; type?: string; helpText?: string;
    }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                type={type}
                value={data[settingKey] || ''}
                onChange={(e) => set(settingKey, e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            {helpText && <p className="mt-1 text-xs text-gray-400">{helpText}</p>}
        </div>
    );

    const TextArea = ({ label, settingKey, placeholder, rows = 4, helpText }: {
        label: string; settingKey: string; placeholder?: string; rows?: number; helpText?: string;
    }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <textarea
                value={data[settingKey] || ''}
                onChange={(e) => set(settingKey, e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
            />
            {helpText && <p className="mt-1 text-xs text-gray-400">{helpText}</p>}
        </div>
    );

    const Toggle = ({ label, settingKey, helpText }: { label: string; settingKey: string; helpText?: string }) => (
        <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors">
            <div>
                <span className="block text-sm font-medium text-gray-900">{label}</span>
                {helpText && <span className="block text-xs text-gray-500">{helpText}</span>}
            </div>
            <div className="relative">
                <input
                    type="checkbox"
                    checked={!!data[settingKey]}
                    onChange={(e) => set(settingKey, e.target.checked)}
                    className="sr-only"
                />
                <div className={`w-10 h-5 rounded-full transition-colors ${data[settingKey] ? 'bg-blue-600' : 'bg-gray-200'}`} />
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${data[settingKey] ? 'translate-x-5' : ''}`} />
            </div>
        </label>
    );

    const SectionCard = ({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) => (
        <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
            </div>
            <div className="p-6 space-y-4">
                {children}
            </div>
        </div>
    );

    // ─────────── Section Renderers ───────────
    const renderGeneral = () => (
        <div className="space-y-6">
            <SectionCard title="Site Identity" description="Basic information about your site">
                <Field label="Site Name" settingKey="site_name" placeholder="Lakemba Mobile King" />
                <Field label="Site Tagline" settingKey="site_tagline" placeholder="Best Mobile Repair Shop in Lakemba" />
                <Field label="Business Email" settingKey="business_email" placeholder="info@lakembamobileking.com.au" type="email" />
                <Field label="Business Phone" settingKey="business_phone" placeholder="0410 807 546" type="tel" />
                <Field label="Business Address" settingKey="business_address" placeholder="52 Railway Parade, Lakemba NSW 2195" />
                <Field label="ABN / Business Number" settingKey="abn_number" placeholder="12 345 678 901" />
            </SectionCard>

            <SectionCard title="Logo" description="Upload your site logo">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Primary Logo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Primary Logo</label>
                        {data.site_logo && (
                            <div className="mb-3 p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                                <img src={data.site_logo} alt="Logo" className="h-12 max-w-[120px] object-contain" />
                                <button onClick={() => set('site_logo', '')} className="p-1 text-gray-400 hover:text-red-500 rounded"><X className="w-4 h-4" /></button>
                            </div>
                        )}
                        <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, 'site_logo')} disabled={uploading}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                    {/* Favicon */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                        {data.site_favicon && (
                            <div className="mb-3 p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                                <img src={data.site_favicon} alt="Favicon" className="h-8 w-8 object-contain" />
                                <button onClick={() => set('site_favicon', '')} className="p-1 text-gray-400 hover:text-red-500 rounded"><X className="w-4 h-4" /></button>
                            </div>
                        )}
                        <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, 'site_favicon')} disabled={uploading}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="mt-1 text-xs text-gray-400">Recommended: 32×32px ICO or PNG</p>
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="Site Icons" description="Upload icons for different devices and platforms. These appear in browser tabs, bookmarks, home screens, and PWA installs.">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { key: 'site_icon_16', label: 'Icon 16×16', size: '16×16px', desc: 'Tiny icon for browser tabs', previewSize: 'h-4 w-4' },
                        { key: 'site_icon_32', label: 'Icon 32×32', size: '32×32px', desc: 'Standard favicon size', previewSize: 'h-8 w-8' },
                        { key: 'site_icon_192', label: 'Icon 192×192', size: '192×192px', desc: 'Android home screen & PWA', previewSize: 'h-12 w-12' },
                        { key: 'site_icon_512', label: 'Icon 512×512', size: '512×512px', desc: 'PWA splash screen', previewSize: 'h-16 w-16' },
                        { key: 'site_apple_touch_icon', label: 'Apple Touch Icon', size: '180×180px', desc: 'iOS home screen bookmark', previewSize: 'h-12 w-12' },
                    ].map(({ key, label, size, desc, previewSize }) => (
                        <div key={key} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                            <label className="block text-sm font-semibold text-gray-800 mb-0.5">{label}</label>
                            <p className="text-[11px] text-gray-400 mb-3">{desc} — <span className="font-medium text-gray-500">{size}</span></p>
                            {data[key] && (
                                <div className="mb-3 p-2.5 bg-white rounded-lg border border-gray-200 flex items-center gap-3">
                                    <div className="flex items-center justify-center bg-gray-100/80 rounded-lg p-2">
                                        <img src={data[key]} alt={label} className={`${previewSize} object-contain`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 truncate">{data[key]}</p>
                                    </div>
                                    <button onClick={() => set(key, '')} className="p-1 text-gray-400 hover:text-red-500 rounded flex-shrink-0">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/png,image/svg+xml,image/x-icon"
                                onChange={(e) => handleLogoUpload(e, key)}
                                disabled={uploading}
                                className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                            />
                        </div>
                    ))}
                </div>
                <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-700">
                    <p className="font-semibold mb-1">💡 Tip</p>
                    <p>Upload a single high-quality PNG (512×512) and we recommend using it as the base for all icon sizes. Use PNG format with transparent background for best results.</p>
                </div>
            </SectionCard>

            <SectionCard title="Business Hours" description="Set your store opening hours">
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Opening Time" settingKey="business_hours_open" placeholder="2:00 PM" />
                    <Field label="Closing Time" settingKey="business_hours_close" placeholder="11:00 PM" />
                </div>
                <Field label="Days Open" settingKey="business_days" placeholder="Mon - Sun (7 Days)" />
                <Toggle label="Show Hours in Header" settingKey="show_hours_header" helpText="Display opening hours in the top announcement bar" />
            </SectionCard>
        </div>
    );

    const renderAppearance = () => (
        <div className="space-y-6">
            <SectionCard title="Brand Colors" description="Primary and secondary colors used across the site">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                        <div className="flex items-center gap-3">
                            <input type="color" value={data.color_primary || '#1d4ed8'} onChange={(e) => set('color_primary', e.target.value)}
                                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
                            <input type="text" value={data.color_primary || '#1d4ed8'} onChange={(e) => set('color_primary', e.target.value)}
                                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
                        <div className="flex items-center gap-3">
                            <input type="color" value={data.color_secondary || '#fbbf24'} onChange={(e) => set('color_secondary', e.target.value)}
                                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
                            <input type="text" value={data.color_secondary || '#fbbf24'} onChange={(e) => set('color_secondary', e.target.value)}
                                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
                        <div className="flex items-center gap-3">
                            <input type="color" value={data.color_accent || '#22c55e'} onChange={(e) => set('color_accent', e.target.value)}
                                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
                            <input type="text" value={data.color_accent || '#22c55e'} onChange={(e) => set('color_accent', e.target.value)}
                                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Danger Color</label>
                        <div className="flex items-center gap-3">
                            <input type="color" value={data.color_danger || '#ef4444'} onChange={(e) => set('color_danger', e.target.value)}
                                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
                            <input type="text" value={data.color_danger || '#ef4444'} onChange={(e) => set('color_danger', e.target.value)}
                                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                        </div>
                    </div>
                </div>
                {/* Preview */}
                <div className="mt-4 p-4 rounded-xl border border-gray-200 bg-gray-50">
                    <p className="text-xs font-medium text-gray-500 mb-3">Preview</p>
                    <div className="flex flex-wrap gap-3">
                        <div className="h-10 w-24 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: data.color_primary || '#1d4ed8' }}>Primary</div>
                        <div className="h-10 w-24 rounded-lg flex items-center justify-center text-gray-900 text-xs font-bold" style={{ background: data.color_secondary || '#fbbf24' }}>Secondary</div>
                        <div className="h-10 w-24 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: data.color_accent || '#22c55e' }}>Accent</div>
                        <div className="h-10 w-24 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: data.color_danger || '#ef4444' }}>Danger</div>
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="Layout Options" description="Global layout and design preferences">
                <Toggle label="Show Announcement Bar" settingKey="show_announcement_bar" helpText="Top bar with phone number and hours" />
                <Field label="Announcement Text" settingKey="announcement_text" placeholder="Free shipping on orders over $50!" />
                <Toggle label="Sticky Header" settingKey="sticky_header" helpText="Keep header fixed when scrolling" />
                <Toggle label="Show Cart Icon in Header" settingKey="show_cart_icon" helpText="Display shopping cart icon on all pages" />
            </SectionCard>
        </div>
    );

    const renderGoogle = () => (
        <div className="space-y-6">
            <SectionCard title="Google Analytics" description="Track website traffic and user behaviour">
                <Field label="GA4 Measurement ID" settingKey="google_analytics_id" placeholder="G-XXXXXXXXXX" helpText="Found in GA4 → Admin → Data Streams" />
                <Toggle label="Enable Google Analytics" settingKey="google_analytics_enabled" />
            </SectionCard>

            <SectionCard title="Google Tag Manager" description="Manage all tags in one place">
                <Field label="GTM Container ID" settingKey="google_tag_manager_id" placeholder="GTM-XXXXXXX" helpText="Found in GTM → Admin → Container Settings" />
                <Toggle label="Enable Google Tag Manager" settingKey="google_tag_manager_enabled" />
            </SectionCard>

            <SectionCard title="Google Search Console" description="Verify site ownership and monitor indexing">
                <Field label="Verification Meta Tag Content" settingKey="google_search_console_id" placeholder="abc123..." helpText='The "content" value from the meta tag Google provides' />
            </SectionCard>

            <SectionCard title="Google Ads" description="Conversion tracking for Google Ads">
                <Field label="Google Ads Conversion ID" settingKey="google_ads_id" placeholder="AW-XXXXXXXXX" />
                <Field label="Conversion Label" settingKey="google_ads_conversion_label" placeholder="AbCdEfGhIjK" />
                <Toggle label="Enable Google Ads Tracking" settingKey="google_ads_enabled" />
            </SectionCard>

            <SectionCard title="Google Maps" description="Embed maps on your contact/store page">
                <Field label="Google Maps API Key" settingKey="google_maps_api_key" placeholder="AIzaSy..." helpText="Required for embedded maps on the contact page" />
                <Field label="Google Maps Embed URL" settingKey="google_maps_embed_url" placeholder="https://www.google.com/maps/embed?pb=..." helpText="Full iframe src URL from Google Maps Share → Embed" />
            </SectionCard>
        </div>
    );

    const renderTracking = () => (
        <div className="space-y-6">
            <SectionCard title="Facebook Pixel" description="Track conversions from Facebook/Instagram ads">
                <Field label="Facebook Pixel ID" settingKey="facebook_pixel_id" placeholder="123456789012345" />
                <Toggle label="Enable Facebook Pixel" settingKey="facebook_pixel_enabled" />
                <Field label="Conversions API Access Token" settingKey="facebook_capi_token" placeholder="EAAGm0PX4Zcg..." helpText="Server-side tracking (optional, recommended)" />
            </SectionCard>

            <SectionCard title="TikTok Pixel" description="Track conversions from TikTok ads">
                <Field label="TikTok Pixel ID" settingKey="tiktok_pixel_id" placeholder="XXXXXXXXXXXXXXXX" />
                <Toggle label="Enable TikTok Pixel" settingKey="tiktok_pixel_enabled" />
            </SectionCard>

            <SectionCard title="Hotjar / Clarity" description="Session recording and heatmaps">
                <Field label="Microsoft Clarity Project ID" settingKey="clarity_id" placeholder="abc123xyz" />
                <Field label="Hotjar Site ID" settingKey="hotjar_id" placeholder="1234567" />
            </SectionCard>
        </div>
    );

    const renderSEO = () => (
        <div className="space-y-6">
            <SectionCard title="Default Meta Tags" description="Fallback meta tags when pages don't set their own">
                <Field label="Default Meta Title" settingKey="seo_default_title" placeholder="Lakemba Mobile King – Phone Repair & Accessories" />
                <TextArea label="Default Meta Description" settingKey="seo_default_description" placeholder="Best mobile phone repair shop in Lakemba. iPhone repair, Samsung repair, screen replacement, battery fix and mobile accessories." rows={3} />
                <Field label="Default OG Image URL" settingKey="seo_og_image" placeholder="/lakemba-logo.png" helpText="Used when sharing pages on social media" />
            </SectionCard>

            <SectionCard title="Robots & Indexing" description="Control how search engines crawl your site">
                <TextArea label="robots.txt Content" settingKey="robots_txt" placeholder={"User-agent: *\nAllow: /\nSitemap: https://yourdomain.com/sitemap.xml"} rows={5} helpText="Custom robots.txt rules" />
                <Toggle label="noindex Admin Pages" settingKey="noindex_admin" helpText="Ensure admin panel pages are never indexed" />
            </SectionCard>

            <SectionCard title="Structured Data" description="Schema.org markup for search engine rich results">
                <Field label="Organization Name" settingKey="schema_org_name" placeholder="Lakemba Mobile King" />
                <Field label="Organization Type" settingKey="schema_org_type" placeholder="MobilePhoneStore" />
                <TextArea label="Custom JSON-LD (Advanced)" settingKey="custom_jsonld" placeholder='{"@context":"https://schema.org",...}' rows={5} helpText="Additional structured data in JSON-LD format" />
            </SectionCard>
        </div>
    );

    const renderSocial = () => (
        <div className="space-y-6">
            <SectionCard title="Social Media Links" description="Links displayed in footer and across the site">
                <div className="space-y-3">
                    {[
                        { key: 'social_facebook', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/lakembamobileking' },
                        { key: 'social_instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/lakembamobileking' },
                        { key: 'social_tiktok', label: 'TikTok', icon: MessageCircle, placeholder: 'https://tiktok.com/@lakembamobileking' },
                        { key: 'social_youtube', label: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/@lakembamobileking' },
                        { key: 'social_twitter', label: 'X / Twitter', icon: Twitter, placeholder: 'https://x.com/lakembamobile' },
                        { key: 'social_whatsapp', label: 'WhatsApp', icon: MessageCircle, placeholder: 'https://wa.me/61410807546' },
                        { key: 'social_linkedin', label: 'LinkedIn', icon: Link2, placeholder: 'https://linkedin.com/company/...' },
                    ].map(({ key, label, icon: Icon, placeholder }) => (
                        <div key={key} className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-4 h-4 text-gray-500" />
                            </div>
                            <input
                                type="url"
                                value={data[key] || ''}
                                onChange={(e) => set(key, e.target.value)}
                                placeholder={placeholder}
                                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                    ))}
                </div>
            </SectionCard>

            <SectionCard title="WhatsApp Business" description="Floating WhatsApp chat button">
                <Toggle label="Show WhatsApp Button" settingKey="whatsapp_button_enabled" helpText="Floating button on bottom-right corner" />
                <Field label="Default Message" settingKey="whatsapp_default_message" placeholder="Hi! I want to know about your services." />
            </SectionCard>
        </div>
    );

    const renderScripts = () => (
        <div className="space-y-6">
            <div className="rounded-xl bg-amber-50 p-4 border border-amber-100 text-sm text-amber-800 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="font-bold">⚠️ Advanced Feature</p>
                    <p className="mt-1">Custom scripts are injected directly into your site's HTML. Only paste code from trusted sources. Incorrect scripts can break your site.</p>
                </div>
            </div>

            <SectionCard title="Head Scripts" description="Scripts injected into the <head> tag of every page">
                <TextArea label="Custom <head> JavaScript" settingKey="custom_head_js" placeholder={'<!-- Example: third-party tracking -->\n<script>\n  // Your custom code\n</script>'} rows={8} />
            </SectionCard>

            <SectionCard title="Body Scripts (Top)" description="Scripts injected right after the opening <body> tag">
                <TextArea label="Custom Body (Top)" settingKey="custom_body_top_js" placeholder={'<!-- GTM noscript, etc. -->'} rows={6} />
            </SectionCard>

            <SectionCard title="Body Scripts (Bottom)" description="Scripts injected before the closing </body> tag">
                <TextArea label="Custom Body (Bottom)" settingKey="custom_body_bottom_js" placeholder={'<!-- Chat widgets, deferred scripts -->'} rows={6} />
            </SectionCard>

            <SectionCard title="Custom CSS" description="Extra CSS applied globally">
                <TextArea label="Custom CSS" settingKey="custom_css" placeholder={"/* Custom overrides */\n.my-class {\n  color: red;\n}"} rows={8} />
            </SectionCard>
        </div>
    );

    const renderEcommerce = () => (
        <div className="space-y-6">
            <SectionCard title="Currency & Tax" description="Store currency and tax settings">
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Currency Code" settingKey="currency_code" placeholder="AUD" />
                    <Field label="Currency Symbol" settingKey="currency_symbol" placeholder="$" />
                </div>
                <Field label="Tax Rate (%)" settingKey="tax_rate" placeholder="10" type="number" helpText="GST percentage applied at checkout" />
                <Toggle label="Prices Include Tax" settingKey="prices_include_tax" helpText="If enabled, product prices already include GST" />
            </SectionCard>

            <SectionCard title="Order Settings" description="Order management defaults">
                <Field label="Order Number Prefix" settingKey="order_prefix" placeholder="LMK-" helpText="Prefix added to order numbers, e.g. LMK-1001" />
                <Field label="Low Stock Threshold" settingKey="low_stock_threshold" placeholder="5" type="number" helpText="Alert when product stock falls below this level" />
                <Toggle label="Enable Guest Checkout" settingKey="guest_checkout" helpText="Allow customers to checkout without creating an account" />
                <Toggle label="Auto-confirm Orders" settingKey="auto_confirm_orders" helpText="Automatically set order status to Processing after payment" />
            </SectionCard>

            <SectionCard title="Notifications" description="Email notification settings">
                <Field label="Admin Notification Email" settingKey="admin_notification_email" placeholder="admin@lakembamobileking.com.au" type="email" helpText="New order notifications are sent to this email" />
                <Toggle label="Send Order Confirmation to Customer" settingKey="send_order_confirmation" helpText="Email customer when order is placed" />
                <Toggle label="Send Shipping Update Emails" settingKey="send_shipping_updates" helpText="Email customer when tracking info is added" />
            </SectionCard>

            <SectionCard title="Stripe Payment" description="Payment gateway configuration">
                <Field label="Stripe Publishable Key" settingKey="stripe_publishable_key" placeholder="pk_live_..." />
                <Field label="Stripe Secret Key" settingKey="stripe_secret_key" placeholder="sk_live_..." />
                <Field label="Stripe Webhook Secret" settingKey="stripe_webhook_secret" placeholder="whsec_..." />
                <Toggle label="Enable Stripe Payments" settingKey="stripe_enabled" />
            </SectionCard>
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'general': return renderGeneral();
            case 'appearance': return renderAppearance();
            case 'google': return renderGoogle();
            case 'tracking': return renderTracking();
            case 'seo': return renderSEO();
            case 'social': return renderSocial();
            case 'scripts': return renderScripts();
            case 'ecommerce': return renderEcommerce();
            default: return renderGeneral();
        }
    };

    // ─────────── Render ───────────
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Settings className="w-6 h-6 text-blue-600" />
                        Site Settings
                    </h1>
                    <p className="text-sm text-gray-500">Manage your site configuration, integrations, and preferences.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-lg shadow-blue-600/20"
                >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>

            {/* Toast */}
            {toast && (
                <div className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-medium ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {toast.message}
                </div>
            )}

            {/* Layout: sidebar nav + content */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left sidebar */}
                <nav className="w-full lg:w-56 flex-shrink-0">
                    <div className="lg:sticky lg:top-24 space-y-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-1.5">
                        {SECTIONS.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveSection(id)}
                                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeSection === id
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </button>
                        ))}
                    </div>
                </nav>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
