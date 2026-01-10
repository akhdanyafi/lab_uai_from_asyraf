'use client';

import type { Insight } from '../analytics';

interface InsightCardProps {
    insight: Insight;
}

export default function InsightCard({ insight }: InsightCardProps) {
    const bgClasses = {
        info: 'bg-blue-50 border-blue-100',
        warning: 'bg-yellow-50 border-yellow-100',
        success: 'bg-green-50 border-green-100',
    };

    const textClasses = {
        info: 'text-blue-800',
        warning: 'text-yellow-800',
        success: 'text-green-800',
    };

    return (
        <div className={`p-4 rounded-xl border ${bgClasses[insight.type]}`}>
            <div className="flex items-start gap-3">
                <span className="text-2xl">{insight.icon}</span>
                <div>
                    <p className={`font-medium ${textClasses[insight.type]}`}>{insight.title}</p>
                    <p className={`text-sm opacity-80 ${textClasses[insight.type]}`}>{insight.description}</p>
                </div>
            </div>
        </div>
    );
}
