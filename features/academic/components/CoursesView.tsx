'use client';

/**
 * CoursesView - DEPRECATED
 * 
 * This component is no longer needed in the simplified schema.
 * Courses are now embedded directly in Classes (courseCode, courseName).
 * 
 * This file is kept as a placeholder to prevent import errors during migration.
 * It should be removed after all references are updated.
 */

interface CoursesViewProps {
    courses?: any[];
}

export default function CoursesView({ courses = [] }: CoursesViewProps) {
    return (
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Fitur Deprecated</h2>
            <p className="text-yellow-700">
                Tabel &quot;Mata Kuliah&quot; terpisah sudah dihapus dalam arsitektur yang disederhanakan.
            </p>
            <p className="text-yellow-700 mt-2">
                Info mata kuliah (kode dan nama) sekarang <strong>diinput langsung saat membuat Kelas baru</strong>.
            </p>
            <p className="text-sm text-yellow-600 mt-4">
                Silakan gunakan menu &quot;Buat Kelas&quot; di halaman Praktikum untuk mengelola kelas dan mata kuliah.
            </p>
        </div>
    );
}
