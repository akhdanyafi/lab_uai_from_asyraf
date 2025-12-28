import { enrollWithKey } from '@/features/academic/actions';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Key, CheckCircle, XCircle } from 'lucide-react';

/**
 * Student Self-Enrollment Page
 * 
 * NEW FEATURE - SIMPLIFIED SCHEMA:
 * - Allows students to enroll themselves using enrollmentKey
 * - Validates key using validateEnrollmentKey()
 * - Auto-enrolls using enrollWithKey()
 * - Redirects to /student/assignments after success
 */

export default async function StudentEnrollPage({
    searchParams,
}: {
    searchParams: Promise<{ success?: string; error?: string }>;
}) {
    const session = await getSession();
    if (!session || session.user.role !== 'Mahasiswa') redirect('/login');

    const params = await searchParams;

    async function handleEnroll(formData: FormData) {
        'use server';
        const enrollmentKey = formData.get('enrollmentKey') as string;
        const session = await getSession();
        if (!session) redirect('/login');

        try {
            await enrollWithKey(enrollmentKey, session.user.id);
            redirect('/student/enroll?success=true');
        } catch (error: any) {
            const errorMessage = encodeURIComponent(error.message || 'Gagal melakukan enrollment');
            redirect(`/student/enroll?error=${errorMessage}`);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-4">
                    <Key className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Enroll Kelas Praktikum</h1>
                <p className="text-gray-600">
                    Masukkan kode enrollment yang diberikan oleh dosen untuk bergabung ke kelas praktikum.
                </p>
            </div>

            {/* Success Message */}
            {params.success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                    <div className="bg-green-100 p-1.5 rounded-full text-green-600 shrink-0">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-green-900 text-sm">Berhasil Terdaftar!</h3>
                        <p className="text-green-700 text-sm mt-1">
                            Anda berhasil terdaftar di kelas. Silakan cek menu{' '}
                            <a href="/student/assignments" className="font-medium underline hover:text-green-800">
                                Praktikum
                            </a>{' '}
                            untuk melihat tugas Anda.
                        </p>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {params.error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <div className="bg-red-100 p-1.5 rounded-full text-red-600 shrink-0">
                        <XCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-red-900 text-sm">Enrollment Gagal</h3>
                        <p className="text-red-700 text-sm mt-1">{decodeURIComponent(params.error)}</p>
                    </div>
                </div>
            )}

            {/* Enrollment Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <form action={handleEnroll} className="space-y-6">
                    <div>
                        <label htmlFor="enrollmentKey" className="block text-sm font-medium text-gray-700 mb-2">
                            Kode Enrollment
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Key className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                id="enrollmentKey"
                                name="enrollmentKey"
                                required
                                placeholder="Contoh: IF12-A-X9K2"
                                className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out text-lg font-mono"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Kode enrollment biasanya dibagikan oleh dosen melalui grup WhatsApp atau pengumuman kelas.
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[#0F4C81] hover:bg-[#0F4C81]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        <Key className="w-5 h-5" />
                        Enroll Sekarang
                    </button>
                </form>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    Cara Mendapatkan Kode Enrollment
                </h3>
                <ul className="text-sm text-blue-800 space-y-2">
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>Tanyakan kepada dosen pengampu mata kuliah praktikum Anda</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>Cek grup WhatsApp atau announcement channel kelas</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>Kode biasanya berformat: [KODE_MK]-[KELAS]-[RANDOM] (contoh: IF12-A-X9K2)</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
