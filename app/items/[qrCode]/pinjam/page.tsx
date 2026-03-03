import { getItemByQrCode } from '@/features/inventory/actions';
import { getSession } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';

interface Props {
    params: Promise<{ qrCode: string }>;
}

export default async function ItemLoanRedirectPage({ params }: Props) {
    const { qrCode } = await params;
    const session = await getSession();

    // Redirect to login if not authenticated
    if (!session) {
        redirect(`/login?callbackUrl=${encodeURIComponent(`/items/${qrCode}/pinjam`)}`);
    }

    const item = await getItemByQrCode(qrCode);

    if (!item) {
        notFound();
    }

    // Redirect based on role
    if (session.user.role === 'Admin') {
        redirect(`/admin/inventory`);
    } else if (session.user.role === 'Dosen') {
        redirect(`/lecturer/items?qrCode=${qrCode}&action=pinjam`);
    } else {
        // Default to student
        redirect(`/student/items?qrCode=${qrCode}&action=pinjam`);
    }
}
