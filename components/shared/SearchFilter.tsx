'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchFilterProps {
    placeholder?: string;
    onSearch: (query: string) => void;
    className?: string;
}

export default function SearchFilter({
    placeholder = "Cari...",
    onSearch,
    className = ""
}: SearchFilterProps) {
    const [query, setQuery] = useState('');

    useEffect(() => {
        const debounce = setTimeout(() => {
            onSearch(query);
        }, 300);
        return () => clearTimeout(debounce);
    }, [query, onSearch]);

    const handleClear = () => {
        setQuery('');
        onSearch('');
    };

    return (
        <div className={`relative ${className}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81]"
            />
            {query && (
                <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
