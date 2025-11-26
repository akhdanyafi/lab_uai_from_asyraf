import { getGovernanceDocs } from '@/lib/actions/governance';
import { getUsers, getRoles } from '@/lib/actions/users';
import GovernanceManager from '@/components/governance/GovernanceManager';
import { getSession } from '@/lib/auth';

export default async function GovernancePage() {
    const session = await getSession();

    const [sops, lpjs, users, roles] = await Promise.all([
        getGovernanceDocs('SOP'),
        getGovernanceDocs('LPJ Bulanan'),
        getUsers(),
        getRoles()
    ]);

    return (
        <GovernanceManager
            sops={sops}
            lpjs={lpjs}
            users={users}
            roles={roles}
            adminId={session?.user.id || 0}
        />
    );
}
