"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";



export default function StoreHero() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!searchQuery.trim()) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery.trim())}&limit=5`);
                if (res.ok) {
                    const data = await res.json();
                    setSearchResults(data.products || []);
                }
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(fetchSearchResults, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (searchQuery.trim()) {
            setIsSearchFocused(false);
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <section className="relative w-full min-h-[500px] md:min-h-[600px] bg-white flex flex-col items-center justify-center py-12 px-4 overflow-hidden font-poppins">

            {/* Typography */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-gray-900 mb-10 text-center tracking-tight">
                Elevate Your Tech.
            </h1>

            {/* Search Form */}
            <form
                onSubmit={handleSearch}
                className="w-full max-w-2xl relative mb-8 group z-50"
            >
                <div className="relative">
                    <input
                        type="text"
                        placeholder="I'm looking for..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                        className="w-full h-14 md:h-16 pl-8 pr-16 rounded-full border border-brand-blue bg-white text-gray-700 text-lg md:text-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all placeholder:text-gray-400 placeholder:font-light"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center rounded-full text-brand-yellow hover:bg-gray-50 transition-colors"
                    >
                        <Search className="w-6 h-6 md:w-7 md:h-7 stroke-[2.5]" />
                    </button>

                    {/* Ajax Search Dropdown */}
                    <AnimatePresence>
                        {isSearchFocused && searchQuery.trim() && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col z-[100]"
                            >
                                {isSearching ? (
                                    <div className="p-6 text-center text-gray-400 text-sm flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
                                        Searching...
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <>
                                        <div className="max-h-[350px] overflow-y-auto py-2">
                                            {searchResults.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/shop/${product.slug}`}
                                                    className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
                                                    onClick={() => setIsSearchFocused(false)}
                                                >
                                                    <div className="w-14 h-14 bg-white rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100">
                                                        <img
                                                            src={product.primaryImage || product.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400&auto=format&fit=crop'}
                                                            alt={product.name}
                                                            className="w-full h-full object-contain p-1"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col flex-1 min-w-0">
                                                        <span className="text-sm font-semibold text-gray-800 truncate text-left">{product.name}</span>
                                                        <span className="text-sm text-brand-blue font-black mt-0.5 text-left">${Number(product.price).toFixed(2)}</span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleSearch()}
                                            className="w-full py-4 text-sm text-center text-brand-blue font-bold hover:bg-gray-50 border-t border-gray-100 transition-colors bg-white hover:text-blue-800"
                                        >
                                            View all results for "{searchQuery}"
                                        </button>
                                    </>
                                ) : (
                                    <div className="p-6 text-center text-gray-500 text-sm bg-gray-50">No products found for "{searchQuery}"</div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </form>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-xs md:text-sm font-bold tracking-widest text-[#7a8b99] uppercase mb-12">
                <Link href="/products?sort=trending" className="hover:text-brand-blue transition-colors">Trending</Link>
                <Link href="/products?sort=new" className="hover:text-brand-blue transition-colors">New Arrivals</Link>
                <Link href="/products?sort=best_sellers" className="hover:text-brand-blue transition-colors">Best Sellers</Link>
            </div>

        </section>
    );
}
