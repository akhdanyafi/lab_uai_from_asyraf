import { BookOpen, Eye, User } from 'lucide-react';
import PublicationLink from '@/components/publications/PublicationLink';

interface Publication {
    id: number;
    title: string;
    authorName: string;
    viewCount: number;
    link: string | null;
    publishDate: Date | null;
}

interface PublicationSectionProps {
    topPublications: Publication[];
}

export default function PublicationSection({ topPublications }: PublicationSectionProps) {
    // if (topPublications.length === 0) return null;

    return (
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <BookOpen className="w-6 h-6 text-[#0F4C81]" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                    Publikasi Terpopuler
                </h2>
            </div>

            <div className="flex flex-col gap-4">
                {topPublications.length === 0 ? (
                    <div className="flex items-center justify-center p-8 text-gray-500 italic bg-gray-50 rounded-xl border border-gray-100">
                        Tidak ada publikasi
                    </div>
                ) : (
                    topPublications.map((pub) => (
                        <div key={pub.id} className="group relative bg-gray-50 rounded-xl p-4 hover:bg-blue-50 transition-colors border border-gray-100 hover:border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                        <Eye className="w-3 h-3" />
                                        {pub.viewCount} Views
                                    </div>
                                    {pub.publishDate && (
                                        <span className="text-xs text-gray-500">
                                            {new Date(pub.publishDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' })}
                                        </span>
                                    )}
                                </div>

                                <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-[#0F4C81] transition-colors">
                                    {pub.title}
                                </h3>

                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <User className="w-4 h-4" />
                                    <span className="line-clamp-1">{pub.authorName}</span>
                                </div>
                            </div>

                            {pub.link && (
                                <PublicationLink
                                    id={pub.id}
                                    url={pub.link}
                                    className="flex-shrink-0 inline-flex items-center gap-1 text-sm font-medium text-[#0F4C81] hover:underline bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-200 transition-all shadow-sm"
                                >
                                    Baca Selengkapnya &rarr;
                                </PublicationLink>
                            )}
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
