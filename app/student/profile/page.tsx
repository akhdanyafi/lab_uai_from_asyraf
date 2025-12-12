import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/profile/ProfileForm';

export default async function StudentProfilePage() {
    const session = await getSession();

    if (!session || session.user.role !== 'Mahasiswa') {
        redirect('/login');
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#0F4C81]">Profil Saya</h1>
                <p className="text-gray-600">Kelola informasi data diri dan keamanan akun.</p>
            </div>

            <ProfileForm
                user={{
                    fullName: session.user.fullName,
                    identifier: session.user.identifier,
                    email: session.user.email,
                    roleName: session.user.role,
                    batch: session.user.batch,
                    studyType: session.user.studyType
                }}
            />
        </div>
    );
}
