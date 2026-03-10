'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    Save, ArrowLeft, Search, CheckCircle2,
    AlertCircle, Plus, Trash2, ChevronDown, ChevronUp
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import RichTextEditor from './RichTextEditor';

interface BrandEditorProps {
    initialData?: any;
    isEditing?: boolean;
}

export default function BrandEditor({ initialData, isEditing = false }: BrandEditorProps) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        logo: '',
        isPopular: false,
        isActive: true,
        sortOrder: 0,
        heroTitle: '',
        heroDescription: '',
        heroImage: '',
        content: '',
        turnaroundTime: '',
        modelsList: [] as string[],
        faqData: [] as { q: string; a: string }[],
        metaTitle: '',
        metaDescription: '',
        focusKeyword: '',
    });

    const [newModel, setNewModel] = useState('');
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                slug: initialData.slug || '',
                logo: initialData.logo || '',
                isPopular: initialData.isPopular || false,
                isActive: initialData.isActive !== undefined ? initialData.isActive : true,
                sortOrder: initialData.sortOrder || 0,
                heroTitle: initialData.heroTitle || '',
                heroDescription: initialData.heroDescription || '',
                heroImage: initialData.heroImage || '',
                content: initialData.content || '',
                turnaroundTime: initialData.turnaroundTime || '',
                modelsList: initialData.modelsList ? (typeof initialData.modelsList === 'string' ? JSON.parse(initialData.modelsList) : initialData.modelsList) : [],
                faqData: initialData.faqData ? (typeof initialData.faqData === 'string' ? JSON.parse(initialData.faqData) : initialData.faqData) : [],
                metaTitle: initialData.metaTitle || '',
                metaDescription: initialData.metaDescription || '',
                focusKeyword: initialData.focusKeyword || '',
            });
        }
    }, [initialData]);

    const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setFormData(prev => ({
            ...prev,
            name,
            slug: isEditing ? prev.slug : generateSlug(name),
            metaTitle: isEditing ? prev.metaTitle : name.slice(0, 60),
        }));
    };

    const seoAnalysis = useMemo(() => {
        const { name, content, focusKeyword, metaTitle, metaDescription, slug } = formData;
        const checks: { label: string; passed: boolean; impact: string; hint?: string }[] = [];
        if (!focusKeyword) return [];
        const lowerKeyword = focusKeyword.toLowerCase();

        checks.push({ label: "Keyword in brand name", passed: name.toLowerCase().includes(lowerKeyword), impact: "High" });
        checks.push({ label: "Keyword in URL slug", passed: slug.toLowerCase().includes(lowerKeyword.replace(/ /g, '-')), impact: "High" });
        checks.push({ label: "Keyword in meta title", passed: metaTitle.toLowerCase().includes(lowerKeyword), impact: "Medium" });
        checks.push({ label: "Keyword in hero description", passed: (formData.heroDescription || '').toLowerCase().includes(lowerKeyword), impact: "Medium" });

        const wordCount = (content || '').replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
        checks.push({ label: `Content word count: ${wordCount}`, passed: wordCount > 100, impact: "Medium", hint: wordCount < 100 ? "Try 100+ words." : "" });
        checks.push({ label: "Meta description length", passed: metaDescription.length >= 120 && metaDescription.length <= 160, impact: "Medium", hint: `Current: ${metaDescription.length}/160.` });
        checks.push({ label: "Meta title length", passed: metaTitle.length > 0 && metaTitle.length <= 60, impact: "Medium", hint: `Current: ${metaTitle.length}/60.` });

        return checks;
    }, [formData]);

    const seoScore = useMemo(() => {
        if (seoAnalysis.length === 0) return 0;
        return Math.round((seoAnalysis.filter(c => c.passed).length / seoAnalysis.length) * 100);
    }, [seoAnalysis]);

    const addModel = () => { if (newModel.trim()) { setFormData(prev => ({ ...prev, modelsList: [...prev.modelsList, newModel.trim()] })); setNewModel(''); } };
    const removeModel = (i: number) => setFormData(prev => ({ ...prev, modelsList: prev.modelsList.filter((_, idx) => idx !== i) }));
    const addFaq = () => { setFormData(prev => ({ ...prev, faqData: [...prev.faqData, { q: '', a: '' }] })); setExpandedFaq(formData.faqData.length); };
    const updateFaq = (i: number, field: 'q' | 'a', value: string) => setFormData(prev => ({ ...prev, faqData: prev.faqData.map((faq, idx) => idx === i ? { ...faq, [field]: value } : faq) }));
    const removeFaq = (i: number) => setFormData(prev => ({ ...prev, faqData: prev.faqData.filter((_, idx) => idx !== i) }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const url = isEditing ? `/api/admin/brands/${initialData.id}` : '/api/admin/brands';
            const res = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) { router.push('/admin/brands'); router.refresh(); }
            else { const data = await res.json(); alert(data.error || 'Failed to save'); }
        } catch (error) { console.error('Error saving brand:', error); }
        finally { setSaving(false); }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-6xl mx-auto pb-20">
            {/* Top Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sticky top-0 z-20 bg-gray-50/80 backdrop-blur-md py-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/brands" className="p-2 rounded-xl border bg-white hover:bg-gray-50"><ArrowLeft size={20} /></Link>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit Brand' : 'Create New Brand'}</h1>
                        <p className="text-xs text-gray-500">/brands/{formData.slug}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {seoAnalysis.length > 0 && (
                        <div className={clsx("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold", seoScore >= 80 ? "bg-emerald-50 text-emerald-700" : seoScore >= 50 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700")}>
                            SEO: {seoScore}%
                        </div>
                    )}
                    <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50">
                        <Save size={18} /> {saving ? 'Saving...' : 'Save Brand'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                        <h2 className="font-bold text-gray-900 border-b pb-3">Basic Information</h2>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Brand Name</label>
                            <input type="text" value={formData.name} onChange={handleNameChange} placeholder="e.g. Apple" className="w-full text-2xl font-bold border-none bg-gray-50/50 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-blue-500/20" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">URL Slug</label>
                                <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full bg-gray-50/50 rounded-lg px-3 py-1.5 text-sm border" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Logo URL</label>
                                <input type="text" value={formData.logo} onChange={(e) => setFormData({ ...formData, logo: e.target.value })} className="w-full bg-gray-50/50 rounded-lg px-3 py-1.5 text-sm border" placeholder="https://..." />
                            </div>
                        </div>
                    </section>

                    {/* Hero Section */}
                    <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                        <h2 className="font-bold text-gray-900 border-b pb-3">Hero / Page Content</h2>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Hero Title</label>
                            <input type="text" value={formData.heroTitle} onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })} placeholder="e.g. Apple Repairs in Lakemba" className="w-full bg-gray-50/50 rounded-lg px-3 py-2 text-sm border" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Hero Description</label>
                            <textarea value={formData.heroDescription} onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })} rows={4} className="w-full bg-gray-50/50 rounded-xl px-4 py-3 text-sm border" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Hero Image URL</label>
                            <input type="text" value={formData.heroImage} onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })} className="w-full bg-gray-50/50 rounded-lg px-3 py-2 text-sm border" />
                            {formData.heroImage && <img src={formData.heroImage} alt="" className="w-full h-40 object-cover rounded-xl mt-2" />}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Turnaround Time</label>
                            <input type="text" value={formData.turnaroundTime} onChange={(e) => setFormData({ ...formData, turnaroundTime: e.target.value })} className="w-full bg-gray-50/50 rounded-lg px-3 py-2 text-sm border" />
                        </div>
                    </section>

                    {/* Rich Content */}
                    <section className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Detailed Content</label>
                        <RichTextEditor content={formData.content} onChange={(content) => setFormData({ ...formData, content })} />
                    </section>

                    {/* Models */}
                    <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                        <h2 className="font-bold text-gray-900 border-b pb-3">Models / Devices</h2>
                        <div className="flex gap-2">
                            <input type="text" value={newModel} onChange={(e) => setNewModel(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addModel())} placeholder="e.g. iPhone 15" className="flex-1 bg-gray-50/50 rounded-lg px-3 py-2 text-sm border" />
                            <button type="button" onClick={addModel} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"><Plus size={16} /></button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.modelsList.map((m, i) => (
                                <span key={i} className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full text-sm font-medium">{m}<button type="button" onClick={() => removeModel(i)} className="text-gray-400 hover:text-red-500"><Trash2 size={12} /></button></span>
                            ))}
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h2 className="font-bold text-gray-900">FAQ Items</h2>
                            <button type="button" onClick={addFaq} className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm"><Plus size={14} /> Add FAQ</button>
                        </div>
                        <div className="space-y-3">
                            {formData.faqData.map((faq, i) => (
                                <div key={i} className="border rounded-xl overflow-hidden">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer" onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}>
                                        <span className="text-sm font-medium text-gray-700">{faq.q || `FAQ #${i + 1}`}</span>
                                        <div className="flex items-center gap-2">
                                            <button type="button" onClick={(e) => { e.stopPropagation(); removeFaq(i); }} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                                            {expandedFaq === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </div>
                                    </div>
                                    {expandedFaq === i && (
                                        <div className="p-4 space-y-3 border-t">
                                            <input type="text" value={faq.q} onChange={(e) => updateFaq(i, 'q', e.target.value)} placeholder="Question..." className="w-full bg-gray-50/50 rounded-lg px-3 py-2 text-sm border" />
                                            <textarea value={faq.a} onChange={(e) => updateFaq(i, 'a', e.target.value)} placeholder="Answer..." rows={3} className="w-full bg-gray-50/50 rounded-lg px-3 py-2 text-sm border" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {formData.faqData.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No FAQs added yet.</p>}
                        </div>
                    </section>

                    {/* SEO Panel */}
                    <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center gap-2 border-b pb-4"><Search className="text-blue-600" size={20} /><h2 className="font-bold text-gray-900">SEO Management</h2></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">Meta Title<span className={clsx("text-[10px]", formData.metaTitle.length > 60 ? "text-red-500" : "text-gray-400")}>{formData.metaTitle.length}/60</span></label>
                                <input type="text" value={formData.metaTitle} onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })} className="w-full bg-gray-50/50 rounded-lg px-3 py-2 text-sm border" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Focus Keyword</label>
                                <input type="text" value={formData.focusKeyword} onChange={(e) => setFormData({ ...formData, focusKeyword: e.target.value })} className="w-full bg-gray-50/50 rounded-lg px-3 py-2 text-sm border" placeholder="e.g. apple repair lakemba" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">Meta Description<span className={clsx("text-[10px]", (formData.metaDescription.length < 120 || formData.metaDescription.length > 160) ? "text-amber-500" : "text-gray-400")}>{formData.metaDescription.length}/160</span></label>
                            <textarea value={formData.metaDescription} onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })} rows={3} className="w-full bg-gray-50/50 rounded-lg px-3 py-2 text-sm border" />
                        </div>
                        {formData.focusKeyword && (
                            <div className="bg-blue-50/50 rounded-xl p-4 space-y-3">
                                <div className="text-xs font-bold text-blue-800 uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={14} /> SEO Analysis ({seoScore}%)</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {seoAnalysis.map((check, i) => (
                                        <div key={i} className="flex items-start gap-2 text-xs">
                                            {check.passed ? <CheckCircle2 size={14} className="text-emerald-500 mt-0.5" /> : <AlertCircle size={14} className="text-amber-500 mt-0.5" />}
                                            <div>
                                                <p className={clsx(check.passed ? "text-gray-700" : "text-gray-500")}>{check.label}</p>
                                                {!check.passed && check.hint && <p className="text-[10px] text-amber-600 italic">{check.hint}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Status</label>
                            <select value={formData.isActive ? 'active' : 'inactive'} onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })} className="w-full bg-gray-50/50 rounded-xl px-4 py-2.5 text-sm border font-medium">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-3">
                            <input type="checkbox" checked={formData.isPopular} onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })} className="rounded" id="isPopular" />
                            <label htmlFor="isPopular" className="text-sm font-semibold text-gray-700">Popular Brand</label>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Sort Order</label>
                            <input type="number" value={formData.sortOrder} onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })} className="w-full bg-gray-50/50 rounded-lg px-3 py-2 text-sm border" />
                        </div>
                    </div>

                    {/* Logo Preview */}
                    {formData.logo && (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                            <h3 className="text-sm font-bold text-gray-700">Logo Preview</h3>
                            <img src={formData.logo} alt="" className="w-24 h-24 object-contain mx-auto" />
                        </div>
                    )}

                    {/* Google Preview */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                        <h3 className="text-sm font-bold text-gray-700">Google Search Preview</h3>
                        <div className="bg-white rounded-xl p-4 border">
                            <p className="text-blue-700 text-lg font-medium leading-tight truncate">{formData.metaTitle || formData.name || 'Brand Name'}</p>
                            <p className="text-emerald-700 text-xs mt-1">lakembamobileking.com.au/brands/{formData.slug || 'brand-slug'}</p>
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{formData.metaDescription || formData.heroDescription || 'Add a meta description...'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
