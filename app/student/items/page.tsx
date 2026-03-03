import { getAvailableItems, getMyLoans } from '@/features/loans/actions';
import { getCategories, getRooms } from '@/features/inventory/actions';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import StudentItemsManager from './_components/StudentItemsManager';

export default async function BrowseItemsPage({ searchParams }: { searchParams: Promise<{ tab?: string; qrCode?: string; action?: string }> }) {
    const session = await getSession();
    if (!session) redirect('/login');

    const params = await searchParams;
    const initialTab = params.tab === 'loans' ? 'loans' : 'items';
    const qrCode = params.qrCode;
    const action = params.action;

    const [items, categories, rooms, myLoans] = await Promise.all([
        getAvailableItems(), // Fetch all without categoryId, we do client filter
        getCategories(),
        getRooms(),
        getMyLoans(session.user.identifier)
    ]);

    return (
        <div>
            <script dangerouslySetInnerHTML={{ __html: `window.__USER_ID__ = ${session.user.identifier};` }} />

            <StudentItemsManager
                items={items}
                categories={categories}
                rooms={rooms}
                myLoans={myLoans}
                userId={session.user.identifier}
                initialTab={initialTab}
                initialQrCode={qrCode}
                initialAction={action}
            />
        </div>
    );
}
