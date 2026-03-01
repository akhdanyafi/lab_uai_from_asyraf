import { getGovernanceDocs } from '@/features/governance/actions';
import { getSession, hasPermission } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { FileText, Download, Calendar } from 'lucide-react';

export default async function LecturerGovernancePage() {
    const session = await getSession();
    if (!session || !hasPermission(session, 'governance.view')) {
        redirect('/login');
    }

    const [sops, lpjs] = await Promise.all([
        getGovernanceDocs('SOP'),
        getGovernanceDocs('LPJ Bulanan'),
    ]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Tata Kelola</h1>
                <p className="text-gray-500 text-sm mt-1">Dokumen SOP dan LPJ Bulanan</p>
            </div>

            {/* SOP Section */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    Standar Operasional Prosedur (SOP)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sops.map((doc) => (
                        <div key={doc.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 text-sm truncate">{doc.title}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Calendar className="w-3 h-3 text-gray-400" />
                                        <span className="text-xs text-gray-500">
                                            {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                        </span>
                                    </div>
                                </div>
                                <a
                                    href={doc.filePath}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors flex-shrink-0"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Unduh
                                </a>
                            </div>
                        </div>
                    ))}
                    {sops.length === 0 && (
                        <div className="col-span-2 text-center py-8 bg-white rounded-xl border border-gray-100">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">Belum ada dokumen SOP</p>
                        </div>
                    )}
                </div>
            </div>

            {/* LPJ Section */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-500" />
                    LPJ Bulanan
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lpjs.map((doc) => (
                        <div key={doc.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-5 h-5 text-orange-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 text-sm truncate">{doc.title}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Calendar className="w-3 h-3 text-gray-400" />
                                        <span className="text-xs text-gray-500">
                                            {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                        </span>
                                    </div>
                                </div>
                                <a
                                    href={doc.filePath}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-orange-700 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors flex-shrink-0"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Unduh
                                </a>
                            </div>
                        </div>
                    ))}
                    {lpjs.length === 0 && (
                        <div className="col-span-2 text-center py-8 bg-white rounded-xl border border-gray-100">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">Belum ada dokumen LPJ</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
