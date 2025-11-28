'use client';

import { uploadDocument, getCourses } from '@/lib/actions/academic';
import { Upload, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';

interface UploadFormProps {
    uploaderId: number;
    allowedTypes: string[];
}

export default function UploadForm({ uploaderId, allowedTypes }: UploadFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedType, setSelectedType] = useState(allowedTypes[0]);
    const [courses, setCourses] = useState<{ id: number; name: string; code: string }[]>([]);

    useEffect(() => {
        if (selectedType === 'Modul Praktikum') {
            getCourses().then(setCourses);
        }
    }, [selectedType]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Upload Dokumen Baru
            </h2>
            <form action={async (formData) => {
                setIsSubmitting(true);
                try {
                    await uploadDocument(formData);
                    const form = document.getElementById('upload-form') as HTMLFormElement;
                    form?.reset();
                    alert('Berhasil mengupload dokumen!');
                } catch (error) {
                    alert('Gagal mengupload dokumen: ' + error);
                    console.error(error);
                } finally {
                    setIsSubmitting(false);
                }
            }} id="upload-form" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="hidden" name="uploaderId" value={uploaderId} />

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul Dokumen</label>
                    <input name="title" required placeholder="Judul..." className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Dokumen</label>
                    <select
                        name="type"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        {allowedTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                {selectedType === 'Modul Praktikum' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mata Kuliah</label>
                        <select name="subject" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20">
                            <option value="">Pilih Mata Kuliah</option>
                            {courses.map(c => (
                                <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                            ))}
                        </select>
                    </div>
                )}

                {selectedType === 'Jurnal Publikasi' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Penulis</label>
                            <input name="authorName" required placeholder="Nama Penulis..." className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Publish</label>
                            <input type="date" name="publishDate" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Link Eksternal (Opsional)</label>
                            <input name="link" placeholder="https://..." className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                    </>
                )}

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {selectedType === 'Jurnal Publikasi' ? 'Abstrak' : 'Deskripsi (Opsional)'}
                    </label>
                    <textarea name="description" rows={3} placeholder={selectedType === 'Jurnal Publikasi' ? 'Ringkasan jurnal...' : 'Keterangan tambahan...'} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">File Dokumen {selectedType === 'Jurnal Publikasi' && '(Opsional jika ada link)'}</label>
                    <input type="file" name="file" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                </div>

                <div className="md:col-span-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 w-full md:w-auto"
                    >
                        {isSubmitting ? 'Mengupload...' : 'Upload Dokumen'}
                    </button>
                </div>
            </form>
        </div>
    );
}
