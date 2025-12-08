import { getPublications, createPublication, deletePublication } from '@/lib/actions/publications';
import { getSession } from '@/lib/auth';
import { BookOpen, Trash2, ExternalLink, Plus, User } from 'lucide-react';
import PublicationLink from '@/components/publications/PublicationLink';

export default async function PublicationsPage() {
    const session = await getSession();
    const publications = await getPublications();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Galeri Publikasi Mahasiswa</h1>
                    <p className="text-gray-500 mt-2">Karya dan publikasi mahasiswa Informatika UAI</p>
                </div>

                {/* Add Publication Form (Only for students) */}
                {session && session.user.role === 'Mahasiswa' && (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-primary" />
                            Tambah Publikasi
                        </h2>
                        <form action={async (formData) => {
                            'use server';
                            const title = formData.get('title') as string;
                            const authorName = formData.get('authorName') as string;
                            const abstract = formData.get('abstract') as string;
                            const link = formData.get('link') as string;
                            const publishDate = formData.get('publishDate') as string;

                            await createPublication({
                                uploaderId: session!.user.id,
                                authorName,
                                title,
                                abstract: abstract || undefined,
                                link: link || undefined,
                                publishDate: publishDate ? new Date(publishDate) : undefined,
                            });
                        }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Publikasi</label>
                                <input name="title" required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Penulis</label>
                                <input name="authorName" required defaultValue={session.user.fullName} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Publikasi</label>
                                <input type="date" name="publishDate" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link (Opsional)</label>
                                <input type="url" name="link" placeholder="https://..." className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Abstrak (Opsional)</label>
                                <textarea name="abstract" rows={3} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                            </div>
                            <div className="md:col-span-2">
                                <button type="submit" className="bg-[#0F4C81] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0F4C81]/90 transition-colors">
                                    Tambah Publikasi
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Publications Grid */}
                {publications.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Belum ada publikasi.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {publications.map((pub) => (
                            <div key={pub.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <BookOpen className="w-6 h-6 text-primary" />
                                    </div>
                                    {session && session.user.id === pub.uploaderId && (
                                        <form action={async () => {
                                            'use server';
                                            await deletePublication(pub.id);
                                        }}>
                                            <button className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </form>
                                    )}
                                </div>

                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{pub.title}</h3>

                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                    <User className="w-4 h-4" />
                                    <span>{pub.authorName}</span>
                                </div>

                                {pub.abstract && (
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{pub.abstract}</p>
                                )}

                                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                    {pub.publishDate && (
                                        <span>{new Date(pub.publishDate).toLocaleDateString('id-ID')}</span>
                                    )}
                                </div>

                                {pub.link && (
                                    <PublicationLink
                                        id={pub.id}
                                        url={pub.link}
                                        className="inline-flex items-center gap-1 text-primary hover:text-blue-700 text-sm font-medium"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Lihat Publikasi
                                    </PublicationLink>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
