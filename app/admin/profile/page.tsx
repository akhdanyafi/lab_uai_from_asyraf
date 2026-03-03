import { getSession, hasPermission } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProfileForm from '@/features/users/components/ProfileForm';
import { db } from '@/db';
import { users, roles } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function AdminProfilePage() {
    const session = await getSession();

    if (!session || !hasPermission(session, 'dashboard.admin')) {
        redirect('/login');
    }

    // Fetch fresh user data from DB
    const dbUserResults = await db
        .select({
            user: users,
            roleName: roles.name
        })
        .from(users)
        .leftJoin(roles, eq(users.roleId, roles.id))
        .where(eq(users.identifier, session.user.identifier))
        .limit(1);

    const dbUser = dbUserResults[0];

    if (!dbUser) {
        redirect('/login');
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#0F4C81]">Profil Saya</h1>
                <p className="text-gray-600">Kelola informasi akun dan keamanan anda.</p>
            </div>

            <ProfileForm
                user={{
                    fullName: dbUser.user.fullName,
                    identifier: dbUser.user.identifier,
                    email: dbUser.user.email || '',
                    roleName: dbUser.roleName || session.user.role,
                    batch: dbUser.user.batch || undefined,
                    studyType: dbUser.user.studyType || undefined,
                }}
            />
        </div>
    );
}
