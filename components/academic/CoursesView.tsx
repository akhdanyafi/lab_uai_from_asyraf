'use client';

import { createCourse, deleteCourse } from '@/lib/actions/academic';
import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

interface CoursesViewProps {
    courses: any[];
}

export default function CoursesView({ courses }: CoursesViewProps) {
    const [isCreating, setIsCreating] = useState(false);

    async function handleCreate(formData: FormData) {
        const code = formData.get('code') as string;
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;

        await createCourse({ code, name, description });
        setIsCreating(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Daftar Mata Kuliah</h2>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="bg-[#0F4C81] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0F4C81]/90 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    {isCreating ? 'Batal' : 'Tambah Mata Kuliah'}
                </button>
            </div>

            {/* Create Form */}
            {isCreating && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-top-2">
                    <h3 className="font-semibold mb-4 text-gray-800">Tambah Mata Kuliah Baru</h3>
                    <form action={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kode MK</label>
                            <input name="code" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Contoh: IF123" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama MK</label>
                            <input name="name" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Contoh: Jaringan Komputer" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                            <input name="description" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Opsional" />
                        </div>
                        <div className="md:col-span-3 flex justify-end">
                            <button type="submit" className="bg-[#0F4C81] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0F4C81]/90 transition-colors">
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
                            <th className="px-6 py-4 font-semibold text-gray-700">Kode</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Nama</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Deskripsi</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {courses.map((course) => (
                            <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{course.code}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{course.name}</td>
                                <td className="px-6 py-4 text-gray-500">{course.description}</td>
                                <td className="px-6 py-4 text-right">
                                    <form action={async () => {
                                        await deleteCourse(course.id);
                                    }}>
                                        <button className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        {courses.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    Belum ada mata kuliah.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
