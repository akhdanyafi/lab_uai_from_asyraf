'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users } from 'lucide-react';

interface RoomAttendanceData {
    roomId: number;
    roomName: string;
    count: number;
}

interface RoomAttendanceChartProps {
    data: RoomAttendanceData[];
}

const COLORS = ['#0F4C81', '#1a5a96', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];

export default function RoomAttendanceChart({ data }: RoomAttendanceChartProps) {
    const chartData = data.map(item => ({
        name: item.roomName,
        value: item.count
    }));

    const totalAttendance = data.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#0F4C81]" />
                    <h2 className="text-lg font-semibold text-gray-900">Kehadiran per Ruangan Hari Ini</h2>
                </div>
                <span className="text-2xl font-bold text-[#0F4C81]">{totalAttendance}</span>
            </div>

            {data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <Users className="w-12 h-12 mb-2 opacity-50" />
                    <p className="text-sm">Belum ada kehadiran hari ini</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12 }}
                            angle={-15}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            allowDecimals={false}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                fontSize: '12px'
                            }}
                            formatter={(value) => [`${value} orang`, 'Kehadiran']}
                        />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
