'use client';

import { deleteDocument } from '@/lib/actions/academic';
import { FileText, Download, Trash2, BookOpen, File, Edit } from 'lucide-react';

interface Document {
    id: number;
    title: string;
    subject: string | null;
    description: string | null;
    filePath: string | null;
    link?: string | null;
    type: string;
    createdAt: Date | null;
    uploaderName: string | null;
}

interface DocumentListProps {
    documents: Document[];
    canDelete?: boolean;
    onEdit?: (doc: Document) => void;
    onDelete?: (id: number) => Promise<void>;
}

export default function DocumentList({ documents, canDelete = false, onEdit, onDelete }: DocumentListProps) {
    if (documents.length === 0) {
        return (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Belum ada dokumen yang tersedia.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
                <div key={doc.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${doc.type === 'Modul Praktikum' ? 'bg-blue-50 text-blue-600' :
                                doc.type === 'Jurnal Publikasi' ? 'bg-purple-50 text-purple-600' :
                                    'bg-green-50 text-green-600'
                                }`}>
                                {doc.type === 'Modul Praktikum' ? <BookOpen className="w-5 h-5" /> :
                                    doc.type === 'Jurnal Publikasi' ? <FileText className="w-5 h-5" /> :
                                        <File className="w-5 h-5" />}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 line-clamp-1" title={doc.title}>{doc.title}</h3>
                                <p className="text-xs text-gray-500 mt-1">
                                    {doc.subject ? doc.subject : doc.type}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        {doc.description && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2" title={doc.description}>
                                {doc.description}
                            </p>
                        )}
                        <div className="text-xs text-gray-400 mb-4">
                            <p>Oleh: {doc.uploaderName}</p>
                            <p>{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                        <div className="flex gap-2">
                            {doc.filePath && (
                                <a
                                    href={doc.filePath}
                                    download
                                    className="flex items-center gap-2 text-sm text-primary hover:text-blue-700 font-medium"
                                >
                                    <Download className="w-4 h-4" />
                                    Unduh
                                </a>
                            )}
                            {doc.link && (
                                <a
                                    href={doc.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-primary hover:text-blue-700 font-medium"
                                >
                                    <FileText className="w-4 h-4" />
                                    Link
                                </a>
                            )}
                        </div>

                        {onEdit && (
                            <button
                                onClick={() => onEdit(doc)}
                                className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                        )}

                        {canDelete && (
                            <form action={async () => {
                                if (confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
                                    if (onDelete) {
                                        await onDelete(doc.id);
                                    } else {
                                        await deleteDocument(doc.id, doc.type);
                                    }
                                }
                            }}>
                                <button className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
