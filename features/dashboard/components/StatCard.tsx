'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { TrendResult } from '../analytics';

interface StatCardProps {
    label: string;
    value: number | string;
    trend?: TrendResult;
    icon: React.ReactNode;
    color?: 'primary' | 'green' | 'yellow' | 'red';
}

export default function StatCard({ label, value, trend, icon, color = 'primary' }: StatCardProps) {
    const colorClasses = {
        primary: 'text-[#0F4C81]',
        green: 'text-green-600',
        yellow: 'text-yellow-600',
        red: 'text-red-600',
    };

    const iconBgClasses = {
        primary: 'bg-[#0F4C81]/10',
        green: 'bg-green-50',
        yellow: 'bg-yellow-50',
        red: 'bg-red-50',
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 text-sm font-medium">{label}</span>
                <div className={`w-10 h-10 rounded-lg ${iconBgClasses[color]} flex items-center justify-center ${colorClasses[color]}`}>
                    {icon}
                </div>
            </div>
            <div className="flex items-end gap-3">
                <p className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</p>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm font-medium pb-1 ${trend.direction === 'up' ? 'text-green-600' :
                            trend.direction === 'down' ? 'text-red-600' : 'text-gray-400'
                        }`}>
                        {trend.direction === 'up' && <TrendingUp className="w-4 h-4" />}
                        {trend.direction === 'down' && <TrendingDown className="w-4 h-4" />}
                        {trend.direction === 'stable' && <Minus className="w-4 h-4" />}
                        <span>{trend.percentage}%</span>
                    </div>
                )}
            </div>
        </div>
    );
}
