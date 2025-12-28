'use client';

import { useState } from 'react';
import { createClass, getLecturers } from '@/features/academic/actions';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

/**
 * Academic Form (Simplified)
 * 
 * UPDATED FOR SIMPLIFIED SCHEMA:
 * - Removed "Create Course" tab (courses merged into classes)
 * - Class form now includes courseCode and courseName directly
 * - enrollmentKey auto-generated on creation
 */

interface AcademicFormProps {
    lecturers: any[];
}

export default function AcademicForm({ lecturers }: AcademicFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleCreateClass(formData: FormData) {
        setLoading(true);
        try {
            const courseCode = formData.get('courseCode') as string;
            const courseName = formData.get('courseName') as string;
            const lecturerId = parseInt(formData.get('lecturerId') as string);
            const name = formData.get('name') as string;
            const semester = formData.get('semester') as string;

            await createClass({ courseCode, courseName, lecturerId, name, semester });
            router.push('/admin/practicum');
            router.refresh();
        } catch (e) {
            console.error(e);
            alert('Gagal membuat kelas: ' + e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Buat Kelas Baru</h2>
            <form action={handleCreateClass} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Kode Mata Kuliah</label>
                        <input
                            type="text"
                            name="courseCode"
                            required
                            placeholder="Contoh: IF123"
                            className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama Mata Kuliah</label>
                        <input
                            type="text"
                            name="courseName"
                            required
                            placeholder="Contoh: Pemrograman Web"
                            className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dosen Pengampu</label>
                    <select name="lecturerId" required className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors">
                        <option value="">Pilih Dosen</option>
                        {lecturers.map(l => (
                            <option key={l.id} value={l.id}>{l.fullName}</option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama Kelas</label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="Contoh: IF-22A"
                            className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                        <input
                            type="text"
                            name="semester"
                            required
                            placeholder="Contoh: Ganjil 2024/2025"
                            className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors"
                        />
                    </div>
                </div>
                <p className="text-sm text-gray-500">
                    💡 Kode enrollment akan di-generate otomatis saat kelas dibuat. Share kode tersebut ke mahasiswa agar bisa self-enroll.
                </p>
                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Menyimpan...' : 'Buat Kelas'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
