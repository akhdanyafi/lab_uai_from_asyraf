'use client';

import { useState } from 'react';
import { createAssignment } from '@/features/academic/actions';
import { useRouter } from 'next/navigation';

/**
 * Session Form (Simplified - Now Assignment Form)
 * 
 * UPDATED FOR SIMPLIFIED SCHEMA:
 * - No longer needs moduleId - creates assignment with embedded content
 * - Uses createAssignment with title, description, filePath, deadline
 * - One-stop workflow: all info in one form
 */

interface SessionFormProps {
    classes: any[];
    modules?: any[]; // Deprecated, kept for backward compatibility
    redirectTo?: string;
}

export default function SessionForm({ classes, redirectTo = '/admin/practicum' }: SessionFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        const classId = parseInt(formData.get('classId') as string);
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const filePath = formData.get('filePath') as string;
        const order = parseInt(formData.get('order') as string || '1');
        const startDate = new Date(formData.get('startDate') as string);
        const deadline = new Date(formData.get('deadline') as string);

        await createAssignment({
            classId,
            title,
            description: description || undefined,
            filePath: filePath || undefined,
            order,
            startDate,
            deadline
        });
        setLoading(false);
        router.push(redirectTo);
    }

    return (
        <form action={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kelas</label>
                    <select name="classId" required className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors">
                        <option value="">Pilih Kelas</option>
                        {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name} - {c.courseName}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Judul Tugas</label>
                    <input
                        type="text"
                        name="title"
                        required
                        placeholder="Contoh: Praktikum 1 - Pengenalan Jaringan"
                        className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                    <textarea
                        name="description"
                        rows={3}
                        placeholder="Petunjuk pengerjaan tugas..."
                        className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors"
                    ></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Link File Soal (Opsional)</label>
                    <input
                        type="url"
                        name="filePath"
                        placeholder="https://example.com/soal.pdf"
                        className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Urutan</label>
                        <input
                            type="number"
                            name="order"
                            defaultValue="1"
                            min="1"
                            className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
                        <input
                            type="datetime-local"
                            name="startDate"
                            required
                            className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Batas Waktu (Deadline)</label>
                        <input
                            type="datetime-local"
                            name="deadline"
                            required
                            className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#0F4C81] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0F4C81]/90 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Menyimpan...' : 'Buat Tugas'}
                </button>
            </div>
        </form>
    );
}
