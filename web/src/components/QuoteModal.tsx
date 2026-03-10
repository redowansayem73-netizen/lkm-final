'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import QuickQuote from '@/components/home/QuickQuote';

export default function QuoteModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-[#e6d430] text-black font-semibold py-3.5 px-8 rounded-xl shadow-lg hover:brightness-105 transition-all text-sm tracking-wide"
            >
                Get a Free Repair Quote
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />
                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10 transition"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                        <div className="p-6">
                            <QuickQuote />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
