'use client';

import CalendarView from '@/components/shared/CalendarView';

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

interface AdminCalendarViewProps {
    rooms: Room[];
    bookings: Booking[];
}

export default function AdminCalendarView({ rooms, bookings }: AdminCalendarViewProps) {
    return (
        <CalendarView
            rooms={rooms}
            bookings={bookings}
            title="Kalender Jadwal Ruangan"
            className="mb-8"
        />
    );
}
