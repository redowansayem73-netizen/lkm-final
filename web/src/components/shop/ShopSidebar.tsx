"use client";

import { useState, useMemo, useEffect } from 'react';
import { ChevronDown, Search, Plus, Minus, X, Home, Tag, DollarSign, Layers, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

type Category = {
    id: number;
    name: string;
    slug: string;
    parentId: number | null;
    children?: Category[];
};

type FilterTag = { name: string; count: number };
type FilterBrand = { name: string; count: number };
type FilterCondition = { name: string; count: number };

interface ShopSidebarProps {
    categories: Category[];
    activeCategory: string | null;
    onCategoryChange: (slug: string | null) => void;
    onClose?: () => void;
    isMobile?: boolean;
    // New filter props
    activeBrandSlugs?: string[];
    onBrandChange?: (brands: string[]) => void;
    activeConditions?: string[];
    onConditionChange?: (conditions: string[]) => void;
    activeTags?: string[];
    onTagChange?: (tags: string[]) => void;
    priceRange?: [number, number];
    onPriceRangeChange?: (range: [number, number]) => void;
    onClearAllFilters?: () => void;
    hasActiveFilters?: boolean;
}

export default function ShopSidebar({
    categories,
    activeCategory,
    onCategoryChange,
    onClose,
    isMobile = false,
    activeBrandSlugs = [],
    onBrandChange,
    activeConditions = [],
    onConditionChange,
    activeTags = [],
    onTagChange,
    priceRange,
    onPriceRangeChange,
    onClearAllFilters,
    hasActiveFilters = false,
}: ShopSidebarProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedTrees, setExpandedTrees] = useState<Record<number, boolean>>({});
    const [showMore, setShowMore] = useState<Record<number, boolean>>({});
    const [brandSearch, setBrandSearch] = useState("");

    // Dynamic filter data from API
    const [filterData, setFilterData] = useState<{
        tags: FilterTag[];
        brands: FilterBrand[];
        conditions: FilterCondition[];
        priceRange: { min: number; max: number };
    } | null>(null);
    const [filterLoading, setFilterLoading] = useState(false);

    // Local price inputs
    const [localMinPrice, setLocalMinPrice] = useState("");
    const [localMaxPrice, setLocalMaxPrice] = useState("");

    // Expanded sections
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        categories: true,
        productType: true,
        brands: false,
        price: false,
        condition: false,
    });

    const toggleSection = (key: string) => {
        setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Fetch dynamic filter data when category changes
    useEffect(() => {
        const fetchFilters = async () => {
            setFilterLoading(true);
            try {
                let url = '/api/products/filters';
                if (activeCategory) url += `?category=${activeCategory}`;
                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    setFilterData(data);
                    // Auto-expand product type if tags exist
                    if (data.tags.length > 0) {
                        setExpandedSections(prev => ({ ...prev, productType: true }));
                    }
                }
            } catch (err) {
                console.error('Failed to fetch filters:', err);
            } finally {
                setFilterLoading(false);
            }
        };
        fetchFilters();
    }, [activeCategory]);

    // Sync local price with external price range
    useEffect(() => {
        if (priceRange) {
            setLocalMinPrice(priceRange[0] > 0 ? String(priceRange[0]) : "");
            setLocalMaxPrice(priceRange[1] < Infinity ? String(priceRange[1]) : "");
        }
    }, [priceRange]);

    const toggleTree = (id: number) => {
        setExpandedTrees(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleShowMore = (id: number) => {
        setShowMore(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const filteredCategories = useMemo(() => {
        if (!searchQuery) return categories;
        const q = searchQuery.toLowerCase();
        const filterTree = (nodes: Category[]): Category[] =>
            nodes.reduce((acc: Category[], node) => {
                const matches = node.name.toLowerCase().includes(q);
                const filteredChildren = node.children ? filterTree(node.children) : [];
                if (matches || filteredChildren.length > 0) {
                    acc.push({ ...node, children: filteredChildren });
                }
                return acc;
            }, []);
        return filterTree(categories);
    }, [categories, searchQuery]);

    const filteredBrands = useMemo(() => {
        if (!filterData) return [];
        if (!brandSearch) return filterData.brands;
        const q = brandSearch.toLowerCase();
        return filterData.brands.filter(b => b.name.toLowerCase().includes(q));
    }, [filterData, brandSearch]);

    const handleSelect = (slug: string) => {
        onCategoryChange(activeCategory === slug ? null : slug);
        if (isMobile && onClose) onClose();
    };

    const handleToggleBrand = (brand: string) => {
        if (!onBrandChange) return;
        const newBrands = activeBrandSlugs.includes(brand)
            ? activeBrandSlugs.filter(b => b !== brand)
            : [...activeBrandSlugs, brand];
        onBrandChange(newBrands);
    };

    const handleToggleCondition = (condition: string) => {
        if (!onConditionChange) return;
        const newConditions = activeConditions.includes(condition)
            ? activeConditions.filter(c => c !== condition)
            : [...activeConditions, condition];
        onConditionChange(newConditions);
    };

    const handleToggleTag = (tag: string) => {
        if (!onTagChange) return;
        const newTags = activeTags.includes(tag)
            ? activeTags.filter(t => t !== tag)
            : [...activeTags, tag];
        onTagChange(newTags);
    };

    const handleApplyPrice = () => {
        if (!onPriceRangeChange) return;
        const min = localMinPrice ? Number(localMinPrice) : 0;
        const max = localMaxPrice ? Number(localMaxPrice) : Infinity;
        onPriceRangeChange([min, max]);
    };

    const renderCategoryItem = (category: Category, level: number = 0) => {
        const hasChildren = category.children && category.children.length > 0;
        const isExpanded = expandedTrees[category.id] || searchQuery.length > 0;
        const isActive = activeCategory === category.slug;
        const children = category.children || [];
        const LIMIT = 3;
        const isShowingMore = showMore[category.id];
        const visibleChildren = isShowingMore || searchQuery ? children : children.slice(0, LIMIT);
        const hasMore = children.length > LIMIT;

        return (
            <div key={category.id} style={{ marginLeft: level > 0 ? `${level * 12}px` : 0 }}>
                <div
                    className={clsx(
                        "flex items-center justify-between py-2 px-3 rounded-xl cursor-pointer transition-all duration-200 select-none group",
                        isActive
                            ? "bg-gradient-to-r from-brand-blue to-blue-600 text-white shadow-md shadow-blue-200"
                            : "text-gray-700 hover:bg-blue-50 hover:text-brand-blue"
                    )}
                    onClick={() => handleSelect(category.slug)}
                >
                    <span className={clsx(
                        "font-semibold leading-snug truncate pr-2",
                        level === 0 ? "text-[14px]" : "text-[13px] font-medium"
                    )}>
                        {category.name}
                    </span>
                    {hasChildren && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleTree(category.id);
                            }}
                            className={clsx(
                                "flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-lg transition-all",
                                isActive
                                    ? "bg-white/20 text-white"
                                    : "bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-brand-blue"
                            )}
                            aria-label={isExpanded ? "Collapse" : "Expand"}
                        >
                            <ChevronDown className={clsx("w-3.5 h-3.5 transition-transform", isExpanded ? "rotate-0" : "-rotate-90")} />
                        </button>
                    )}
                </div>

                <AnimatePresence initial={false}>
                    {hasChildren && isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            className="overflow-hidden ml-2 mt-0.5 pl-2 border-l-2 border-blue-100"
                        >
                            {visibleChildren.map(child => renderCategoryItem(child, level + 1))}
                            {hasMore && !searchQuery && (
                                <button
                                    onClick={() => toggleShowMore(category.id)}
                                    className="flex items-center gap-1.5 mt-1 ml-1 py-1 px-2 text-xs font-bold text-brand-blue/70 hover:text-brand-blue transition-colors"
                                >
                                    {isShowingMore
                                        ? <><Minus className="w-3 h-3" /> Show less</>
                                        : <><Plus className="w-3 h-3" /> {children.length - LIMIT} more</>
                                    }
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    const SectionHeader = ({ icon: Icon, title, sectionKey, count }: { icon: any; title: string; sectionKey: string; count?: number }) => (
        <button
            onClick={() => toggleSection(sectionKey)}
            className="flex items-center justify-between w-full py-2.5 group"
        >
            <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-gray-400 group-hover:text-brand-blue transition-colors" />
                <span className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-600 transition-colors">
                    {title}
                </span>
                {count !== undefined && count > 0 && (
                    <span className="text-[10px] font-bold bg-brand-blue text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {count}
                    </span>
                )}
            </div>
            <ChevronDown className={clsx(
                "w-3.5 h-3.5 text-gray-300 transition-transform",
                expandedSections[sectionKey] ? "rotate-0" : "-rotate-90"
            )} />
        </button>
    );

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black text-gray-800">Filters</h2>
                <div className="flex items-center gap-2">
                    {hasActiveFilters && onClearAllFilters && (
                        <button
                            onClick={onClearAllFilters}
                            className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
                        >
                            <X className="w-3 h-3" />
                            Clear All
                        </button>
                    )}
                    {isMobile && onClose && (
                        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto -mr-2 pr-2 space-y-1 custom-scrollbar">

                {/* ── CATEGORIES ── */}
                <SectionHeader icon={Layers} title="Categories" sectionKey="categories" />
                <AnimatePresence initial={false}>
                    {expandedSections.categories && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            {/* Search */}
                            <div className="relative mb-3">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-9 pl-9 pr-4 text-sm bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>

                            {/* All Products */}
                            <button
                                onClick={() => { onCategoryChange(null); if (isMobile && onClose) onClose(); }}
                                className={clsx(
                                    "flex items-center gap-2.5 w-full py-2 px-3 rounded-xl mb-2 text-sm font-semibold transition-all",
                                    !activeCategory
                                        ? "bg-gradient-to-r from-brand-blue to-blue-600 text-white shadow-md shadow-blue-200"
                                        : "text-gray-600 hover:bg-blue-50 hover:text-brand-blue"
                                )}
                            >
                                <Home className="w-4 h-4 flex-shrink-0" />
                                All Products
                            </button>

                            <div className="space-y-0.5 mb-3">
                                {filteredCategories.length > 0 ? (
                                    filteredCategories.map(cat => renderCategoryItem(cat))
                                ) : (
                                    <div className="text-center py-6 text-gray-400 text-sm">
                                        <Search className="w-7 h-7 mx-auto mb-2 opacity-30" />
                                        No categories found
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="h-px bg-gray-100" />

                {/* ── PRODUCT TYPE (Dynamic Tags) ── */}
                {filterData && filterData.tags.length > 0 && (
                    <>
                        <SectionHeader icon={Tag} title="Product Type" sectionKey="productType" count={activeTags.length} />
                        <AnimatePresence initial={false}>
                            {expandedSections.productType && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden pb-3"
                                >
                                    <div className="flex flex-wrap gap-1.5">
                                        {filterData.tags.slice(0, 20).map(tag => {
                                            const isActive = activeTags.includes(tag.name);
                                            return (
                                                <button
                                                    key={tag.name}
                                                    onClick={() => handleToggleTag(tag.name)}
                                                    className={clsx(
                                                        "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border",
                                                        isActive
                                                            ? "bg-brand-blue text-white border-brand-blue shadow-sm shadow-blue-200"
                                                            : "bg-white text-gray-600 border-gray-200 hover:border-brand-blue hover:text-brand-blue"
                                                    )}
                                                >
                                                    {tag.name}
                                                    <span className={clsx(
                                                        "ml-1.5 text-[10px]",
                                                        isActive ? "text-blue-200" : "text-gray-400"
                                                    )}>
                                                        {tag.count}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div className="h-px bg-gray-100" />
                    </>
                )}

                {/* ── PRICE RANGE ── */}
                <SectionHeader icon={DollarSign} title="Price Range" sectionKey="price" count={priceRange && (priceRange[0] > 0 || priceRange[1] < Infinity) ? 1 : 0} />
                <AnimatePresence initial={false}>
                    {expandedSections.price && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pb-3"
                        >
                            {filterData && (
                                <p className="text-[11px] text-gray-400 mb-2">
                                    Range: ${filterData.priceRange.min.toFixed(0)} – ${filterData.priceRange.max.toFixed(0)}
                                </p>
                            )}
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={localMinPrice}
                                    onChange={(e) => setLocalMinPrice(e.target.value)}
                                    className="w-full h-9 px-3 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                                <span className="text-gray-400 text-xs font-bold">–</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={localMaxPrice}
                                    onChange={(e) => setLocalMaxPrice(e.target.value)}
                                    className="w-full h-9 px-3 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                            </div>
                            <button
                                onClick={handleApplyPrice}
                                className="mt-2 w-full h-8 bg-brand-blue text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                            >
                                Apply Price
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="h-px bg-gray-100" />

                {/* ── BRANDS ── */}
                {filterData && filterData.brands.length > 0 && (
                    <>
                        <SectionHeader icon={Sparkles} title="Brands" sectionKey="brands" count={activeBrandSlugs.length} />
                        <AnimatePresence initial={false}>
                            {expandedSections.brands && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden pb-3"
                                >
                                    {filterData.brands.length > 5 && (
                                        <div className="relative mb-2">
                                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                            <input
                                                type="text"
                                                placeholder="Search brands..."
                                                value={brandSearch}
                                                onChange={(e) => setBrandSearch(e.target.value)}
                                                className="w-full h-8 pl-8 pr-3 text-xs bg-gray-50 border border-transparent rounded-lg outline-none focus:bg-white focus:border-brand-blue transition-all"
                                            />
                                        </div>
                                    )}
                                    <div className="max-h-48 overflow-y-auto space-y-0.5 custom-scrollbar">
                                        {filteredBrands.map(brand => {
                                            const isActive = activeBrandSlugs.includes(brand.name);
                                            return (
                                                <label
                                                    key={brand.name}
                                                    className={clsx(
                                                        "flex items-center gap-2.5 py-1.5 px-2 rounded-lg cursor-pointer transition-all text-sm",
                                                        isActive ? "bg-blue-50 text-brand-blue" : "text-gray-600 hover:bg-gray-50"
                                                    )}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isActive}
                                                        onChange={() => handleToggleBrand(brand.name)}
                                                        className="w-4 h-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue accent-brand-blue"
                                                    />
                                                    <span className="flex-1 font-medium truncate text-[13px]">{brand.name}</span>
                                                    <span className="text-[10px] text-gray-400 font-semibold">{brand.count}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div className="h-px bg-gray-100" />
                    </>
                )}

                {/* ── CONDITION ── */}
                {filterData && filterData.conditions.length > 0 && (
                    <>
                        <SectionHeader icon={Sparkles} title="Condition" sectionKey="condition" count={activeConditions.length} />
                        <AnimatePresence initial={false}>
                            {expandedSections.condition && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden pb-3"
                                >
                                    <div className="flex flex-wrap gap-1.5">
                                        {filterData.conditions.map(cond => {
                                            const isActive = activeConditions.includes(cond.name);
                                            return (
                                                <button
                                                    key={cond.name}
                                                    onClick={() => handleToggleCondition(cond.name)}
                                                    className={clsx(
                                                        "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border capitalize",
                                                        isActive
                                                            ? "bg-green-500 text-white border-green-500 shadow-sm"
                                                            : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600"
                                                    )}
                                                >
                                                    {cond.name}
                                                    <span className={clsx("ml-1.5 text-[10px]", isActive ? "text-green-200" : "text-gray-400")}>
                                                        {cond.count}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </div>
        </div>
    );
}
