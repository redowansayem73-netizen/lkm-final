"use client";

import { useState, useMemo, useEffect } from 'react';
import { ChevronDown, Search, Plus, Minus, X, DollarSign, Layers, Sparkles, Smartphone, Headset } from 'lucide-react';
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
    // Use an array to support multiple model checkboxes
    activeCategories?: string[];
    onCategoryChange: (slugs: string[]) => void;
    onClose?: () => void;
    isMobile?: boolean;
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
    activeCategories = [],
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
    const [showMore, setShowMore] = useState<Record<number, boolean>>({});
    const [brandSearch, setBrandSearch] = useState("");
    const [expandedAccessoryTags, setExpandedAccessoryTags] = useState<Record<string, boolean>>({});

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
        models: true,
        accessories: true,
        brands: false,
        price: false,
        condition: false,
    });

    const toggleSection = (key: string) => {
        setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Fetch dynamic filter data 
    useEffect(() => {
        const fetchFilters = async () => {
            setFilterLoading(true);
            try {
                let url = '/api/products/filters';
                // Active categories is an array now, only send first for simple filter fetching if needed, or comma separated
                if (activeCategories.length > 0) url += `?category=${activeCategories.join(',')}`;
                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    setFilterData(data);
                }
            } catch (err) {
                console.error('Failed to fetch filters:', err);
            } finally {
                setFilterLoading(false);
            }
        };
        fetchFilters();
    }, [activeCategories.join(',')]);

    // Sync local price with external price range
    useEffect(() => {
        if (priceRange) {
            setLocalMinPrice(priceRange[0] > 0 ? String(priceRange[0]) : "");
            setLocalMaxPrice(priceRange[1] < Infinity ? String(priceRange[1]) : "");
        }
    }, [priceRange]);

    const toggleShowMore = (id: number) => {
        setShowMore(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleAccessoryExpand = (tagName: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setExpandedAccessoryTags(prev => ({ ...prev, [tagName]: !prev[tagName] }));
    };

    const handleSelectCategory = (slug: string) => {
        const newCats = activeCategories.includes(slug)
            ? activeCategories.filter(c => c !== slug)
            : [...activeCategories, slug];
        onCategoryChange(newCats);
        // Do not auto-close on mobile so they can check multiple models
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

    // Calculate grouped models representing the "Brands" in categories (iPhone, Samsung)
    const groupedModels = useMemo(() => {
        let matchingRoots = categories;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            matchingRoots = categories.map(root => {
                const childMatches = (root.children || []).filter(c => c.name.toLowerCase().includes(q));
                if (root.name.toLowerCase().includes(q) || childMatches.length > 0) {
                    return { ...root, children: childMatches.length > 0 ? childMatches : root.children };
                }
                return null;
            }).filter(Boolean) as Category[];
        }

        return matchingRoots.map(root => {
            const name = root.name.replace(/Accessories/i, '').trim() || root.name;
            const children = [...(root.children || [])].sort((a, b) => {
                // Extract numbers to sort high to low (latest model first)
                const numA = parseInt(a.name.replace(/\D/g, '')) || 0;
                const numB = parseInt(b.name.replace(/\D/g, '')) || 0;
                if (numA !== numB) return numB - numA;
                return a.name.localeCompare(b.name);
            });
            return {
                ...root,
                displayName: name,
                sortedModels: children
            };
        });
    }, [categories, searchQuery]);

    const filteredBrands = useMemo(() => {
        if (!filterData) return [];
        if (!brandSearch) return filterData.brands;
        const q = brandSearch.toLowerCase();
        return filterData.brands.filter(b => b.name.toLowerCase().includes(q));
    }, [filterData, brandSearch]);

    const SectionHeader = ({ icon: Icon, title, sectionKey, count }: { icon: any; title: string; sectionKey: string; count?: number }) => (
        <button
            onClick={() => toggleSection(sectionKey)}
            className="flex items-center justify-between w-full py-3 group outline-none"
        >
            <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-gray-400 group-hover:text-brand-blue transition-colors" />
                <span className="text-xs font-black uppercase tracking-widest text-gray-800 group-hover:text-brand-blue transition-colors">
                    {title}
                </span>
                {count !== undefined && count > 0 && (
                    <span className="text-[10px] font-bold bg-brand-blue text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {count}
                    </span>
                )}
            </div>
            <ChevronDown className={clsx(
                "w-4 h-4 text-gray-300 transition-transform",
                expandedSections[sectionKey] ? "rotate-0" : "-rotate-90"
            )} />
        </button>
    );

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-black text-gray-800">Filters</h2>
                <div className="flex items-center gap-2">
                    {hasActiveFilters && onClearAllFilters && (
                        <button
                            onClick={onClearAllFilters}
                            className="text-[11px] font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1 bg-red-50 px-2 py-1 rounded-lg"
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

            <div className="flex-1 overflow-y-auto -mr-2 pr-2 space-y-2 custom-scrollbar">

                {/* ── BY MODELS (ROW 1) ── */}
                <SectionHeader icon={Smartphone} title="By Models" sectionKey="models" count={activeCategories.length} />
                <AnimatePresence initial={false}>
                    {expandedSections.models && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pb-4"
                        >
                            {/* Search Options optionally */}
                            {categories.length > 5 && (
                                <div className="relative mb-3">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                    <input
                                        type="text"
                                        placeholder="Search models..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full h-9 pl-9 pr-4 text-xs bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                    {searchQuery && (
                                        <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            )}

                            <div className="space-y-4 pt-1">
                                {groupedModels.map(group => {
                                    if (group.sortedModels.length === 0) return null;
                                    const isShowingMore = showMore[group.id];
                                    const LIMIT = 3;
                                    const visibleModels = isShowingMore ? group.sortedModels : group.sortedModels.slice(0, LIMIT);
                                    const hasMore = group.sortedModels.length > LIMIT;

                                    return (
                                        <div key={group.id} className="bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                                            <h3 className="text-xs font-black text-gray-800 mb-2.5 uppercase tracking-wide">{group.displayName}</h3>
                                            <div className="space-y-1">
                                                {visibleModels.map(model => {
                                                    const isActive = activeCategories.includes(model.slug);
                                                    return (
                                                        <label key={model.id} className="flex items-center gap-2.5 cursor-pointer group/item py-1 px-1 rounded-lg hover:bg-white transition-colors">
                                                            <div className={clsx(
                                                                "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                                                isActive ? "bg-brand-blue border-brand-blue" : "border-gray-300 bg-white group-hover/item:border-brand-blue"
                                                            )}>
                                                                {isActive && <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3 text-white"><path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                                            </div>
                                                            <span className={clsx("text-[13px] font-medium transition-colors truncate", isActive ? "text-brand-blue" : "text-gray-600 group-hover/item:text-gray-900")}>
                                                                {model.name}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                            {hasMore && (
                                                <button
                                                    onClick={() => toggleShowMore(group.id)}
                                                    className="flex items-center gap-1.5 mt-2.5 ml-1 text-xs font-bold text-brand-blue hover:text-blue-700 transition-colors"
                                                >
                                                    {isShowingMore ? <><Minus className="w-3 h-3" /> Show less</> : <><Plus className="w-3 h-3" /> {group.sortedModels.length - LIMIT} more</>}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                                {groupedModels.length === 0 && (
                                    <div className="text-center py-4 text-gray-400 text-xs">
                                        No models found
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="h-px bg-gray-100" />

                {/* ── BY ACCESSORIES (ROW 2) ── */}
                {filterData && filterData.tags.length > 0 && (
                    <>
                        <SectionHeader icon={Headset} title="By Accessories" sectionKey="accessories" count={activeTags.length} />
                        <AnimatePresence initial={false}>
                            {expandedSections.accessories && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden pb-4"
                                >
                                    {/* Accessory Tags List */}
                                    <div className="space-y-1.5 pt-1">
                                        {/* Display top 15 accessories, add limit logic if there are more later */}
                                        {filterData.tags.slice(0, 15).map(tag => {
                                            const isActive = activeTags.includes(tag.name);
                                            const isExpanded = expandedAccessoryTags[tag.name];

                                            return (
                                                <div key={tag.name} className={clsx(
                                                    "rounded-xl border transition-all overflow-hidden",
                                                    isExpanded || isActive ? "border-blue-100 bg-blue-50/30" : "border-transparent hover:bg-gray-50"
                                                )}>
                                                    <div className="flex items-center p-2 group/tag">
                                                        <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                                                            <div className={clsx(
                                                                "w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0",
                                                                isActive ? "bg-brand-blue border-brand-blue" : "border-gray-300 bg-white group-hover/tag:border-brand-blue"
                                                            )}>
                                                                {isActive && <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3 text-white"><path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                                            </div>
                                                            <span className={clsx(
                                                                "text-[13px] font-semibold capitalize truncate transition-colors",
                                                                isActive ? "text-brand-blue" : "text-gray-700 group-hover/tag:text-gray-900"
                                                            )}>
                                                                {tag.name}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400 font-bold bg-white border border-gray-100 px-1.5 rounded-full flex-shrink-0">
                                                                {tag.count}
                                                            </span>
                                                        </label>
                                                        
                                                        {/* Toggle Sub-Models */}
                                                        <button 
                                                            onClick={(e) => toggleAccessoryExpand(tag.name, e)} 
                                                            className={clsx(
                                                                "p-1.5 rounded-lg transition-colors flex-shrink-0 ml-2",
                                                                isExpanded ? "text-brand-blue bg-blue-100 hover:bg-blue-200" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                                            )}
                                                            aria-label="Show device models"
                                                        >
                                                            <ChevronDown className={clsx("w-3.5 h-3.5 transition-transform", isExpanded ? "rotate-180" : "rotate-0")} />
                                                        </button>
                                                    </div>

                                                    {/* Nested Device Models for this Accessory */}
                                                    <AnimatePresence initial={false}>
                                                        {isExpanded && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden bg-white/50 border-t border-blue-50"
                                                            >
                                                                <div className="p-3 pl-9 space-y-4">
                                                                    {groupedModels.map(group => {
                                                                        if (group.sortedModels.length === 0) return null;
                                                                        // For sub-menus, just show top 3 models
                                                                        return (
                                                                            <div key={`acc-model-${group.id}`} className="space-y-1.5">
                                                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{group.displayName}</span>
                                                                                {group.sortedModels.slice(0, 3).map(model => {
                                                                                    const modelActive = activeCategories.includes(model.slug);
                                                                                    return (
                                                                                        <label key={`acc-${tag.name}-${model.id}`} className="flex items-center gap-2 cursor-pointer group/item py-0.5">
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                checked={modelActive}
                                                                                                onChange={() => handleSelectCategory(model.slug)}
                                                                                                className="w-3.5 h-3.5 rounded border-gray-300 text-brand-blue focus:ring-brand-blue accent-brand-blue"
                                                                                            />
                                                                                            <span className={clsx("text-xs font-medium transition-colors truncate", modelActive ? "text-brand-blue" : "text-gray-500 group-hover/item:text-brand-blue")}>
                                                                                                {model.name}
                                                                                            </span>
                                                                                        </label>
                                                                                    );
                                                                                })}
                                                                                {group.sortedModels.length > 3 && (
                                                                                    // A button to jump to full models list or just indicating there's more
                                                                                    <div className="text-[10px] text-gray-400 font-medium pl-5 italic">
                                                                                        + {group.sortedModels.length - 3} more
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        })}
                                        
                                        {/* If more than 15 tags exist, could add +more but 15 is plenty for now */}
                                        {filterData.tags.length > 15 && (
                                            <div className="text-xs font-semibold text-brand-blue pl-3 py-2">
                                                + {filterData.tags.length - 15} more accessories
                                            </div>
                                        )}
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
                            className="overflow-hidden pb-4 px-1"
                        >
                            {filterData && (
                                <div className="text-[11px] font-semibold text-gray-500 mb-3 bg-gray-50 p-2 rounded-lg inline-block">
                                    Range: <span className="text-gray-900">${filterData.priceRange.min.toFixed(0)}</span> – <span className="text-gray-900">${filterData.priceRange.max.toFixed(0)}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={localMinPrice}
                                        onChange={(e) => setLocalMinPrice(e.target.value)}
                                        className="w-full h-10 pl-7 pr-3 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
                                    />
                                </div>
                                <span className="text-gray-300 text-sm font-black">–</span>
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={localMaxPrice}
                                        onChange={(e) => setLocalMaxPrice(e.target.value)}
                                        className="w-full h-10 pl-7 pr-3 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleApplyPrice}
                                className="mt-3 w-full h-10 bg-brand-blue text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
                            >
                                Apply Filter
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="h-px bg-gray-100" />

                {/* ── BRANDS (ADDITIONAL) ── */}
                {filterData && filterData.brands.length > 0 && (
                    <>
                        <SectionHeader icon={Sparkles} title="Extra Brands" sectionKey="brands" count={activeBrandSlugs.length} />
                        <AnimatePresence initial={false}>
                            {expandedSections.brands && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden pb-4"
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
                                    <div className="max-h-48 overflow-y-auto space-y-0.5 custom-scrollbar pb-3">
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
                                                    <div className={clsx(
                                                        "w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0",
                                                        isActive ? "bg-brand-blue border-brand-blue" : "border-gray-300 bg-white"
                                                    )}>
                                                        {isActive && <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3 text-white"><path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                                    </div>
                                                    <span className="flex-1 font-medium truncate text-[13px]">{brand.name}</span>
                                                    <span className="text-[10px] text-gray-400 font-semibold">{brand.count}</span>
                                                </label>
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
