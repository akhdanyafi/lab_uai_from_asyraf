'use client';

import { useState } from 'react';
import { createSession } from '@/lib/actions/practicum';
import { useRouter } from 'next/navigation';

interface SessionFormProps {
    classes: any[];
    modules: any[];
}

export default function SessionForm({ classes, modules }: SessionFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        const classId = parseInt(formData.get('classId') as string);
        const moduleId = parseInt(formData.get('moduleId') as string);
        const startDate = new Date(formData.get('startDate') as string);
        const deadline = new Date(formData.get('deadline') as string);

        await createSession({ classId, moduleId, startDate, deadline });
        setLoading(false);
        router.push('/admin/practicum');
    }

    return (
        <form action={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kelas</label>
                    <select name="classId" required className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors">
                        <option value="">Pilih Kelas</option>
                        {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name} - {c.course.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Modul</label>
                    <select name="moduleId" required className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors">
                        <option value="">Pilih Modul</option>
                        {modules.map(m => (
                            <option key={m.id} value={m.id}>{m.title} ({m.course.name})</option>
                        ))}
                    </select>
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
                    className="bg-[#0F4C81] text-white px-6 py-2 rounded-lg hover:bg-[#0F4C81]/90 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Menyimpan...' : 'Buat Sesi'}
                </button>
            </div>
        </form>
    );
}
