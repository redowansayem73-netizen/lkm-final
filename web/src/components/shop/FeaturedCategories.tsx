"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
    Headphones, Speaker, Watch, Plug, Cable, BatteryCharging, Smartphone,
    Car, Monitor, Usb, Zap, MapPin, ChevronRight
} from 'lucide-react';

// Categories mapped from actual DB data with premium icons
const categories = [
    {
        name: 'Phone Cases',
        slug: 'iphone-17-pro',
        icon: Smartphone,
        color: 'from-blue-500 to-indigo-600',
        bgLight: 'bg-blue-50',
        textColor: 'text-blue-600',
        description: 'Latest iPhone cases',
    },
    {
        name: 'Audio',
        slug: 'audio',
        icon: Headphones,
        color: 'from-purple-500 to-violet-600',
        bgLight: 'bg-purple-50',
        textColor: 'text-purple-600',
        description: 'Earbuds & Headphones',
    },
    {
        name: 'Power Banks',
        slug: 'power-bank',
        icon: BatteryCharging,
        color: 'from-emerald-500 to-teal-600',
        bgLight: 'bg-emerald-50',
        textColor: 'text-emerald-600',
        description: 'Portable charging',
    },
    {
        name: 'Apple Cables',
        slug: 'cables-for-apple',
        icon: Cable,
        color: 'from-sky-500 to-cyan-600',
        bgLight: 'bg-sky-50',
        textColor: 'text-sky-600',
        description: 'Lightning & USB-C',
    },
    {
        name: 'Stands & Mounts',
        slug: 'stand-mount',
        icon: MapPin,
        color: 'from-amber-500 to-orange-600',
        bgLight: 'bg-amber-50',
        textColor: 'text-amber-600',
        description: 'Phone & tablet stands',
    },
    {
        name: 'Car Accessories',
        slug: 'car-accessories',
        icon: Car,
        color: 'from-slate-600 to-gray-700',
        bgLight: 'bg-slate-50',
        textColor: 'text-slate-600',
        description: 'Mounts & chargers',
    },
    {
        name: 'Wall Chargers',
        slug: 'wall-chargers',
        icon: Plug,
        color: 'from-rose-500 to-pink-600',
        bgLight: 'bg-rose-50',
        textColor: 'text-rose-600',
        description: 'Fast charge adapters',
    },
    {
        name: 'Speakers',
        slug: 'speakers',
        icon: Speaker,
        color: 'from-orange-500 to-red-600',
        bgLight: 'bg-orange-50',
        textColor: 'text-orange-600',
        description: 'Bluetooth speakers',
    },
    {
        name: 'HDMI Cables',
        slug: 'hdmi-cables',
        icon: Monitor,
        color: 'from-indigo-500 to-blue-600',
        bgLight: 'bg-indigo-50',
        textColor: 'text-indigo-600',
        description: 'Display cables',
    },
    {
        name: 'USB Cables',
        slug: 'micro-usb-cables',
        icon: Usb,
        color: 'from-teal-500 to-emerald-600',
        bgLight: 'bg-teal-50',
        textColor: 'text-teal-600',
        description: 'Micro USB & more',
    },
    {
        name: 'Watch Accessories',
        slug: 'watch-accessories',
        icon: Watch,
        color: 'from-fuchsia-500 to-purple-600',
        bgLight: 'bg-fuchsia-50',
        textColor: 'text-fuchsia-600',
        description: 'Bands & chargers',
    },
    {
        name: 'Wireless Chargers',
        slug: 'Wireless-Charger',
        icon: Zap,
        color: 'from-yellow-500 to-amber-600',
        bgLight: 'bg-yellow-50',
        textColor: 'text-yellow-600',
        description: 'MagSafe & Qi pads',
    },
];

type Category = typeof categories[0];

function CategoryCard({ category }: { category: Category }) {
    return (
        <Link
            href={`/products?category=${category.slug}`}
            className="group relative flex flex-col items-center text-center"
        >
            {/* Icon container */}
            <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl ${category.bgLight} flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg overflow-hidden`}>
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />
                
                {/* Icon */}
                <category.icon className={`relative z-10 w-7 h-7 md:w-9 md:h-9 ${category.textColor} group-hover:text-white transition-colors duration-300 stroke-[1.5]`} />
            </div>

            {/* Name */}
            <span className="text-sm font-semibold text-gray-800 group-hover:text-[#265795] transition-colors duration-200 leading-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                {category.name}
            </span>
        </Link>
    );
}

export default function FeaturedCategories() {
    const [showAll, setShowAll] = useState(false);

    // Show 6 on mobile initially, all on desktop
    const mobileCategories = showAll ? categories : categories.slice(0, 6);

    return (
        <section className="py-10 md:py-14 bg-white" aria-label="Shop by Category">
            <div className="container mx-auto px-4">
                {/* Section Header — Centered on desktop */}
                <div className="flex flex-col items-center text-center mb-8 md:mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>
                        <span className="text-gray-900">Shop by </span>
                        <span className="text-[#265795]">Category</span>
                    </h2>
                    <p className="text-gray-400 text-sm mt-1.5 hidden md:block">Browse our most popular collections</p>
                </div>

                {/* Desktop Grid - 6 columns, centered */}
                <div className="hidden md:grid grid-cols-6 gap-6 lg:gap-8 max-w-5xl mx-auto">
                    {categories.map((category) => (
                        <CategoryCard key={category.slug} category={category} />
                    ))}
                </div>

                {/* Mobile Grid - 3 columns */}
                <div className="grid grid-cols-3 gap-4 md:hidden">
                    {mobileCategories.map((category) => (
                        <CategoryCard key={category.slug} category={category} />
                    ))}
                </div>

                {/* Mobile "See All" Button */}
                {!showAll && (
                    <div className="mt-8 text-center md:hidden">
                        <button
                            onClick={() => setShowAll(true)}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-200 active:scale-95 transition-all"
                        >
                            Show All Categories
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* View All link for desktop */}
                <div className="hidden md:flex justify-center mt-8">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#265795] hover:text-blue-700 transition-colors"
                        style={{ fontFamily: 'var(--font-outfit)' }}
                    >
                        View All Products
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
