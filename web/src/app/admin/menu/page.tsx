'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Save, ExternalLink, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';

interface MenuItem {
    id: string;
    label: string;
    href: string;
    visible: boolean;
    position: number;
    type: 'link' | 'dropdown';
}

const defaultMenuItems: MenuItem[] = [
    { id: 'repair-services', label: 'Repair Services', href: '/services', visible: true, position: 0, type: 'link' },
    { id: 'brands', label: 'Brands', href: '/brands', visible: true, position: 1, type: 'dropdown' },
    { id: 'about', label: 'About Us', href: '/about', visible: true, position: 2, type: 'link' },
    { id: 'blog', label: 'Blog', href: '/blog', visible: true, position: 3, type: 'link' },
    { id: 'contact', label: 'Contact Us', href: '/contact', visible: true, position: 4, type: 'link' },
];

export default function MenuManagementPage() {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [newLabel, setNewLabel] = useState('');
    const [newHref, setNewHref] = useState('');

    useEffect(() => {
        // Load from localStorage or use defaults
        const stored = localStorage.getItem('lkm_menu_config');
        if (stored) {
            setItems(JSON.parse(stored));
        } else {
            setItems(defaultMenuItems);
        }
    }, []);

    const handleSave = () => {
        setSaving(true);
        // Store in localStorage (could be moved to API/DB later)
        localStorage.setItem('lkm_menu_config', JSON.stringify(items));
        setTimeout(() => {
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }, 300);
    };

    const handleAdd = () => {
        if (!newLabel.trim() || !newHref.trim()) return;
        const newItem: MenuItem = {
            id: `custom-${Date.now()}`,
            label: newLabel.trim(),
            href: newHref.trim(),
            visible: true,
            position: items.length,
            type: 'link',
        };
        setItems([...items, newItem]);
        setNewLabel('');
        setNewHref('');
    };

    const handleRemove = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleToggleVisibility = (id: string) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, visible: !item.visible } : item
        ));
    };

    const handleMoveUp = (index: number) => {
        if (index === 0) return;
        const newItems = [...items];
        [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
        setItems(newItems.map((item, i) => ({ ...item, position: i })));
    };

    const handleMoveDown = (index: number) => {
        if (index === items.length - 1) return;
        const newItems = [...items];
        [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
        setItems(newItems.map((item, i) => ({ ...item, position: i })));
    };

    const handleUpdateLabel = (id: string, label: string) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, label } : item
        ));
    };

    const handleUpdateHref = (id: string, href: string) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, href } : item
        ));
    };

    const handleReset = () => {
        if (confirm('Reset menu to defaults? This will remove all customizations.')) {
            setItems(defaultMenuItems);
            localStorage.removeItem('lkm_menu_config');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 max-w-4xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage the navigation menu items displayed on your website</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                    >
                        Reset to Defaults
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 text-sm disabled:opacity-50 transition"
                    >
                        <Save size={16} />
                        {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Menu Items List */}
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b">
                    <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500 uppercase">
                        <div className="col-span-1">Order</div>
                        <div className="col-span-4">Label</div>
                        <div className="col-span-4">URL / Path</div>
                        <div className="col-span-1">Visible</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {items.map((item, index) => (
                        <div key={item.id} className={`px-6 py-4 grid grid-cols-12 gap-4 items-center transition ${!item.visible ? 'opacity-50 bg-gray-50' : 'hover:bg-gray-50/50'}`}>
                            <div className="col-span-1 flex items-center gap-1">
                                <GripVertical className="w-4 h-4 text-gray-300" />
                                <div className="flex flex-col gap-0.5">
                                    <button onClick={() => handleMoveUp(index)} className="p-0.5 hover:bg-gray-200 rounded" disabled={index === 0}>
                                        <ArrowUp className="w-3 h-3 text-gray-400" />
                                    </button>
                                    <button onClick={() => handleMoveDown(index)} className="p-0.5 hover:bg-gray-200 rounded" disabled={index === items.length - 1}>
                                        <ArrowDown className="w-3 h-3 text-gray-400" />
                                    </button>
                                </div>
                            </div>

                            <div className="col-span-4">
                                <input
                                    type="text"
                                    value={item.label}
                                    onChange={(e) => handleUpdateLabel(item.id, e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div className="col-span-4">
                                <input
                                    type="text"
                                    value={item.href}
                                    onChange={(e) => handleUpdateHref(item.id, e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div className="col-span-1 flex justify-center">
                                <button
                                    onClick={() => handleToggleVisibility(item.id)}
                                    className={`p-2 rounded-lg transition ${item.visible ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-100'}`}
                                    title={item.visible ? 'Click to hide' : 'Click to show'}
                                >
                                    {item.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>

                            <div className="col-span-2 flex items-center justify-end gap-2">
                                <a
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                                    title="Preview"
                                >
                                    <ExternalLink size={16} />
                                </a>
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                                    title="Remove"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add New Item */}
            <div className="bg-white rounded-2xl border shadow-sm p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Add Menu Item</h3>
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Label</label>
                        <input
                            type="text"
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            placeholder="e.g. Price List"
                            className="w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">URL / Path</label>
                        <input
                            type="text"
                            value={newHref}
                            onChange={(e) => setNewHref(e.target.value)}
                            placeholder="e.g. /price-list"
                            className="w-full px-4 py-2.5 border rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <button
                        onClick={handleAdd}
                        disabled={!newLabel.trim() || !newHref.trim()}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 text-sm disabled:opacity-40 transition whitespace-nowrap"
                    >
                        <Plus size={16} /> Add Item
                    </button>
                </div>
            </div>

            {/* Help Text */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                <h4 className="text-sm font-bold text-blue-900 mb-2">💡 Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1.5">
                    <li>• Use the <strong>arrow buttons</strong> to reorder items in the navigation</li>
                    <li>• Toggle the <strong>eye icon</strong> to show/hide items without deleting them</li>
                    <li>• Changes are saved to your browser. Click <strong>Save Changes</strong> to persist</li>
                    <li>• Use <strong>Reset to Defaults</strong> to restore the original menu configuration</li>
                </ul>
            </div>
        </div>
    );
}
