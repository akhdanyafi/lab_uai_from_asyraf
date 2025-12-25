import { getClasses } from '@/features/academic/actions';
import ClassDashboard from '@/features/academic/components/practicum/views/ClassDashboard';

export default async function PracticumPage() {
    const classes = await getClasses();

    return (
        <div className="container mx-auto py-8">
            <ClassDashboard classes={classes} />
        </div>
    );
}
