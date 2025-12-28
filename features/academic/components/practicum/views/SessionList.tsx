'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ReportList from './ReportList';
import { getAssignmentById, getClassAssignments } from '@/features/academic/actions';

/**
 * Session List (Simplified - Now Assignment List)
 * 
 * UPDATED FOR SIMPLIFIED SCHEMA:
 * - Uses Assignment interface instead of Session
 * - title is directly on assignment (no module.title)
 * - Uses getClassAssignments and getAssignmentById
 */

interface Assignment {
    id: number;
    classId: number;
    title: string;
    description: string | null;
    filePath: string | null;
    order: number;
    startDate: Date;
    deadline: Date;
    isOpen: boolean;
    reports?: any[];
}

interface SessionListProps {
    classId: number;
}

export default function SessionList({ classId }: SessionListProps) {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedAssignmentId, setExpandedAssignmentId] = useState<number | null>(null);
    const [reports, setReports] = useState<any[]>([]);
    const [loadingReports, setLoadingReports] = useState(false);

    useEffect(() => {
        const fetchAssignments = async () => {
            setLoading(true);
            try {
                const data = await getClassAssignments(classId);
                setAssignments(data as unknown as Assignment[]);
            } catch (error) {
                console.error("Failed to fetch assignments:", error);
            } finally {
                setLoading(false);
            }
        };

        if (classId) {
            fetchAssignments();
            setExpandedAssignmentId(null);
        }
    }, [classId]);

    const toggleAssignment = async (assignmentId: number) => {
        if (expandedAssignmentId === assignmentId) {
            setExpandedAssignmentId(null);
            return;
        }

        setExpandedAssignmentId(assignmentId);
        setLoadingReports(true);
        try {
            const data = await getAssignmentById(assignmentId);
            if (data) {
                setReports(data.reports);
            }
        } catch (error) {
            console.error("Failed to fetch reports:", error);
        } finally {
            setLoadingReports(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    }

    if (assignments.length === 0) {
        return (
            <div className="text-center p-8 border rounded-lg bg-muted/10">
                <p className="text-muted-foreground">Belum ada tugas praktikum untuk kelas ini.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {assignments.map((assignment) => (
                <Card key={assignment.id} className="overflow-hidden transition-all">
                    <div
                        className="p-4 cursor-pointer hover:bg-muted/50 flex items-center justify-between"
                        onClick={() => toggleAssignment(assignment.id)}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${assignment.isOpen ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-gray-900">{assignment.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                    <span>
                                        {format(new Date(assignment.startDate), 'dd MMM yyyy')} - {format(new Date(assignment.deadline), 'dd MMM yyyy')}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant={assignment.isOpen ? "default" : "secondary"}>
                                {assignment.isOpen ? "Aktif" : "Selesai"}
                            </Badge>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                                {expandedAssignmentId === assignment.id ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                    {expandedAssignmentId === assignment.id && (
                        <div className="border-t bg-muted/5 p-4 animate-in slide-in-from-top-2 duration-200">
                            <div className="mb-4">
                                <h4 className="text-sm font-medium mb-2">Laporan Mahasiswa</h4>
                                {loadingReports ? (
                                    <div className="flex justify-center p-4">
                                        <Loader2 className="animate-spin h-4 w-4 text-muted-foreground" />
                                    </div>
                                ) : (
                                    <ReportList reports={reports} />
                                )}
                            </div>
                        </div>
                    )}
                </Card>
            ))}
        </div>
    );
}
