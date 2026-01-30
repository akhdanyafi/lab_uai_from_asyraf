'use client';

import { Bell, UserCheck, Package, CalendarCheck, FileCheck, ExternalLink, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { MarkAllReadButton } from './MarkAllReadButton';

interface NotificationItem {
    type: 'pending_user' | 'pending_loan' | 'pending_booking' | 'auto_loan' | 'auto_booking' | 'auto_return';
    count?: number;
    data?: any;
}

interface DashboardNotificationsProps {
    pendingUsers: number;
    pendingLoans: number;
    pendingBookings: number;
    autoApprovedLoans: any[];
    autoApprovedBookings: any[];
    autoReturnedLoans: any[];
}

export default function DashboardNotifications({
    pendingUsers,
    pendingLoans,
    pendingBookings,
    autoApprovedLoans,
    autoApprovedBookings,
    autoReturnedLoans
}: DashboardNotificationsProps) {
    const totalNotifications = pendingUsers + pendingLoans + pendingBookings +
        autoApprovedLoans.length + autoApprovedBookings.length +
        autoReturnedLoans.length;

    if (totalNotifications === 0) {
        return null;
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#0F4C81]" />
                    <h2 className="font-semibold text-gray-900 text-sm">Notifikasi Dashboard</h2>
                    <span className="bg-[#0F4C81] text-white text-xs px-1.5 py-0.5 rounded-full">
                        {totalNotifications}
                    </span>
                </div>
                {(autoApprovedLoans.length > 0 || autoApprovedBookings.length > 0 || autoReturnedLoans.length > 0) && (
                    <MarkAllReadButton />
                )}
            </div>

            <div className="space-y-2">
                {/* Pending User Validation */}
                {pendingUsers > 0 && (
                    <div className="flex items-center justify-between p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                <UserCheck className="w-4 h-4 text-amber-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-medium text-amber-900 text-xs">User Menunggu Validasi</p>
                                <p className="text-xs text-amber-700">{pendingUsers} pending</p>
                            </div>
                        </div>
                        <Link
                            href="/admin/validations?tab=users"
                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-medium text-xs transition-colors shrink-0"
                        >
                            Validasi
                        </Link>
                    </div>
                )}

                {/* Pending Loans */}
                {pendingLoans > 0 && (
                    <div className="flex items-center justify-between p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                <Package className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-medium text-blue-900 text-xs">Peminjaman Menunggu Validasi</p>
                                <p className="text-xs text-blue-700">{pendingLoans} pending</p>
                            </div>
                        </div>
                        <Link
                            href="/admin/validations?tab=loans"
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-xs transition-colors shrink-0"
                        >
                            Validasi
                        </Link>
                    </div>
                )}

                {/* Pending Bookings */}
                {pendingBookings > 0 && (
                    <div className="flex items-center justify-between p-2.5 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                                <CalendarCheck className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-medium text-purple-900 text-xs">Booking Ruangan Menunggu Validasi</p>
                                <p className="text-xs text-purple-700">{pendingBookings} pending</p>
                            </div>
                        </div>
                        <Link
                            href="/admin/validations?tab=rooms"
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium text-xs transition-colors shrink-0"
                        >
                            Validasi
                        </Link>
                    </div>
                )}

                {/* Auto-approved Loans */}
                {autoApprovedLoans.slice(0, 3).map((loan) => (
                    <div key={`loan-${loan.id}`} className="flex items-center justify-between p-2.5 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            <FileCheck className="w-4 h-4 text-green-600 shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-gray-900 truncate">
                                    Peminjaman <span className="text-green-600">{loan.item?.name}</span> oleh <span className="text-gray-700">{loan.student?.fullName}</span>
                                </p>
                                <p className="text-xs text-gray-500">Auto-approved</p>
                            </div>
                        </div>
                        {loan.suratIzin && (
                            <a
                                href={loan.suratIzin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-800 text-xs flex items-center gap-1 shrink-0 ml-2"
                            >
                                <ExternalLink className="w-3 h-3" /> Lihat
                            </a>
                        )}
                    </div>
                ))}

                {/* Auto-approved Bookings */}
                {autoApprovedBookings.slice(0, 3).map((booking) => (
                    <div key={`booking-${booking.id}`} className="flex items-center justify-between p-2.5 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            <FileCheck className="w-4 h-4 text-green-600 shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-gray-900 truncate">
                                    Booking <span className="text-green-600">{booking.room?.name}</span> oleh <span className="text-gray-700">{booking.user?.fullName}</span>
                                </p>
                                <p className="text-xs text-gray-500">Auto-approved</p>
                            </div>
                        </div>
                        {booking.suratPermohonan && (
                            <a
                                href={booking.suratPermohonan}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-800 text-xs flex items-center gap-1 shrink-0 ml-2"
                            >
                                <ExternalLink className="w-3 h-3" /> Lihat
                            </a>
                        )}
                    </div>
                ))}

                {/* Auto-returned Loans */}
                {autoReturnedLoans.slice(0, 3).map((loan) => (
                    <div key={`return-${loan.id}`} className="flex items-center justify-between p-2.5 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            <FileCheck className="w-4 h-4 text-green-600 shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-gray-900 truncate">
                                    Pengembalian <span className="text-green-600">{loan.item?.name}</span> oleh <span className="text-gray-700">{loan.student?.fullName}</span>
                                </p>
                                <p className="text-xs text-gray-500">Auto-approved</p>
                            </div>
                        </div>
                        {loan.returnPhoto && (
                            <a
                                href={loan.returnPhoto}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-800 text-xs flex items-center gap-1 shrink-0 ml-2"
                            >
                                <ExternalLink className="w-3 h-3" /> Lihat
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
