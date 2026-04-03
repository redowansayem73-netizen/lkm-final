"use client";

import Link from "next/link";
import { Search, ShoppingCart, Menu, Phone, ChevronDown, X, Facebook, Instagram } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import brandsData from "@/data/brands.json";

import { useCart } from "@/context/CartContext";
import clsx from "clsx";

// Custom TikTok Icon since it's not in Lucide
const TikTok = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        height="1em"
        width="1em"
        className={className}
    >
        <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
    </svg>
);

export default function Header({ className = '' }: { className?: string }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isRepairOpen, setIsRepairOpen] = useState(false);
    const [isBrandsOpen, setIsBrandsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [shopCategories, setShopCategories] = useState<any[]>([]);
    const [shopBrands, setShopBrands] = useState<any[]>([]);


    const pathname = usePathname();
    const router = useRouter();
    const isHome = pathname === '/';
    const isShopPage = pathname === '/shop' || pathname.startsWith('/shop/');

    const navRef = useRef<HTMLDivElement>(null);
    const { items } = useCart();

    const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Fetch dynamic shop filters only on shop page
    useEffect(() => {
        if (isShopPage) {
            fetch('/api/products/filters')
                .then(res => res.json())
                .then(data => {
                    setShopCategories(data.categories || []);
                    setShopBrands(data.brands || []);
                })
                .catch(console.error);
        }
    }, [isShopPage]);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleSearch = (e: React.FormEvent | React.KeyboardEvent) => {
        if ('key' in e && e.key !== 'Enter') return;
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsMenuOpen(false);
        }
    };


    // Header transparency logic - Disabled per user request for solid colored header
    const isTransparent = false;

    return (
        <header className={clsx(
            className,
            "fixed w-full z-50 transition-all duration-300"
        )}>
            {/* Top Bar - #265795 Blue bg */}
            <div className="bg-[#265795] text-white py-2 text-xs md:text-sm relative z-50 border-b border-[#265795]/10 flex flex-col justify-center">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    {/* Left: Phone & Open Info */}
                    <div className="flex items-center gap-4 md:gap-6">
                        <a href="tel:0410807546" className="flex items-center hover:text-brand-yellow transition font-medium">
                            <Phone className="h-3 w-3 mr-2" />
                            0410 807 546
                        </a>
                        <span className="hidden sm:flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                            Open 7 Days
                        </span>
                    </div>

                    {/* Right: Social Icons */}
                    <div className="flex items-center gap-4">
                        <a href="https://www.facebook.com/lakemba.mobileking/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-yellow transition">
                            <Facebook className="h-4 w-4" />
                        </a>
                        <a href="https://www.instagram.com/lakemba.mobileking/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-yellow transition">
                            <Instagram className="h-4 w-4" />
                        </a>
                        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-yellow transition">
                            <TikTok className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Navigation - White bg, Black text */}
            <div className="w-full transition-all duration-300 border-b bg-white py-3 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5 group text-black">
                            <div className="rounded-full flex-shrink-0 transition-all duration-300 group-hover:scale-105 ring-2 ring-brand-yellow/30 shadow-[0_2px_12px_rgba(30,58,138,0.15)]">
                                <img
                                    src="/lakemba-logo.png"
                                    alt="Lakemba Mobile King"
                                    className="h-12 w-12 sm:h-[52px] sm:w-[52px] rounded-full object-cover block"
                                />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-black transition-colors group-hover:text-[#265795]">Lakemba</span>
                                <span className="text-[11px] sm:text-xs font-black text-brand-yellow uppercase tracking-widest">Mobile King</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-8 font-medium transition-colors text-black">
                            {isShopPage ? (
                                <>
                                    <Link href="/shop" className="hover:text-[#265795] font-bold transition">All Products</Link>

                                    {/* Dynamic Shop Categories Dropdown */}
                                    <div className="group relative">
                                        <button className="flex items-center py-2 hover:text-[#265795] focus:outline-none transition gap-1">
                                            Categories <ChevronDown className="h-4 w-4 transform group-hover:-rotate-180 transition-transform duration-300" />
                                        </button>
                                        <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 w-64 z-50">
                                            <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4 text-gray-800 font-normal">
                                                <ul className="space-y-1 max-h-[60vh] overflow-y-auto pr-2">
                                                    {shopCategories.length > 0 ? shopCategories.map((cat: any) => (
                                                        <li key={cat.id}>
                                                            <Link href={`/shop?category=${cat.slug}`} className="block px-3 py-2 rounded-lg hover:bg-gray-50 hover:text-[#265795] hover:translate-x-1 transition-all truncate text-sm">
                                                                {cat.name}
                                                            </Link>
                                                        </li>
                                                    )) : (
                                                        <li className="px-3 py-2 text-gray-400 text-sm">Loading categories...</li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <Link href="/products?sort=newest" className="hover:text-[#265795] font-bold transition">New Arrivals</Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/services" className="hover:text-[#265795] transition">Repair Services</Link>

                                    {/* Brands Dropdown */}
                                    <div className="group relative">
                                        <button className="flex items-center py-2 hover:text-[#265795] focus:outline-none transition gap-1">
                                            Brands <ChevronDown className="h-4 w-4" />
                                        </button>
                                        <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top w-56">
                                            <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4 text-gray-800">
                                                <ul className="space-y-2">
                                                    {brandsData.map((brand) => (
                                                        <li key={brand.id}>
                                                            <Link href={`/brands/${brand.slug}`} className="block hover:text-[#265795] hover:translate-x-1 transition-transform">
                                                                {brand.name} Repairs
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <Link href="/about" className="hover:text-[#265795] transition">About Us</Link>
                                    <Link href="/blog" className="hover:text-[#265795] transition">Blog</Link>
                                    <Link href="/contact" className="hover:text-[#265795] transition">Contact Us</Link>
                                </>
                            )}
                        </nav>

                        {/* Right Side Icons & CTA */}
                        <div className="flex items-center space-x-4">
                            {/* Search (Compact) - Hidden on Shop */}
                            {!isShopPage && (
                                <div className="hidden xl:flex relative">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={handleSearch}
                                        className={clsx(
                                            "w-48 border rounded-full py-1.5 px-4 text-sm focus:outline-none focus:border-brand-blue transition",
                                            isTransparent
                                                ? "bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white focus:text-gray-900"
                                                : "bg-gray-50 border-gray-200 focus:bg-white"
                                        )}
                                    />
                                    <button onClick={handleSearch} className="absolute right-3 top-2">
                                        <Search className="h-4 w-4 text-gray-900" />
                                    </button>
                                </div>
                            )}

                            <Link href="/cart" className="relative hover:text-[#265795] transition text-black">
                                <ShoppingCart className="h-6 w-6" />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-brand-yellow text-brand-blue text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>

                            {!isShopPage && (
                                <Link
                                    href="/shop"
                                    className="hidden md:inline-flex items-center justify-center px-5 py-2 border border-transparent text-sm font-bold rounded-full shadow-lg text-brand-blue bg-brand-yellow hover:bg-white hover:scale-105 transition-all"
                                >
                                    Online Store
                                </Link>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                className="lg:hidden p-1 transition-colors text-black"
                                onClick={toggleMenu}
                            >
                                {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div className={`lg:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-screen opacity-100 shadow-xl' : 'max-h-0 opacity-0'}`}>
                <div className="container mx-auto px-4 py-4 space-y-4 font-medium">
                    {/* Search Mobile - Hidden on Shop */}
                    {!isShopPage && (
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                className="w-full border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:border-brand-blue bg-gray-50 text-gray-900"
                            />
                            <button onClick={handleSearch} className="absolute right-3 top-3.5">
                                <Search className="h-5 w-5 text-gray-400" />
                            </button>
                        </div>
                    )}

                    <div className="space-y-1">
                        {isShopPage ? (
                            <>
                                <Link href="/shop" className="block py-3 text-lg font-bold text-brand-blue border-b border-gray-100" onClick={toggleMenu}>
                                    All Products
                                </Link>

                                <div>
                                    <button
                                        onClick={() => setIsBrandsOpen(!isBrandsOpen)}
                                        className="flex items-center justify-between w-full py-3 text-lg text-gray-800 border-b border-gray-100"
                                    >
                                        Categories <ChevronDown className={`h-5 w-5 transition-transform ${isBrandsOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div className={`pl-4 bg-gray-50 rounded-b-lg space-y-3 overflow-hidden transition-all duration-300 ${isBrandsOpen ? 'max-h-[400px] py-4 overflow-y-auto' : 'max-h-0'}`}>
                                        <ul className="space-y-3">
                                            {shopCategories.length > 0 ? shopCategories.map((cat: any) => (
                                                <li key={cat.id}>
                                                    <Link href={`/shop?category=${cat.slug}`} className="block text-gray-600 truncate" onClick={toggleMenu}>
                                                        {cat.name}
                                                    </Link>
                                                </li>
                                            )) : (
                                                <li className="text-gray-400 text-sm">Loading categories...</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>


                                <Link href="/products?sort=newest" className="block py-3 text-lg font-bold text-gray-800 border-b border-gray-100" onClick={toggleMenu}>
                                    New Arrivals
                                </Link>
                                <Link href="/track-order" className="block py-3 text-lg font-bold text-gray-800 border-b border-gray-100" onClick={toggleMenu}>
                                    Track Order
                                </Link>
                            </>
                        ) : (
                            <>
                                <div>
                                    <button
                                        onClick={() => setIsBrandsOpen(!isBrandsOpen)}
                                        className="flex items-center justify-between w-full py-3 text-lg text-black border-b border-gray-100"
                                    >
                                        Brands <ChevronDown className={`h-5 w-5 transition-transform ${isBrandsOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div className={`pl-4 bg-gray-50 rounded-b-lg space-y-3 overflow-hidden transition-all duration-300 ${isBrandsOpen ? 'max-h-[400px] py-4' : 'max-h-0'}`}>
                                        <ul className="space-y-3">
                                            {brandsData.map((brand) => (
                                                <li key={brand.id}>
                                                    <Link href={`/brands/${brand.slug}`} className="block text-gray-700 hover:text-[#265795]" onClick={toggleMenu}>
                                                        {brand.name} Repairs
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <Link href="/services" className="block py-3 text-lg text-black border-b border-gray-100 font-medium" onClick={toggleMenu}>
                                    Repair Services
                                </Link>

                                <Link href="/about" className="block py-3 text-lg text-black border-b border-gray-100 font-medium" onClick={toggleMenu}>
                                    About Us
                                </Link>
                                <Link href="/blog" className="block py-3 text-lg text-black border-b border-gray-100 font-medium" onClick={toggleMenu}>
                                    Blog
                                </Link>
                                <Link href="/contact" className="block py-3 text-lg text-black border-b border-gray-100 font-medium" onClick={toggleMenu}>
                                    Contact Us
                                </Link>
                                <Link href="/shop" className="block py-3 text-lg text-[#265795] font-bold" onClick={toggleMenu}>
                                    Online Store
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
