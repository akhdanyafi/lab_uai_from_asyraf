'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Users, Library, ClipboardList, ChevronDown, Key } from 'lucide-react';
import SessionList from './SessionList';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ModuleList from './ModuleList';
import EnrollmentManager from '../EnrollmentManager';

/**
 * Class Dashboard (Simplified)
 * 
 * UPDATED FOR SIMPLIFIED SCHEMA:
 * - Removed courseId/course - now uses courseCode/courseName embedded in class
 * - Shows enrollmentKey for easy sharing
 * - ModuleList now uses classId instead of courseId
 */

interface ClassData {
    id: number;
    name: string;
    semester: string;
    courseCode: string;
    courseName: string;
    enrollmentKey: string;
}

interface ClassDashboardProps {
    classes: ClassData[];
    basePath?: string;
}

export default function ClassDashboard({ classes, basePath = '/admin/practicum' }: ClassDashboardProps) {
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
                        Kelola tugas, sesi, dan laporan praktikum dalam satu tempat.
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
                        <div className="relative">
                            <select
                                value={selectedClassId || ''}
                                onChange={(e) => setSelectedClassId(Number(e.target.value))}
                                className="appearance-none bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                {classes.map((cls) => (
                                    <option key={cls.id} value={cls.id}>
                                        {cls.name} - {cls.courseName}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            <Separator />

            {selectedClass ? (
                <>
                    {/* Enrollment Key Display */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Key className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-blue-800">Kode Enrollment</p>
                                <p className="text-xs text-blue-600">Bagikan ke mahasiswa untuk self-enroll</p>
                            </div>
                        </div>
                        <code className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-mono text-lg font-bold">
                            {selectedClass.enrollmentKey}
                        </code>
                    </div>

                    <Tabs defaultValue="sessions" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="sessions" className="flex items-center gap-2">
                                <ClipboardList className="h-4 w-4" />
                                Tugas Praktikum
                            </TabsTrigger>
                            <TabsTrigger value="modules" className="flex items-center gap-2">
                                <Library className="h-4 w-4" />
                                Daftar Tugas
                            </TabsTrigger>
                            <TabsTrigger value="enrollments" className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Peserta
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="sessions" className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Daftar Tugas Praktikum</h2>
                            </div>
                            <SessionList classId={selectedClass.id} />
                        </TabsContent>

                        <TabsContent value="modules" className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Daftar Tugas - {selectedClass.courseName}</h2>
                            </div>
                            <ModuleList classId={selectedClass.id} />
                        </TabsContent>

                        <TabsContent value="enrollments">
                            <EnrollmentManager classId={selectedClass.id} />
                        </TabsContent>
                    </Tabs>
                </>
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
