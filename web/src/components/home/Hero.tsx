'use client';

import Link from 'next/link';
import QuickQuote from './QuickQuote';
import { motion } from 'framer-motion';
import { CalendarDays, ShieldCheck, Clock } from 'lucide-react';

export default function Hero() {
    return (
        <section className="hero-section relative w-full bg-white overflow-hidden">
            {/* Subtle top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#265795] via-[#ecde2e] to-[#265795]" />

            <div
                className="container mx-auto px-5 sm:px-6 lg:px-10 xl:px-16 w-full pt-[130px] lg:pt-[160px] xl:pt-[190px] pb-[40px] lg:pb-[80px]"
            >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-14 xl:gap-20 w-full max-w-[1320px] mx-auto">

                    {/* ── LEFT: Text + Form (stacked on mobile) ── */}
                    <div className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left">

                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-1.5 bg-[#265795]/[0.06] border border-[#265795]/15 text-[#265795] px-4 py-1.5 rounded-full mb-4"
                        >
                            <span className="text-base leading-none">👑</span>
                            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.12em] uppercase" style={{ fontFamily: 'var(--font-outfit)' }}>
                                #1 Rated Mobile Repair Shop — Lakemba, NSW
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.08 }}
                            className="font-extrabold text-[#1a1a2e] leading-[1.08] tracking-tight mb-5 lg:mb-6"
                            style={{
                                fontSize: 'clamp(2rem, 5.5vw, 3.6rem)',
                                fontFamily: 'var(--font-outfit)',
                            }}
                        >
                            Expert Phone Repair{' '}
                            <span className="text-[#265795]">Services</span>
                        </motion.h1>

                        {/* ── MOBILE: Inline form ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            className="w-full lg:hidden"
                        >
                            <QuickQuote variant="light" />
                        </motion.div>

                        {/* ── MOBILE + DESKTOP: Trust row ── */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.35 }}
                            className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 mt-6 lg:mt-0 w-full"
                        >
                            {[
                                { icon: CalendarDays, label: 'Open 7 Days', color: '#265795' },
                                { icon: ShieldCheck, label: 'Service Warranty', color: '#265795' },
                                { icon: Clock, label: '30 Min Repairs', color: '#ecde2e' },
                            ].map((b, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#265795]/[0.07]">
                                        <b.icon className="w-3.5 h-3.5" style={{ color: b.color }} />
                                    </div>
                                    <span className="text-[12px] sm:text-[13px] font-semibold text-gray-600 tracking-wide">{b.label}</span>
                                </div>
                            ))}
                        </motion.div>

                        {/* Desktop subtext below trust */}
                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.28 }}
                            className="hidden lg:block text-gray-500 leading-relaxed max-w-[480px] mt-7 text-[15px]"
                        >
                            Lakemba&apos;s most trusted phone repair shop. We fix iPhones, Samsung, and all smartphones — <strong className="text-gray-700">fast, affordable, and backed by warranty.</strong>
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4 mt-8 w-full lg:w-auto"
                        >
                            <Link href="/shop" className="bg-[#e6d430] text-black font-bold py-3.5 px-8 rounded-xl hover:brightness-105 transition-all text-center shadow-[0_4px_14px_rgba(230,212,48,0.4)]">
                                Shop Accessories
                            </Link>
                            <Link href="/services" className="bg-[#e6d430] text-black font-bold py-3.5 px-8 rounded-xl hover:brightness-105 transition-all text-center shadow-[0_4px_14px_rgba(230,212,48,0.4)]">
                                Our Services
                            </Link>
                        </motion.div>
                    </div>

                    {/* ── RIGHT: Desktop form ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="hidden lg:flex w-full lg:w-[43%] xl:w-[42%] justify-center lg:justify-end"
                    >
                        <div className="w-full max-w-[440px]">
                            <QuickQuote variant="light" />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
