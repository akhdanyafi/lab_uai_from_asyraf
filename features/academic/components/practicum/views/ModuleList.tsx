'use client';

import { useState, useEffect } from 'react';
import { Package, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import { getCourseModules } from '@/features/academic/actions';
import Link from 'next/link';

interface Module {
    id: number;
    title: string;
    description: string | null;
    filePath: string;
    order: number;
}

interface ModuleListProps {
    courseId: number;
}

export default function ModuleList({ courseId }: ModuleListProps) {
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchModules = async () => {
            setLoading(true);
            try {
                const data = await getCourseModules(courseId);
                setModules(data);
            } catch (error) {
                console.error("Failed to fetch modules:", error);
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchModules();
        }
    }, [courseId]);

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    }

    if (modules.length === 0) {
        return (
            <div className="text-center p-8 border rounded-lg bg-muted/10">
                <p className="text-muted-foreground">Belum ada modul untuk mata kuliah ini.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
                <Card key={module.id} className="flex flex-col">
                    <CardHeader className="pb-3 flex-row gap-4 space-y-0">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600 shrink-0">
                            <Package className="h-5 w-5" />
                        </div>
                        <div className="overflow-hidden">
                            <CardTitle className="text-base font-semibold text-gray-900 line-clamp-1" title={module.title}>
                                {module.title}
                            </CardTitle>
                            <p className="text-xs text-gray-500 mt-1">Modul Praktikum</p>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                            {module.description || "Tidak ada deskripsi"}
                        </p>
                        <div className="pt-4 border-t border-gray-50 mt-auto">
                            <Link
                                href={module.filePath}
                                target="_blank"
                                className="flex items-center gap-2 text-sm text-[#0F4C81] hover:text-blue-700 font-medium w-fit"
                            >
                                <Package className="h-4 w-4" />
                                Unduh Modul
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
