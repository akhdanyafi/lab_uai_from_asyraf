import { getAvailableItems, getMyLoans } from '@/features/loans/actions';
import { getCategories, getRooms } from '@/features/inventory/actions';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import StudentItemsManager from './_components/StudentItemsManager';

export default async function BrowseItemsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
    const session = await getSession();
    if (!session) redirect('/login');

    const params = await searchParams;
    const initialTab = params.tab === 'loans' ? 'loans' : 'items';

    const [items, categories, rooms, myLoans] = await Promise.all([
        getAvailableItems(), // Fetch all without categoryId, we do client filter
        getCategories(),
        getRooms(),
        getMyLoans(session.user.id)
    ]);

    return (
        <div>
            <script dangerouslySetInnerHTML={{ __html: `window.__USER_ID__ = ${session.user.id};` }} />

            <StudentItemsManager
                items={items}
                categories={categories}
                rooms={rooms}
                myLoans={myLoans}
                userId={session.user.id}
                initialTab={initialTab}
            />
        </div>
    );
}
