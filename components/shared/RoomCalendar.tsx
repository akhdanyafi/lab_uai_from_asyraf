'use client';

import { useState, useMemo } from 'react';
import { DayPicker } from 'react-day-picker';
import { id } from 'date-fns/locale';
import { Clock, MapPin } from 'lucide-react';
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

interface RoomCalendarProps {
    bookings: Booking[];
    onDateSelect?: (date: Date) => void;
    selectedRoomId?: number | null;
}

export default function RoomCalendar({ bookings, onDateSelect, selectedRoomId }: RoomCalendarProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        if (date && onDateSelect) {
            onDateSelect(date);
        }
    };

    // Filter logic
    const filteredBookings = useMemo(() => {
        return bookings.filter(b => {
            if (selectedRoomId) {
                return b.room.id === selectedRoomId;
            }
            return true;
        });
    }, [bookings, selectedRoomId]);

    const getBookingsForDay = (date: Date) => {
        return filteredBookings.filter(b => {
            const bookingDate = new Date(b.startTime);
            return bookingDate.getDate() === date.getDate() &&
                bookingDate.getMonth() === date.getMonth() &&
                bookingDate.getFullYear() === date.getFullYear();
        });
    };

    const bookedDays = useMemo(() => {
        return filteredBookings.map(b => new Date(b.startTime));
    }, [filteredBookings]);

    return (
        /* PERBAIKAN 1: Hapus bg-white, shadow, dan border. 
           Gunakan h-full dan flex-col agar stack vertikal. */
        <div className="flex flex-col h-full w-full">
            
            {/* Bagian Kalender (DatePicker) */}
            <div className="flex justify-center border-b border-gray-100 pb-4 mb-4 bg-white">
                <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    locale={id}
                    modifiers={{ booked: bookedDays }}
                    modifiersStyles={{
                        booked: {
                            fontWeight: 'bold',
                            color: '#0F4C81', // Sesuaikan dengan warna brand Anda
                            textDecoration: 'underline'
                        }
                    }}
                    styles={{
                        caption: { color: '#1f2937' },
                        head_cell: { color: '#6b7280' },
                        // PERBAIKAN 2: Kecilkan ukuran font agar muat di sidebar
                        day: { fontSize: '0.875rem' } 
                    }}
                />
            </div>

            {/* Bagian List Agenda (Detail) */}
            <div className="flex-1 overflow-y-auto px-1 custom-scrollbar min-h-[300px]">
                {selectedDate ? (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 sticky top-0 bg-white py-2 z-10 border-b border-gray-50">
                            Agenda {selectedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </h3>

                        <div className="space-y-3">
                            {getBookingsForDay(selectedDate).length > 0 ? (
                                getBookingsForDay(selectedDate).map(booking => (
                                    /* Card Item Kecil */
                                    <div key={booking.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-primary/30 transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F4C81]">
                                                <Clock className="w-3 h-3" />
                                                {new Date(booking.startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <span className="text-[10px] bg-white border px-1.5 py-0.5 rounded text-gray-500">
                                                {booking.room.name}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-800 line-clamp-2 leading-snug">
                                            {booking.purpose}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    <p className="text-sm">Tidak ada jadwal</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-400 italic text-sm">
                        Pilih tanggal diatas
                    </div>
                )}
            </div>
        </div>
    );
}