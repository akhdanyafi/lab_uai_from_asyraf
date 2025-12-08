import Navbar from '@/components/home/Navbar';
import HeroSection from '@/components/home/HeroSection';
import SOPSection from '@/components/home/SOPSection';
import AnnouncementSection from '@/components/home/AnnouncementSection';
import CalendarView from '@/components/shared/CalendarView';
import PublicationSection from '@/components/home/PublicationSection';
import Footer from '@/components/home/Footer';
import { getAllRooms, getMonthBookings } from '@/lib/actions/bookings';
import { getGovernanceDocs } from '@/lib/actions/governance';
import { getTopPublications } from '@/lib/actions/publications';

export default async function Home() {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const [rooms, currentMonthBookings, nextMonthBookings, nextNextMonthBookings, sops, topPublications] = await Promise.all([
    getAllRooms(),
    getMonthBookings(currentMonth, currentYear),
    getMonthBookings((currentMonth + 1) % 12, currentMonth + 1 > 11 ? currentYear + 1 : currentYear),
    getMonthBookings((currentMonth + 2) % 12, currentMonth + 2 > 11 ? currentYear + 1 : currentYear),
    getGovernanceDocs('SOP'),
    getTopPublications(3),
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <SOPSection sops={sops} />
          </div>
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
              <CalendarView
                rooms={rooms}
                bookings={calendarBookings}
                title="Kalender Ruangan"
                className="h-[320px]"
                layoutMode="stacked"
              />
              <AnnouncementSection />
            </div>
          </div>
        </div>
        <PublicationSection topPublications={topPublications} />
      </div>
      <Footer />
    </main>
  );
}