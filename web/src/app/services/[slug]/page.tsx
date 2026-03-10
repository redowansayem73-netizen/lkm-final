import React from 'react';
import servicesData from '@/data/services.json';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Phone, Clock, ChevronRight, ChevronDown } from 'lucide-react';
import { db } from '@/db';
import { services } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import QuoteModal from '@/components/QuoteModal';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export function generateStaticParams() {
    return servicesData.map((service) => ({
        slug: service.slug,
    }));
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Fetch from database
    const [dbService] = await db.select().from(services)
        .where(and(eq(services.slug, slug), eq(services.isActive, true)))
        .limit(1);

    if (!dbService) {
        notFound();
    }

    // Parse JSON fields
    const modelsList: string[] = dbService.modelsList ? JSON.parse(dbService.modelsList) : [];
    const faqData: { q: string; a: string }[] = dbService.faqData ? JSON.parse(dbService.faqData) : [];

    return <DynamicServiceLayout service={dbService} modelsList={modelsList} faqData={faqData} />;
}

// Unified layout for all DB-sourced services
function DynamicServiceLayout({ service, modelsList, faqData }: {
    service: any;
    modelsList: string[];
    faqData: { q: string; a: string }[];
}) {
    const otherServices = servicesData.filter(s =>
        s.slug !== service.slug
    ).slice(0, 15);

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="bg-gray-50 py-16 lg:py-20 overflow-hidden relative">
                {service.heroImage && !service.heroImage.includes('unsplash') && (
                    <>
                        <div className="absolute inset-0 opacity-10">
                            <img src={service.heroImage} alt={service.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-gray-50/95 to-gray-50/80" />
                    </>
                )}
                <div className="container mx-auto px-4 relative z-10 pt-[50px] lg:pt-[80px]">
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        <div className="flex-1 text-center lg:text-left">
                            <h1 className="text-2xl lg:text-4xl font-semibold text-[#1a1a2e] mb-5 leading-tight tracking-tight">
                                {service.title}
                            </h1>
                            {service.heroDescription && (
                                <div className="space-y-4 text-base text-gray-500 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                    {service.heroDescription.split('\n\n').map((p: string, i: number) => (
                                        <p key={i}>{p}</p>
                                    ))}
                                </div>
                            )}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                <QuoteModal />
                                <a href="tel:0410807546" className="bg-white text-[#265795] border border-gray-200 font-semibold py-3.5 px-8 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2 text-sm">
                                    <Phone className="w-4 h-4" /> 0410 807 546
                                </a>
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] rounded-2xl overflow-hidden shadow-lg bg-gray-100">
                                <img
                                    src={service.heroImage || `https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=400&fit=crop&auto=format`}
                                    alt={service.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call Bar */}
            <div className="bg-[#1f5494] py-6 lg:py-8">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4 tracking-tight">
                        Need Help? We&apos;re Here For You
                    </h2>
                    <a href="tel:0410807546" className="inline-flex items-center gap-3 bg-white text-[#1f5494] font-bold py-3 px-8 lg:px-10 rounded-xl text-xl lg:text-2xl shadow-lg hover:scale-105 transition-all">
                        <Phone className="w-6 h-6 lg:w-7 lg:h-7 fill-current" /> 0410 807 546
                    </a>
                </div>
            </div>

            {/* Content & Sidebar */}
            <div className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2 space-y-12">
                        {/* Rich Content */}
                        {service.content && (
                            <section>
                                <div className="prose prose-lg text-gray-600 max-w-none" dangerouslySetInnerHTML={{ __html: service.content }} />
                            </section>
                        )}

                        {/* Turnaround Time */}
                        {service.turnaroundTime && (
                            <section className="bg-blue-50 rounded-3xl p-8 lg:p-12">
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="bg-white p-4 rounded-2xl shadow-sm self-start">
                                        <Clock className="w-10 h-10 text-[#265795]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-[#1a1a2e] tracking-tight">
                                            Turnaround Times
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed text-base mt-2">{service.turnaroundTime}</p>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Models & FAQ — Two Column Layout */}
                        {(modelsList.length > 0 || faqData.length > 0) && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                {/* Models List */}
                                {modelsList.length > 0 && (
                                    <section>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-6 tracking-tight">
                                            Supported Models
                                        </h3>
                                        <ul className="space-y-2.5">
                                            {modelsList.map((model, i) => (
                                                <li key={i} className="flex items-center gap-3 text-gray-700 font-medium border-b border-gray-100 pb-2 text-sm">
                                                    <div className="w-1.5 h-1.5 bg-[#265795] rounded-full flex-shrink-0" /> {model}
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                )}

                                {/* FAQ Accordion */}
                                {faqData.length > 0 && (
                                    <section>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-6 tracking-tight">
                                            Frequently Asked Questions
                                        </h3>
                                        <div className="space-y-3">
                                            {faqData.map((faq, i) => (
                                                <details key={i} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden group" open={i === 0}>
                                                    <summary className="w-full flex items-center justify-between p-4 text-left cursor-pointer list-none">
                                                        <span className="text-sm font-semibold text-gray-900 pr-6">{faq.q}</span>
                                                        <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                                                    </summary>
                                                    <div className="px-4 pb-4 text-gray-600 text-sm border-t border-gray-100 pt-3">
                                                        {faq.a}
                                                    </div>
                                                </details>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                            <h3 className="text-lg font-semibold text-[#1a1a2e] mb-6 tracking-tight">
                                Other Services
                            </h3>
                            <div className="space-y-2">
                                {otherServices.map(s => (
                                    <Link
                                        key={s.id}
                                        href={`/services/${s.slug}`}
                                        className="flex items-center justify-between p-3 rounded-xl hover:bg-white hover:shadow-md transition-all group"
                                    >
                                        <span className="text-gray-600 group-hover:text-[#265795] font-medium text-sm">{s.title}</span>
                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#265795] group-hover:translate-x-1 transition-all" />
                                    </Link>
                                ))}
                                <Link href="/services" className="block text-center mt-6 text-[#265795] font-semibold hover:underline text-sm">
                                    View All Services
                                </Link>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-[#265795] to-[#1e3a8a] text-white rounded-3xl p-8 shadow-xl">
                            <Phone className="w-7 h-7 text-[#e6d430] mb-4" />
                            <h4 className="text-lg font-semibold mb-2">Need Help?</h4>
                            <p className="text-blue-100 mb-6 text-sm">Speak with our expert technicians at Lakemba Mobile King.</p>
                            <a href="tel:0410807546" className="block text-center bg-white text-[#265795] font-semibold py-3 rounded-xl hover:shadow-lg transition-all">
                                0410 807 546
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
