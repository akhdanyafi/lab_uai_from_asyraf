'use client';

import Link from 'next/link';
import { createClass, deleteClass } from '@/features/academic/actions';
import { useState } from 'react';
import { Trash2, Plus, Key, Copy } from 'lucide-react';

/**
 * Classes View (Simplified)
 * 
 * UPDATED FOR SIMPLIFIED SCHEMA:
 * - Removed courseId/courses dropdown - now uses direct courseCode/courseName inputs
 * - Shows enrollmentKey for each class
 * - cls.courseCode/cls.courseName instead of cls.course.code/cls.course.name
 */

interface ClassesViewProps {
    classes: any[];
    courses?: any[]; // Deprecated, kept for backward compatibility
    lecturers: any[];
}

export default function ClassesView({ classes, lecturers }: ClassesViewProps) {
    const [isCreating, setIsCreating] = useState(false);

    async function handleCreate(formData: FormData) {
        const courseCode = formData.get('courseCode') as string;
        const courseName = formData.get('courseName') as string;
        const lecturerId = parseInt(formData.get('lecturerId') as string);
        const name = formData.get('name') as string;
        const semester = formData.get('semester') as string;

        await createClass({ courseCode, courseName, lecturerId, name, semester });
        setIsCreating(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Daftar Kelas</h2>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="bg-[#0F4C81] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0F4C81]/90 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    {isCreating ? 'Batal' : 'Tambah Kelas'}
                </button>
            </div>

            {/* Create Form */}
            {isCreating && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-top-2">
                    <h3 className="font-semibold mb-4 text-gray-800">Tambah Kelas Baru</h3>
                    <form action={handleCreate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kode Mata Kuliah</label>
                                <input name="courseCode" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Contoh: IF123" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Mata Kuliah</label>
                                <input name="courseName" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Contoh: Jaringan Komputer" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dosen Pengampu</label>
                                <select name="lecturerId" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white">
                                    <option value="">Pilih Dosen</option>
                                    {lecturers.map(l => (
                                        <option key={l.id} value={l.id}>{l.fullName}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kelas</label>
                                <input name="name" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Contoh: IF-22A" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                                <input name="semester" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Contoh: Ganjil 2024/2025" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">💡 Kode enrollment akan otomatis di-generate saat kelas dibuat.</p>
                        <div className="flex justify-end">
                            <button type="submit" className="bg-[#0F4C81] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#0F4C81]/90 transition-colors">
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700">Kelas</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Mata Kuliah</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Dosen</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Kode Enroll</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {classes.map((cls) => (
                            <tr key={cls.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    <Link href={`/lecturer/classes/${cls.id}`} className="hover:text-blue-600 hover:underline">
                                        {cls.name}
                                    </Link>
                                    <p className="text-xs text-gray-500">{cls.semester}</p>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{cls.courseName} ({cls.courseCode})</td>
                                <td className="px-6 py-4 text-gray-600">{cls.lecturer?.fullName || 'N/A'}</td>
                                <td className="px-6 py-4">
                                    <code className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-mono">
                                        {cls.enrollmentKey}
                                    </code>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <form action={async () => {
                                        await deleteClass(cls.id);
                                    }}>
                                        <button className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        {classes.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    Belum ada kelas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
