'use client';

import Link from 'next/link';
import { createClass, deleteClass } from '@/lib/actions/academic';
import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

interface ClassesViewProps {
    classes: any[];
    courses: any[];
    lecturers: any[];
}

export default function ClassesView({ classes, courses, lecturers }: ClassesViewProps) {
    const [isCreating, setIsCreating] = useState(false);

    async function handleCreate(formData: FormData) {
        const courseId = parseInt(formData.get('courseId') as string);
        const lecturerId = parseInt(formData.get('lecturerId') as string);
        const name = formData.get('name') as string;
        const semester = formData.get('semester') as string;

        await createClass({ courseId, lecturerId, name, semester });
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
                    <form action={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                        <div className="lg:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mata Kuliah</label>
                            <select name="courseId" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white">
                                <option value="">Pilih MK</option>
                                {courses.map(c => (
                                    <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                                ))}
                            </select>
                        </div>
                        <div className="lg:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dosen</label>
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
                        <div>
                            <button type="submit" className="w-full bg-[#0F4C81] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0F4C81]/90 transition-colors">
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
                            <th className="px-6 py-4 font-semibold text-gray-700">Semester</th>
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
                                </td>
                                <td className="px-6 py-4 text-gray-600">{cls.course.name} ({cls.course.code})</td>
                                <td className="px-6 py-4 text-gray-600">{cls.lecturer.fullName}</td>
                                <td className="px-6 py-4 text-gray-500">{cls.semester}</td>
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
