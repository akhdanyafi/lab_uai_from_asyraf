'use client';

import { useEffect, useState } from 'react';
import TrendChart from '@/features/dashboard/components/TrendChart';
import CategoryBarChart from '@/features/dashboard/components/CategoryBarChart';
import InsightCard from '@/features/dashboard/components/InsightCard';
import {
    getLoanTrendData,
    getBookingsByRoom,
    getIdleItemsCount,
    getPendingCounts,
    getRecentBookings
} from '@/features/dashboard/actions';
import {
    calculateTrend,
    generateInsights,
    formatChartData,
    detectPeakHours,
    type Insight,
    type ChartDataPoint
} from '@/features/dashboard/analytics';

export default function DashboardAnalytics() {
    const [loanTrendData, setLoanTrendData] = useState<ChartDataPoint[]>([]);
    const [bookingsByRoom, setBookingsByRoom] = useState<ChartDataPoint[]>([]);
    const [insights, setInsights] = useState<Insight[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAnalytics() {
            try {
                const [trendData, roomData, idleCount, pendingCounts, recentBookings] = await Promise.all([
                    getLoanTrendData(),
                    getBookingsByRoom(),
                    getIdleItemsCount(),
                    getPendingCounts(),
                    getRecentBookings(30)
                ]);

                // Format trend data for chart
                setLoanTrendData(formatChartData(trendData));
                setBookingsByRoom(roomData);

                // Calculate loan trend
                const thisWeek = trendData.slice(-7).reduce((sum, d) => sum + d.count, 0);
                const prevWeek = trendData.slice(-14, -7).reduce((sum, d) => sum + d.count, 0);
                const loansTrend = calculateTrend(thisWeek, prevWeek);

                // Detect peak hours
                const peakHours = detectPeakHours(recentBookings);

                // Generate insights
                const generatedInsights = generateInsights({
                    loansTrend,
                    pendingLoans: pendingCounts.pendingLoans,
                    pendingBookings: pendingCounts.pendingBookings,
                    pendingUsers: pendingCounts.pendingUsers,
                    pendingPublications: pendingCounts.pendingPublications,
                    idleItems: idleCount,
                    peakHours
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
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
            {/* Insights Section */}
            {insights.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">💡 Insights</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
