'use client';

import { Trash2, FileText, ExternalLink, Edit } from 'lucide-react';

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
    if (documents.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                Belum ada dokumen.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
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
    );
}
