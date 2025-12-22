'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import CalendarView from '@/components/shared/CalendarView';
import { createRoomBooking } from '@/lib/actions/booking';

interface Room {
    id: number;
    name: string;
    location: string;
    capacity: number;
}

interface Booking {
    id: number;
    startTime: Date;
    endTime: Date;
    purpose: string;
    status: 'Pending' | 'Disetujui' | 'Ditolak' | 'Selesai' | 'Terlambat' | null;
    room: {
        id: number;
        name: string;
    };
}

interface RoomBookingClientProps {
    rooms: Room[];
    calendarBookings: Booking[];
    userId: number;
}

export default function RoomBookingClient({ rooms, calendarBookings, userId }: RoomBookingClientProps) {
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedRoomId, setSelectedRoomId] = useState<string>('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [purpose, setPurpose] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDateSelect = (date: Date) => {
        // Format date as YYYY-MM-DD for input
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        setSelectedDate(`${year}-${month}-${day}`);
    };

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        try {
            const roomId = parseInt(formData.get('roomId') as string);
            const date = formData.get('date') as string;
            const startTimeVal = formData.get('startTime') as string;
            const endTimeVal = formData.get('endTime') as string;
            const purposeVal = formData.get('purpose') as string;

            const startDateTime = new Date(`${date}T${startTimeVal}`);
            const endDateTime = new Date(`${date}T${endTimeVal}`);

            await createRoomBooking({
                userId,
                roomId,
                startTime: startDateTime,
                endTime: endDateTime,
                purpose: purposeVal,
            });

            // Reset form or show success
            alert('Booking berhasil diajukan!');
            setPurpose('');
            setStartTime('');
            setEndTime('');
        } catch (error) {
            console.error(error);
            alert('Gagal mengajukan booking.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Calendar */}
            <div className="lg:col-span-2 space-y-6">
                <CalendarView
                    rooms={rooms}
                    bookings={calendarBookings}
                    title="Kalender Ketersediaan"
                    onDateSelect={handleDateSelect}
                />
            </div>

            {/* Right Column: Booking Form */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        Form Booking
                    </h2>
                    <form action={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ruangan</label>
                            <select
                                name="roomId"
                                required
                                value={selectedRoomId}
                                onChange={(e) => setSelectedRoomId(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">Pilih Ruangan</option>
                                {rooms.map(room => (
                                    <option key={room.id} value={room.id}>{room.name} - {room.location}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                            <input
                                type="date"
                                name="date"
                                required
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mulai</label>
                                <input
                                    type="time"
                                    name="startTime"
                                    required
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Selesai</label>
                                <input
                                    type="time"
                                    name="endTime"
                                    required
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Keperluan</label>
                            <textarea
                                name="purpose"
                                required
                                rows={3}
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                placeholder="Jelaskan keperluan booking..."
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#0F4C81] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0F4C81]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Mengirim...' : 'Ajukan Booking'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
