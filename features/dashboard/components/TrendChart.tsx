'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartDataPoint } from '../analytics';

interface TrendChartProps {
    data: ChartDataPoint[];
    title: string;
    color?: string;
}

export default function TrendChart({ data, title, color = '#0F4C81' }: TrendChartProps) {
    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 11, fill: '#6b7280' }}
                            axisLine={{ stroke: '#e5e7eb' }}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: '#6b7280' }}
                            axisLine={{ stroke: '#e5e7eb' }}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                fontSize: '12px'
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={2}
                            dot={{ fill: color, strokeWidth: 0, r: 4 }}
                            activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: '#fff' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
