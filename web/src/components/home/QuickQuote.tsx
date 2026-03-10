'use client';

import { useState, useMemo, useEffect } from 'react';
import {
    ArrowRight, Clock, DollarSign, ChevronDown, Check, AlertCircle,
    Calendar, User, Mail, Phone, ArrowLeft, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

type RepairItem = { id?: number; brand: string; model: string; issue: string; price: string; time: string; };

export default function QuickQuote({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
    const [repairsData, setRepairsData] = useState<RepairItem[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedIssue, setSelectedIssue] = useState('');
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [bookingData, setBookingData] = useState({ date: '', time: '', name: '', email: '', phone: '', notes: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        async function loadData() {
            try {
                const res = await fetch('/api/repair-quotes');
                if (res.ok) {
                    const data = await res.json();
                    setRepairsData(data);
                }
            } catch (err) {
                console.error("Failed to load repairs quotes", err);
            } finally {
                setIsLoadingData(false);
            }
        }
        loadData();
    }, []);

    const brands = useMemo(() => {
        return Array.from(new Set(repairsData.map(i => i.brand))).sort((a, b) => {
            // Put Apple and Samsung at the top
            if (a.toLowerCase() === 'apple' && b.toLowerCase() !== 'apple') return -1;
            if (b.toLowerCase() === 'apple' && a.toLowerCase() !== 'apple') return 1;
            if (a.toLowerCase() === 'samsung' && b.toLowerCase() !== 'samsung') return -1;
            if (b.toLowerCase() === 'samsung' && a.toLowerCase() !== 'samsung') return 1;
            return a.localeCompare(b);
        });
    }, [repairsData]);
    const models = useMemo(() => {
        if (!selectedBrand) return [];
        return Array.from(new Set(repairsData.filter(i => i.brand === selectedBrand).map(i => i.model))).sort();
    }, [selectedBrand, repairsData]);
    const issues = useMemo(() => {
        if (!selectedModel) return [];
        return Array.from(new Set(repairsData.filter(i => i.model === selectedModel).map(i => i.issue))).sort();
    }, [selectedModel, repairsData]);
    const quote = useMemo(() => {
        if (!selectedModel || !selectedIssue) return null;
        return repairsData.find(i => i.brand === selectedBrand && i.model === selectedModel && i.issue === selectedIssue);
    }, [selectedBrand, selectedModel, selectedIssue, repairsData]);

    const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setBookingData(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleBookNow = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ brand: selectedBrand, model: selectedModel, issue: selectedIssue, price: quote?.price, bookingDate: bookingData.date, bookingTime: bookingData.time, customerName: bookingData.name, customerEmail: bookingData.email, customerPhone: bookingData.phone, notes: bookingData.notes })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to submit booking');
            setStep(3);
        } catch (err: any) {
            setSubmitError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ── Light theme styles ── */
    const selectClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium text-[14px] outline-none transition-all appearance-none cursor-pointer hover:border-gray-300 focus:border-[#265795] focus:ring-2 focus:ring-[#265795]/10 disabled:opacity-40 disabled:cursor-not-allowed";
    const labelClass = "block text-[10px] font-bold text-gray-400 uppercase tracking-[0.14em] mb-1.5 ml-0.5";
    const inputClass = "w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 font-medium focus:border-[#265795] focus:ring-2 focus:ring-[#265795]/10 outline-none transition-all placeholder:text-gray-400";

    return (
        <div
            className="relative w-full bg-white rounded-2xl p-5 sm:p-6 border border-gray-100"
            style={{
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                fontFamily: 'var(--font-inter)',
            }}
        >
            {/* Top accent — subtle primary line */}
            <div className="absolute top-0 left-6 right-6 h-[2px] rounded-b bg-gradient-to-r from-[#265795] via-[#ecde2e] to-[#265795] opacity-70" />

            <AnimatePresence mode="wait">

                {/* ── STEP 1: Quote ── */}
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <div className="mb-4 text-center">
                            <h2 className="text-lg sm:text-xl font-bold text-[#1a1a2e] tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                                Instant Repair Quote
                            </h2>
                            <p className="text-gray-400 text-[12px] mt-0.5">Select your device details below</p>
                        </div>

                        <div className="space-y-3">
                            {/* Brand */}
                            <div>
                                <label className={labelClass}>Brand</label>
                                <div className="relative">
                                    <select className={selectClass} value={selectedBrand}
                                        onChange={e => { setSelectedBrand(e.target.value); setSelectedModel(''); setSelectedIssue(''); }}
                                        style={{ color: selectedBrand ? '#000' : '#9ca3af' }}
                                    >
                                        <option value="" disabled className="text-black">Select Brand</option>
                                        {brands.map(b => <option key={b} value={b} className="text-black">{b}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
                                </div>
                            </div>

                            {/* Model */}
                            <div className={clsx('transition-opacity duration-200', !selectedBrand && 'opacity-50 pointer-events-none')}>
                                <label className={labelClass}>Model</label>
                                <div className="relative">
                                    <select className={selectClass} value={selectedModel} disabled={!selectedBrand}
                                        onChange={e => { setSelectedModel(e.target.value); setSelectedIssue(''); }}
                                        style={{ color: selectedModel ? '#000' : '#9ca3af' }}
                                    >
                                        <option value="" disabled className="text-black">Select Model</option>
                                        {models.map(m => <option key={m} value={m} className="text-black">{m}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
                                </div>
                            </div>

                            {/* Issue */}
                            <div className={clsx('transition-opacity duration-200', !selectedModel && 'opacity-50 pointer-events-none')}>
                                <label className={labelClass}>Issue</label>
                                <div className="relative">
                                    <select className={selectClass} value={selectedIssue} disabled={!selectedModel}
                                        onChange={e => setSelectedIssue(e.target.value)}
                                        style={{ color: selectedIssue ? '#000' : '#9ca3af' }}
                                    >
                                        <option value="" disabled className="text-black">Select Issue</option>
                                        {issues.map(i => <option key={i} value={i} className="text-black">{i}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
                                </div>
                            </div>

                            {/* Quote Result */}
                            <AnimatePresence>
                                {quote && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-3.5 bg-[#265795]/[0.04] border border-[#265795]/10 rounded-xl mt-0.5">
                                            <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                                                <span className="text-gray-500 flex items-center gap-1.5 text-xs">
                                                    <Clock className="w-3.5 h-3.5 text-[#265795]" /> Est. Time
                                                </span>
                                                <span className="font-semibold text-gray-700 text-xs bg-white px-2 py-0.5 rounded-md border border-gray-100">
                                                    {quote.time || 'Contact us'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-500 flex items-center gap-1.5 text-xs">
                                                    <DollarSign className="w-3.5 h-3.5 text-green-500" /> Est. Price
                                                </span>
                                                <span className="font-bold text-2xl text-[#265795] tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                                                    ${quote.price}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* CTA Button */}
                            <button
                                onClick={() => quote && setStep(2)}
                                disabled={!quote}
                                className={clsx(
                                    'w-full py-3 px-6 rounded-xl font-bold text-[14px] transition-all flex items-center justify-center gap-2 group outline-none mt-1',
                                    quote
                                        ? 'text-[#1a1a2e] hover:brightness-105 active:scale-[0.98]'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                )}
                                style={quote ? {
                                    background: 'linear-gradient(135deg, #ecde2e 0%, #f0e34a 100%)',
                                    boxShadow: '0 2px 10px rgba(236,222,46,0.25)',
                                } : {}}
                            >
                                {quote ? (
                                    <><span>Book This Repair</span><ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>
                                ) : (
                                    <span>Get Instant Quote</span>
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* ── STEP 2: Booking Details ── */}
                {step === 2 && (
                    <motion.div key="step2"
                        initial={{ x: 16, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 16, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <div className="flex items-center mb-4 gap-2">
                            <button onClick={() => setStep(1)}
                                className="p-1.5 -ml-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors group">
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                            </button>
                            <h2 className="text-lg font-bold text-[#1a1a2e]" style={{ fontFamily: 'var(--font-outfit)' }}>Booking Details</h2>
                        </div>

                        <form onSubmit={handleBookNow} className="space-y-3">
                            <div className="bg-[#265795]/[0.04] p-3 rounded-xl border border-[#265795]/10 flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-bold text-[#265795] uppercase tracking-wider mb-0.5">Repairing</p>
                                    <p className="font-bold text-gray-800 text-sm leading-snug">{selectedBrand} {selectedModel}</p>
                                    <p className="text-xs text-gray-500">{selectedIssue}</p>
                                </div>
                                <p className="text-2xl font-bold text-[#265795]" style={{ fontFamily: 'var(--font-outfit)' }}>${quote?.price}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1 group">
                                    <label className={labelClass}>Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        <input type="date" name="date" required
                                            className={inputClass}
                                            value={bookingData.date} onChange={handleBookingChange} />
                                    </div>
                                </div>
                                <div className="space-y-1 group">
                                    <label className={labelClass}>Time</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        <select name="time" required className={clsx(inputClass, 'appearance-none')}
                                            value={bookingData.time} onChange={handleBookingChange}>
                                            <option value="" disabled>Time</option>
                                            {['02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM'].map(t =>
                                                <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {[
                                { label: 'Your Name', name: 'name', type: 'text', icon: User, placeholder: 'John Doe' },
                                { label: 'Phone Number', name: 'phone', type: 'tel', icon: Phone, placeholder: '0412 345 678' },
                                { label: 'Email', name: 'email', type: 'email', icon: Mail, placeholder: 'john@example.com' },
                            ].map(f => (
                                <div key={f.name} className="space-y-1 group">
                                    <label className={labelClass}>{f.label}</label>
                                    <div className="relative">
                                        <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        <input type={f.type} name={f.name} placeholder={f.placeholder} required
                                            className={inputClass}
                                            value={(bookingData as any)[f.name]} onChange={handleBookingChange} />
                                    </div>
                                </div>
                            ))}

                            {submitError && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />{submitError}
                                </div>
                            )}

                            <button type="submit" disabled={isSubmitting}
                                className="w-full py-3 px-6 rounded-xl font-bold text-[14px] text-[#1a1a2e] flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                style={{
                                    background: 'linear-gradient(135deg, #ecde2e 0%, #f0e34a 100%)',
                                    boxShadow: '0 2px 10px rgba(236,222,46,0.25)',
                                }}>
                                {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <><Check className="w-5 h-5" /> Confirm Booking</>}
                            </button>
                        </form>
                    </motion.div>
                )}

                {/* ── STEP 3: Success ── */}
                {step === 3 && (
                    <motion.div key="step3"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center py-8"
                    >
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-green-500" />
                        </div>
                        <h2 className="text-xl font-bold text-[#1a1a2e] mb-1.5" style={{ fontFamily: 'var(--font-outfit)' }}>Booking Confirmed!</h2>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-[260px] mx-auto">
                            We&apos;ll see you on <strong className="text-gray-700">{bookingData.date}</strong> at <strong className="text-gray-700">{bookingData.time}</strong>.
                        </p>
                        <button
                            onClick={() => { setStep(1); setBookingData({ date: '', time: '', name: '', email: '', phone: '', notes: '' }); setSelectedBrand(''); setSelectedModel(''); setSelectedIssue(''); }}
                            className="bg-gray-100 text-gray-700 font-semibold py-2.5 px-8 rounded-xl hover:bg-gray-200 transition-colors text-sm w-full">
                            Book Another Repair
                        </button>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}
