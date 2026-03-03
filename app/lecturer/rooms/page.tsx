import { getAllRooms, getMyBookings, getMonthBookings, getScheduledPracticumsForCalendar } from '@/features/bookings/actions';
import { getSession, hasPermission } from '@/lib/auth';
import { redirect } from 'next/navigation';
import StudentRoomManager from '@/app/student/rooms/_components/StudentRoomManager';

export default async function LecturerRoomsPage() {
    const session = await getSession();
    if (!session || !hasPermission(session, 'dashboard.lecturer')) redirect('/login');

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Fetch bookings for current month and next 2 months
    const [rooms, myBookings, currentMonthBookings, nextMonthBookings, nextNextMonthBookings, practicumSchedules] = await Promise.all([
        getAllRooms(),
        getMyBookings(session.user.identifier),
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
                <p className="text-gray-500 text-sm mt-1">Ajukan pemesanan ruangan dan pantau status booking Anda</p>
            </div>

            <StudentRoomManager
                rooms={rooms}
                myBookings={myBookings}
                calendarBookings={calendarBookings}
                practicumSchedules={practicumSchedules}
                userId={session.user.identifier}
                role="lecturer"
            />
        </div>
    );
}
