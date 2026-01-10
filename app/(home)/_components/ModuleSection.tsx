import { BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Module {
    id: number;
    name: string;
    description: string | null;
}

interface ModuleSectionProps {
    modules: Module[];
}

export default function ModuleSection({ modules }: ModuleSectionProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#0F4C81]" />
                    <h2 className="text-lg font-semibold text-gray-800">Modul Praktikum</h2>
                </div>
                <Link
                    href="/login"
                    className="text-sm text-[#0F4C81] hover:underline flex items-center gap-1"
                >
                    Lihat semua <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {modules.length === 0 ? (
                <div className="text-center py-6 text-gray-400">
                    <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Belum ada modul tersedia</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {modules.slice(0, 5).map((module, idx) => (
                        <div
                            key={module.id}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-lg bg-[#0F4C81]/10 flex items-center justify-center text-[#0F4C81] font-bold text-sm">
                                {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-sm truncate">{module.name}</p>
                                {module.description && (
                                    <p className="text-xs text-gray-500 truncate">{module.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
