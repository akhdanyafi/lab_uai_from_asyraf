'use client';

import { useEffect, useState } from 'react';
import TrendChart from '@/features/dashboard/components/TrendChart';
import CategoryBarChart from '@/features/dashboard/components/CategoryBarChart';
import InsightCard from '@/features/dashboard/components/InsightCard';
import {
    getSmartAnalyticsData,
    getBookingsByRoom,
} from '@/features/dashboard/actions';
import {
    generateSmartInsights,
    formatChartData,
    type Insight,
    type ChartDataPoint,
} from '@/features/dashboard/analytics';

export default function DashboardAnalytics() {
    const [loanTrendData, setLoanTrendData] = useState<ChartDataPoint[]>([]);
    const [bookingsByRoom, setBookingsByRoom] = useState<ChartDataPoint[]>([]);
    const [insights, setInsights] = useState<Insight[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAnalytics() {
            try {
                const [smartData, roomData] = await Promise.all([
                    getSmartAnalyticsData(),
                    getBookingsByRoom(),
                ]);

                // Format 7-day trend for chart (last 7 of 14 days)
                const last7 = smartData.trendData14.slice(-7).map(d => ({
                    date: new Date(d.date),
                    count: d.count,
                }));
                setLoanTrendData(formatChartData(last7));
                setBookingsByRoom(roomData);

                // Generate smart insights from all data
                const generatedInsights = generateSmartInsights({
                    trendData14: smartData.trendData14,
                    pendingCounts: smartData.pendingCounts,
                    overdueLoans: smartData.overdueLoans,
                    upcomingDeadlines: smartData.upcomingDeadlines,
                    dayOfWeekStats: smartData.dayOfWeekStats,
                    roomUtilization: smartData.roomUtilization,
                    idleItems: smartData.idleItems,
                    recentBookings: smartData.recentBookings,
                });

                setInsights(generatedInsights);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-gray-100 animate-pulse h-24 rounded-xl" />
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-100 animate-pulse h-64 rounded-xl" />
                    <div className="bg-gray-100 animate-pulse h-64 rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 mb-8">
            {/* Smart Insights Section */}
            {insights.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">🧠 Smart Insights</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {insights.map((insight, idx) => (
                            <InsightCard key={idx} insight={insight} />
                        ))}
                    </div>
                </div>
            )}

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TrendChart
                    data={loanTrendData}
                    title="📈 Trend Peminjaman (7 Hari)"
                    color="#0F4C81"
                />
                <CategoryBarChart
                    data={bookingsByRoom}
                    title="🏠 Booking per Ruangan"
                    color="#10B981"
                />
            </div>
        </div>
    );
}
