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

interface ServiceEditorProps {
    initialData?: any;
    isEditing?: boolean;
}

export default function ServiceEditor({ initialData, isEditing = false }: ServiceEditorProps) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        icon: '',
        heroDescription: '',
        heroImage: '',
        content: '',
        turnaroundTime: '',
        modelsList: [] as string[],
        faqData: [] as { q: string; a: string }[],
        metaTitle: '',
        metaDescription: '',
        focusKeyword: '',
        isActive: true,
    });

    const [newModel, setNewModel] = useState('');
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                slug: initialData.slug || '',
                icon: initialData.icon || '',
                heroDescription: initialData.heroDescription || '',
                heroImage: initialData.heroImage || '',
                content: initialData.content || '',
                turnaroundTime: initialData.turnaroundTime || '',
                modelsList: initialData.modelsList ? (typeof initialData.modelsList === 'string' ? JSON.parse(initialData.modelsList) : initialData.modelsList) : [],
                faqData: initialData.faqData ? (typeof initialData.faqData === 'string' ? JSON.parse(initialData.faqData) : initialData.faqData) : [],
                metaTitle: initialData.metaTitle || '',
                metaDescription: initialData.metaDescription || '',
                focusKeyword: initialData.focusKeyword || '',
                isActive: initialData.isActive !== undefined ? initialData.isActive : true,
            });
        }
    }, [initialData]);

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData(prev => ({
            ...prev,
            title,
            slug: isEditing ? prev.slug : generateSlug(title),
            metaTitle: isEditing ? prev.metaTitle : title.slice(0, 60),
        }));
    };

    // SEO Analysis
    const seoAnalysis = useMemo(() => {
        const { title, content, focusKeyword, metaTitle, metaDescription, slug } = formData;
        const checks: { label: string; passed: boolean; impact: string; hint?: string }[] = [];

        if (!focusKeyword) return [];

        const lowerContent = (content || '').toLowerCase();
        const lowerKeyword = focusKeyword.toLowerCase();

        checks.push({
            label: "Focus keyword in title",
            passed: title.toLowerCase().includes(lowerKeyword),
            impact: "High"
        });

        checks.push({
            label: "Focus keyword in URL slug",
            passed: slug.toLowerCase().includes(lowerKeyword.replace(/ /g, '-')),
            impact: "High"
        });

        checks.push({
            label: "Focus keyword in meta title",
            passed: metaTitle.toLowerCase().includes(lowerKeyword),
            impact: "Medium"
        });

        checks.push({
            label: "Focus keyword in hero description",
            passed: (formData.heroDescription || '').toLowerCase().includes(lowerKeyword),
            impact: "Medium"
        });

        const wordCount = (content || '').replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
        checks.push({
            label: `Content word count: ${wordCount}`,
            passed: wordCount > 100,
            impact: "Medium",
            hint: wordCount < 100 ? "Try to reach at least 100 words in content." : ""
        });

        checks.push({
            label: "Meta description length",
            passed: metaDescription.length >= 120 && metaDescription.length <= 160,
            impact: "Medium",
            hint: `Current: ${metaDescription.length}. Goal: 120-160.`
        });

        checks.push({
            label: "Meta title length",
            passed: metaTitle.length > 0 && metaTitle.length <= 60,
            impact: "Medium",
            hint: `Current: ${metaTitle.length}/60.`
        });

        checks.push({
            label: "Has FAQ data",
            passed: formData.faqData.length >= 3,
            impact: "Low",
            hint: formData.faqData.length < 3 ? "Add at least 3 FAQs for better SEO." : ""
        });

        return checks;
    }, [formData]);

    const seoScore = useMemo(() => {
        if (seoAnalysis.length === 0) return 0;
        const passed = seoAnalysis.filter(c => c.passed).length;
        return Math.round((passed / seoAnalysis.length) * 100);
    }, [seoAnalysis]);

    const addModel = () => {
        if (newModel.trim()) {
            setFormData(prev => ({ ...prev, modelsList: [...prev.modelsList, newModel.trim()] }));
            setNewModel('');
        }
    };

    const removeModel = (index: number) => {
        setFormData(prev => ({ ...prev, modelsList: prev.modelsList.filter((_, i) => i !== index) }));
    };

    const addFaq = () => {
        setFormData(prev => ({ ...prev, faqData: [...prev.faqData, { q: '', a: '' }] }));
        setExpandedFaq(formData.faqData.length);
    };

    const updateFaq = (index: number, field: 'q' | 'a', value: string) => {
        setFormData(prev => ({
            ...prev,
            faqData: prev.faqData.map((faq, i) => i === index ? { ...faq, [field]: value } : faq)
        }));
    };

    const removeFaq = (index: number) => {
        setFormData(prev => ({ ...prev, faqData: prev.faqData.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const url = isEditing ? `/api/admin/services/${initialData.id}` : '/api/admin/services';
            const res = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                router.push('/admin/services');
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to save');
            }
        } catch (error) {
            console.error('Error saving service:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-6xl mx-auto pb-20">
            {/* Top Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sticky top-0 z-20 bg-gray-50/80 backdrop-blur-md py-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/services" className="p-2 rounded-xl border bg-white hover:bg-gray-50">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit Service' : 'Create New Service'}</h1>
                        <p className="text-xs text-gray-500">/services/{formData.slug}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {seoAnalysis.length > 0 && (
                        <div className={clsx(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold",
                            seoScore >= 80 ? "bg-emerald-50 text-emerald-700" :
                                seoScore >= 50 ? "bg-amber-50 text-amber-700" :
                                    "bg-red-50 text-red-700"
                        )}>
                            SEO: {seoScore}%
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Save size={18} /> {saving ? 'Saving...' : 'Save Service'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Basic Info */}
                    <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                        <h2 className="font-bold text-gray-900 border-b pb-3">Basic Information</h2>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Service Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={handleTitleChange}
                                placeholder="e.g. Phone Screen Repair"
                                className="w-full text-2xl font-bold border-none bg-gray-50/50 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">URL Slug</label>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400 text-sm">/services/</span>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="flex-1 bg-gray-50/50 rounded-lg px-3 py-1.5 text-sm border focus:bg-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Icon (Lucide name)</label>
                                <input
                                    type="text"
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    placeholder="e.g. Smartphone"
                                    className="w-full bg-gray-50/50 rounded-lg px-3 py-1.5 text-sm border focus:bg-white"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Hero Section */}
                    <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                        <h2 className="font-bold text-gray-900 border-b pb-3">Hero Section</h2>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Hero Description</label>
                            <textarea
                                value={formData.heroDescription}
                                onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
                                placeholder="Compelling description for the hero section..."
                                rows={5}
                                className="w-full bg-gray-50/50 rounded-xl px-4 py-3 text-sm border focus:bg-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Hero Image (400×400 recommended)</label>
                            {formData.heroImage ? (
                                <div className="relative group w-fit">
                                    <img src={formData.heroImage} alt="" className="w-40 h-40 object-cover rounded-xl border" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, heroImage: '' })}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-3 items-end">
                                    <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition">
                                        <Plus size={24} className="text-gray-400 mb-1" />
                                        <span className="text-xs text-gray-400">Upload Image</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                const fd = new FormData();
                                                fd.append('file', file);
                                                fd.append('folder', 'services');
                                                try {
                                                    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
                                                    if (res.ok) {
                                                        const data = await res.json();
                                                        setFormData(prev => ({ ...prev, heroImage: data.url }));
                                                    }
                                                } catch (err) { console.error('Upload failed', err); }
                                            }}
                                        />
                                    </label>
                                    <div className="flex-1 space-y-1">
                                        <span className="text-xs text-gray-400">Or paste URL:</span>
                                        <input
                                            type="text"
                                            value={formData.heroImage}
                                            onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                                            placeholder="https://..."
                                            className="w-full bg-gray-50/50 rounded-lg px-3 py-2 text-sm border"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Turnaround Time</label>
                            <input
                                type="text"
                                value={formData.turnaroundTime}
                                onChange={(e) => setFormData({ ...formData, turnaroundTime: e.target.value })}
                                placeholder="e.g. Most repairs completed within 30 minutes"
                                className="w-full bg-gray-50/50 rounded-lg px-3 py-2 text-sm border"
                            />
                        </div>
                    </section>

                    {/* Rich Content */}
                    <section className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Detailed Content</label>
                        <RichTextEditor
                            content={formData.content}
                            onChange={(content) => setFormData({ ...formData, content })}
                        />
                    </section>

                    {/* Models List */}
                    <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                        <h2 className="font-bold text-gray-900 border-b pb-3">Supported Models / Devices</h2>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newModel}
                                onChange={(e) => setNewModel(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addModel())}
                                placeholder="e.g. iPhone 15 Pro Max"
                                className="flex-1 bg-gray-50/50 rounded-lg px-3 py-2 text-sm border"
                            />
                            <button type="button" onClick={addModel} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                                <Plus size={16} />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.modelsList.map((model, i) => (
                                <span key={i} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium">
                                    {model}
                                    <button type="button" onClick={() => removeModel(i)} className="text-gray-400 hover:text-red-500">
                                        <Trash2 size={12} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h2 className="font-bold text-gray-900">FAQ Items</h2>
                            <button type="button" onClick={addFaq} className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                                <Plus size={14} /> Add FAQ
                            </button>
                        </div>
                        <div className="space-y-3">
                            {formData.faqData.map((faq, i) => (
                                <div key={i} className="border rounded-xl overflow-hidden">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer" onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}>
                                        <span className="text-sm font-medium text-gray-700">
                                            {faq.q || `FAQ #${i + 1} (untitled)`}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button type="button" onClick={(e) => { e.stopPropagation(); removeFaq(i); }} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                                            {expandedFaq === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </div>
                                    </div>
                                    {expandedFaq === i && (
                                        <div className="p-4 space-y-3 border-t">
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-500">Question</label>
                                                <input
                                                    type="text"
                                                    value={faq.q}
                                                    onChange={(e) => updateFaq(i, 'q', e.target.value)}
                                                    placeholder="Enter FAQ question..."
                                                    className="w-full bg-gray-50/50 rounded-lg px-3 py-2 text-sm border"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-500">Answer</label>
                                                <textarea
                                                    value={faq.a}
                                                    onChange={(e) => updateFaq(i, 'a', e.target.value)}
                                                    placeholder="Enter FAQ answer..."
                                                    rows={3}
                                                    className="w-full bg-gray-50/50 rounded-lg px-3 py-2 text-sm border"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {formData.faqData.length === 0 && (
                                <p className="text-sm text-gray-400 text-center py-6">No FAQs added yet. Click "Add FAQ" to get started.</p>
                            )}
                        </div>
                    </section>

                    {/* SEO Panel */}
                    <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center gap-2 border-b pb-4">
                            <Search className="text-blue-600" size={20} />
                            <h2 className="font-bold text-gray-900">SEO Management</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                                    Meta Title
                                    <span className={clsx("text-[10px]", formData.metaTitle.length > 60 ? "text-red-500" : "text-gray-400")}>
                                        {formData.metaTitle.length}/60
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.metaTitle}
                                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                    className="w-full bg-gray-50/50 rounded-lg px-3 py-2 text-sm border"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Focus Keyword</label>
                                <input
                                    type="text"
                                    value={formData.focusKeyword}
                                    onChange={(e) => setFormData({ ...formData, focusKeyword: e.target.value })}
                                    className="w-full bg-gray-50/50 rounded-lg px-3 py-2 text-sm border"
                                    placeholder="e.g. phone screen repair lakemba"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                                Meta Description
                                <span className={clsx("text-[10px]", (formData.metaDescription.length < 120 || formData.metaDescription.length > 160) ? "text-amber-500" : "text-gray-400")}>
                                    {formData.metaDescription.length}/160
                                </span>
                            </label>
                            <textarea
                                value={formData.metaDescription}
                                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                rows={3}
                                className="w-full bg-gray-50/50 rounded-lg px-3 py-2 text-sm border"
                            />
                        </div>

                        {/* SEO Analysis */}
                        {formData.focusKeyword && (
                            <div className="bg-blue-50/50 rounded-xl p-4 space-y-3">
                                <div className="text-xs font-bold text-blue-800 uppercase tracking-widest flex items-center gap-2">
                                    <CheckCircle2 size={14} /> SEO Analysis ({seoScore}%)
                                </div>
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
                            <select
                                value={formData.isActive ? 'active' : 'inactive'}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                                className="w-full bg-gray-50/50 rounded-xl px-4 py-2.5 text-sm border font-medium"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* Google Preview */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                        <h3 className="text-sm font-bold text-gray-700">Google Search Preview</h3>
                        <div className="bg-white rounded-xl p-4 border">
                            <p className="text-blue-700 text-lg font-medium leading-tight truncate">
                                {formData.metaTitle || formData.title || 'Service Title'}
                            </p>
                            <p className="text-emerald-700 text-xs mt-1">
                                lakembamobileking.com.au/services/{formData.slug || 'service-slug'}
                            </p>
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                {formData.metaDescription || formData.heroDescription || 'Add a meta description...'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
