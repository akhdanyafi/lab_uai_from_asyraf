import { getCourses } from '@/features/courses/actions';
import CourseList from '@/features/courses/components/CourseList';

export default async function StudentCoursesPage() {
    const courses = await getCourses();

    return (
        <div>
            <CourseList courses={courses as any} />
        </div>
    );
}
