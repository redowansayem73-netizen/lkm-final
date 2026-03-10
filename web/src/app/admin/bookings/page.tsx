'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { RefreshCw, Clock, CheckCircle, Search, Mail, Phone, Calendar as CalendarIcon, Server, AlertCircle, Plus, Printer, X } from 'lucide-react';
import clsx from 'clsx';

interface Booking {
    id: number;
    brand: string;
    model: string;
    issue: string;
    price: string | null;
    bookingDate: string;
    bookingTime: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    notes: string | null;
    status: 'pending' | 'processing' | 'done';
    estDeliveryDate?: string | null;
    estDeliveryTime?: string | null;
    completionDate?: string | null;
    completionTime?: string | null;
    createdAt: string;
}

export default function AdminBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [updating, setUpdating] = useState<number | null>(null);

    // Modals state
    const [showNewModal, setShowNewModal] = useState(false);
    const [savingNew, setSavingNew] = useState(false);
    const [newBooking, setNewBooking] = useState({
        brand: '', model: '', issue: '', price: '',
        bookingDate: new Date().toISOString().split('T')[0],
        bookingTime: new Date().toTimeString().slice(0, 5),
        customerName: '', customerEmail: '', customerPhone: '', notes: ''
    });
    const [repairsData, setRepairsData] = useState<any[]>([]);

    useEffect(() => {
        async function loadQuotes() {
            try {
                const res = await fetch('/api/repair-quotes?all=true');
                if (res.ok) setRepairsData(await res.json());
            } catch (err) { }
        }
        loadQuotes();
    }, []);

    const brands = useMemo(() => Array.from(new Set(repairsData.map(i => i.brand))).sort(), [repairsData]);
    const models = useMemo(() => {
        if (!newBooking.brand) return [];
        return Array.from(new Set(repairsData.filter(i => i.brand === newBooking.brand).map(i => i.model))).sort();
    }, [newBooking.brand, repairsData]);
    const issues = useMemo(() => {
        if (!newBooking.model) return [];
        return Array.from(new Set(repairsData.filter(i => i.model === newBooking.model).map(i => i.issue))).sort();
    }, [newBooking.model, repairsData]);

    useEffect(() => {
        if (newBooking.brand && newBooking.model && newBooking.issue) {
            const quote = repairsData.find(i => i.brand === newBooking.brand && i.model === newBooking.model && i.issue === newBooking.issue);
            if (quote && quote.price) {
                setNewBooking(prev => ({ ...prev, price: quote.price }));
            }
        }
    }, [newBooking.brand, newBooking.model, newBooking.issue, repairsData]);

    const receiptRef = useRef<HTMLDivElement>(null);
    const [printingBooking, setPrintingBooking] = useState<Booking | null>(null);

    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/bookings');
            if (!res.ok) throw new Error('Failed to fetch bookings');
            const data = await res.json();
            setBookings(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleCreateBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingNew(true);
        try {
            const res = await fetch('/api/admin/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newBooking, status: 'pending' })
            });
            if (res.ok) {
                setShowNewModal(false);
                fetchBookings();
                setNewBooking({
                    brand: '', model: '', issue: '', price: '',
                    bookingDate: new Date().toISOString().split('T')[0],
                    bookingTime: new Date().toTimeString().slice(0, 5),
                    customerName: '', customerEmail: '', customerPhone: '', notes: ''
                });
            } else {
                alert('Failed to create booking');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSavingNew(false);
        }
    };

    const updateStatus = async (id: number, newStatus: string) => {
        if (!confirm(`Are you sure you want to change the status to ${newStatus}? This will send an email.`)) return;

        try {
            setUpdating(id);
            const res = await fetch(`/api/admin/bookings/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                fetchBookings();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to update status');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred');
        } finally {
            setUpdating(null);
        }
    };

    const printReceipt = (booking: Booking) => {
        setPrintingBooking(booking);
        setTimeout(() => {
            const content = document.getElementById(`receipt-${booking.id}`)?.innerHTML;
            if (content) {
                const printWindow = window.open('', '_blank');
                if (printWindow) {
                    printWindow.document.write(`
                        <html>
                            <head>
                                <title>Receipt #${booking.id}</title>
                                <style>
                                    body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
                                    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 20px;}
                                    .header h1 { margin: 0; color: #2563eb; }
                                    .details { margin-bottom: 20px; }
                                    .item { margin-bottom: 10px; display: flex; justify-content: space-between; border-bottom: 1px dashed #eee; padding-bottom: 5px;}
                                    .item-label { font-weight: bold; width: 120px; }
                                    .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #666; }
                                    @media print { body { padding: 0; margin: 0; } }
                                </style>
                            </head>
                            <body>
                                <div class="header">
                                    <h1>Lakemba Mobile King</h1>
                                    <p>Phone Screen & Accessories Repairs</p>
                                    <p>0410 807 546</p>
                                </div>
                                <h2 style="text-align:center;">Repair Receipt #${booking.id}</h2>
                                <div class="details">
                                    <div class="item"><span class="item-label">Date:</span> <span>${new Date().toLocaleDateString()}</span></div>
                                    <div class="item"><span class="item-label">Customer:</span> <span>${booking.customerName}</span></div>
                                    <div class="item"><span class="item-label">Phone:</span> <span>${booking.customerPhone}</span></div>
                                </div>
                                <h3>Device Information</h3>
                                <div class="details">
                                    <div class="item"><span class="item-label">Device:</span> <span>${booking.brand} ${booking.model}</span></div>
                                    <div class="item"><span class="item-label">Issue:</span> <span>${booking.issue}</span></div>
                                    <div class="item"><span class="item-label">Status:</span> <span style="text-transform:uppercase; font-weight:bold;">${booking.status}</span></div>
                                    ${booking.estDeliveryDate ? `<div class="item"><span class="item-label">Est. Completion:</span> <span>${booking.estDeliveryDate} ${booking.estDeliveryTime || ''}</span></div>` : ''}
                                    ${booking.completionDate ? `<div class="item"><span class="item-label">Completed On:</span> <span>${booking.completionDate} ${booking.completionTime || ''}</span></div>` : ''}
                                </div>
                                <h3>Charges</h3>
                                <div class="details">
                                    <div class="item"><span class="item-label">Total Amount:</span> <span style="font-weight:bold; font-size:18px;">$${booking.price || 'Pending Quote'}</span></div>
                                </div>
                                <div class="footer">
                                    <p>Thank you for choosing Lakemba Mobile King!</p>
                                    <p>Please retain this receipt for warranty purposes. 6 Months warranty on screen repairs.</p>
                                </div>
                                <script>
                                    window.onload = function() { window.print(); window.close(); }
                                </script>
                            </body>
                        </html>
                    `);
                    printWindow.document.close();
                }
            }
            setPrintingBooking(null);
        }, 100);
    };

    const filteredBookings = bookings.filter(b =>
        b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Repair Bookings</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage online and in-store repair appointments</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold">
                        {bookings.length} bookings
                    </div>
                    <button onClick={() => setShowNewModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm">
                        <Plus className="w-4 h-4" /> New Booking
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by customer name, email, brand or model..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>
                <button onClick={fetchBookings} disabled={loading} className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50">
                    <RefreshCw className={clsx('h-4 w-4', loading && 'animate-spin')} />
                </button>
            </div>

            {/* List */}
            {loading && bookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mb-4" />
                    <p className="text-gray-500 font-medium">Loading bookings...</p>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-red-100 shadow-sm">
                    <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                    <p className="text-red-600 font-bold mb-1">Failed to load bookings</p>
                    <p className="text-gray-500 text-sm">{error}</p>
                </div>
            ) : filteredBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <CalendarIcon className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-900 font-bold mb-1">No bookings found</p>
                    <p className="text-gray-500 text-sm">{searchTerm ? 'Try adjusting your search criteria' : 'Waiting for new appointments'}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredBookings.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-6 lg:items-center justify-between group">
                            {/* Hidden Receipt Area */}
                            <div id={`receipt-${booking.id}`} className="hidden">Receipt Content Placeholder</div>

                            {/* Left: Status & Main Info */}
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className={clsx(
                                        'px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider',
                                        booking.status === 'pending' && 'bg-amber-100 text-amber-700',
                                        booking.status === 'processing' && 'bg-blue-100 text-blue-700',
                                        booking.status === 'done' && 'bg-emerald-100 text-emerald-700'
                                    )}>
                                        {booking.status}
                                    </span>
                                    <span className="text-sm font-medium text-gray-400">#{booking.id}</span>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        Created: {new Date(booking.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {booking.brand} {booking.model}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">{booking.issue}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <p className="text-lg font-bold text-blue-600">
                                            {booking.price && booking.price !== '0' && booking.price !== 'N/A' ? `$${booking.price}` : 'Quote Pending'}
                                        </p>
                                        <button
                                            onClick={() => printReceipt(booking)}
                                            className="text-xs font-medium text-gray-500 hover:text-blue-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Printer className="w-3 h-3" /> Print Receipt
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Center: Appointment Details */}
                            <div className="lg:w-[300px] border-l border-gray-100 pl-6 space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Appointment</p>
                                    <div className="space-y-1.5">
                                        <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                            <CalendarIcon className="w-4 h-4 text-gray-400" /> {booking.bookingDate}
                                        </p>
                                        <p className="text-sm text-gray-600 flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-gray-400" /> {booking.bookingTime}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Customer Details & Actions */}
                            <div className="lg:w-[350px] border-l border-gray-100 pl-6 flex flex-col justify-between h-full space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Customer</p>
                                    <div className="space-y-1.5">
                                        <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                            {booking.customerName}
                                        </p>
                                        <a href={`tel:${booking.customerPhone}`} className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-2 transition-colors">
                                            <Phone className="w-4 h-4 text-gray-400" /> {booking.customerPhone}
                                        </a>
                                        <a href={`mailto:${booking.customerEmail}`} className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-2 transition-colors truncate">
                                            <Mail className="w-4 h-4 text-gray-400" /> {booking.customerEmail}
                                        </a>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-2">
                                    {booking.status === 'pending' && (
                                        <button disabled={updating === booking.id} onClick={() => updateStatus(booking.id, 'processing')} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm">
                                            {updating === booking.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Server className="w-4 h-4" />}
                                            Process
                                        </button>
                                    )}
                                    {booking.status === 'processing' && (
                                        <button disabled={updating === booking.id} onClick={() => updateStatus(booking.id, 'done')} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 px-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm">
                                            {updating === booking.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                            Done
                                        </button>
                                    )}
                                    {booking.status === 'done' && (
                                        <button onClick={() => printReceipt(booking)} className="flex-1 bg-gray-900 hover:bg-black text-white text-sm font-semibold py-2 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors">
                                            <Printer className="w-4 h-4" /> Print Receipt
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* New Booking Modal */}
            {showNewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Manual POS Booking</h3>
                                <p className="text-sm text-gray-500">Create an in-store repair booking</p>
                            </div>
                            <button onClick={() => setShowNewModal(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <form id="new-booking-form" onSubmit={handleCreateBooking} className="space-y-6">
                                {/* Device Details */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Device Info (Auto-populates Quote)</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500">Brand *</label>
                                            <input list="brands-list" required type="text" value={newBooking.brand} onChange={e => setNewBooking({ ...newBooking, brand: e.target.value })} className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white" placeholder="Search or type brand" />
                                            <datalist id="brands-list">{brands.map(b => <option key={b as string} value={b as string} />)}</datalist>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500">Model *</label>
                                            <input list="models-list" required type="text" value={newBooking.model} onChange={e => setNewBooking({ ...newBooking, model: e.target.value })} className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white" placeholder="Search or type model" disabled={!newBooking.brand} />
                                            <datalist id="models-list">{models.map(m => <option key={m as string} value={m as string} />)}</datalist>
                                        </div>
                                    </div>
                                    <div className="space-y-1 mt-4">
                                        <label className="text-xs font-semibold text-gray-500">Issue *</label>
                                        <input list="issues-list" required type="text" value={newBooking.issue} onChange={e => setNewBooking({ ...newBooking, issue: e.target.value })} className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white" placeholder="Search or type issue" disabled={!newBooking.model} />
                                        <datalist id="issues-list">{issues.map(i => <option key={i as string} value={i as string} />)}</datalist>
                                    </div>
                                    <div className="space-y-1 mt-4">
                                        <label className="text-xs font-semibold text-gray-500">Quoted Price ($)</label>
                                        <input type="number" step="0.01" min="0" value={newBooking.price} onChange={e => setNewBooking({ ...newBooking, price: e.target.value })} className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white" />
                                    </div>
                                </div>

                                {/* Customer Details */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Customer Info</h4>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500">Full Name *</label>
                                        <input required type="text" value={newBooking.customerName} onChange={e => setNewBooking({ ...newBooking, customerName: e.target.value })} className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500">Email *</label>
                                            <input required type="email" value={newBooking.customerEmail} onChange={e => setNewBooking({ ...newBooking, customerEmail: e.target.value })} className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500">Phone *</label>
                                            <input required type="tel" value={newBooking.customerPhone} onChange={e => setNewBooking({ ...newBooking, customerPhone: e.target.value })} className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white" />
                                        </div>
                                    </div>
                                </div>

                                {/* Appointment */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Date & Time</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500">Date *</label>
                                            <input required type="date" value={newBooking.bookingDate} onChange={e => setNewBooking({ ...newBooking, bookingDate: e.target.value })} className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500">Time *</label>
                                            <input required type="time" value={newBooking.bookingTime} onChange={e => setNewBooking({ ...newBooking, bookingTime: e.target.value })} className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white" />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3 rounded-b-3xl">
                            <button onClick={() => setShowNewModal(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors">
                                Cancel
                            </button>
                            <button form="new-booking-form" type="submit" disabled={savingNew} className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm">
                                {savingNew ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                Save Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
