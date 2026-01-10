'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartDataPoint } from '../analytics';

interface CategoryBarChartProps {
    data: ChartDataPoint[];
    title: string;
    color?: string;
}

export default function CategoryBarChart({ data, title, color = '#0F4C81' }: CategoryBarChartProps) {
    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                        <XAxis
                            type="number"
                            tick={{ fontSize: 11, fill: '#6b7280' }}
                            axisLine={{ stroke: '#e5e7eb' }}
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            tick={{ fontSize: 11, fill: '#6b7280' }}
                            axisLine={{ stroke: '#e5e7eb' }}
                            width={80}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                fontSize: '12px'
                            }}
                        />
                        <Bar
                            dataKey="value"
                            fill={color}
                            radius={[0, 4, 4, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
