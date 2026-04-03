"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from "@/components/layout/Header";
import ProductCard from "@/components/shop/ProductCard";
import ShopSidebar from "@/components/shop/ShopSidebar";
import { ChevronLeft, ChevronRight, PackageOpen, SlidersHorizontal, X, ChevronDown, Search, Grid3X3, LayoutGrid } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

type Category = {
    id: number;
    name: string;
    slug: string;
    parentId: number | null;
    children?: Category[];
};

type Product = {
    id: string;
    name: string;
    price: number;
    comparePrice?: number;
    image?: string;
    imageUrl?: string;
    primaryImage?: string;
    brand?: string;
    slug: string;
    condition?: string;
    variants?: any[];
};

type Brand = { id: number; name: string; slug: string; logo: string | null; isPopular: boolean | null; };

interface ShopClientProps {
    initialBrands: Brand[];
    initialCategories: Category[];
}

const PRODUCTS_PER_PAGE = 20;

// Smart pagination helper — shows max 7 items with ellipsis
function getPaginationItems(current: number, total: number): (number | '...')[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const items: (number | '...')[] = [];
    if (current <= 4) {
        items.push(1, 2, 3, 4, 5, '...', total);
    } else if (current >= total - 3) {
        items.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
    } else {
        items.push(1, '...', current - 1, current, current + 1, '...', total);
    }
    return items;
}

function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
            <div className="aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-50" />
            <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-1/3" />
                <div className="h-4 bg-gray-100 rounded w-4/5" />
                <div className="h-4 bg-gray-100 rounded w-3/5" />
                <div className="h-6 bg-gray-100 rounded w-2/5 mt-2" />
            </div>
        </div>
    );
}

export default function ProductsClient({ initialBrands, initialCategories }: ShopClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize state from URL params
    const initialCategoryParam = searchParams.get('category');
    const initialActiveCategories = initialCategoryParam ? initialCategoryParam.split(',').filter(Boolean) : [];
    const initialBrand = searchParams.get('brand') || "";

    const initialSort = searchParams.get('sort') || "default";

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategories, setActiveCategories] = useState<string[]>(initialActiveCategories);
    const [activeCategoryNames, setActiveCategoryNames] = useState<string[]>([]);
    const [activeBrandSlug, setActiveBrandSlug] = useState<string>(initialBrand);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [sortBy, setSortBy] = useState(initialSort);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // New filter state
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [activeBrands, setActiveBrands] = useState<string[]>(initialBrand ? [initialBrand] : []);
    const [activeConditions, setActiveConditions] = useState<string[]>([]);
    const [activeTags, setActiveTags] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, Infinity]);
    const [gridCols, setGridCols] = useState<3 | 4>(4);

    const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Debounce search input
    useEffect(() => {
        if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
        searchTimerRef.current = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1);
        }, 400);
        return () => {
            if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
        };
    }, [searchQuery]);

    // Sync state with URL params when they change externally
    useEffect(() => {
        const cat = searchParams.get('category');
        const brnd = searchParams.get('brand');
        const catArray = cat ? cat.split(',').filter(Boolean) : [];
        if (catArray.join(',') !== activeCategories.join(',')) setActiveCategories(catArray);
        if (brnd && brnd !== activeBrandSlug) {
            setActiveBrandSlug(brnd);
            setActiveBrands([brnd]);
        }
    }, [searchParams]);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            let url = `/api/products?page=${currentPage}&limit=${PRODUCTS_PER_PAGE}`;
            if (activeCategories.length > 0) url += `&category=${activeCategories.join(',')}`;
            if (activeBrands.length > 0) url += `&brand=${activeBrands[0]}`;
            if (debouncedSearch) url += `&search=${encodeURIComponent(debouncedSearch)}`;
            if (activeConditions.length > 0) url += `&condition=${activeConditions.join(',')}`;
            if (activeTags.length > 0) url += `&tags=${activeTags.join(',')}`;
            if (priceRange[0] > 0) url += `&minPrice=${priceRange[0]}`;
            if (priceRange[1] < Infinity) url += `&maxPrice=${priceRange[1]}`;
            if (sortBy && sortBy !== 'default') url += `&sort=${sortBy}`;

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                let prods: Product[] = data.products || [];
                // Client-side sort
                if (sortBy === "price-asc") prods = [...prods].sort((a, b) => Number(a.price) - Number(b.price));
                else if (sortBy === "price-desc") prods = [...prods].sort((a, b) => Number(b.price) - Number(a.price));
                else if (sortBy === "name") prods = [...prods].sort((a, b) => a.name.localeCompare(b.name));
                setProducts(prods);
                setTotalPages(data.totalPages || 1);
                setTotalCount(data.totalCount || 0);
            }
        } catch (err) {
            console.error("Failed to fetch products:", err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, activeCategories, activeBrands, sortBy, debouncedSearch, activeConditions, activeTags, priceRange]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    useEffect(() => {
        if (activeCategories.length === 0) { setActiveCategoryNames([]); return; }
        const findName = (cats: Category[], slug: string): string => {
            for (const cat of cats) {
                if (cat.slug === slug) return cat.name;
                if (cat.children) {
                    const found = findName(cat.children, slug);
                    if (found) return found;
                }
            }
            return slug;
        };
        setActiveCategoryNames(activeCategories.map(c => findName(initialCategories, c)));
    }, [activeCategories, initialCategories]);

    const updateUrlParams = (cats: string[], brand: string) => {
        const params = new URLSearchParams();
        if (cats.length > 0) params.set('category', cats.join(','));
        if (brand) params.set('brand', brand);
        router.push(`/products${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });
    };

    const handleCategoryChange = (slugs: string[]) => {
        setActiveCategories(slugs);
        // Do not reset tags when changing models to allow cross-filtering (e.g., Phone Case -> iPhone 16)
        setCurrentPage(1);
        updateUrlParams(slugs, activeBrands.length > 0 ? activeBrands[0] : "");
    };

    const handleBrandChange = (brands: string[]) => {
        setActiveBrands(brands);
        setActiveBrandSlug(brands[0] || "");
        setCurrentPage(1);
        updateUrlParams(activeCategories, brands[0] || "");
    };

    const handlePageChange = (page: number) => {
        if (typeof page !== 'number') return;
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const hasActiveFilters = !!(
        activeCategories.length > 0 ||
        activeBrands.length > 0 ||
        activeConditions.length > 0 ||
        activeTags.length > 0 ||
        debouncedSearch ||
        priceRange[0] > 0 ||
        priceRange[1] < Infinity
    );

    const clearAllFilters = () => {
        setActiveCategories([]);
        setActiveCategoryNames([]);
        setActiveBrands([]);
        setActiveBrandSlug("");
        setActiveConditions([]);
        setActiveTags([]);
        setSearchQuery("");
        setDebouncedSearch("");
        setPriceRange([0, Infinity]);
        setCurrentPage(1);
        router.push('/products', { scroll: false });
    };

    const startItem = totalCount > 0 ? (currentPage - 1) * PRODUCTS_PER_PAGE + 1 : 0;
    const endItem = Math.min(currentPage * PRODUCTS_PER_PAGE, totalCount);

    const activeFilterChips: { label: string; onRemove: () => void }[] = [];
    activeCategories.forEach((catSlug, idx) => {
        const name = activeCategoryNames[idx] || catSlug;
        activeFilterChips.push({
            label: `Model: ${name}`,
            onRemove: () => handleCategoryChange(activeCategories.filter(c => c !== catSlug)),
        });
    });
    activeBrands.forEach(brand => {
        activeFilterChips.push({
            label: `Brand: ${brand}`,
            onRemove: () => handleBrandChange(activeBrands.filter(b => b !== brand)),
        });
    });
    activeConditions.forEach(cond => {
        activeFilterChips.push({
            label: `Condition: ${cond}`,
            onRemove: () => setActiveConditions(activeConditions.filter(c => c !== cond)),
        });
    });
    activeTags.forEach(tag => {
        activeFilterChips.push({
            label: tag,
            onRemove: () => setActiveTags(activeTags.filter(t => t !== tag)),
        });
    });
    if (priceRange[0] > 0 || priceRange[1] < Infinity) {
        const label = priceRange[1] < Infinity
            ? `$${priceRange[0]} – $${priceRange[1]}`
            : `From $${priceRange[0]}`;
        activeFilterChips.push({
            label: `Price: ${label}`,
            onRemove: () => setPriceRange([0, Infinity]),
        });
    }
    if (debouncedSearch) {
        activeFilterChips.push({
            label: `Search: "${debouncedSearch}"`,
            onRemove: () => { setSearchQuery(""); setDebouncedSearch(""); },
        });
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            key="overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.aside
                            key="drawer"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl flex flex-col lg:hidden"
                        >
                            <div className="flex-1 overflow-y-auto p-5">
                                <ShopSidebar
                                    categories={initialCategories}
                                    activeCategories={activeCategories}
                                    onCategoryChange={handleCategoryChange}
                                    onClose={() => setSidebarOpen(false)}
                                    isMobile={true}
                                    activeBrandSlugs={activeBrands}
                                    onBrandChange={handleBrandChange}
                                    activeConditions={activeConditions}
                                    onConditionChange={setActiveConditions}
                                    activeTags={activeTags}
                                    onTagChange={setActiveTags}
                                    priceRange={priceRange}
                                    onPriceRangeChange={setPriceRange}
                                    onClearAllFilters={clearAllFilters}
                                    hasActiveFilters={hasActiveFilters}
                                />
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <main className="flex-1 pt-[104px] w-full">
                {/* Breadcrumb / page banner */}
                <div className="w-full bg-white border-b border-gray-100">
                    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-sm text-gray-500">
                        <span className="hover:text-brand-blue cursor-pointer transition-colors" onClick={() => handleCategoryChange([])}>All Products</span>
                        {activeBrandSlug && (
                            <>
                                <ChevronRight className="w-4 h-4 text-gray-300" />
                                <span className="text-gray-900 font-semibold">{activeBrandSlug.charAt(0).toUpperCase() + activeBrandSlug.slice(1).replace('-', ' ')}</span>
                            </>
                        )}
                        {activeCategoryNames.length > 0 && !activeBrandSlug && (
                            <>
                                <ChevronRight className="w-4 h-4 text-gray-300" />
                                <span className="text-gray-900 font-semibold">{activeCategoryNames.join(', ')}</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex gap-6 lg:gap-8 items-start">
                        {/* Desktop Sidebar */}
                        <aside className="hidden lg:flex flex-col w-64 xl:w-72 flex-shrink-0">
                            <div className="sticky top-[110px] bg-white rounded-2xl border border-gray-100 shadow-sm p-5 max-h-[calc(100vh-130px)] overflow-y-auto custom-scrollbar">
                                <ShopSidebar
                                    categories={initialCategories}
                                    activeCategories={activeCategories}
                                    onCategoryChange={handleCategoryChange}
                                    activeBrandSlugs={activeBrands}
                                    onBrandChange={handleBrandChange}
                                    activeConditions={activeConditions}
                                    onConditionChange={setActiveConditions}
                                    activeTags={activeTags}
                                    onTagChange={setActiveTags}
                                    priceRange={priceRange}
                                    onPriceRangeChange={setPriceRange}
                                    onClearAllFilters={clearAllFilters}
                                    hasActiveFilters={hasActiveFilters}
                                />
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                            {/* Search Bar */}
                            <div className="mb-4">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    <input
                                        type="text"
                                        placeholder="Search products by name, brand, or SKU..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full h-12 pl-12 pr-12 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100 transition-all shadow-sm placeholder:text-gray-400"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => { setSearchQuery(""); setDebouncedSearch(""); }}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Active Filter Chips */}
                            <AnimatePresence>
                                {activeFilterChips.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mb-4 overflow-hidden"
                                    >
                                        <div className="flex flex-wrap gap-2 items-center">
                                            {activeFilterChips.map((chip, i) => (
                                                <motion.button
                                                    key={`${chip.label}-${i}`}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    onClick={chip.onRemove}
                                                    className="flex items-center gap-1.5 h-8 px-3 bg-blue-50 text-brand-blue rounded-lg text-xs font-semibold border border-blue-200 hover:bg-blue-100 transition-all"
                                                >
                                                    {chip.label}
                                                    <X className="w-3 h-3" />
                                                </motion.button>
                                            ))}
                                            <button
                                                onClick={clearAllFilters}
                                                className="h-8 px-3 text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                Clear all
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Toolbar */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                                <div className="flex items-center gap-3">
                                    {/* Mobile filter toggle */}
                                    <button
                                        onClick={() => setSidebarOpen(true)}
                                        className="lg:hidden flex items-center gap-2 h-10 px-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-brand-blue hover:text-brand-blue transition-all shadow-sm"
                                    >
                                        <SlidersHorizontal className="w-4 h-4" />
                                        Filters
                                        {hasActiveFilters && <span className="w-2 h-2 bg-brand-blue rounded-full" />}
                                    </button>

                                    <span className="text-sm text-gray-500 hidden sm:block">
                                        {loading ? "Loading..." : `${totalCount} product${totalCount !== 1 ? 's' : ''}`}
                                        {totalCount > 0 && !loading && ` · ${startItem}–${endItem}`}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Grid toggle */}
                                    <div className="hidden md:flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                        <button
                                            onClick={() => setGridCols(3)}
                                            className={clsx(
                                                "p-2 transition-all",
                                                gridCols === 3 ? "bg-brand-blue text-white" : "text-gray-400 hover:text-gray-600"
                                            )}
                                            title="3 columns"
                                        >
                                            <LayoutGrid className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setGridCols(4)}
                                            className={clsx(
                                                "p-2 transition-all",
                                                gridCols === 4 ? "bg-brand-blue text-white" : "text-gray-400 hover:text-gray-600"
                                            )}
                                            title="4 columns"
                                        >
                                            <Grid3X3 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Sort */}
                                    <div className="relative flex-shrink-0">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                                            className="h-10 pl-3 pr-8 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none hover:border-brand-blue focus:border-brand-blue focus:ring-2 focus:ring-blue-50 transition-all appearance-none cursor-pointer shadow-sm"
                                        >
                                            <option value="default">Sort: Default</option>
                                            <option value="newest">Newest First</option>
                                            <option value="price-asc">Price: Low to High</option>
                                            <option value="price-desc">Price: High to Low</option>
                                            <option value="name">Name: A–Z</option>
                                        </select>
                                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Product Count (mobile) */}
                            <p className="sm:hidden text-sm text-gray-500 mb-4">
                                {loading ? "Loading..." : `${totalCount} product${totalCount !== 1 ? 's' : ''}`}
                                {totalCount > 0 && !loading && ` · Showing ${startItem}–${endItem}`}
                            </p>

                            {/* Products Grid */}
                            <div className="relative min-h-[320px]">
                                <AnimatePresence mode="wait">
                                    {loading ? (
                                        <motion.div
                                            key="skeleton"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className={clsx(
                                                "grid gap-3 md:gap-4",
                                                gridCols === 3
                                                    ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3"
                                                    : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
                                            )}
                                        >
                                            {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                                        </motion.div>
                                    ) : products.length > 0 ? (
                                        <motion.div
                                            key={`grid-${currentPage}-${activeCategories.join('-')}-${gridCols}`}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className={clsx(
                                                "grid gap-3 md:gap-4",
                                                gridCols === 3
                                                    ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3"
                                                    : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
                                            )}
                                        >
                                            {products.map((product, idx) => (
                                                <motion.div
                                                    key={product.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.25, delay: idx * 0.03 }}
                                                >
                                                    <ProductCard
                                                        id={product.id}
                                                        slug={product.slug}
                                                        name={product.name}
                                                        price={product.price}
                                                        image={product.primaryImage || product.imageUrl}
                                                        brand={product.brand}
                                                        condition={product.condition}
                                                        variants={product.variants}
                                                    />
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="empty"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-gray-200 text-center"
                                        >
                                            <PackageOpen className="w-14 h-14 text-gray-200 mb-4" strokeWidth={1.5} />
                                            <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
                                            <p className="text-gray-500 text-sm max-w-xs">
                                                {hasActiveFilters
                                                    ? "Try adjusting your filters or search term."
                                                    : "No products are available right now. Check back later!"}
                                            </p>
                                            {hasActiveFilters && (
                                                <button
                                                    onClick={clearAllFilters}
                                                    className="mt-5 px-5 py-2 bg-brand-blue text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
                                                >
                                                    Clear All Filters
                                                </button>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Pagination */}
                            {!loading && totalPages > 1 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-10 flex flex-col items-center gap-4"
                                >
                                    {/* Page info */}
                                    <p className="text-sm text-gray-500">
                                        Showing <span className="font-semibold text-gray-800">{startItem}–{endItem}</span> of <span className="font-semibold text-gray-800">{totalCount}</span> results
                                    </p>

                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 disabled:opacity-30 hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all shadow-sm"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>

                                        {getPaginationItems(currentPage, totalPages).map((item, i) =>
                                            item === '...' ? (
                                                <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
                                            ) : (
                                                <button
                                                    key={item}
                                                    onClick={() => handlePageChange(item as number)}
                                                    className={clsx(
                                                        "w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all shadow-sm",
                                                        currentPage === item
                                                            ? "bg-brand-blue text-white shadow-blue-200"
                                                            : "bg-white border border-gray-200 text-gray-600 hover:border-brand-blue hover:text-brand-blue"
                                                    )}
                                                >
                                                    {item}
                                                </button>
                                            )
                                        )}

                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 disabled:opacity-30 hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all shadow-sm"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
