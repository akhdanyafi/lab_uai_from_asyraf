'use client';

import { useState } from 'react';
import { ClipboardList, CalendarDays, History } from 'lucide-react';

interface ValidationTabsProps {
    loansContent: React.ReactNode;
    roomsContent: React.ReactNode;
    historyContent: React.ReactNode;
    usersContent: React.ReactNode;
}

export default function ValidationTabs({ loansContent, roomsContent, historyContent, usersContent }: ValidationTabsProps) {
    const [activeTab, setActiveTab] = useState<'loans' | 'rooms' | 'history' | 'users'>('loans');

    return (
        <div>
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
                <button
                    onClick={() => setActiveTab('loans')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'loans'
                        ? 'bg-white text-[#0F4C81] shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                        }`}
                >
                    <ClipboardList className="w-4 h-4" />
                    Validasi Peminjaman
                </button>
                <button
                    onClick={() => setActiveTab('rooms')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'rooms'
                        ? 'bg-white text-[#0F4C81] shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                        }`}
                >
                    <CalendarDays className="w-4 h-4" />
                    Validasi Ruangan
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'history'
                        ? 'bg-white text-[#0F4C81] shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                        }`}
                >
                    Riwayat
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'users'
                        ? 'bg-white text-[#0F4C81] shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                        }`}
                >
                    <ClipboardList className="w-4 h-4" />
                    Validasi Akun
                </button>
            </div>

            {/* Content */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === 'loans' && loansContent}
                {activeTab === 'rooms' && roomsContent}
                {activeTab === 'history' && historyContent}
                {activeTab === 'users' && usersContent}
            </div>
        </div>
    );
}
