import { getGovernanceDocs } from '@/features/governance/actions';
import { getUsers, getRoles, getLecturers } from '@/features/users/actions';
import GovernanceManager from '@/features/governance/components/GovernanceManager';
import { getSession } from '@/lib/auth';

export default async function GovernancePage() {
    const session = await getSession();

    const [sops, lpjs, users, roles, lecturers] = await Promise.all([
        getGovernanceDocs('SOP'),
        getGovernanceDocs('LPJ Bulanan'),
        getUsers(),
        getRoles(),
        getLecturers(),
    ]);

    return (
        <GovernanceManager
            sops={sops}
            lpjs={lpjs}
            users={users}
            roles={roles}
            lecturers={lecturers}
            adminId={session?.user.id || 0}
        />
    );
}
