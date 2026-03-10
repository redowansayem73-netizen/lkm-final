'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, Trash2, Edit, Copy } from 'lucide-react';

interface Service {
    id: number;
    title: string;
    slug: string;
    isActive: boolean;
    focusKeyword: string | null;
    createdAt: string;
}

export default function AdminServicesPage() {
    const router = useRouter();
    const [services, setServices] = useState<Service[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/services?search=${search}&pageSize=50`);
            if (res.ok) {
                const data = await res.json();
                setServices(data.services || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchServices(); }, [search]);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this service?')) return;
        const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
        if (res.ok) fetchServices();
    };

    const handleDuplicate = async (id: number) => {
        const res = await fetch(`/api/admin/services/${id}/duplicate`, { method: 'POST' });
        if (res.ok) {
            const data = await res.json();
            fetchServices();
            if (data.id) {
                router.push(`/admin/services/${data.id}`);
            }
        } else {
            alert('Failed to duplicate service');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Services</h1>
                <Link href="/admin/services/new" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 text-sm">
                    <Plus size={18} /> Add Service
                </Link>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search services..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm"
                />
            </div>

            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Service</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Slug</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">SEO Keyword</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Status</th>
                            <th className="text-right text-xs font-semibold text-gray-500 uppercase px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={5} className="text-center py-12 text-gray-400">Loading...</td></tr>
                        ) : services.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-12 text-gray-400">No services found. <Link href="/admin/services/new" className="text-blue-600 underline">Create one</Link></td></tr>
                        ) : services.map(s => (
                            <tr key={s.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4"><span className="font-medium text-gray-900">{s.title}</span></td>
                                <td className="px-6 py-4 text-sm text-gray-500">/services/{s.slug}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{s.focusKeyword || <span className="text-amber-500 text-xs">Not set</span>}</td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${s.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {s.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/admin/services/${s.id}`} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600" title="Edit"><Edit size={16} /></Link>
                                        <button onClick={() => handleDuplicate(s.id)} className="p-2 hover:bg-amber-50 rounded-lg text-amber-600" title="Duplicate"><Copy size={16} /></button>
                                        <button onClick={() => handleDelete(s.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500" title="Delete"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

