'use client';

import { useState } from 'react';
import { updateGrade } from '@/features/academic/practicum';
import { Download, Save } from 'lucide-react';

interface GradingTableProps {
    reports: any[];
}

export default function GradingTable({ reports }: GradingTableProps) {
    const [loading, setLoading] = useState<number | null>(null);

    async function handleGradeChange(reportId: number, grade: number) {
        setLoading(reportId);
        await updateGrade(reportId, grade);
        setLoading(null);
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="p-4 font-semibold text-gray-600">Mahasiswa</th>
                        <th className="p-4 font-semibold text-gray-600">NIM</th>
                        <th className="p-4 font-semibold text-gray-600">Status</th>
                        <th className="p-4 font-semibold text-gray-600">Laporan</th>
                        <th className="p-4 font-semibold text-gray-600">Nilai</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {reports.map((report) => (
                        <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-medium text-gray-900">{report.student.fullName}</td>
                            <td className="p-4 text-gray-600">{report.student.identifier}</td>
                            <td className="p-4">
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                    Submitted
                                </span>
                            </td>
                            <td className="p-4">
                                <a
                                    href={report.filePath}
                                    target="_blank"
                                    className="flex items-center gap-1 text-[#0F4C81] hover:underline text-sm"
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </a>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        defaultValue={report.grade}
                                        min="0"
                                        max="100"
                                        className="w-20 p-1.5 border rounded text-center"
                                        onBlur={(e) => handleGradeChange(report.id, parseInt(e.target.value))}
                                    />
                                    {loading === report.id && (
                                        <span className="text-xs text-gray-500 animate-pulse">Saving...</span>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    {reports.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-gray-500">
                                Belum ada laporan yang dikumpulkan.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
