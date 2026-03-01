'use client';

import { deleteUser } from '@/features/users/actions';
import { Trash2, Edit, User, Search, X, Shield, Check, Loader2 } from 'lucide-react';
import { useState, useMemo, useTransition } from 'react';
import UserForm from './UserForm';
import { getUserPermissionOverrides, updateUserPermissions } from '@/features/permissions/actions';

interface Permission {
    id: number;
    code: string;
    name: string;
    category: string;
    description: string | null;
}

interface UserListProps {
    users: any[];
    roles: any[];
    lecturers: { id: number; fullName: string; identifier: string }[];
    allPermissions?: Permission[];
    rolePermissionMap?: Record<number, string[]>;
}

export default function UserList({ users, roles, lecturers, allPermissions = [], rolePermissionMap = {} }: UserListProps) {
    const [editingUser, setEditingUser] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Permission modal state
    const [permUser, setPermUser] = useState<any>(null);
    const [isPermModalOpen, setIsPermModalOpen] = useState(false);
    const [userOverrides, setUserOverrides] = useState<{ code: string; granted: boolean }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [saveMessage, setSaveMessage] = useState('');

    const filteredUsers = useMemo(() => {
        if (!searchQuery) return users;
        const query = searchQuery.toLowerCase();
        return users.filter(user =>
            user.fullName.toLowerCase().includes(query) ||
            user.identifier.toLowerCase().includes(query) ||
            (user.email && user.email.toLowerCase().includes(query))
        );
    }, [users, searchQuery]);

    // Group permissions by category
    const permissionsByCategory = useMemo(() => {
        const grouped: Record<string, Permission[]> = {};
        for (const perm of allPermissions) {
            if (!grouped[perm.category]) grouped[perm.category] = [];
            grouped[perm.category].push(perm);
        }
        return grouped;
    }, [allPermissions]);

    // --- Permission Modal logic ---
    const openPermModal = async (user: any) => {
        setPermUser(user);
        setIsPermModalOpen(true);
        setIsLoading(true);
        setSaveMessage('');
        try {
            const overrides = await getUserPermissionOverrides(user.id);
            setUserOverrides(overrides.map(o => ({ code: o.code, granted: o.granted ? true : false })));
        } catch {
            setUserOverrides([]);
        } finally {
            setIsLoading(false);
        }
    };

    const closePermModal = () => {
        setIsPermModalOpen(false);
        setPermUser(null);
        setUserOverrides([]);
        setSaveMessage('');
    };

    const isRoleDefault = (permCode: string): boolean => {
        if (!permUser) return false;
        return (rolePermissionMap[permUser.roleId] || []).includes(permCode);
    };

    const isPermissionEnabled = (permCode: string): boolean => {
        const override = userOverrides.find(o => o.code === permCode);
        if (override !== undefined) return override.granted;
        return isRoleDefault(permCode);
    };

    const togglePermission = (permCode: string) => {
        const isDefault = isRoleDefault(permCode);
        const existing = userOverrides.find(o => o.code === permCode);

        if (existing !== undefined) {
            // Remove override → revert to role default behavior
            setUserOverrides(prev => prev.filter(o => o.code !== permCode));
        } else {
            // Add override → flip from default
            setUserOverrides(prev => [...prev, { code: permCode, granted: !isDefault }]);
        }
    };

    const handleSavePerm = () => {
        if (!permUser) return;
        startTransition(async () => {
            try {
                await updateUserPermissions(permUser.id, userOverrides);
                setSaveMessage('Berhasil disimpan! User perlu login ulang.');
            } catch {
                setSaveMessage('Gagal menyimpan permission.');
            }
        });
    };

    if (editingUser) {
        return (
            <UserForm
                roles={roles}
                lecturers={lecturers}
                initialData={editingUser}
                onSuccess={() => setEditingUser(null)}
                onCancel={() => setEditingUser(null)}
            />
        );
    }

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Search */}
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari nama, NIM/NIDN, atau email..."
                            className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81]"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    {searchQuery && (
                        <p className="text-sm text-gray-500 mt-2">
                            Menampilkan {filteredUsers.length} dari {users.length} user
                        </p>
                    )}
                </div>

                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700">Nama Lengkap</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">NIM/NIDN</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Email</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Role</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                            {user.fullName.charAt(0)}
                                        </div>
                                        <span className="font-medium text-gray-900">{user.fullName}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{user.identifier}</td>
                                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${user.roleName === 'Admin' ? 'bg-purple-50 text-purple-700' :
                                        user.roleName === 'Dosen' ? 'bg-blue-50 text-blue-700' :
                                            'bg-green-50 text-green-700'
                                        }`}>
                                        {user.roleName}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-1">
                                        <button
                                            onClick={() => openPermModal(user)}
                                            className="text-amber-500 hover:text-amber-700 p-2 hover:bg-amber-50 rounded-lg transition-colors"
                                            title="Kelola Akses"
                                        >
                                            <Shield className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setEditingUser(user)}
                                            className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit User"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <form action={async () => {
                                            if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
                                                await deleteUser(user.id);
                                            }
                                        }}>
                                            <button className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors" title="Hapus User">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    {searchQuery ? 'Tidak ada hasil pencarian' : 'Belum ada data user.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Permission Modal */}
            {isPermModalOpen && permUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closePermModal} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden mx-4">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#0F4C81]/5 to-transparent">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Kelola Akses</h2>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {permUser.fullName} — <span className={`font-medium ${permUser.roleName === 'Admin' ? 'text-purple-600' :
                                            permUser.roleName === 'Dosen' ? 'text-blue-600' :
                                                'text-green-600'
                                        }`}>{permUser.roleName}</span>
                                </p>
                            </div>
                            <button onClick={closePermModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-6 h-6 animate-spin text-[#0F4C81]" />
                                    <span className="ml-2 text-gray-500">Memuat permission...</span>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                                        <span className="inline-block w-3 h-3 rounded bg-blue-100 border border-blue-300 mr-1 align-middle" /> Default dari role &nbsp;|&nbsp;
                                        <span className="inline-block w-3 h-3 rounded bg-green-100 border border-green-300 mr-1 align-middle" /> Custom (ditambahkan) &nbsp;|&nbsp;
                                        <span className="inline-block w-3 h-3 rounded bg-red-100 border border-red-300 mr-1 align-middle" /> Dicabut dari default
                                    </div>

                                    {Object.entries(permissionsByCategory).map(([category, perms]) => (
                                        <div key={category}>
                                            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C81]" />
                                                {category}
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {perms.map((perm) => {
                                                    const enabled = isPermissionEnabled(perm.code);
                                                    const isDefault = isRoleDefault(perm.code);
                                                    const override = userOverrides.find(o => o.code === perm.code);
                                                    const hasCustomGrant = override?.granted === true;
                                                    const hasCustomRevoke = override?.granted === false;

                                                    let bgColor = 'bg-gray-50 border-gray-200';
                                                    let checkColor = 'text-gray-300';

                                                    if (enabled && isDefault && !hasCustomRevoke) {
                                                        bgColor = 'bg-blue-50/50 border-blue-200';
                                                        checkColor = 'text-blue-500';
                                                    } else if (enabled && hasCustomGrant) {
                                                        bgColor = 'bg-green-50/50 border-green-200';
                                                        checkColor = 'text-green-500';
                                                    } else if (!enabled && hasCustomRevoke) {
                                                        bgColor = 'bg-red-50/50 border-red-200';
                                                        checkColor = 'text-red-400';
                                                    }

                                                    return (
                                                        <button
                                                            key={perm.code}
                                                            onClick={() => togglePermission(perm.code)}
                                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-left hover:shadow-sm ${bgColor}`}
                                                        >
                                                            <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${checkColor}`}>
                                                                {enabled ? (
                                                                    <Check className="w-4 h-4" strokeWidth={3} />
                                                                ) : (
                                                                    <div className="w-4 h-4 rounded border-2 border-gray-300" />
                                                                )}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className={`text-sm font-medium ${enabled ? 'text-gray-900' : 'text-gray-400'}`}>
                                                                    {perm.name}
                                                                </p>
                                                                {hasCustomGrant && <span className="text-[10px] text-green-600 font-medium">CUSTOM</span>}
                                                                {hasCustomRevoke && <span className="text-[10px] text-red-500 font-medium">DICABUT</span>}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                            <div>
                                {saveMessage && (
                                    <p className={`text-sm ${saveMessage.includes('Gagal') ? 'text-red-600' : 'text-green-600'}`}>
                                        {saveMessage}
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={closePermModal} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                    Batal
                                </button>
                                <button
                                    onClick={handleSavePerm}
                                    disabled={isPending}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-[#0F4C81] text-white rounded-lg text-sm hover:bg-[#0D3F6B] transition-colors disabled:opacity-50"
                                >
                                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
