'use client';

import { useState, useEffect } from 'react';
import { Package, Loader2 } from 'lucide-react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import { getClassAssignments } from '@/features/academic/actions';
import Link from 'next/link';

/**
 * AssignmentList (Replaces ModuleList)
 * 
 * UPDATED FOR SIMPLIFIED SCHEMA:
 * - Modules are now embedded in Assignments
 * - Uses classId instead of courseId
 * - Uses getClassAssignments instead of getCourseModules
 */

interface Assignment {
    id: number;
    title: string;
    description: string | null;
    filePath: string | null;
    order: number;
    startDate: Date;
    deadline: Date;
    isOpen: boolean;
}

interface ModuleListProps {
    classId: number;
    // Legacy prop for backward compatibility
    courseId?: number;
}

export default function ModuleList({ classId, courseId }: ModuleListProps) {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);

    // Use classId, fallback to courseId for backward compatibility
    const targetId = classId || courseId;

    useEffect(() => {
        const fetchAssignments = async () => {
            setLoading(true);
            try {
                if (targetId) {
                    const data = await getClassAssignments(targetId);
                    setAssignments(data as unknown as Assignment[]);
                }
            } catch (error) {
                console.error("Failed to fetch assignments:", error);
            } finally {
                setLoading(false);
            }
        };

        if (targetId) {
            fetchAssignments();
        } else {
            setLoading(false);
        }
    }, [targetId]);

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    }

    if (assignments.length === 0) {
        return (
            <div className="text-center p-8 border rounded-lg bg-muted/10">
                <p className="text-muted-foreground">Belum ada tugas untuk kelas ini.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {assignments.map((assignment) => (
                <Card key={assignment.id} className="flex flex-col">
                    <CardHeader className="pb-3 flex-row gap-4 space-y-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${assignment.isOpen
                                ? 'bg-green-50 text-green-600'
                                : 'bg-red-50 text-red-600'
                            }`}>
                            <Package className="h-5 w-5" />
                        </div>
                        <div className="overflow-hidden">
                            <CardTitle className="text-base font-semibold text-gray-900 line-clamp-1" title={assignment.title}>
                                {assignment.title}
                            </CardTitle>
                            <p className="text-xs mt-1">
                                <span className={assignment.isOpen ? 'text-green-600' : 'text-red-600'}>
                                    {assignment.isOpen ? '● Aktif' : '○ Ditutup'}
                                </span>
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                            {assignment.description || "Tidak ada deskripsi"}
                        </p>
                        {assignment.filePath && (
                            <div className="pt-4 border-t border-gray-50 mt-auto">
                                <Link
                                    href={assignment.filePath}
                                    target="_blank"
                                    className="flex items-center gap-2 text-sm text-[#0F4C81] hover:text-blue-700 font-medium w-fit"
                                >
                                    <Package className="h-4 w-4" />
                                    Unduh Soal
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
