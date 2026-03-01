import { getGovernanceDocs } from '@/features/governance/actions';
import { getUsers, getRoles, getLecturers } from '@/features/users/actions';
import { getHeroPhotos } from '@/features/hero-photos/actions';
import { getAllPermissions, getRolePermissionMap } from '@/features/permissions/actions';
import GovernanceManager from '@/features/governance/components/GovernanceManager';
import { getSession } from '@/lib/auth';

export default async function GovernancePage() {
    const session = await getSession();

    const [sops, lpjs, users, roles, lecturers, heroPhotos, allPermissions, rolePermissionMap] = await Promise.all([
        getGovernanceDocs('SOP'),
        getGovernanceDocs('LPJ Bulanan'),
        getUsers(),
        getRoles(),
        getLecturers(),
        getHeroPhotos(),
        getAllPermissions(),
        getRolePermissionMap(),
    ]);

    return (
        <GovernanceManager
            sops={sops}
            lpjs={lpjs}
            users={users}
            roles={roles}
            lecturers={lecturers}
            heroPhotos={heroPhotos}
            adminId={session?.user.id || 0}
            allPermissions={allPermissions}
            rolePermissionMap={rolePermissionMap}
        />
    );
}
