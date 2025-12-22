'use client';

import { useState, useMemo } from 'react';
import { DayPicker } from 'react-day-picker';
import { id } from 'date-fns/locale';
import { CalendarDays, Filter, ChevronDown, Clock, MapPin } from 'lucide-react';
import 'react-day-picker/dist/style.css';

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

interface Room {
    id: number;
    name: string;
    location: string;
}

interface HomeCalendarProps {
    rooms: Room[];
    bookings: Booking[];
    title?: string;
    className?: string;
}

export default function HomeCalendar({
    rooms,
    bookings,
    title = "Jadwal Pemakaian Ruangan",
    className = ""
}: HomeCalendarProps) {
    const [selectedRoomId, setSelectedRoomId] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    // Filter bookings based on selected room
    const filteredBookings = useMemo(() => {
        return bookings.filter(b => {
            if (selectedRoomId) {
                return b.room.id.toString() === selectedRoomId;
            }
            return true;
        });
    }, [bookings, selectedRoomId]);

    // Get dates that have bookings
    const bookedDays = useMemo(() => {
        return filteredBookings.map(b => new Date(b.startTime));
    }, [filteredBookings]);

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
    };

    const getBookingsForDay = (date: Date) => {
        return filteredBookings.filter(b => {
            const bookingDate = new Date(b.startTime);
            return bookingDate.getDate() === date.getDate() &&
                bookingDate.getMonth() === date.getMonth() &&
                bookingDate.getFullYear() === date.getFullYear();
        });
    };

    const selectedDayBookings = selectedDate ? getBookingsForDay(selectedDate) : [];

    return (
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#0F4C81]/10 rounded-lg text-[#0F4C81]">
                        <CalendarDays className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0F4C81]">
                        {title}
                    </h3>
                </div>

                {/* Filter */}
                <div className="relative group min-w-[200px]">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#0F4C81] transition-colors">
                        <Filter className="w-4 h-4" />
                    </div>
                    <select
                        value={selectedRoomId}
                        onChange={(e) => setSelectedRoomId(e.target.value)}
                        className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-200 text-[#1F2937] text-sm font-medium bg-gray-50 hover:bg-white hover:border-[#0F4C81] focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/20 appearance-none cursor-pointer transition-all outline-none"
                    >
                        <option value="">Semua Ruangan</option>
                        {rooms.map(room => (
                            <option key={room.id} value={room.id}>{room.name}</option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-2 flex justify-center w-full">
                <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && handleDateClick(date)}
                    locale={id}
                    modifiers={{
                        booked: bookedDays
                    }}
                    modifiersStyles={{
                        booked: {
                            fontWeight: 'bold',
                            color: '#0F4C81',
                            position: 'relative',
                        }
                    }}
                    styles={{
                        caption: { color: '#1f2937' },
                        head_cell: { color: '#6b7280' },
                        day: { margin: '0.2rem' }
                    }}
                    className="custom-day-picker scale-90 sm:scale-100"
                />
            </div>

            {/* Booking List Below Calendar */}
            {selectedDate && selectedDayBookings.length > 0 && (
                <div className="border-t border-gray-100 bg-gray-50/50 p-4 animate-in slide-in-from-top-2">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3 px-1">
                        <CalendarDays className="w-4 h-4 text-[#0F4C81]" />
                        Jadwal {selectedDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </h4>
                    <div className="space-y-3">
                        {selectedDayBookings.map(booking => (
                            <div key={booking.id} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:border-[#0F4C81]/30 transition-all">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                        <div className="p-1.5 bg-[#0F4C81]/10 rounded-md text-[#0F4C81]">
                                            <Clock className="w-3.5 h-3.5" />
                                        </div>
                                        {new Date(booking.startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        <span className="text-gray-400">-</span>
                                        {new Date(booking.endTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-600 flex items-center gap-1 w-fit">
                                        <MapPin className="w-3 h-3" />
                                        {booking.room.name}
                                    </div>
                                </div>

                                <div className="text-sm text-gray-600 pl-2 border-l-2 border-gray-100">
                                    {booking.purpose}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
