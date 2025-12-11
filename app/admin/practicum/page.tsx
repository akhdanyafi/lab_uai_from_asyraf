import { getClasses } from '@/lib/actions/academic';
import ClassDashboard from '@/components/practicum/views/ClassDashboard';

export default async function PracticumPage() {
    const classes = await getClasses();

    return (
        <div className="container mx-auto py-8">
            <ClassDashboard classes={classes} />
        </div>
    );
}
