'use client';

import { useState, useTransition, useMemo } from 'react';
import { GraduationCap, Plus, Trash2, Edit, X, Search, User } from 'lucide-react';
import { createCourse, updateCourse, deleteCourse, assignLecturerToCourse } from '@/features/courses/actions';
import type { CourseWithLecturer } from '@/features/courses/types';

interface Lecturer {
    id: number;
    fullName: string;
    identifier: string;
}

interface CourseManagerProps {
    courses: CourseWithLecturer[];
    lecturers: Lecturer[];
}

export default function CourseManager({ courses, lecturers }: CourseManagerProps) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState<CourseWithLecturer | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCourses = useMemo(() => {
        if (!searchQuery) return courses;
        const query = searchQuery.toLowerCase();
        return courses.filter(c =>
            c.name.toLowerCase().includes(query) ||
            c.code.toLowerCase().includes(query)
        );
    }, [courses, searchQuery]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const code = formData.get('code') as string;
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const sks = parseInt(formData.get('sks') as string) || 3;
        const semester = formData.get('semester') as 'Ganjil' | 'Genap' | '';
        const lecturerId = formData.get('lecturerId') as string;

        startTransition(async () => {
            try {
                if (editingCourse) {
                    await updateCourse(editingCourse.id, {
                        code, name,
                        description: description || undefined,
                        sks, semester: semester || undefined,
                        lecturerId: lecturerId ? parseInt(lecturerId) : null,
                    });
                    setMessage({ type: 'success', text: 'Mata kuliah berhasil diperbarui!' });
                } else {
                    await createCourse({
                        code, name,
                        description: description || undefined,
                        sks, semester: semester || undefined,
                        lecturerId: lecturerId ? parseInt(lecturerId) : undefined,
                    });
                    setMessage({ type: 'success', text: 'Mata kuliah berhasil ditambahkan!' });
                }
                setShowForm(false);
                setEditingCourse(null);
            } catch {
                setMessage({ type: 'error', text: 'Gagal menyimpan mata kuliah' });
            }
        });
    };

    const handleDelete = (id: number) => {
        if (!confirm('Hapus mata kuliah ini?')) return;
        startTransition(async () => {
            try {
                await deleteCourse(id);
                setMessage({ type: 'success', text: 'Mata kuliah berhasil dihapus!' });
            } catch {
                setMessage({ type: 'error', text: 'Gagal menghapus mata kuliah' });
            }
        });
    };

    const handleEdit = (course: CourseWithLecturer) => {
        setEditingCourse(course);
        setShowForm(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mata Kuliah</h1>
                    <p className="text-gray-500 text-sm mt-1">Kelola daftar mata kuliah dan dosen pengajar</p>
                </div>
                <button
                    onClick={() => { setShowForm(true); setEditingCourse(null); }}
                    className="bg-[#0F4C81] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0F4C81]/90 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Mata Kuliah
                </button>
            </div>

            {/* Message */}
            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingCourse ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah Baru'}
                            </h3>
                            <button onClick={() => { setShowForm(false); setEditingCourse(null); }} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kode MK *</label>
                                    <input
                                        name="code"
                                        required
                                        defaultValue={editingCourse?.code || ''}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20"
                                        placeholder="IF201"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">SKS</label>
                                    <input
                                        name="sks"
                                        type="number"
                                        min={1}
                                        max={6}
                                        defaultValue={editingCourse?.sks || 3}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Mata Kuliah *</label>
                                <input
                                    name="name"
                                    required
                                    defaultValue={editingCourse?.name || ''}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20"
                                    placeholder="Basis Data"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                                <select
                                    name="semester"
                                    defaultValue={editingCourse?.semester || ''}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20"
                                >
                                    <option value="">-- Pilih Semester --</option>
                                    <option value="Ganjil">Ganjil</option>
                                    <option value="Genap">Genap</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dosen Pengajar</label>
                                <select
                                    name="lecturerId"
                                    defaultValue={editingCourse?.lecturerId || ''}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20"
                                >
                                    <option value="">-- Belum ditentukan --</option>
                                    {lecturers.map(l => (
                                        <option key={l.id} value={l.id}>{l.fullName} ({l.identifier})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    defaultValue={editingCourse?.description || ''}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20"
                                    placeholder="Deskripsi mata kuliah..."
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="bg-[#0F4C81] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#0F4C81]/90 transition-colors disabled:opacity-50"
                                >
                                    {isPending ? 'Menyimpan...' : editingCourse ? 'Simpan Perubahan' : 'Tambah'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowForm(false); setEditingCourse(null); }}
                                    className="text-gray-500 hover:text-gray-700 px-6 py-2 rounded-lg text-sm font-medium"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari mata kuliah..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20"
                    />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    Menampilkan {filteredCourses.length} dari {courses.length} mata kuliah
                </p>
            </div>

            {/* Course Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-6 py-3 font-semibold text-gray-600">Kode</th>
                                <th className="text-left px-6 py-3 font-semibold text-gray-600">Nama</th>
                                <th className="text-left px-6 py-3 font-semibold text-gray-600">SKS</th>
                                <th className="text-left px-6 py-3 font-semibold text-gray-600">Semester</th>
                                <th className="text-left px-6 py-3 font-semibold text-gray-600">Dosen</th>
                                <th className="text-right px-6 py-3 font-semibold text-gray-600">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredCourses.map((course) => (
                                <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-mono font-semibold bg-blue-50 text-blue-700">
                                            {course.code}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <GraduationCap className="w-4 h-4 text-[#0F4C81]" />
                                            <span className="font-medium text-gray-900">{course.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{course.sks}</td>
                                    <td className="px-6 py-4 text-gray-600">{course.semester || '-'}</td>
                                    <td className="px-6 py-4">
                                        {course.lecturerName ? (
                                            <span className="inline-flex items-center gap-1 text-gray-700">
                                                <User className="w-3 h-3" />
                                                {course.lecturerName}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-xs">Belum ditentukan</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-1">
                                            <button
                                                onClick={() => handleEdit(course)}
                                                className="text-blue-500 hover:text-blue-700 p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(course.id)}
                                                className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredCourses.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    {searchQuery ? 'Tidak ada mata kuliah yang sesuai pencarian.' : 'Belum ada mata kuliah.'}
                </div>
            )}
        </div>
    );
}
