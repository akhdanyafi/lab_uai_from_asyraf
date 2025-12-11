'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Users, Library, ClipboardList } from 'lucide-react';
import ClassSelector from '../args/ClassSelector';
import SessionList from './SessionList';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ModuleList from './ModuleList';
import EnrollmentManager from '../EnrollmentManager';

interface Course {
    code: string;
    name: string;
}

interface ClassData {
    id: number;
    name: string;
    semester: string;
    courseId: number;
    course: Course;
}

interface ClassDashboardProps {
    classes: ClassData[];
}

export default function ClassDashboard({ classes }: ClassDashboardProps) {
    const [selectedClassId, setSelectedClassId] = useState<number | undefined>(
        classes.length > 0 ? classes[0].id : undefined
    );

    const selectedClass = classes.find(c => c.id === selectedClassId);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Praktikum</h1>
                    <p className="text-gray-500 mt-1">
                        Kelola modul, sesi, dan laporan praktikum dalam satu tempat.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/academic/create">
                            Kelola Data
                        </Link>
                    </Button>
                    <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200">
                        <span className="text-sm font-medium text-gray-600 pl-2">Kelas:</span>
                        <ClassSelector
                            classes={classes}
                            selectedClassId={selectedClassId}
                            onSelectClass={setSelectedClassId}
                        />
                    </div>
                </div>
            </div>

            <Separator />

            {selectedClass ? (
                <Tabs defaultValue="sessions" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="sessions" className="flex items-center gap-2">
                            <ClipboardList className="h-4 w-4" />
                            Sesi Praktikum
                        </TabsTrigger>
                        <TabsTrigger value="modules" className="flex items-center gap-2">
                            <Library className="h-4 w-4" />
                            Modul
                        </TabsTrigger>
                        <TabsTrigger value="enrollments" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Peserta
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="sessions" className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Daftar Sesi Praktikum</h2>
                            <Button asChild size="sm">
                                <Link href="/admin/practicum/create">
                                    <ClipboardList className="mr-2 h-4 w-4" />
                                    Buat Sesi Baru
                                </Link>
                            </Button>
                        </div>
                        <SessionList classId={selectedClass.id} />
                    </TabsContent>

                    <TabsContent value="modules" className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Daftar Modul - {selectedClass.course.name}</h2>
                            <Button size="sm" variant="outline" asChild>
                                <Link href={`/admin/practicum/create-module?courseId=${selectedClass.courseId}`}>
                                    <Library className="mr-2 h-4 w-4" />
                                    Tambah Modul
                                </Link>
                            </Button>
                        </div>
                        <ModuleList courseId={selectedClass.courseId} />
                    </TabsContent>

                    <TabsContent value="enrollments">
                        <EnrollmentManager classId={selectedClass.id} />
                    </TabsContent>
                </Tabs>
            ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg bg-muted/5">
                    <Library className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">Belum ada kelas dipilih</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mt-2">
                        Silakan pilih kelas terlebih dahulu menggunakan menu dropdown di atas untuk melihat detail praktikum.
                    </p>
                </div>
            )}
        </div>
    );
}
