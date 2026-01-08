import { getPublicPublications, getPublicationKeywords } from '@/features/publications/actions';
import { getSession } from '@/lib/auth';
import { BookOpen, ExternalLink, User, Search, Tag, LogIn, ArrowLeft } from 'lucide-react';
import PublicationLink from '@/features/publications/components/PublicationLink';
import Link from 'next/link';

interface SearchParams {
    search?: string;
    keyword?: string;
}

export default async function PublicationsPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const params = await searchParams;
    const session = await getSession();
    const publications = await getPublicPublications({
        search: params.search,
        keyword: params.keyword,
    });
    const keywords = await getPublicationKeywords();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Beranda
                </Link>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Galeri Publikasi</h1>
                        <p className="text-gray-500 mt-2">Karya dan publikasi mahasiswa Informatika UAI</p>
                    </div>
                    {session ? (
                        <Link
                            href="/student/publications"
                            className="inline-flex items-center gap-2 bg-[#0F4C81] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0F4C81]/90 transition-colors"
                        >
                            <BookOpen className="w-4 h-4" />
                            Ajukan Publikasi
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                            <LogIn className="w-4 h-4" />
                            Login untuk Ajukan Publikasi
                        </Link>
                    )}
                </div>

                {/* Search and Filter */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <form method="GET" className="flex flex-col md:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                name="search"
                                type="text"
                                placeholder="Cari judul atau penulis..."
                                defaultValue={params.search}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        {/* Keyword Filter */}
                        <div className="w-full md:w-64">
                            <select
                                name="keyword"
                                defaultValue={params.keyword || ''}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">Semua Kata Kunci</option>
                                {keywords.map((kw) => (
                                    <option key={kw} value={kw}>
                                        {kw}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="bg-[#0F4C81] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#0F4C81]/90 transition-colors"
                        >
                            Cari
                        </button>

                        {(params.search || params.keyword) && (
                            <Link
                                href="/publications"
                                className="text-gray-500 hover:text-gray-700 px-4 py-2 text-sm"
                            >
                                Reset
                            </Link>
                        )}
                    </form>
                </div>

                {/* Active Filters */}
                {(params.search || params.keyword) && (
                    <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                        <span>Filter aktif:</span>
                        {params.search && (
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                Pencarian: "{params.search}"
                            </span>
                        )}
                        {params.keyword && (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                {params.keyword}
                            </span>
                        )}
                    </div>
                )}

                {/* Publications Grid */}
                {publications.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">
                            {params.search || params.keyword
                                ? 'Tidak ada publikasi yang cocok dengan filter.'
                                : 'Belum ada publikasi.'}
                        </p>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-gray-500 mb-4">{publications.length} publikasi ditemukan</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {publications.map((pub) => {
                                // Parse keywords
                                let pubKeywords: string[] = [];
                                if (pub.keywords) {
                                    try {
                                        pubKeywords = JSON.parse(pub.keywords);
                                    } catch { }
                                }

                                return (
                                    <div key={pub.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <BookOpen className="w-6 h-6 text-primary" />
                                            </div>
                                        </div>

                                        {(pub.link || pub.filePath) ? (
                                            <PublicationLink
                                                id={pub.id}
                                                url={pub.link || pub.filePath || '#'}
                                                className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-[#0F4C81] cursor-pointer block"
                                            >
                                                {pub.title}
                                            </PublicationLink>
                                        ) : (
                                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{pub.title}</h3>
                                        )}

                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                            <User className="w-4 h-4" />
                                            <span>{pub.authorName}</span>
                                        </div>

                                        {pub.abstract && (
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-3">{pub.abstract}</p>
                                        )}

                                        {/* Keywords */}
                                        {pubKeywords.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {pubKeywords.slice(0, 3).map((kw) => (
                                                    <Link
                                                        key={kw}
                                                        href={`/publications?keyword=${encodeURIComponent(kw)}`}
                                                        className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded hover:bg-gray-200"
                                                    >
                                                        {kw}
                                                    </Link>
                                                ))}
                                                {pubKeywords.length > 3 && (
                                                    <span className="text-xs text-gray-400">+{pubKeywords.length - 3}</span>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                            {pub.publishDate && (
                                                <span>{new Date(pub.publishDate).toLocaleDateString('id-ID')}</span>
                                            )}
                                            <span>{pub.viewCount} views</span>
                                        </div>

                                        {(pub.link || pub.filePath) && (
                                            <PublicationLink
                                                id={pub.id}
                                                url={pub.link || pub.filePath || '#'}
                                                className="inline-flex items-center gap-1 text-primary hover:text-blue-700 text-sm font-medium"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                Lihat Publikasi
                                            </PublicationLink>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
