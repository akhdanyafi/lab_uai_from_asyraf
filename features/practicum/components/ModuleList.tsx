'use client';

import { useState, useMemo } from 'react';
import { BookOpen, Search, ExternalLink, FileText } from 'lucide-react';
import type { PracticumModule } from '@/features/practicum/types';

interface ModuleListProps {
    modules: PracticumModule[];
    allSubjects: string[];
}

export default function ModuleList({ modules, allSubjects }: ModuleListProps) {
    // Search & Filter
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSubject, setFilterSubject] = useState('');

    // Filtered modules
    const filteredModules = useMemo(() => {
        return modules.filter(m => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                if (!m.name.toLowerCase().includes(query)) {
                    return false;
                }
            }
            // Subject filter
            if (filterSubject && m.subjects) {
                if (!m.subjects.includes(filterSubject)) {
                    return false;
                }
            } else if (filterSubject && !m.subjects) {
                return false;
            }
            return true;
        });
    }, [modules, searchQuery, filterSubject]);

    const parseSubjects = (subjects: string | null): string[] => {
        if (!subjects) return [];
        try {
            const parsed = JSON.parse(subjects);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Modul Praktikum</h1>
                <p className="text-gray-500 text-sm mt-1">Daftar modul praktikum yang tersedia</p>
            </div>

            {/* Search & Filter */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari modul..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <select
                        value={filterSubject}
                        onChange={(e) => setFilterSubject(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[180px]"
                    >
                        <option value="">Semua Matakuliah</option>
                        {allSubjects.map(subject => (
                            <option key={subject} value={subject}>{subject}</option>
                        ))}
                    </select>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    Menampilkan {filteredModules.length} dari {modules.length} modul
                </p>
            </div>

            {/* Module List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredModules.map((module) => (
                    <div key={module.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="w-5 h-5 text-[#0F4C81]" />
                            <h3 className="font-semibold text-gray-900 line-clamp-1">{module.name}</h3>
                        </div>
                        {module.description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{module.description}</p>
                        )}
                        {module.subjects && (
                            <div className="flex flex-wrap gap-1 mb-3">
                                {parseSubjects(module.subjects).map((subject, idx) => (
                                    <span key={idx} className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                        {subject}
                                    </span>
                                ))}
                            </div>
                        )}
                        {module.filePath ? (
                            <a
                                href={module.filePath}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-white bg-[#0F4C81] hover:bg-[#0F4C81]/90 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <ExternalLink className="w-3 h-3" />
                                Download Modul
                            </a>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-sm text-gray-400">
                                <FileText className="w-3 h-3" />
                                File belum tersedia
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {filteredModules.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    {searchQuery || filterSubject ? 'Tidak ada modul yang sesuai filter.' : 'Belum ada modul praktikum.'}
                </div>
            )}
        </div>
    );
}
