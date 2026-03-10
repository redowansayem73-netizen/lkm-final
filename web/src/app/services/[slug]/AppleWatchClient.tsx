"use client";

import React from 'react';
import Link from 'next/link';
import { Phone, Clock, ChevronRight } from 'lucide-react';

interface AppleWatchClientProps {
    servicesData: any[];
}

export default function AppleWatchClient({ servicesData }: AppleWatchClientProps) {
    const [openFaq, setOpenFaq] = React.useState<number | null>(0);

    const faqs = [
        {
            q: "What does my repair estimate include?",
            a: "The repair price estimate includes both replacement parts and labour."
        },
        {
            q: "What types of phones or tablets do you repair?",
            a: "We repair all major brands including iPhone, Samsung, OPPO, Google Pixel, and tablets like iPad and Samsung Tab."
        },
        {
            q: "What if there are more repairs required to get my phone back in working condition?",
            a: "We will always contact you before proceeding with any additional repairs or costs discovered during diagnostic."
        },
        {
            q: "When should a phone's battery be replaced?",
            a: "We recommend replacement when battery health drops below 80% or you experience abrupt shutdowns."
        },
        {
            q: "What is a Door to Door Repair?",
            a: "Our technician comes to your location to perform the repair on-site for your convenience."
        },
        {
            q: "Will I lose my data?",
            a: "While we take every precaution to protect your data, we always recommend making a backup before any repair."
        }
    ];

    const modelList = [
        "Apple Watch 1st Gen", "Apple Watch 2nd Gen", "Apple Watch 3rd Gen",
        "Apple Watch 4th Gen", "Apple Watch 5th Gen", "Apple Watch 6th Gen",
        "Apple Watch 7th Gen", "Apple Watch 8th Gen", "Apple Watch 9th Gen",
        "Apple Watch SE", "Apple Watch Ultra"
    ];

    const otherServices = servicesData.filter(s =>
        s.slug !== 'apple-watch-repair' &&
        !s.title.toLowerCase().includes('laptop') &&
        !s.title.toLowerCase().includes('macbook')
    ).slice(0, 15);

    return (
        <div className="bg-white">
            {/* White Hero Section */}
            <div className="relative bg-gray-50 py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <img
                        src="https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?q=80&w=2070&auto=format&fit=crop"
                        alt="Apple Watch Repair Tools"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />

                <div className="container mx-auto px-4 relative z-10 pt-[80px] lg:pt-[110px]">
                    <div className="max-w-4xl">
                        <h1 className="text-4xl lg:text-7xl font-black text-[#1a1a2e] mb-4 uppercase tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                            Fast & Professional Apple Watch Repairs in Lakemba
                        </h1>
                        <div className="w-24 h-1 bg-[#245a9a] mb-10" />

                        <div className="space-y-6 text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl">
                            <p>
                                Looking for reliable Apple Watch repair in Lakemba? Our experienced technicians provide fast and professional repairs for all Apple Watch models. Whether your Apple Watch has a cracked screen, battery issue, or is not turning on, we can diagnose and fix the problem quickly.
                            </p>
                            <p>
                                As Lakemba&apos;s trusted repair specialists, we use high-quality parts and proven repair techniques to restore your Apple Watch to perfect working condition.
                            </p>
                            <p>
                                Is your Apple Watch not working properly? Don&apos;t worry — our skilled team is here to help. Visit us today for quick, affordable, and reliable Apple Watch repairs in Lakemba, and get your device back on your wrist in no time.
                            </p>
                        </div>

                        <a href="tel:0410807546" className="inline-block bg-[#245a9a] text-white font-bold py-4 px-10 rounded-full shadow-2xl hover:bg-[#1e4a7e] transition-all text-lg">
                            Get a Free Repair Quote
                        </a>
                    </div>
                </div>
            </div>

            {/* Blue Call Bar */}
            <div className="bg-[#245a9a] py-8 lg:py-12 relative overflow-hidden">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl lg:text-5xl font-black text-white mb-6 uppercase tracking-tighter" style={{ fontFamily: 'var(--font-outfit)' }}>
                        Need Help? We&apos;re Here For You
                    </h2>
                    <a href="tel:0410807546" className="inline-flex items-center gap-4 bg-white text-[#245a9a] font-black py-4 px-8 lg:px-12 rounded-xl text-2xl lg:text-4xl shadow-xl hover:scale-105 transition-all">
                        <Phone className="w-8 h-8 lg:w-10 lg:h-10 fill-current" /> 0410 807 546
                    </a>
                </div>
            </div>

            {/* Content & Sidebar */}
            <div className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-16">
                        <section>
                            <h2 className="text-4xl font-black text-gray-900 mb-8" style={{ fontFamily: 'var(--font-outfit)' }}>
                                Apple Watch Repair Information
                            </h2>
                            <div className="prose prose-lg text-gray-600 max-w-none">
                                <p className="text-lg">
                                    If you want to fix your Apple Watch, our team at Lakemba Mobile King can help you out in no time. We understand your Apple Watch is an essential part of your daily life, and we strive for the fastest possible turnaround without compromising on quality.
                                </p>

                                <div className="mt-10 p-8 bg-gray-50 border-l-4 border-[#245a9a] rounded-r-2xl">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-[#245a9a]" /> Apple Watch Repairs Turnaround Times
                                    </h3>
                                    <p className="text-gray-700 font-medium">
                                        Repair times for Apple watch is around 1-3 business days.
                                    </p>
                                </div>

                                <div className="mt-12">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6 font-outfit uppercase tracking-wider">
                                        We provide free quotes for apple watch repair services
                                    </h3>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
                                        {modelList.map((model, i) => (
                                            <li key={i} className="flex items-center gap-3 text-gray-700 font-medium border-b border-gray-100 pb-2">
                                                <div className="w-2 h-2 bg-[#245a9a] rounded-full" /> {model}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* FAQ Section */}
                        <section className="bg-gray-50 rounded-[30px] p-8 lg:p-16">
                            <h2 className="text-5xl font-black text-center text-gray-900 mb-4 uppercase tracking-tighter" style={{ fontFamily: 'var(--font-outfit)' }}>
                                FAQ&apos;s
                            </h2>
                            <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto text-lg">
                                Get answers to common questions about our repair services, warranty, turnaround times, and how we handle your devices.
                            </p>

                            <div className="space-y-4 max-w-4xl mx-auto">
                                {faqs.map((faq, i) => (
                                    <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transition-all hover:shadow-md">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between p-6 text-left"
                                        >
                                            <span className="text-lg font-bold text-gray-900 pr-8">{faq.q}</span>
                                            <div className="flex-shrink-0">
                                                {openFaq === i ? (
                                                    <div className="w-6 h-1 bg-[#245a9a]" />
                                                ) : (
                                                    <div className="relative w-6 h-6 flex items-center justify-center">
                                                        <div className="absolute w-6 h-1 bg-[#245a9a]" />
                                                        <div className="absolute w-1 h-6 bg-[#245a9a]" />
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                        <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-[600px]' : 'max-h-0'}`}>
                                            <div className="p-6 pt-0 text-gray-600 text-lg border-t border-gray-50">
                                                {faq.a}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-3xl p-8 border-2 border-gray-50 sticky top-24 shadow-sm">
                            <h3 className="text-2xl font-black text-gray-900 mb-8 border-b-2 border-[#245a9a] pb-2 inline-block" style={{ fontFamily: 'var(--font-outfit)' }}>
                                Other Services
                            </h3>
                            <div className="space-y-1">
                                {otherServices.map(s => (
                                    <Link
                                        key={s.id}
                                        href={`/services/${s.slug}`}
                                        className="flex items-center justify-between py-4 border-b border-gray-50 text-lg font-bold text-gray-900 hover:text-[#245a9a] transition-all group"
                                    >
                                        <span>{s.title}</span>
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                ))}
                                <Link href="/services" className="block text-center mt-10 bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all">
                                    View All Services
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
