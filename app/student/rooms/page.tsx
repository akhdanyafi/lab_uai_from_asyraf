import { getAllRooms, getMyBookings, getMonthBookings, getScheduledPracticumsForCalendar } from '@/features/bookings/actions';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import StudentRoomManager from './_components/StudentRoomManager';

export default async function RoomBookingPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Fetch bookings for current month and next 2 months
    const [rooms, myBookings, currentMonthBookings, nextMonthBookings, nextNextMonthBookings, practicumSchedules] = await Promise.all([
        getAllRooms(),
        getMyBookings(session.user.id),
        getMonthBookings(currentMonth, currentYear),
        getMonthBookings((currentMonth + 1) % 12, currentMonth + 1 > 11 ? currentYear + 1 : currentYear),
        getMonthBookings((currentMonth + 2) % 12, currentMonth + 2 > 11 ? currentYear + 1 : currentYear),
        getScheduledPracticumsForCalendar(),
    ]);

    const calendarBookings = [
        ...currentMonthBookings,
        ...nextMonthBookings,
        ...nextNextMonthBookings
    ];



    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Booking Ruangan</h1>
                <p className="text-gray-500 text-sm mt-1">Ajukan pemesanan ruangan laboratorium</p>
            </div>

            <StudentRoomManager
                rooms={rooms}
                calendarBookings={calendarBookings}
                practicumSchedules={practicumSchedules}
                myBookings={myBookings}
                userId={session.user.id}
            />
        </div>
    );
}
