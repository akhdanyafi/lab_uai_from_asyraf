import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PublicationSubmitForm from '@/features/publications/components/PublicationSubmitForm';

export default async function SubmitPublicationPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    return (
        <div className="space-y-6">
            {/* Back Link */}
            <Link
                href="/student/publications"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Publikasi
            </Link>

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Ajukan Publikasi</h1>
                <p className="text-gray-500 text-sm mt-1">
                    Lengkapi form di bawah ini untuk mengajukan publikasi Anda. Pengajuan akan direview oleh Admin/Dosen sebelum dipublikasikan.
                </p>
            </div>

            {/* Submit Form */}
            <PublicationSubmitForm userId={session.user.id} userName={session.user.fullName} />
        </div>
    );
}
