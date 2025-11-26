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
    layoutMode?: 'default' | 'stacked';
}

export default function RoomCalendar({ bookings, onDateSelect, selectedRoomId, layoutMode = 'default' }: RoomCalendarProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        if (date && onDateSelect) {
            onDateSelect(date);
        }
    };

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
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col ${layoutMode === 'default' ? 'md:flex-row' : ''} h-full`}>
            <div className={`p-6 border-b ${layoutMode === 'default' ? 'md:border-b-0 md:border-r' : ''} border-gray-100 flex-shrink-0 flex justify-center bg-white`}>
                <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    locale={id}
                    modifiers={{
                        booked: bookedDays
                    }}
                    modifiersStyles={{
                        booked: {
                            fontWeight: 'bold',
                            color: 'var(--primary)',
                            textDecoration: 'underline'
                        }
                    }}
                    styles={{
                        caption: { color: '#1f2937' },
                        head_cell: { color: '#6b7280' },
                    }}
                    className="custom-day-picker"
                />
            </div>

            <div className="flex-1 bg-gray-50/30 p-6 overflow-y-auto max-h-[600px]">
                {selectedDate ? (
                    <div className="animate-in fade-in duration-300">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2 sticky top-0 bg-gray-50/30 backdrop-blur-sm py-2 z-10">
                            <div className="w-1 h-4 bg-primary rounded-full" />
                            Jadwal {selectedDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </h3>

                        <div className="space-y-3">
                            {getBookingsForDay(selectedDate).length > 0 ? (
                                getBookingsForDay(selectedDate).map(booking => (
                                    <div key={booking.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between group hover:border-primary/30 hover:shadow-md transition-all">
                                        <div className="w-full">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                                    <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                                                        <Clock className="w-3.5 h-3.5" />
                                                    </div>
                                                    {new Date(booking.startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} -
                                                    {new Date(booking.endTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="px-2.5 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600 flex items-center gap-1.5">
                                                    <MapPin className="w-3 h-3" />
                                                    {booking.room.name}
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-600 pl-9 border-l-2 border-gray-100 ml-3">
                                                {booking.purpose}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-gray-500 italic text-center py-12 bg-white rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center gap-2">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    Tidak ada booking pada tanggal ini
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm italic">
                        Pilih tanggal untuk melihat jadwal
                    </div>
                )}
            </div>
        </div>
    );
}
