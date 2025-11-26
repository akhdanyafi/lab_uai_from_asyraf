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

interface CalendarSectionProps {
    rooms: Room[];
    bookings: Booking[];
}

export default function CalendarSection({ rooms, bookings }: CalendarSectionProps) {
    return (
        <CalendarView
            rooms={rooms}
            bookings={bookings}
            title="Kalender Ruangan"
            className="h-full"
            layoutMode="stacked"
        />
    );
}
