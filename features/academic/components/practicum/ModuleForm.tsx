'use client';

import { useState } from 'react';
import { createAssignment, getClasses } from '@/features/academic/actions';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

/**
 * Assignment Form (Simplified)
 * 
 * REPLACES OLD ModuleForm.tsx
 * - Module info now embedded in Assignment
 * - One-stop workflow: title + description + file + deadline in one form
 * - No need to create "Bank Soal" separately
 */

interface AssignmentFormProps {
    classes: any[];
    redirectTo?: string;
}

export default function AssignmentForm({ classes, redirectTo = '/admin/practicum' }: AssignmentFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultClassId = searchParams.get('classId');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        try {
            const classId = parseInt(formData.get('classId') as string);
            const title = formData.get('title') as string;
            const description = formData.get('description') as string;
            const filePath = formData.get('filePath') as string;
            const order = parseInt(formData.get('order') as string);
            const startDate = new Date(formData.get('startDate') as string);
            const deadline = new Date(formData.get('deadline') as string);

            await createAssignment({
                classId,
                title,
                description,
                filePath: filePath || undefined,
                order,
                startDate,
                deadline
            });

            setLoading(false);
            router.push(redirectTo);
        } catch (e) {
            console.error(e);
            alert('Gagal membuat tugas: ' + e);
            setLoading(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kelas</label>
                    <select
                        name="classId"
                        required
                        defaultValue={defaultClassId || ""}
                        className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors"
                    >
                        <option value="">Pilih Kelas</option>
                        {classes.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.courseName} - {c.name} ({c.semester})
                            </option>
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
                    <p className="text-xs text-muted-foreground mt-1">Masukkan link langsung ke file PDF soal. Bisa diisi nanti.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
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
                <Button variant="ghost" type="button" onClick={() => router.back()}>
                    Batal
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Menyimpan...' : 'Simpan Tugas'}
                </Button>
            </div>
        </form>
    );
}
