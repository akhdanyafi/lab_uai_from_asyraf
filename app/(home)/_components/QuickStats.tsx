import { Package, BookOpen, FileText, Users } from 'lucide-react';

interface QuickStatsProps {
    totalItems: number;
    availableItems: number;
    totalModules: number;
    totalPublications: number;
}

export default function QuickStats({
    totalItems,
    availableItems,
    totalModules,
    totalPublications
}: QuickStatsProps) {
    const stats = [
        {
            label: 'Total Alat',
            value: totalItems,
            subtext: `${availableItems} tersedia`,
            icon: Package,
            color: 'bg-blue-500'
        },
        {
            label: 'Modul Praktikum',
            value: totalModules,
            subtext: 'tersedia',
            icon: BookOpen,
            color: 'bg-green-500'
        },
        {
            label: 'Publikasi',
            value: totalPublications,
            subtext: 'mahasiswa',
            icon: FileText,
            color: 'bg-purple-500'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow"
                >
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.label} • {stat.subtext}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
