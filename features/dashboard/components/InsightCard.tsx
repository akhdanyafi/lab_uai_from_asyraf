'use client';

import Link from 'next/link';
import type { Insight } from '../analytics';

interface InsightCardProps {
    insight: Insight;
}

export default function InsightCard({ insight }: InsightCardProps) {
    const bgClasses = {
        info: 'bg-blue-50 border-blue-200',
        warning: 'bg-amber-50 border-amber-200',
        success: 'bg-green-50 border-green-200',
        danger: 'bg-red-50 border-red-200',
    };

    const textClasses = {
        info: 'text-blue-800',
        warning: 'text-amber-800',
        success: 'text-green-800',
        danger: 'text-red-800',
    };

    const badgeClasses = {
        critical: 'bg-red-500 text-white',
        high: 'bg-amber-500 text-white',
        medium: 'bg-blue-100 text-blue-700',
        low: 'bg-gray-100 text-gray-600',
    };

    const priorityLabels = {
        critical: 'Kritis',
        high: 'Penting',
        medium: 'Sedang',
        low: 'Info',
    };

    return (
        <div className={`p-4 rounded-xl border ${bgClasses[insight.type]} transition-shadow hover:shadow-md`}>
            <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{insight.icon}</span>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <p className={`font-semibold text-sm ${textClasses[insight.type]}`}>{insight.title}</p>
                        {insight.priority !== 'low' && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ${badgeClasses[insight.priority]}`}>
                                {priorityLabels[insight.priority]}
                            </span>
                        )}
                    </div>
                    <p className={`text-xs opacity-75 ${textClasses[insight.type]}`}>{insight.description}</p>
                    {insight.actionLabel && insight.actionHref && (
                        <Link
                            href={insight.actionHref}
                            className={`inline-block text-xs font-medium mt-2 underline underline-offset-2 ${textClasses[insight.type]}`}
                        >
                            {insight.actionLabel} →
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
