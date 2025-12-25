import { getClasses, getModules } from '@/features/academic/practicum';
import SessionForm from '@/features/academic/components/practicum/SessionForm';

export default async function CreateSessionPage() {
    const [classes, modules] = await Promise.all([
        getClasses(),
        getModules()
    ]);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Buat Sesi Praktikum Baru</h1>
            <SessionForm classes={classes} modules={modules} />
        </div>
    );
}
