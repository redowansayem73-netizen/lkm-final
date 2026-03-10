'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Search, Plus, Edit2, Trash2, AlertCircle, Save, X, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface RepairQuote {
    id: number;
    brand: string;
    model: string;
    issue: string;
    price: string;
    time: string;
    createdAt: string;
}

export default function AdminRepairQuotes() {
    const [quotes, setQuotes] = useState<RepairQuote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 20;

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingQuote, setEditingQuote] = useState<RepairQuote | null>(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        brand: '', model: '', issue: '', price: '', time: '30 Mins'
    });

    const fetchQuotes = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/repair-quotes?all=true');
            if (!res.ok) throw new Error('Failed to fetch quotes');
            const data = await res.json();
            setQuotes(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchQuotes();
    }, [fetchQuotes]);

    const handleOpenModal = (quote?: RepairQuote) => {
        if (quote) {
            setEditingQuote(quote);
            setFormData({
                brand: quote.brand,
                model: quote.model,
                issue: quote.issue,
                price: quote.price,
                time: quote.time
            });
        } else {
            setEditingQuote(null);
            setFormData({ brand: '', model: '', issue: '', price: '', time: '30 Mins' });
        }
        setShowModal(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const url = editingQuote ? `/api/repair-quotes/${editingQuote.id}` : '/api/repair-quotes';
            const method = editingQuote ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setShowModal(false);
                fetchQuotes();
            } else {
                alert('Failed to save quote');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this quote?')) return;
        try {
            const res = await fetch(`/api/repair-quotes/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchQuotes();
            } else {
                alert('Failed to delete quote');
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Filter and Paginate
    const filteredQuotes = quotes.filter(q =>
        q.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.issue.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredQuotes.length / ITEMS_PER_PAGE);
    const paginatedQuotes = filteredQuotes.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Repair Quotes</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage pricing and issues for the Quick Quote calculator</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold">
                        {quotes.length} total quotes
                    </div>
                    <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm">
                        <Plus className="w-4 h-4" /> New Quote
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by brand, model, or issue..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>
                <button onClick={fetchQuotes} disabled={loading} className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50">
                    <RefreshCw className={clsx('h-4 w-4', loading && 'animate-spin')} />
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Brand</th>
                                <th className="px-6 py-4 font-semibold">Model</th>
                                <th className="px-6 py-4 font-semibold">Issue</th>
                                <th className="px-6 py-4 font-semibold">Price</th>
                                <th className="px-6 py-4 font-semibold">Time</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading && quotes.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <RefreshCw className="h-6 w-6 animate-spin text-blue-500 mx-auto mb-2" />
                                        <p className="text-gray-500 font-medium">Loading quotes...</p>
                                    </td>
                                </tr>
                            ) : paginatedQuotes.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <AlertCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-gray-900 font-medium">No quotes found</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedQuotes.map((quote) => (
                                    <tr key={quote.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{quote.brand}</td>
                                        <td className="px-6 py-4">{quote.model}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium border border-gray-200">
                                                {quote.issue}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-[#265795]">${quote.price}</td>
                                        <td className="px-6 py-4 text-xs">{quote.time}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleOpenModal(quote)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(quote.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-4">
                        <p className="text-sm text-gray-500">
                            Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredQuotes.length)}</span> of <span className="font-medium">{filteredQuotes.length}</span> results
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-medium text-gray-700 px-2">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{editingQuote ? 'Edit Quote' : 'New Quote'}</h3>
                                <p className="text-sm text-gray-500">{editingQuote ? 'Update pricing or details' : 'Add a new repair price'}</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <form id="quote-form" onSubmit={handleSave} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Brand</label>
                                        <input required type="text" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" placeholder="e.g. Apple" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Model</label>
                                        <input required type="text" value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })} className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" placeholder="e.g. iPhone 15 Pro" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Issue</label>
                                    <input required type="text" value={formData.issue} onChange={e => setFormData({ ...formData, issue: e.target.value })} className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" placeholder="e.g. Screen Replacement" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price ($)</label>
                                        <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" placeholder="e.g. 199.00" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Est. Time</label>
                                        <input required type="text" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" placeholder="e.g. 30 Mins" />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3 rounded-b-3xl">
                            <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors">
                                Cancel
                            </button>
                            <button form="quote-form" type="submit" disabled={saving} className="px-5 py-2.5 text-sm font-semibold text-white bg-[#265795] hover:bg-[#1e487a] rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm">
                                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Quote
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
