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

type TabKey = 'loans' | 'rooms' | 'riwayat' | 'users';

const VALID_TABS: TabKey[] = ['loans', 'rooms', 'riwayat', 'users'];

export default function ValidationTabs({
    loansContent,
    roomsContent,
    riwayatContent,
    usersContent,
}: ValidationTabsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const tabParam = searchParams.get('tab');
    const initialTab = (tabParam && VALID_TABS.includes(tabParam as TabKey))
        ? (tabParam as TabKey)
        : 'loans';

    const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

    // Sync state with URL if it changes (e.g. back button)
    useEffect(() => {
        if (tabParam && VALID_TABS.includes(tabParam as TabKey)) {
            setActiveTab(tabParam as TabKey);
        }
    }, [tabParam]);

    const handleTabChange = (tab: TabKey) => {
        setActiveTab(tab);
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', tab);
        router.push(`${pathname}?${params.toString()}`);
    };

    const tabs = [
        { key: 'loans' as TabKey, label: 'Peminjaman', icon: ClipboardList },
        { key: 'rooms' as TabKey, label: 'Ruangan', icon: CalendarDays },
        { key: 'riwayat' as TabKey, label: 'Riwayat', icon: History },
        { key: 'users' as TabKey, label: 'Validasi User', icon: Users },
    ];

    return (
        <div>
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => handleTabChange(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key
                            ? 'bg-white text-[#0F4C81] shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
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
