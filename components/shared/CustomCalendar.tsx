'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

interface Booking {
    id: number;
    startTime: Date;
    endTime: Date;
    purpose: string;
    room: {
        id: number;
        name: string;
    };
}

interface PracticumSchedule {
    id: number;
    roomId: number;
    roomName: string | null;
    courseName: string | null;
    courseCode: string | null;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    scheduledDate: Date;
}

interface CustomCalendarProps {
    bookings: Booking[];
    practicumSchedules?: PracticumSchedule[];
    onDateSelect?: (date: Date) => void;
    selectedRoomId?: number | null;
}

const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function CustomCalendar({ bookings, practicumSchedules = [], onDateSelect, selectedRoomId }: CustomCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // Filter bookings by room
    const filteredBookings = useMemo(() => {
        return bookings.filter(b => {
            if (selectedRoomId) {
                return b.room.id === selectedRoomId;
            }
            return true;
        });
    }, [bookings, selectedRoomId]);

    // Filter practicum schedules by room
    const filteredPracticums = useMemo(() => {
        return practicumSchedules.filter(p => {
            if (selectedRoomId) {
                return p.roomId === selectedRoomId;
            }
            return true;
        });
    }, [practicumSchedules, selectedRoomId]);

    // Get days in month
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        // Get first day of week (Monday = 0, Sunday = 6)
        let startDay = firstDay.getDay() - 1;
        if (startDay < 0) startDay = 6;

        return { daysInMonth, startDay };
    };

    // Check if date has bookings or practicum schedules
    const hasBooking = (day: number) => {
        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const hasRegularBooking = filteredBookings.some(b => {
            const bookingDate = new Date(b.startTime);
            return bookingDate.getDate() === checkDate.getDate() &&
                bookingDate.getMonth() === checkDate.getMonth() &&
                bookingDate.getFullYear() === checkDate.getFullYear();
        });
        if (hasRegularBooking) return true;

        return filteredPracticums.some(p => {
            const pDate = new Date(p.scheduledDate);
            return pDate.getDate() === checkDate.getDate() &&
                pDate.getMonth() === checkDate.getMonth() &&
                pDate.getFullYear() === checkDate.getFullYear();
        });
    };

    // Get bookings for selected date
    const getBookingsForDay = (date: Date) => {
        return filteredBookings.filter(b => {
            const bookingDate = new Date(b.startTime);
            return bookingDate.getDate() === date.getDate() &&
                bookingDate.getMonth() === date.getMonth() &&
                bookingDate.getFullYear() === date.getFullYear();
        });
    };

    // Get practicum schedules for selected date
    const getPracticumsForDay = (date: Date) => {
        return filteredPracticums.filter(p => {
            const pDate = new Date(p.scheduledDate);
            return pDate.getDate() === date.getDate() &&
                pDate.getMonth() === date.getMonth() &&
                pDate.getFullYear() === date.getFullYear();
        });
    };

    // Check if day is today
    const isToday = (day: number) => {
        const today = new Date();
        return day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    // Check if day is selected
    const isSelected = (day: number) => {
        return day === selectedDate.getDate() &&
            currentDate.getMonth() === selectedDate.getMonth() &&
            currentDate.getFullYear() === selectedDate.getFullYear();
    };

    // Handle date click
    const handleDateClick = (day: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(newDate);
        onDateSelect?.(newDate);
    };

    // Navigation
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const { daysInMonth, startDay } = getDaysInMonth(currentDate);
    const selectedBookings = getBookingsForDay(selectedDate);
    const selectedPracticums = getPracticumsForDay(selectedDate);

    return (
        <div className="flex flex-col h-full w-full">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-3">
                <button
                    onClick={prevMonth}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h3 className="text-sm font-semibold text-gray-800">
                    {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <button
                    onClick={nextMonth}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-0.5 mb-1">
                {DAYS.map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0.5 mb-4">
                {/* Empty cells for start offset */}
                {Array.from({ length: startDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Day cells */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const hasBookingToday = hasBooking(day);
                    const isTodayDate = isToday(day);
                    const isSelectedDate = isSelected(day);

                    return (
                        <button
                            key={day}
                            onClick={() => handleDateClick(day)}
                            className={`
                                aspect-square flex items-center justify-center text-sm rounded-lg transition-all relative
                                ${isSelectedDate
                                    ? 'bg-[#0F4C81] text-white font-semibold shadow-md'
                                    : isTodayDate
                                        ? 'bg-[#0F4C81]/10 text-[#0F4C81] font-semibold'
                                        : 'hover:bg-gray-100 text-gray-700'
                                }
                            `}
                        >
                            {day}
                            {hasBookingToday && !isSelectedDate && (
                                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                                    <span className="w-1 h-1 bg-[#0F4C81] rounded-full" />
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Selected Date Agenda */}
            <div className="flex-1 overflow-y-auto border-t border-gray-100 pt-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Agenda {selectedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </h4>

                <div className="space-y-2">
                    {/* Practicum schedules first (higher priority) */}
                    {selectedPracticums.length > 0 && selectedPracticums.map(practicum => (
                        <div
                            key={`p-${practicum.id}`}
                            className="bg-green-50 p-2.5 rounded-lg border border-green-200"
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold text-green-700 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {practicum.startTime} - {practicum.endTime}
                                </span>
                                <span className="text-[10px] bg-green-100 border border-green-300 px-1.5 py-0.5 rounded text-green-700 font-medium">
                                    {practicum.roomName}
                                </span>
                            </div>
                            <p className="text-xs text-green-800 font-semibold">
                                🎓 Praktikum: {practicum.courseName} ({practicum.courseCode})
                            </p>
                            <p className="text-[10px] text-green-600 mt-0.5">Ruangan tidak tersedia untuk booking</p>
                        </div>
                    ))}

                    {/* Regular bookings */}
                    {selectedBookings.length > 0 ? (
                        selectedBookings.map(booking => (
                            <div
                                key={booking.id}
                                className="bg-gray-50 p-2.5 rounded-lg border border-gray-100"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-bold text-[#0F4C81] flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(booking.startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span className="text-[10px] bg-white border px-1.5 py-0.5 rounded text-gray-500">
                                        {booking.room.name}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-700 line-clamp-2">
                                    {booking.purpose}
                                </p>
                            </div>
                        ))
                    ) : (
                        selectedPracticums.length === 0 && (
                            <div className="text-center py-4 text-gray-400">
                                <p className="text-xs">Tidak ada jadwal</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
