'use client';

import { useState } from 'react';
import { createModule } from '@/features/academic/actions';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface ModuleFormProps {
    courses: any[];
    redirectTo?: string;
}

export default function ModuleForm({ courses, redirectTo = '/admin/practicum' }: ModuleFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultCourseId = searchParams.get('courseId');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        const courseId = parseInt(formData.get('courseId') as string);
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const filePath = formData.get('filePath') as string;
        const order = parseInt(formData.get('order') as string);

        await createModule({ courseId, title, description, filePath, order });
        setLoading(false);
        router.push(redirectTo);
    }

    return (
        <form action={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mata Kuliah</label>
                    <select
                        name="courseId"
                        required
                        defaultValue={defaultCourseId || ""}
                        className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors"
                    >
                        <option value="">Pilih Mata Kuliah</option>
                        {courses.map(c => (
                            <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Judul Modul</label>
                    <input
                        type="text"
                        name="title"
                        required
                        placeholder="Contoh: Modul 1 - Pengenalan Jaringan"
                        className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                    <textarea
                        name="description"
                        rows={3}
                        className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors"
                    ></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Link File Modul (URL)</label>
                    <input
                        type="url"
                        name="filePath"
                        required
                        placeholder="https://example.com/modul.pdf"
                        className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Masukkan link langsung ke file PDF atau dokumen modul.</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Urutan</label>
                    <input
                        type="number"
                        name="order"
                        required
                        defaultValue="1"
                        min="1"
                        className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button variant="ghost" type="button" onClick={() => router.back()}>
                    Batal
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Menyimpan...' : 'Simpan Modul'}
                </Button>
            </div>
        </form>
    );
}
