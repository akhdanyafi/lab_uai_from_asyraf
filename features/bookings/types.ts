// Booking Types

export interface Room {
    id: number;
    name: string;
    location: string;
    capacity: number;
    status: 'Tersedia' | 'Maintenance';
}

export interface Booking {
    id: number;
    userId: number;
    roomId: number;
    validatorId: number | null;
    startTime: Date;
    endTime: Date;
    purpose: string;
    status: 'Pending' | 'Disetujui' | 'Ditolak';
}

export interface BookingWithDetails extends Booking {
    user: {
        id: number;
        fullName: string;
    };
    room: Room;
    validator?: {
        id: number;
        fullName: string;
    };
}

export interface CreateBookingInput {
    userId: number;
    roomId: number;
    startTime: Date;
    endTime: Date;
    purpose: string;
}

export interface CalendarEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
    roomId: number;
    roomName: string;
    status: string;
}
