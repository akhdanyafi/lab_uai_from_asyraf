'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ClipboardList, CalendarDays, History, Users } from 'lucide-react';

interface ValidationTabsProps {
    loansContent: React.ReactNode;
    roomsContent: React.ReactNode;
    riwayatContent: React.ReactNode;
    usersContent: React.ReactNode;
}

export default function ValidationTabs({
    loansContent,
    roomsContent,
    riwayatContent,
    usersContent
}: ValidationTabsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const tabParam = searchParams.get('tab');
    const initialTab = (tabParam && ['loans', 'rooms', 'riwayat', 'users'].includes(tabParam))
        ? (tabParam as 'loans' | 'rooms' | 'riwayat' | 'users')
        : 'loans';

    const [activeTab, setActiveTab] = useState<'loans' | 'rooms' | 'riwayat' | 'users'>(initialTab);

    // Sync state with URL if it changes (e.g. back button)
    useEffect(() => {
        if (tabParam && ['loans', 'rooms', 'riwayat', 'users'].includes(tabParam)) {
            setActiveTab(tabParam as any);
        }
    }, [tabParam]);

    const handleTabChange = (tab: 'loans' | 'rooms' | 'riwayat' | 'users') => {
        setActiveTab(tab);
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', tab);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div>
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
                <button
                    onClick={() => handleTabChange('loans')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'loans'
                        ? 'bg-white text-[#0F4C81] shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                        }`}
                >
                    <ClipboardList className="w-4 h-4" />
                    Peminjaman
                </button>
                <button
                    onClick={() => handleTabChange('rooms')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'rooms'
                        ? 'bg-white text-[#0F4C81] shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                        }`}
                >
                    <CalendarDays className="w-4 h-4" />
                    Ruangan
                </button>
                <button
                    onClick={() => handleTabChange('riwayat')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'riwayat'
                        ? 'bg-white text-[#0F4C81] shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                        }`}
                >
                    <History className="w-4 h-4" />
                    Riwayat
                </button>
                <button
                    onClick={() => handleTabChange('users')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'users'
                        ? 'bg-white text-[#0F4C81] shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                        }`}
                >
                    <Users className="w-4 h-4" />
                    Validasi User
                </button>
            </div>

            {/* Content */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === 'loans' && loansContent}
                {activeTab === 'rooms' && roomsContent}
                {activeTab === 'riwayat' && riwayatContent}
                {activeTab === 'users' && usersContent}
            </div>
        </div>
    );
}
