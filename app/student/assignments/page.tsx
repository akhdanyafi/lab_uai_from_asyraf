import { getStudentAssignments } from '@/features/academic/actions';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FileText } from 'lucide-react';

/**
 * Student Sessions Page (Simplified)
 * 
 * UPDATED FOR SIMPLIFIED SCHEMA:
 * - Uses getStudentAssignments instead of getStudentSessions
 * - Uses assignment.title directly instead of module.title
 * - Uses class.courseName instead of class.course.name
 */

export default async function StudentSessionsPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    const assignments = await getStudentAssignments(session.user.id);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Praktikum Saya</h1>
            <p className="text-gray-600">Daftar tugas praktikum aktif dari kelas yang Anda ikuti.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignments.map((assignment) => {
                    return (
                        <Link
                            key={assignment.id}
                            href={`/student/assignments/${assignment.id}`}
                            className="block group"
                        >
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md h-full flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${assignment.isOpen ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#0F4C81] transition-colors">{assignment.title}</h3>
                                            <p className="text-sm text-gray-500">{assignment.class.name} - {assignment.class.courseName}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${assignment.isOpen ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                        {assignment.isOpen ? 'Aktif' : 'Tutup'}
                                    </span>
                                </div>

                                <div className="mt-auto pt-4 border-t border-gray-50 space-y-2.5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Deadline</span>
                                        <span className="font-medium text-gray-900">{assignment.deadline.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Status</span>
                                        <span className={`font-medium ${assignment.reports.length > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                                            {assignment.reports.length > 0 ? 'Sudah Kumpul' : 'Belum Kumpul'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
                {assignments.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-xl bg-gray-50/50">
                        <FileText className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Belum ada tugas praktikum</h3>
                        <p className="text-sm text-gray-500 max-w-sm mt-2">
                            Anda belum memiliki tugas praktikum aktif saat ini.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
