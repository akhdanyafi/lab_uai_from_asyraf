import { getItemByQrCode } from '@/features/inventory/actions';
import { getSession } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { Box, ArrowLeft, Calendar, FileText, Send } from 'lucide-react';
import { requestItemLoan } from '@/features/loans/actions';

interface Props {
    params: Promise<{ qrCode: string }>;
}

export default async function ItemLoanFormPage({ params }: Props) {
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

    // Check if item is available
    if (item.status !== 'Tersedia') {
        redirect(`/items/${qrCode}`);
    }

    // Extract values for use in server action
    const itemId = item.id;
    const sessionUserId = session.user.id;

    async function handleSubmit(formData: FormData) {
        'use server';

        const purpose = formData.get('purpose') as string;
        const returnPlanDate = formData.get('returnPlanDate') as string;
        const permitLetter = formData.get('permitLetter') as File | null;

        let permitPath: string | undefined;
        let permitVerified = false;

        // Upload permit letter if provided (PDF only)
        if (permitLetter && permitLetter.size > 0) {
            if (permitLetter.type !== 'application/pdf') {
                throw new Error('Surat izin harus dalam format PDF');
            }

            const uploadFormData = new FormData();
            uploadFormData.append('file', permitLetter);
            uploadFormData.append('folder', 'surat-izin');

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/upload?verify=true&type=suratIzin`, {
                method: 'POST',
                body: uploadFormData,
            });

            if (response.ok) {
                const data = await response.json();
                permitPath = data.path;
                permitVerified = data.verification?.valid === true;
            }
        }

        // Create loan request
        const res = await requestItemLoan({
            itemId,
            studentId: sessionUserId,
            purpose,
            returnPlanDate: new Date(returnPlanDate),
            permitLetter: permitPath,
            permitVerified,
        });

        if (res?.error) {
            throw new Error(res.error);
        }

        redirect('/student/loans');
    }

    // Calculate min date (today) and max date (30 days from now)
    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-lg mx-auto">
                {/* Back Button */}
                <Link
                    href={`/items/${qrCode}`}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Detail
                </Link>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#0F4C81] to-[#1a5a96] p-6 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                <Box className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Pinjam Alat</h1>
                                <p className="text-white/80 text-sm">{item.name}</p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form action={handleSubmit} className="p-6 space-y-5">
                        {/* Purpose */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tujuan Peminjaman *
                            </label>
                            <textarea
                                name="purpose"
                                required
                                rows={3}
                                placeholder="Jelaskan tujuan peminjaman alat ini..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81] resize-none"
                            />
                        </div>

                        {/* Return Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Rencana Tanggal Kembali *
                            </label>
                            <input
                                type="date"
                                name="returnPlanDate"
                                required
                                min={today}
                                max={maxDate}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81]"
                            />
                            <p className="text-xs text-gray-400 mt-1">Maksimal 30 hari dari sekarang</p>
                        </div>

                        {/* Permit Letter (Optional) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FileText className="w-4 h-4 inline mr-1" />
                                Surat Izin (Opsional)
                            </label>
                            <input
                                type="file"
                                name="permitLetter"
                                accept=".pdf"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81] text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0F4C81]/10 file:text-[#0F4C81] hover:file:bg-[#0F4C81]/20"
                            />
                            <p className="text-xs text-gray-400 mt-1">PDF (Max 10MB). Upload surat izin untuk auto-approval (akan diverifikasi otomatis)</p>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-[#0F4C81] text-white py-3 rounded-xl font-medium hover:bg-[#0F4C81]/90 transition-colors"
                        >
                            <Send className="w-4 h-4" />
                            Ajukan Peminjaman
                        </button>

                        <p className="text-center text-xs text-gray-400">
                            Peminjaman akan diproses oleh admin lab
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
