'use client';

import { useState } from 'react';
import { BookOpen, FileText, File } from 'lucide-react';
import DocumentList from './DocumentList';
import UploadForm from './UploadForm';

interface AcademicManagerProps {
    modules: any[];
    journals: any[];
    reports: any[];
    userRole: string;
    userId: number;
}

export default function AcademicManager({ modules, journals, reports, userRole, userId }: AcademicManagerProps) {
    const [activeTab, setActiveTab] = useState<'modules' | 'journals' | 'reports'>('modules');

    // Determine allowed upload types based on role
    const allowedUploadTypes = [];
    if (userRole === 'Admin' || userRole === 'Dosen') {
        allowedUploadTypes.push('Modul Praktikum', 'Jurnal Publikasi');
    }
    if (userRole === 'Mahasiswa') {
        allowedUploadTypes.push('Laporan Praktikum');
    }

    // Determine if user can delete (Admin/Lecturer can delete modules/journals, Student can delete own reports?)
    // For simplicity:
    // - Admin/Lecturer can delete Modules/Journals.
    // - Student can delete their own Reports.
    // - Admin/Lecturer can delete Student Reports (maybe?).

    const canDeleteModules = userRole === 'Admin' || userRole === 'Dosen';
    const canDeleteJournals = userRole === 'Admin' || userRole === 'Dosen';
    const canDeleteReports = true; // Everyone can delete reports they see (filtered by backend/page logic)

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Akademik</h1>
                    <p className="text-gray-500 text-sm mt-1">Pusat informasi dan dokumen akademik laboratorium</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('modules')}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'modules'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                >
                    <BookOpen className="w-4 h-4" />
                    Modul Praktikum
                </button>
                <button
                    onClick={() => setActiveTab('journals')}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'journals'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                >
                    <FileText className="w-4 h-4" />
                    Jurnal Publikasi
                </button>
                <button
                    onClick={() => setActiveTab('reports')}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'reports'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                >
                    <File className="w-4 h-4" />
                    Laporan Praktikum
                </button>
            </div>

            {/* Content */}
            <div>
                {/* Upload Form - Show only if role is allowed to upload for the ACTIVE tab */}
                {((activeTab === 'modules' && (userRole === 'Admin' || userRole === 'Dosen')) ||
                    (activeTab === 'journals' && (userRole === 'Admin' || userRole === 'Dosen')) ||
                    (activeTab === 'reports' && userRole === 'Mahasiswa')) && (
                        <UploadForm
                            uploaderId={userId}
                            allowedTypes={
                                activeTab === 'modules' ? ['Modul Praktikum'] :
                                    activeTab === 'journals' ? ['Jurnal Publikasi'] :
                                        ['Laporan Praktikum']
                            }
                        />
                    )}

                {activeTab === 'modules' && <DocumentList documents={modules} canDelete={canDeleteModules} />}
                {activeTab === 'journals' && <DocumentList documents={journals} canDelete={canDeleteJournals} />}
                {activeTab === 'reports' && <DocumentList documents={reports} canDelete={canDeleteReports} />}
            </div>
        </div>
    );
}
