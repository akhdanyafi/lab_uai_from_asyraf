import Navbar from '@/components/home/Navbar';
import HeroSection from '@/components/home/HeroSection';
import SOPSection from '@/components/home/SOPSection';
import AnnouncementSection from '@/components/home/AnnouncementSection';
import CalendarSection from '@/components/home/CalendarSection';
import PublicationSection from '@/components/home/PublicationSection';
import Footer from '@/components/home/Footer';
import { getAllRooms, getMonthBookings } from '@/lib/actions/bookings';
import { getSops } from '@/lib/actions/sops';

export default async function Home() {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const [rooms, currentMonthBookings, nextMonthBookings, nextNextMonthBookings, sops] = await Promise.all([
    getAllRooms(),
    getMonthBookings(currentMonth, currentYear),
    getMonthBookings((currentMonth + 1) % 12, currentMonth + 1 > 11 ? currentYear + 1 : currentYear),
    getMonthBookings((currentMonth + 2) % 12, currentMonth + 2 > 11 ? currentYear + 1 : currentYear),
    getSops(),
  ]);

  const calendarBookings = [
    ...currentMonthBookings,
    ...nextMonthBookings,
    ...nextNextMonthBookings
  ];

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8 space-y-8">
        <HeroSection />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SOPSection sops={sops} />
          </div>
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
              <AnnouncementSection />
              <CalendarSection rooms={rooms} bookings={calendarBookings} />
            </div>
          </div>
        </div>

        <PublicationSection />
      </div>

      <Footer />
    </main>
  );
}
