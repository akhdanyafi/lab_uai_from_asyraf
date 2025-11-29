'use client';

import Link from 'next/link';
import { Plus, Calendar, Clock, CheckCircle, XCircle, PlayCircle } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface PracticumViewProps {
    sessions: any[];
}

export default function PracticumView({ sessions }: PracticumViewProps) {
    const getStatus = (start: Date, end: Date, isOpen: boolean) => {
        const now = new Date();
        if (!isOpen) return { label: 'Ditutup', color: 'bg-red-100 text-red-700', icon: XCircle };
        if (now > end) return { label: 'Selesai', color: 'bg-gray-100 text-gray-700', icon: CheckCircle };
        if (now < start) return { label: 'Belum Mulai', color: 'bg-yellow-100 text-yellow-700', icon: Clock };
        return { label: 'Sedang Berjalan', color: 'bg-green-100 text-green-700', icon: PlayCircle };
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Jadwal Praktikum</h2>
                <Link
                    href="/admin/practicum/create"
                    className="flex items-center gap-2 bg-[#0F4C81] text-white px-4 py-2 rounded-lg hover:bg-[#0F4C81]/90 transition-colors text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    <span>Buat Sesi Baru</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Modul & Mata Kuliah</th>
                            <th className="p-4 font-semibold text-gray-600">Kelas</th>
                            <th className="p-4 font-semibold text-gray-600">Jadwal</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sessions.map((session) => {
                            const status = getStatus(new Date(session.startDate), new Date(session.deadline), session.isOpen || false);
                            return (
                                <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-gray-900">{session.module.title}</div>
                                        <div className="text-sm text-gray-500">{session.module.course.name}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm font-medium">
                                            {session.class.name}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Calendar className="w-3 h-3" />
                                            {format(new Date(session.startDate), 'dd MMM yyyy', { locale: id })}
                                        </div>
                                        <div className="flex items-center gap-2 text-red-600">
                                            <Clock className="w-3 h-3" />
                                            {format(new Date(session.deadline), 'dd MMM yyyy HH:mm', { locale: id })}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                            <status.icon className="w-3 h-3" />
                                            {status.label}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <Link
                                            href={`/admin/practicum/${session.id}`}
                                            className="text-[#0F4C81] hover:underline text-sm font-medium"
                                        >
                                            Detail
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                        {sessions.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    Belum ada sesi praktikum yang dibuat.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
