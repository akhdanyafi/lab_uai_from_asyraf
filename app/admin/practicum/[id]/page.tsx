import { getSessionById } from '@/features/academic/practicum';
import GradingTable from './_components/GradingTable';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar, Clock, BookOpen, Users } from 'lucide-react';

export default async function PracticumDetailPage({ params }: { params: { id: string } }) {
    const session = await getSessionById(parseInt(params.id));

    if (!session) {
        notFound();
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">{session.module.title}</h1>
                        <div className="flex items-center gap-4 text-gray-600 text-sm">
                            <div className="flex items-center gap-1.5">
                                <BookOpen className="w-4 h-4" />
                                <span>{session.module.course.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Users className="w-4 h-4" />
                                <span>{session.class.name}</span>
                            </div>
                        </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${session.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {session.isOpen ? 'Aktif' : 'Ditutup'}
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase">Mulai</p>
                            <p className="font-medium text-gray-900">{format(new Date(session.startDate), 'dd MMMM yyyy HH:mm', { locale: id })}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase">Deadline</p>
                            <p className="font-medium text-gray-900">{format(new Date(session.deadline), 'dd MMMM yyyy HH:mm', { locale: id })}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs (Simplified for now, just showing Grading Table) */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-800">Penilaian & Laporan</h2>
                <GradingTable reports={session.reports} />
            </div>
        </div>
    );
}
