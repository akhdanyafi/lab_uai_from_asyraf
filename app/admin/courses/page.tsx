import { getCourses } from '@/features/courses/actions';
import { getLecturers } from '@/features/users/actions';
import CourseManager from '@/features/courses/components/CourseManager';

export default async function AdminCoursesPage() {
    const [courses, lecturers] = await Promise.all([
        getCourses(),
        getLecturers()
    ]);

    return (
        <CourseManager courses={courses} lecturers={lecturers} />
    );
}
