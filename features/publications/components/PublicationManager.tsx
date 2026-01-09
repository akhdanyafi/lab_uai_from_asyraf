'use client';

import { useState, useTransition, useMemo } from 'react';
import { BookOpen, Clock, CheckCircle, XCircle, Plus, Trash2, Send, ExternalLink, FileText, Upload, X, Search, Edit, Eye } from 'lucide-react';
import { createPublication, approvePublication, rejectPublication, deletePublication, updatePublication } from '@/features/publications/actions';
import LikeButton from './LikeButton';

interface Publication {
    id: number;
    title: string;
    authorName: string;
    abstract?: string | null;
    keywords?: string | null;
    link?: string | null;
    filePath?: string | null;
    status: 'Pending' | 'Published' | 'Rejected';
    viewCount: number;
    publishDate?: Date | null;
    createdAt?: Date | null;
    uploaderName?: string | null;
}

interface PendingSubmission {
    publication: Publication;
    submitterName?: string | null;
    submitterIdentifier?: string | null;
}

interface Props {
    publications: Publication[];
    pendingSubmissions: PendingSubmission[];
    userId: number;
}

export default function PublicationManager({ publications, pendingSubmissions, userId }: Props) {
    const [activeTab, setActiveTab] = useState<'upload' | 'pending' | 'all'>('pending');
    const [isPending, startTransition] = useTransition();
    const [selectedSubmission, setSelectedSubmission] = useState<PendingSubmission | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [filterKeyword, setFilterKeyword] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('');

    // Extract all unique keywords from publications
    const allKeywords = useMemo(() => {
        const keywordSet = new Set<string>();
        publications.forEach(pub => {
            if (pub.keywords) {
                try {
                    const kws = JSON.parse(pub.keywords);
                    kws.forEach((kw: string) => keywordSet.add(kw));
                } catch { }
            }
        });
        return Array.from(keywordSet).sort();
    }, [publications]);

    // Filtered publications
    const filteredPublications = useMemo(() => {
        return publications.filter(pub => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                if (!pub.title.toLowerCase().includes(query) && !pub.authorName.toLowerCase().includes(query)) {
                    return false;
                }
            }
            // Keyword filter
            if (filterKeyword && pub.keywords) {
                if (!pub.keywords.includes(filterKeyword)) {
                    return false;
                }
            } else if (filterKeyword && !pub.keywords) {
                return false;
            }
            // Status filter
            if (filterStatus && pub.status !== filterStatus) {
                return false;
            }
            return true;
        });
    }, [publications, searchQuery, filterKeyword, filterStatus]);

    // Edit state
    const [editingPublication, setEditingPublication] = useState<Publication | null>(null);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingPublication) return;

        const formData = new FormData(e.currentTarget);
        const title = formData.get('title') as string;
        const authorName = formData.get('authorName') as string;
        const abstract = formData.get('abstract') as string;
        const link = formData.get('link') as string;
        const keywordsRaw = formData.get('keywords') as string;

        // Parse keywords if comma-separated
        let keywords = keywordsRaw;
        if (keywordsRaw && !keywordsRaw.startsWith('[')) {
            keywords = JSON.stringify(keywordsRaw.split(',').map(k => k.trim()).filter(Boolean));
        }

        startTransition(async () => {
            try {
                await updatePublication(editingPublication.id, {
                    title,
                    authorName,
                    abstract: abstract || undefined,
                    link: link || undefined,
                    keywords: keywords || undefined,
                });
                setMessage({ type: 'success', text: 'Publikasi berhasil diperbarui!' });
                setEditingPublication(null);
            } catch {
                setMessage({ type: 'error', text: 'Gagal memperbarui publikasi' });
            }
        });
    };

    const handleApprove = async (formData: FormData) => {
        const id = Number(formData.get('id'));
        const title = formData.get('title') as string;
        const authorName = formData.get('authorName') as string;
        const abstract = formData.get('abstract') as string;
        const link = formData.get('link') as string;
        const keywords = formData.get('keywords') as string;
        const filePath = formData.get('filePath') as string;

        startTransition(async () => {
            try {
                await approvePublication(id, userId, {
                    title,
                    authorName,
                    abstract: abstract || undefined,
                    link: link || undefined,
                    keywords: keywords || undefined,
                    filePath: filePath || undefined,
                });
                setMessage({ type: 'success', text: 'Publikasi berhasil dipublikasikan!' });
                setSelectedSubmission(null);
            } catch {
                setMessage({ type: 'error', text: 'Gagal mempublikasikan' });
            }
        });
    };

    const handleReject = (id: number) => {
        if (!confirm('Tolak pengajuan ini?')) return;
        startTransition(async () => {
            try {
                await rejectPublication(id);
                setMessage({ type: 'success', text: 'Pengajuan ditolak' });
                setSelectedSubmission(null);
            } catch {
                setMessage({ type: 'error', text: 'Gagal menolak' });
            }
        });
    };

    const handleDelete = (id: number) => {
        if (!confirm('Hapus publikasi ini?')) return;
        startTransition(async () => {
            try {
                await deletePublication(id);
                setMessage({ type: 'success', text: 'Publikasi dihapus' });
            } catch {
                setMessage({ type: 'error', text: 'Gagal menghapus' });
            }
        });
    };

    const handleDirectPublish = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get('title') as string;
        const authorName = formData.get('authorName') as string;
        const abstract = formData.get('abstract') as string;
        const link = formData.get('link') as string;
        const keywordsRaw = formData.get('keywords') as string;
        const publishDateStr = formData.get('publishDate') as string;

        const keywords = keywordsRaw
            ? JSON.stringify(keywordsRaw.split(',').map(k => k.trim()).filter(Boolean))
            : undefined;

        startTransition(async () => {
            try {
                let filePath: string | undefined;

                // Upload file if selected
                if (selectedFile) {
                    const uploadFormData = new FormData();
                    uploadFormData.append('file', selectedFile);
                    uploadFormData.append('folder', 'publications');

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

                await createPublication({
                    uploaderId: userId,
                    title,
                    authorName,
                    abstract: abstract || undefined,
                    link: link || undefined,
                    keywords,
                    filePath,
                    publishDate: publishDateStr ? new Date(publishDateStr) : undefined,
                });
                setMessage({ type: 'success', text: 'Publikasi berhasil ditambahkan!' });
                setSelectedFile(null);
                (e.target as HTMLFormElement).reset();
            } catch {
                setMessage({ type: 'error', text: 'Gagal menambahkan publikasi' });
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Message */}
            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'pending'
                        ? 'bg-white text-[#0F4C81] shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Clock className="w-4 h-4" />
                    Pengajuan Pending
                    {pendingSubmissions.length > 0 && (
                        <span className="bg-yellow-100 text-yellow-700 text-xs px-1.5 py-0.5 rounded-full">
                            {pendingSubmissions.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('upload')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'upload'
                        ? 'bg-white text-[#0F4C81] shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Plus className="w-4 h-4" />
                    Upload Langsung
                </button>
                <button
                    onClick={() => setActiveTab('all')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'all'
                        ? 'bg-white text-[#0F4C81] shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <BookOpen className="w-4 h-4" />
                    Semua Publikasi
                </button>
            </div>

            {/* Pending Tab */}
            {activeTab === 'pending' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    {pendingSubmissions.length === 0 ? (
                        <div className="p-8 text-center">
                            <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
                            <p className="text-gray-500">Tidak ada pengajuan yang perlu direview.</p>
                        </div>
                    ) : selectedSubmission ? (
                        // Approval Form
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-semibold text-lg">Review & Publikasikan</h3>
                                <button
                                    onClick={() => setSelectedSubmission(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ← Kembali
                                </button>
                            </div>

                            <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                                <p className="text-sm text-yellow-700">
                                    Diajukan oleh: <strong>{selectedSubmission.submitterName}</strong> ({selectedSubmission.submitterIdentifier})
                                </p>
                            </div>

                            <form action={handleApprove} className="space-y-4">
                                <input type="hidden" name="id" value={selectedSubmission.publication.id} />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                                        <input
                                            name="title"
                                            required
                                            defaultValue={selectedSubmission.publication.title}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Penulis</label>
                                        <input
                                            name="authorName"
                                            required
                                            defaultValue={selectedSubmission.publication.authorName}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                                        <input
                                            name="link"
                                            defaultValue={selectedSubmission.publication.link || ''}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Keywords (JSON)</label>
                                        <input
                                            name="keywords"
                                            defaultValue={selectedSubmission.publication.keywords || ''}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Abstrak</label>
                                        <textarea
                                            name="abstract"
                                            rows={3}
                                            defaultValue={selectedSubmission.publication.abstract || ''}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">File Path (opsional)</label>
                                        <input
                                            name="filePath"
                                            defaultValue={selectedSubmission.publication.filePath || ''}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Publikasikan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleReject(selectedSubmission.publication.id)}
                                        disabled={isPending}
                                        className="bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Tolak
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        // List of pending submissions
                        <div className="divide-y divide-gray-100">
                            {pendingSubmissions.map((sub) => (
                                <div key={sub.publication.id} className="p-4 hover:bg-gray-50">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{sub.publication.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1">{sub.publication.authorName}</p>
                                            <p className="text-xs text-gray-400 mt-2">
                                                Diajukan oleh: {sub.submitterName} • {new Date(sub.publication.createdAt!).toLocaleDateString('id-ID')}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedSubmission(sub)}
                                            className="bg-[#0F4C81] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0F4C81]/90 transition-colors"
                                        >
                                            Review
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Upload Tab */}
            {activeTab === 'upload' && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-[#0F4C81]" />
                        Upload Publikasi Langsung
                    </h2>

                    <form onSubmit={handleDirectPublish} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Publikasi *</label>
                            <input name="title" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Penulis *</label>
                            <input name="authorName" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Publikasi</label>
                            <input type="date" name="publishDate" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Link (opsional)</label>
                            <input type="url" name="link" placeholder="https://..." className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kata Kunci (pisahkan dengan koma)</label>
                            <input name="keywords" placeholder="AI, Machine Learning, Data Science" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>

                        {/* File Upload */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">File Publikasi (PDF)</label>
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
                                {selectedFile ? (
                                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-[#0F4C81]" />
                                            <span className="text-sm text-gray-700">{selectedFile.name}</span>
                                            <span className="text-xs text-gray-400">
                                                ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedFile(null)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center cursor-pointer py-4">
                                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500">Klik untuk upload file PDF</span>
                                        <span className="text-xs text-gray-400 mt-1">Maks. 10MB</span>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    if (file.size > 10 * 1024 * 1024) {
                                                        alert('File terlalu besar (maks. 10MB)');
                                                        return;
                                                    }
                                                    setSelectedFile(file);
                                                }
                                            }}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Abstrak</label>
                            <textarea name="abstract" rows={3} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div className="md:col-span-2">
                            <button type="submit" disabled={isPending} className="bg-[#0F4C81] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#0F4C81]/90 transition-colors disabled:opacity-50 flex items-center gap-2">
                                {isPending ? 'Mengupload...' : 'Publikasikan'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* All Publications Tab */}
            {activeTab === 'all' && (
                <div className="space-y-4">
                    {/* Search & Filter Bar */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex flex-col md:flex-row gap-3">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari judul atau penulis..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                />
                            </div>
                            {/* Keyword Filter */}
                            <select
                                value={filterKeyword}
                                onChange={(e) => setFilterKeyword(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">Semua Kata Kunci</option>
                                {allKeywords.map(kw => (
                                    <option key={kw} value={kw}>{kw}</option>
                                ))}
                            </select>
                            {/* Status Filter */}
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">Semua Status</option>
                                <option value="Published">Published</option>
                                <option value="Pending">Pending</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{filteredPublications.length} dari {publications.length} publikasi</p>
                    </div>

                    {/* Publications Grid */}
                    {filteredPublications.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p>Tidak ada publikasi yang sesuai filter.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredPublications.map((pub) => {
                                const keywords = pub.keywords ? (() => {
                                    try { return JSON.parse(pub.keywords); } catch { return []; }
                                })() : [];

                                return (
                                    <div key={pub.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="w-5 h-5 text-[#0F4C81]" />
                                                <span className={`text-xs px-2 py-0.5 rounded ${pub.status === 'Published' ? 'bg-green-100 text-green-700' :
                                                    pub.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {pub.status}
                                                </span>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => setEditingPublication(pub)}
                                                    className="text-blue-500 hover:text-blue-700 p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(pub.id)}
                                                    className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{pub.title}</h3>
                                        <p className="text-sm text-gray-600 mb-2">{pub.authorName}</p>
                                        {pub.abstract && (
                                            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{pub.abstract}</p>
                                        )}
                                        {keywords.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {keywords.slice(0, 3).map((kw: string, idx: number) => (
                                                    <span key={idx} className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                                        {kw}
                                                    </span>
                                                ))}
                                                {keywords.length > 3 && (
                                                    <span className="text-xs text-gray-400">+{keywords.length - 3}</span>
                                                )}
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Eye className="w-3 h-3" />
                                                    {pub.viewCount}
                                                </span>
                                                <LikeButton
                                                    publicationId={pub.id}
                                                    userId={userId}
                                                />
                                            </div>
                                            {(pub.link || pub.filePath) && (
                                                <a
                                                    href={pub.link || pub.filePath || '#'}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-sm text-[#0F4C81] hover:underline"
                                                >
                                                    <ExternalLink className="w-3 h-3" />
                                                    Lihat
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Edit Modal */}
            {editingPublication && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Edit Publikasi</h3>
                            <button
                                onClick={() => setEditingPublication(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul *</label>
                                    <input
                                        name="title"
                                        required
                                        defaultValue={editingPublication.title}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Penulis *</label>
                                    <input
                                        name="authorName"
                                        required
                                        defaultValue={editingPublication.authorName}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                                    <input
                                        name="link"
                                        defaultValue={editingPublication.link || ''}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kata Kunci</label>
                                    <input
                                        name="keywords"
                                        defaultValue={(() => {
                                            if (!editingPublication.keywords) return '';
                                            try {
                                                const kws = JSON.parse(editingPublication.keywords);
                                                return Array.isArray(kws) ? kws.join(', ') : editingPublication.keywords;
                                            } catch {
                                                return editingPublication.keywords;
                                            }
                                        })()}
                                        placeholder="AI, Machine Learning, Data Science"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Abstrak</label>
                                    <textarea
                                        name="abstract"
                                        rows={3}
                                        defaultValue={editingPublication.abstract || ''}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="bg-[#0F4C81] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#0F4C81]/90 transition-colors disabled:opacity-50"
                                >
                                    {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingPublication(null)}
                                    className="text-gray-500 hover:text-gray-700 px-6 py-2 rounded-lg text-sm font-medium"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
