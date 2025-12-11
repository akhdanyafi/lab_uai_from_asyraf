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
import { getSessionById } from '@/lib/actions/practicum';
import { getClassSessions } from '@/lib/actions/academic';

interface Session {
    id: number;
    classId: number;
    moduleId: number;
    startDate: Date;
    deadline: Date;
    isOpen: boolean | null;
    module: {
        title: string;
    };
}

interface SessionListProps {
    classId: number;
}

export default function SessionList({ classId }: SessionListProps) {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedSessionId, setExpandedSessionId] = useState<number | null>(null);
    const [reports, setReports] = useState<any[]>([]);
    const [loadingReports, setLoadingReports] = useState(false);

    useEffect(() => {
        const fetchSessions = async () => {
            setLoading(true);
            try {
                // We need to fetch sessions for this class.
                // Assuming getClassSessions returns the list we need.
                const data = await getClassSessions(classId);
                setSessions(data);
            } catch (error) {
                console.error("Failed to fetch sessions:", error);
            } finally {
                setLoading(false);
            }
        };

        if (classId) {
            fetchSessions();
            setExpandedSessionId(null); // Reset expansion on class change
        }
    }, [classId]);

    const toggleSession = async (sessionId: number) => {
        if (expandedSessionId === sessionId) {
            setExpandedSessionId(null);
            return;
        }

        setExpandedSessionId(sessionId);
        setLoadingReports(true);
        try {
            const data = await getSessionById(sessionId);
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

    if (sessions.length === 0) {
        return (
            <div className="text-center p-8 border rounded-lg bg-muted/10">
                <p className="text-muted-foreground">Belum ada sesi praktikum untuk kelas ini.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {sessions.map((session) => (
                <Card key={session.id} className="overflow-hidden transition-all">
                    <div
                        className="p-4 cursor-pointer hover:bg-muted/50 flex items-center justify-between"
                        onClick={() => toggleSession(session.id)}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${session.isOpen ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-gray-900">{session.module.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                    <span>
                                        {format(new Date(session.startDate), 'dd MMM yyyy')} - {format(new Date(session.deadline), 'dd MMM yyyy')}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant={session.isOpen ? "default" : "secondary"}>
                                {session.isOpen ? "Aktif" : "Selesai"}
                            </Badge>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                                {expandedSessionId === session.id ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                    {expandedSessionId === session.id && (
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
