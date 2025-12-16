'use client';

import { useState } from 'react';
import { BookOpen, FileText, File, GraduationCap, Users, Calendar } from 'lucide-react';
import DocumentList from './DocumentList';
import UploadForm from './UploadForm';
import CoursesView from './CoursesView';
import ClassesView from './ClassesView';
import PracticumView from './PracticumView';

interface AcademicManagerProps {
    modules: any[];
    journals: any[];
    reports: any[];
    courses: any[];
    classes: any[];
    lecturers: any[];
    sessions: any[];
    userRole: string;
    userId: number;
    visibleTabs?: ('modules' | 'journals' | 'reports' | 'courses' | 'classes' | 'practicum')[];
}

export default function AcademicManager({
    modules,
    journals,
    reports,
    courses,
    classes,
    lecturers,
    sessions,
    userRole,
    userId,
    visibleTabs = ['modules', 'journals', 'reports', 'courses', 'classes', 'practicum']
}: AcademicManagerProps) {
    const [activeTab, setActiveTab] = useState<'modules' | 'journals' | 'reports' | 'courses' | 'classes' | 'practicum'>('journals');

    // ... (allowedUploadTypes logic)

    const canDeleteModules = userRole === 'Admin' || userRole === 'Dosen';
    const canDeleteJournals = userRole === 'Admin' || userRole === 'Dosen';
    const canDeleteReports = true;

    return (
        <div>
            {/* ... (Header) */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Akademik</h1>
                    <p className="text-gray-500 text-sm mt-1">Pusat informasi dan dokumen akademik laboratorium</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit overflow-x-auto">
                {/* ... (Existing Tabs) */}
                {visibleTabs.includes('journals') && (
                    <button
                        onClick={() => setActiveTab('journals')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'journals'
                            ? 'bg-white text-[#0F4C81] shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                            }`}
                    >
                        <FileText className="w-4 h-4" />
                        Jurnal Publikasi
                    </button>
                )}
                {visibleTabs.includes('courses') && (
                    <button
                        onClick={() => setActiveTab('courses')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'courses'
                            ? 'bg-white text-[#0F4C81] shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                            }`}
                    >
                        <BookOpen className="w-4 h-4" />
                        Mata Kuliah
                    </button>
                )}
                {visibleTabs.includes('classes') && (
                    <button
                        onClick={() => setActiveTab('classes')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'classes'
                            ? 'bg-white text-[#0F4C81] shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                            }`}
                    >
                        <Users className="w-4 h-4" />
                        Kelas
                    </button>
                )}
                {visibleTabs.includes('modules') && (
                    <button
                        onClick={() => setActiveTab('modules')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'modules'
                            ? 'bg-white text-[#0F4C81] shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                            }`}
                    >
                        <GraduationCap className="w-4 h-4" />
                        Modul Praktikum
                    </button>
                )}
                {visibleTabs.includes('practicum') && (
                    <button
                        onClick={() => setActiveTab('practicum')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'practicum'
                            ? 'bg-white text-[#0F4C81] shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                            }`}
                    >
                        <Calendar className="w-4 h-4" />
                        Jadwal Praktikum
                    </button>
                )}
                {visibleTabs.includes('reports') && (
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'reports'
                            ? 'bg-white text-[#0F4C81] shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                            }`}
                    >
                        <File className="w-4 h-4" />
                        Laporan Praktikum
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* ... (Upload Form) */}
                {((activeTab === 'modules' && visibleTabs.includes('modules') && (userRole === 'Admin' || userRole === 'Dosen')) ||
                    (activeTab === 'journals' && visibleTabs.includes('journals') && (userRole === 'Admin' || userRole === 'Dosen')) ||
                    (activeTab === 'reports' && visibleTabs.includes('reports') && userRole === 'Mahasiswa')) && (
                        <UploadForm
                            uploaderId={userId}
                            allowedTypes={
                                activeTab === 'modules' ? ['Modul Praktikum'] :
                                    activeTab === 'journals' ? ['Jurnal Publikasi'] :
                                        ['Laporan Praktikum']
                            }
                        />
                    )}

                {activeTab === 'modules' && visibleTabs.includes('modules') && <DocumentList documents={modules} canDelete={canDeleteModules} />}
                {activeTab === 'journals' && visibleTabs.includes('journals') && <DocumentList documents={journals} canDelete={canDeleteJournals} />}
                {activeTab === 'reports' && visibleTabs.includes('reports') && <DocumentList documents={reports} canDelete={canDeleteReports} />}
                {activeTab === 'courses' && visibleTabs.includes('courses') && <CoursesView courses={courses} />}
                {activeTab === 'classes' && visibleTabs.includes('classes') && <ClassesView classes={classes} courses={courses} lecturers={lecturers} />}
                {activeTab === 'practicum' && visibleTabs.includes('practicum') && (
                    <PracticumView
                        sessions={sessions}
                        userRole={userRole}
                        baseUrl={userRole === 'Dosen' ? '/lecturer/sessions' : '/admin/practicum'}
                    />
                )}
            </div>
        </div>
    );
}
