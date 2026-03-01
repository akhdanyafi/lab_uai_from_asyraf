import { getCourses } from '@/features/courses/actions';
import { GraduationCap, User, Search } from 'lucide-react';

export default async function StudentCoursesPage() {
    const courses = await getCourses();

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Mata Kuliah</h1>
                <p className="text-gray-500 text-sm mt-1">Daftar mata kuliah yang tersedia</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course: any) => (
                    <div
                        key={course.id}
                        className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <GraduationCap className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 text-sm">{course.name}</h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {course.code} • Semester {course.semester}
                                </p>
                                <p className="text-xs text-gray-500">{course.credits} SKS</p>
                            </div>
                        </div>
                        {course.lecturerName && (
                            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                                <User className="w-3.5 h-3.5 text-gray-400" />
                                <span className="text-xs text-gray-600">{course.lecturerName}</span>
                            </div>
                        )}
                    </div>
                ))}
                {courses.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-100">
                        <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Belum ada mata kuliah</p>
                    </div>
                )}
            </div>
        </div>
    );
}
