import { format } from 'date-fns';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Report {
    id: number;
    grade: number | null;
    filePath: string;
    submissionDate: Date | null;
    student: {
        fullName: string;
        identifier: string;
    };
    feedback?: string | null;
}

interface ReportListProps {
    reports: Report[];
    onUpdateGrade?: (reportId: number, grade: number) => void;
}

export default function ReportList({ reports, onUpdateGrade }: ReportListProps) {
    if (reports.length === 0) {
        return (
            <div className="p-4 text-center text-muted-foreground border rounded-md bg-muted/20">
                Belum ada laporan yang dikumpulkan.
            </div>
        );
    }

    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Mahasiswa</TableHead>
                        <TableHead>NIM</TableHead>
                        <TableHead>Tanggal Submit</TableHead>
                        <TableHead>File</TableHead>
                        <TableHead>Nilai</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reports.map((report) => (
                        <TableRow key={report.id}>
                            <TableCell className="font-medium">{report.student.fullName}</TableCell>
                            <TableCell>{report.student.identifier}</TableCell>
                            <TableCell>
                                {report.submissionDate ? format(new Date(report.submissionDate), 'dd MMM yyyy HH:mm') : '-'}
                            </TableCell>
                            <TableCell>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={report.filePath} target="_blank">
                                        <FileText className="mr-2 h-4 w-4" />
                                        Lihat
                                    </Link>
                                </Button>
                            </TableCell>
                            <TableCell>
                                {report.grade !== null ? (
                                    <Badge variant={report.grade >= 60 ? "default" : "destructive"}>
                                        {report.grade}
                                    </Badge>
                                ) : (
                                    <span className="text-muted-foreground text-sm">Belum dinilai</span>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
