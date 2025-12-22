'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';

export default function LoanHistoryFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
    const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

    const handleFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (startDate) params.set('startDate', startDate);
        else params.delete('startDate');

        if (endDate) params.set('endDate', endDate);
        else params.delete('endDate');

        router.push(`?${params.toString()}`);
    };

    const clearFilter = () => {
        setStartDate('');
        setEndDate('');
        const params = new URLSearchParams(searchParams.toString());
        params.delete('startDate');
        params.delete('endDate');
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap items-end gap-4">
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Dari Tanggal</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81]"
                />
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Sampai Tanggal</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81]"
                />
            </div>
            <div className="flex gap-2">
                <button
                    onClick={handleFilter}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0F4C81] text-white rounded-lg text-sm font-medium hover:bg-[#0F4C81]/90 transition-colors"
                >
                    <Filter className="w-4 h-4" />
                    Filter
                </button>
                {(startDate || endDate) && (
                    <button
                        onClick={clearFilter}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                        <X className="w-4 h-4" />
                        Reset
                    </button>
                )}
            </div>
        </div>
    );
}
