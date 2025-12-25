'use client';

import { useState } from 'react';
import { createCourse, createClass } from '@/features/academic/actions';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AcademicFormProps {
    courses: any[];
    lecturers: any[];
}

export default function AcademicForm({ courses, lecturers }: AcademicFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleCreateCourse(formData: FormData) {
        setLoading(true);
        try {
            const code = formData.get('code') as string;
            const name = formData.get('name') as string;
            await createCourse({ code, name });
            router.refresh();
            // Optional: Show success message
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateClass(formData: FormData) {
        setLoading(true);
        try {
            const courseId = parseInt(formData.get('courseId') as string);
            const lecturerId = parseInt(formData.get('lecturerId') as string);
            const name = formData.get('name') as string;
            const semester = formData.get('semester') as string;

            await createClass({ courseId, lecturerId, name, semester });
            router.push('/admin/practicum'); // Redirect to practicum dashboard to see it
            router.refresh();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <Tabs defaultValue="class">
                <TabsList className="mb-4">
                    <TabsTrigger value="class">Buat Kelas Baru</TabsTrigger>
                    <TabsTrigger value="course">Buat Mata Kuliah Baru</TabsTrigger>
                </TabsList>

                <TabsContent value="class">
                    <form action={handleCreateClass} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mata Kuliah</label>
                            <select name="courseId" required className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors">
                                <option value="">Pilih Mata Kuliah</option>
                                {courses.map(c => (
                                    <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                                ))}
                            </select>
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Kelas</label>
                            <input type="text" name="name" required placeholder="Contoh: IF-22A" className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                            <input type="text" name="semester" required placeholder="Contoh: Ganjil 2024/2025" className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors" />
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Menyimpan...' : 'Buat Kelas'}
                            </Button>
                        </div>
                    </form>
                </TabsContent>

                <TabsContent value="course">
                    <form action={handleCreateCourse} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kode Mata Kuliah</label>
                            <input type="text" name="code" required placeholder="Contoh: IF123" className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Mata Kuliah</label>
                            <input type="text" name="name" required placeholder="Contoh: Pemrograman Web" className="w-full p-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors" />
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Menyimpan...' : 'Buat Mata Kuliah'}
                            </Button>
                        </div>
                    </form>
                </TabsContent>
            </Tabs>
        </div>
    );
}
