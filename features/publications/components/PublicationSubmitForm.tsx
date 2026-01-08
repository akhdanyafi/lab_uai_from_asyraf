'use client';

import { useState, useTransition } from 'react';
import { Send, Upload, FileText, X } from 'lucide-react';
import { submitPublication } from '@/features/publications/actions';

interface Props {
    userId: number;
    userName: string;
}

export default function PublicationSubmitForm({ userId, userName }: Props) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage(null);

        const formData = new FormData(e.currentTarget);
        const title = formData.get('title') as string;
        const authorName = formData.get('authorName') as string;
        const abstract = formData.get('abstract') as string;
        const link = formData.get('link') as string;
        const keywordsRaw = formData.get('keywords') as string;

        // Parse keywords
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

                await submitPublication({
                    submitterId: userId,
                    authorName,
                    title,
                    abstract: abstract || undefined,
                    link: link || undefined,
                    keywords,
                    filePath,
                });

                setMessage({ type: 'success', text: 'Publikasi berhasil diajukan! Menunggu review admin.' });
                setSelectedFile(null);
                (e.target as HTMLFormElement).reset();
            } catch (error) {
                setMessage({ type: 'error', text: 'Gagal mengajukan publikasi' });
            }
        });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Send className="w-5 h-5 text-[#0F4C81]" />
                Ajukan Publikasi Baru
            </h2>
            <p className="text-sm text-gray-500 mb-4">
                Pengajuan akan direview oleh Admin/Dosen sebelum dipublikasikan.
            </p>

            {message && (
                <div className={`p-4 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul Publikasi *</label>
                    <input
                        name="title"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Penulis *</label>
                    <input
                        name="authorName"
                        required
                        defaultValue={userName}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Link Publikasi (opsional)</label>
                    <input
                        type="url"
                        name="link"
                        placeholder="https://..."
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kata Kunci (pisahkan dengan koma)</label>
                    <input
                        name="keywords"
                        placeholder="AI, Machine Learning, Data Science"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
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
                    <textarea
                        name="abstract"
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <div className="md:col-span-2">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-[#0F4C81] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#0F4C81]/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <Send className="w-4 h-4" />
                        {isPending ? 'Mengajukan...' : 'Ajukan Publikasi'}
                    </button>
                </div>
            </form>
        </div>
    );
}
