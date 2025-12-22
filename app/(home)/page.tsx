import Navbar from '@/components/layout/Navbar';
import HeroSection from './_components/HeroSection';
import SOPSection from './_components/SOPSection';
import AnnouncementSection from './_components/AnnouncementSection';
import HomeCalendar from './_components/HomeCalendar';
import PublicationSection from './_components/PublicationSection';
import Footer from '@/components/layout/Footer';
import { getAllRooms, getMonthBookings, getMaintenanceRooms } from '@/lib/actions/booking';
import { getGovernanceDocs } from '@/lib/actions/governance';
import { getTopPublications } from '@/lib/actions/publication';
import { getMaintenanceItems } from '@/lib/actions/inventory';

export default async function Home() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const [rooms, currentMonthBookings, nextMonthBookings, nextNextMonthBookings, sops, topPublications, maintenanceRooms, maintenanceItems] = await Promise.all([
        getAllRooms(),
        getMonthBookings(currentMonth, currentYear),
        getMonthBookings((currentMonth + 1) % 12, currentMonth + 1 > 11 ? currentYear + 1 : currentYear),
        getMonthBookings((currentMonth + 2) % 12, currentMonth + 2 > 11 ? currentYear + 1 : currentYear),
        getGovernanceDocs('SOP'),
        getTopPublications(3),
        getMaintenanceRooms(),
        getMaintenanceItems(),
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
                    <div className="space-y-8">
                        <SOPSection sops={sops} />
                        <PublicationSection topPublications={topPublications} />
                    </div>
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 gap-8">
                            <HomeCalendar
                                rooms={rooms}
                                bookings={calendarBookings}
                                title="Kalender Ruangan"
                            />
                            <AnnouncementSection
                                maintenanceRooms={maintenanceRooms}
                                maintenanceItems={maintenanceItems}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
