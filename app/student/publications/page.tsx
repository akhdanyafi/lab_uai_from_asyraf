import { getPublicPublications, getPublicationKeywords, getUserPublications, getPublicationLikeCounts, getUserLikedPublicationIds } from '@/features/publications/actions';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { BookOpen, Clock, CheckCircle, XCircle, ExternalLink, FileText, Search, User, Plus, ArrowLeft, Eye } from 'lucide-react';
import Link from 'next/link';
import PublicationLink from '@/features/publications/components/PublicationLink';
import LikeButton from '@/features/publications/components/LikeButton';

interface SearchParams {
    search?: string;
    keyword?: string;
    tab?: string;
}

export default async function StudentPublicationsPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const session = await getSession();
    if (!session) redirect('/login');

    const params = await searchParams;
    const activeTab = params.tab || 'all';

    // Fetch data
    const publishedPublications = await getPublicPublications({
        search: params.search,
        keyword: params.keyword,
    });
    const keywords = await getPublicationKeywords();
    const mySubmissions = await getUserPublications(session.user.id);

    // Get like data for published publications
    const publicationIds = publishedPublications.map(p => p.id);
    const likeCounts = await getPublicationLikeCounts(publicationIds);
    const userLikedIds = await getUserLikedPublicationIds(session.user.id, publicationIds);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Pending':
                return (
                    <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                        <Clock className="w-3 h-3" />
                        Menunggu Review
                    </span>
                );
            case 'Published':
                return (
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        <CheckCircle className="w-3 h-3" />
                        Dipublikasikan
                    </span>
                );
            case 'Rejected':
                return (
                    <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                        <XCircle className="w-3 h-3" />
                        Ditolak
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Publikasi</h1>
                    <p className="text-gray-500 text-sm mt-1">Lihat dan ajukan publikasi</p>
                </div>
                <Link
                    href="/student/publications/submit"
                    className="inline-flex items-center gap-2 bg-[#0F4C81] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0F4C81]/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Ajukan Publikasi
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
                <Link
                    href="/student/publications?tab=all"
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'all'
                        ? 'bg-white text-[#0F4C81] shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <BookOpen className="w-4 h-4" />
                    Semua Publikasi
                </Link>
                <Link
                    href="/student/publications?tab=my"
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'my'
                        ? 'bg-white text-[#0F4C81] shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <FileText className="w-4 h-4" />
                    Pengajuan Saya
                    {mySubmissions.length > 0 && (
                        <span className="bg-gray-200 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">
                            {mySubmissions.length}
                        </span>
                    )}
                </Link>
            </div>

            {/* All Publications Tab */}
            {activeTab === 'all' && (
                <>
                    {/* Search and Filter */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <form method="GET" className="flex flex-col md:flex-row gap-4">
                            <input type="hidden" name="tab" value="all" />
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
                                    href="/student/publications?tab=all"
                                    className="text-gray-500 hover:text-gray-700 px-4 py-2 text-sm"
                                >
                                    Reset
                                </Link>
                            )}
                        </form>
                    </div>

                    {/* Publications Grid */}
                    {publishedPublications.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">
                                {params.search || params.keyword
                                    ? 'Tidak ada publikasi yang sesuai filter.'
                                    : 'Belum ada publikasi.'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-gray-500">{publishedPublications.length} publikasi ditemukan</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {publishedPublications.map((pub) => {
                                    let pubKeywords: string[] = [];
                                    if (pub.keywords) {
                                        try {
                                            pubKeywords = JSON.parse(pub.keywords);
                                        } catch { }
                                    }

                                    return (
                                        <div key={pub.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                                            {/* Title - Clickable */}
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
                                                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{pub.abstract}</p>
                                            )}

                                            {/* Keywords */}
                                            {pubKeywords.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mb-3">
                                                    {pubKeywords.slice(0, 3).map((kw) => (
                                                        <span
                                                            key={kw}
                                                            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                                                        >
                                                            {kw}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                {pub.publishDate && (
                                                    <span>{new Date(pub.publishDate).toLocaleDateString('id-ID')}</span>
                                                )}
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="w-3 h-3" />
                                                        {pub.viewCount}
                                                    </span>
                                                    <LikeButton
                                                        publicationId={pub.id}
                                                        userId={session.user.id}
                                                        initialLiked={userLikedIds.includes(pub.id)}
                                                        initialLikeCount={likeCounts[pub.id] || 0}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </>
            )}

            {/* My Submissions Tab */}
            {activeTab === 'my' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="font-semibold text-gray-900">Riwayat Pengajuan Saya</h2>
                        <Link
                            href="/student/publications/submit"
                            className="text-sm text-[#0F4C81] hover:underline flex items-center gap-1"
                        >
                            <Plus className="w-4 h-4" />
                            Ajukan Baru
                        </Link>
                    </div>

                    {mySubmissions.length === 0 ? (
                        <div className="p-8 text-center">
                            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">Anda belum mengajukan publikasi.</p>
                            <Link
                                href="/student/publications/submit"
                                className="inline-flex items-center gap-2 mt-4 bg-[#0F4C81] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0F4C81]/90 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Ajukan Publikasi Pertama
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {mySubmissions.map((pub) => (
                                <div key={pub.id} className="p-4 hover:bg-gray-50">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{pub.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1">{pub.authorName}</p>
                                            {pub.abstract && (
                                                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{pub.abstract}</p>
                                            )}
                                            <div className="flex items-center gap-3 mt-2">
                                                {getStatusBadge(pub.status)}
                                                <span className="text-xs text-gray-400">
                                                    {new Date(pub.createdAt!).toLocaleDateString('id-ID')}
                                                </span>
                                                {pub.filePath && (
                                                    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                                        <FileText className="w-3 h-3" />
                                                        File Attached
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {pub.filePath && (
                                                <a
                                                    href={pub.filePath}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[#0F4C81] hover:text-blue-700"
                                                    title="Download File"
                                                >
                                                    <FileText className="w-5 h-5" />
                                                </a>
                                            )}
                                            {pub.status === 'Published' && pub.link && (
                                                <a
                                                    href={pub.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[#0F4C81] hover:text-blue-700"
                                                    title="External Link"
                                                >
                                                    <ExternalLink className="w-5 h-5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
