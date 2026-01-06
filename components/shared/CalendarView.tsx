'use client';

import { useState } from 'react';
import { CalendarDays, Filter, ChevronDown } from 'lucide-react';
import CustomCalendar from './CustomCalendar';

interface Room {
    id: number;
    name: string;
    location: string;
}

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

interface CalendarViewProps {
    rooms: Room[];
    bookings: Booking[];
    title?: string;
    onDateSelect?: (date: Date) => void;
    className?: string;
    layoutMode?: 'default' | 'stacked';
}

export default function CalendarView({
    rooms,
    bookings,
    title = "Jadwal Pemakaian Ruangan",
    onDateSelect,
    className = "",
    layoutMode = 'default'
}: CalendarViewProps) {
    const [selectedRoomId, setSelectedRoomId] = useState<string>('');

    // Menghitung statistik ringkas untuk UX yang lebih informatif (Opsional)
    const activeBookingsCount = bookings.length;
    const roomLabel = selectedRoomId
        ? rooms.find(r => r.id.toString() === selectedRoomId)?.name
        : "Semua Ruangan";

    return (
        // Container Utama: Card Putih dengan Shadow Halus
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full ${className}`}>

            {/* --- 1. HEADER SECTION (Compact) --- */}
            <div className="p-4 border-b border-gray-100 bg-white">
                {/* Title Row */}
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-[#0F4C81]/10 rounded-lg text-[#0F4C81]">
                        <CalendarDays className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0F4C81]">
                        {title}
                    </h3>
                </div>

                {/* Filter Dropdown (Full Width) */}
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <Filter className="w-4 h-4" />
                    </div>
                    <select
                        value={selectedRoomId}
                        onChange={(e) => setSelectedRoomId(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 rounded-lg border border-gray-200 text-[#1F2937] text-sm bg-gray-50 hover:bg-white hover:border-[#0F4C81] focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/20 appearance-none cursor-pointer transition-all outline-none"
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

            {/* --- 3. CALENDAR AREA --- */}
            <div className="flex-1 p-4 bg-white overflow-hidden flex flex-col">
                <CustomCalendar
                    bookings={bookings}
                    selectedRoomId={selectedRoomId ? parseInt(selectedRoomId) : null}
                    onDateSelect={onDateSelect}
                />
            </div>
        </div>
    );
}