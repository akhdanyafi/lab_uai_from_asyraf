import { getGovernanceDocs } from '@/lib/actions/governance';
import { getUsers, getRoles } from '@/lib/actions/users';
import { getHeroPhotos } from '@/lib/actions/hero-photos';
import GovernanceManager from '@/components/governance/GovernanceManager';
import { getSession } from '@/lib/auth';

export default async function GovernancePage() {
    const session = await getSession();

    const [sops, lpjs, users, roles, heroPhotos] = await Promise.all([
        getGovernanceDocs('SOP'),
        getGovernanceDocs('LPJ Bulanan'),
        getUsers(),
        getRoles(),
        getHeroPhotos()
    ]);

    return (
        <GovernanceManager
            sops={sops}
            lpjs={lpjs}
            users={users}
            roles={roles}
            heroPhotos={heroPhotos}
            adminId={session?.user.id || 0}
        />
    );
}
