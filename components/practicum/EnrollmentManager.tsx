'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Trash2, Loader2, Users, CheckSquare, Square } from 'lucide-react';
import { getClassMembers, enrollStudent, unenrollStudent, searchStudents, bulkEnrollStudents } from '@/lib/actions/academic';

interface Student {
    id: number;
    studentId: number; // User ID
    fullName: string;
    identifier: string; // NIM
    email: string;
}

interface SearchResult {
    id: number;
    fullName: string;
    identifier: string;
    email: string;
    batch?: number;
    studyType?: 'Reguler' | 'Hybrid';
}

interface EnrollmentManagerProps {
    classId: number;
}

export default function EnrollmentManager({ classId }: EnrollmentManagerProps) {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [filterBatch, setFilterBatch] = useState<string>('');
    const [filterType, setFilterType] = useState<string>('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Bulk Selection State
    const [selectedStudentIds, setSelectedStudentIds] = useState<Set<number>>(new Set());

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const data = await getClassMembers(classId);
            setStudents(data);
        } catch (error) {
            console.error("Failed to fetch members:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (classId) {
            fetchMembers();
        }
    }, [classId]);

    // Search Effect
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length > 0 || filterBatch || filterType) {
                setIsSearching(true);
                try {
                    const filters = {
                        batch: filterBatch ? parseInt(filterBatch) : undefined,
                        studyType: filterType ? (filterType as 'Reguler' | 'Hybrid') : undefined
                    };

                    const results = await searchStudents(searchQuery, filters);

                    // Filter out already enrolled students
                    const enrolledIds = new Set(students.map(s => s.studentId));
                    const filteredResults = results.filter(r => !enrolledIds.has(r.id));

                    setSearchResults(filteredResults);
                    setSelectedStudentIds(new Set()); // Reset selection on search change
                } catch (error) {
                    console.error("Search failed:", error);
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, filterBatch, filterType, students]);

    const handleEnroll = async (studentId: number) => {
        try {
            await enrollStudent(classId, studentId);
            fetchMembers(); // Refresh list to update exclusion
            // Remove from results to avoid re-adding
            setSearchResults(prev => prev.filter(s => s.id !== studentId));
        } catch (error) {
            alert("Gagal mendaftarkan mahasiswa: " + error);
        }
    };

    const handleBulkEnroll = async () => {
        if (selectedStudentIds.size === 0) return;

        try {
            await bulkEnrollStudents(classId, Array.from(selectedStudentIds));
            setSelectedStudentIds(new Set());
            setSearchResults([]); // Clear Search
            fetchMembers();
            alert(`Berhasil mendaftarkan ${selectedStudentIds.size} mahasiswa.`);
        } catch (error) {
            alert("Gagal bulk enroll: " + error);
        }
    }

    const handleUnenroll = async (studentId: number) => {
        if (!confirm("Hapus mahasiswa dari kelas ini?")) return;
        try {
            await unenrollStudent(classId, studentId);
            fetchMembers();
        } catch (error) {
            alert("Gagal menghapus mahasiswa: " + error);
        }
    };

    const toggleSelectAll = () => {
        if (selectedStudentIds.size === searchResults.length) {
            setSelectedStudentIds(new Set());
        } else {
            setSelectedStudentIds(new Set(searchResults.map(s => s.id)));
        }
    };

    const toggleSelect = (id: number) => {
        const next = new Set(selectedStudentIds);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setSelectedStudentIds(next);
    };

    return (
        <div className="space-y-6">
            {/* Add Student Section */}
            <Card>
                <CardHeader className="pb-3 border-b border-gray-100">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        <UserPlus className="h-4 w-4 text-primary" />
                        Tambah Peserta (Bulk)
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari Nama / NIM..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <div className="w-full md:w-40">
                            <select
                                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                value={filterBatch}
                                onChange={(e) => setFilterBatch(e.target.value)}
                            >
                                <option value="">Semua Angkatan</option>
                                <option value="2021">2021</option>
                                <option value="2022">2022</option>
                                <option value="2023">2023</option>
                                <option value="2024">2024</option>
                            </select>
                        </div>
                        <div className="w-full md:w-40">
                            <select
                                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="">Semua Tipe</option>
                                <option value="Reguler">Reguler</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>
                    </div>

                    {/* Search Results Area */}
                    {(searchResults.length > 0 || isSearching) && (
                        <div className="border rounded-md overflow-hidden">
                            <div className="bg-gray-50 p-2 flex items-center justify-between border-b">
                                <div className="flex items-center gap-2">
                                    <button onClick={toggleSelectAll} className="flex items-center gap-2 text-sm font-medium ml-2">
                                        {searchResults.length > 0 && selectedStudentIds.size === searchResults.length ? (
                                            <CheckSquare className="h-4 w-4 text-primary" />
                                        ) : (
                                            <Square className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        Pilih Semua ({searchResults.length})
                                    </button>
                                </div>
                                {selectedStudentIds.size > 0 && (
                                    <Button size="sm" onClick={handleBulkEnroll}>
                                        Tambahkan {selectedStudentIds.size} Terpilih
                                    </Button>
                                )}
                            </div>

                            {isSearching ? (
                                <div className="p-8 flex justify-center text-muted-foreground">
                                    <Loader2 className="h-6 w-6 animate-spin mr-2" /> Mencari...
                                </div>
                            ) : (
                                <div className="max-h-60 overflow-y-auto">
                                    {searchResults.map((user) => (
                                        <div
                                            key={user.id}
                                            className={`flex items-center justify-between p-3 border-b last:border-0 hover:bg-gray-50 cursor-pointer ${selectedStudentIds.has(user.id) ? 'bg-blue-50' : ''}`}
                                            onClick={() => toggleSelect(user.id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`h-4 w-4 border rounded flex items-center justify-center ${selectedStudentIds.has(user.id) ? 'bg-primary border-primary text-white' : 'border-gray-300'}`}>
                                                    {selectedStudentIds.has(user.id) && <CheckSquare className="h-3 w-3" />}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-sm text-gray-900">{user.fullName}</div>
                                                    <div className="text-xs text-gray-500 flex gap-2">
                                                        <span>{user.identifier}</span>
                                                        {user.batch && <span>• {user.batch}</span>}
                                                        {user.studyType && <span>• {user.studyType}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={(e) => { e.stopPropagation(); handleEnroll(user.id); }}>
                                                Add
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {!isSearching && searchResults.length === 0 && (searchQuery || filterBatch || filterType) && (
                        <div className="text-center p-4 text-muted-foreground text-sm border border-dashed rounded-md">
                            Tidak ditemukan hasil. Coba ubah filter.
                        </div>
                    )}

                </CardContent>
            </Card>

            {/* Enrolled List */}
            <Card>
                <CardHeader className="pb-3 border-b border-gray-100">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        Daftar Peserta ({students.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="animate-spin h-8 w-8 text-primary" />
                        </div>
                    ) : students.length === 0 ? (
                        <div className="text-center p-8 text-muted-foreground">
                            Belum ada peserta di kelas ini.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>NIM</TableHead>
                                    <TableHead>Nama Mahasiswa</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="w-[100px] text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.map((student) => (
                                    <TableRow key={student.studentId}>
                                        <TableCell className="font-medium">{student.identifier}</TableCell>
                                        <TableCell>{student.fullName}</TableCell>
                                        <TableCell>{student.email}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleUnenroll(student.studentId)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
