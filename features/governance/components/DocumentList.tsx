'use client';

import { Trash2, FileText, ExternalLink, Edit, Search, X } from 'lucide-react';
import { useState, useMemo } from 'react';

interface Document {
    id: number;
    title: string;
    filePath: string;
    type: string;
    createdAt?: Date | null;
}

interface DocumentListProps {
    documents: Document[];
    onDelete: (id: number) => void;
    onEdit?: (doc: Document) => void;
}

export default function DocumentList({ documents, onDelete, onEdit }: DocumentListProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDocuments = useMemo(() => {
        if (!searchQuery) return documents;
        const query = searchQuery.toLowerCase();
        return documents.filter(doc =>
            doc.title.toLowerCase().includes(query)
        );
    }, [documents, searchQuery]);

    return (
        <div>
            {/* Search */}
            <div className="mb-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari judul dokumen..."
                        className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81]"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
                {searchQuery && (
                    <p className="text-sm text-gray-500 mt-2">
                        Menampilkan {filteredDocuments.length} dari {documents.length} dokumen
                    </p>
                )}
            </div>

            {filteredDocuments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    {searchQuery ? 'Tidak ada hasil pencarian' : 'Belum ada dokumen.'}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredDocuments.map((doc) => (
                        <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <FileText className="w-5 h-5 text-[#0F4C81] flex-shrink-0 mt-0.5" />
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-medium text-gray-900 truncate">{doc.title}</h4>
                                        {doc.createdAt && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(doc.createdAt).toLocaleDateString('id-ID')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <a
                                        href={doc.filePath}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:text-blue-700 p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Lihat File"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                    {onEdit && (
                                        <button
                                            onClick={() => onEdit(doc)}
                                            className="text-gray-500 hover:text-gray-700 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            if (confirm('Hapus dokumen ini?')) {
                                                onDelete(doc.id);
                                            }
                                        }}
                                        className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Hapus"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

