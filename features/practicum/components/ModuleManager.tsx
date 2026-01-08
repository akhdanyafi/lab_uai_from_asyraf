'use client';

import { useState, useTransition, useMemo } from 'react';
import { BookOpen, Plus, Trash2, Edit, Upload, X, Search, FileText, ExternalLink } from 'lucide-react';
import { createModule, updateModule, deleteModule } from '@/features/practicum/actions';
import type { PracticumModule } from '@/features/practicum/types';

interface ModuleManagerProps {
    modules: PracticumModule[];
    allSubjects: string[];
}

export default function ModuleManager({ modules, allSubjects }: ModuleManagerProps) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingModule, setEditingModule] = useState<PracticumModule | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Search & Filter
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSubject, setFilterSubject] = useState('');

    // Filtered modules
    const filteredModules = useMemo(() => {
        return modules.filter(m => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                if (!m.name.toLowerCase().includes(query)) {
                    return false;
                }
            }
            // Subject filter
            if (filterSubject && m.subjects) {
                if (!m.subjects.includes(filterSubject)) {
                    return false;
                }
            } else if (filterSubject && !m.subjects) {
                return false;
            }
            return true;
        });
    }, [modules, searchQuery, filterSubject]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const subjectsRaw = formData.get('subjects') as string;

        // Parse subjects
        const subjects = subjectsRaw
            ? subjectsRaw.split(',').map(s => s.trim()).filter(Boolean)
            : [];

        startTransition(async () => {
            try {
                let filePath: string | undefined;

                // Upload file if selected
                if (selectedFile) {
                    const uploadFormData = new FormData();
                    uploadFormData.append('file', selectedFile);
                    uploadFormData.append('folder', 'practicum');

                    const uploadRes = await fetch('/api/upload', {
                        method: 'POST',
                        body: uploadFormData,
                    });

                    if (!uploadRes.ok) {
                        throw new Error('Gagal mengupload file');
                    }

                    const uploadData = await uploadRes.json();
                    filePath = uploadData.path;
                }

                if (editingModule) {
                    await updateModule(editingModule.id, {
                        name,
                        description: description || undefined,
                        subjects: subjects.length > 0 ? subjects : undefined,
                        filePath: filePath || undefined,
                    });
                    setMessage({ type: 'success', text: 'Modul berhasil diperbarui!' });
                } else {
                    await createModule({
                        name,
                        description: description || undefined,
                        subjects: subjects.length > 0 ? subjects : undefined,
                        filePath,
                    });
                    setMessage({ type: 'success', text: 'Modul berhasil ditambahkan!' });
                }

                setShowForm(false);
                setEditingModule(null);
                setSelectedFile(null);
            } catch {
                setMessage({ type: 'error', text: 'Gagal menyimpan modul' });
            }
        });
    };

    const handleDelete = (id: number) => {
        if (!confirm('Hapus modul ini?')) return;
        startTransition(async () => {
            try {
                await deleteModule(id);
                setMessage({ type: 'success', text: 'Modul berhasil dihapus!' });
            } catch {
                setMessage({ type: 'error', text: 'Gagal menghapus modul' });
            }
        });
    };

    const handleEdit = (module: PracticumModule) => {
        setEditingModule(module);
        setShowForm(true);
        setSelectedFile(null);
    };

    const parseSubjects = (subjects: string | null): string[] => {
        if (!subjects) return [];
        try {
            const parsed = JSON.parse(subjects);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Modul Praktikum</h1>
                    <p className="text-gray-500 text-sm mt-1">Kelola modul praktikum laboratorium</p>
                </div>
                <button
                    onClick={() => { setShowForm(true); setEditingModule(null); }}
                    className="bg-[#0F4C81] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0F4C81]/90 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Modul
                </button>
            </div>

            {/* Message */}
            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingModule ? 'Edit Modul' : 'Tambah Modul Baru'}
                            </h3>
                            <button onClick={() => { setShowForm(false); setEditingModule(null); }} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Modul *</label>
                                <input
                                    name="name"
                                    required
                                    defaultValue={editingModule?.name || ''}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Modul 1 - Dasar Kriptografi"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Matakuliah</label>
                                <input
                                    name="subjects"
                                    defaultValue={parseSubjects(editingModule?.subjects || null).join(', ')}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Kriptografi, Komputasi Awan (pisahkan dengan koma)"
                                />
                                <p className="text-xs text-gray-500 mt-1">Pisahkan dengan koma jika lebih dari satu</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {editingModule ? 'File (Opsional - biarkan kosong jika tidak ingin mengubah)' : 'File'}
                                </label>
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    {selectedFile ? (
                                        <div className="flex items-center justify-center gap-2 text-[#0F4C81]">
                                            <FileText className="w-5 h-5" />
                                            <span className="text-sm">{selectedFile.name}</span>
                                        </div>
                                    ) : editingModule?.filePath ? (
                                        <div className="text-sm text-gray-500">
                                            File saat ini: {editingModule.filePath.split('/').pop()}
                                            <br />
                                            <span className="text-xs">Klik untuk mengganti</span>
                                        </div>
                                    ) : (
                                        <div className="py-4">
                                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500">Klik atau drag file ke sini</p>
                                            <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, PPT, PPTX</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    defaultValue={editingModule?.description || ''}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Deskripsi modul..."
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="bg-[#0F4C81] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#0F4C81]/90 transition-colors disabled:opacity-50"
                                >
                                    {isPending ? 'Menyimpan...' : editingModule ? 'Simpan Perubahan' : 'Tambah Modul'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowForm(false); setEditingModule(null); }}
                                    className="text-gray-500 hover:text-gray-700 px-6 py-2 rounded-lg text-sm font-medium"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Search & Filter */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari modul..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <select
                        value={filterSubject}
                        onChange={(e) => setFilterSubject(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[180px]"
                    >
                        <option value="">Semua Matakuliah</option>
                        {allSubjects.map(subject => (
                            <option key={subject} value={subject}>{subject}</option>
                        ))}
                    </select>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    Menampilkan {filteredModules.length} dari {modules.length} modul
                </p>
            </div>

            {/* Module List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredModules.map((module) => (
                    <div key={module.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-[#0F4C81]" />
                                <h3 className="font-semibold text-gray-900 line-clamp-1">{module.name}</h3>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handleEdit(module)}
                                    className="text-blue-500 hover:text-blue-700 p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(module.id)}
                                    className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Hapus"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        {module.description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{module.description}</p>
                        )}
                        {module.subjects && (
                            <div className="flex flex-wrap gap-1 mb-3">
                                {parseSubjects(module.subjects).map((subject, idx) => (
                                    <span key={idx} className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                        {subject}
                                    </span>
                                ))}
                            </div>
                        )}
                        {module.filePath && (
                            <a
                                href={module.filePath}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-[#0F4C81] hover:underline"
                            >
                                <ExternalLink className="w-3 h-3" />
                                Lihat File
                            </a>
                        )}
                    </div>
                ))}
            </div>

            {filteredModules.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    {searchQuery || filterSubject ? 'Tidak ada modul yang sesuai filter.' : 'Belum ada modul praktikum.'}
                </div>
            )}
        </div>
    );
}
