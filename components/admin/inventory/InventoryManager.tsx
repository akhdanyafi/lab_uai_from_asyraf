'use client';

import { useState } from 'react';
import { Box, Tags, MapPin } from 'lucide-react';
import CategoriesView from './CategoriesView';
import RoomsView from './RoomsView';
import ItemsView from './ItemsView';

interface InventoryManagerProps {
    categories: any[];
    rooms: any[];
    items: any[];
}

export default function InventoryManager({ categories, rooms, items }: InventoryManagerProps) {
    const [activeTab, setActiveTab] = useState<'items' | 'categories' | 'rooms'>('items');

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Aset</h1>
                    <p className="text-gray-500 text-sm mt-1">Kelola inventaris alat, kategori, dan ruangan laboratorium</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-8">
                <button
                    onClick={() => setActiveTab('items')}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'items'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                >
                    <Box className="w-4 h-4" />
                    Daftar Alat
                </button>
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'categories'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                >
                    <Tags className="w-4 h-4" />
                    Kategori
                </button>
                <button
                    onClick={() => setActiveTab('rooms')}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'rooms'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                >
                    <MapPin className="w-4 h-4" />
                    Ruangan
                </button>
            </div>

            {/* Content */}
            <div>
                {activeTab === 'items' && <ItemsView items={items} rooms={rooms} categories={categories} />}
                {activeTab === 'categories' && <CategoriesView categories={categories} />}
                {activeTab === 'rooms' && <RoomsView rooms={rooms} />}
            </div>
        </div>
    );
}
