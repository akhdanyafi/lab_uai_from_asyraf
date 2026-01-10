'use client';

import { deleteUser } from '@/features/users/actions';
import { Trash2, Edit, User, Search, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import UserForm from './UserForm';

interface UserListProps {
    users: any[];
    roles: any[];
    lecturers: { id: number; fullName: string; identifier: string }[];
}

export default function UserList({ users, roles, lecturers }: UserListProps) {
    const [editingUser, setEditingUser] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = useMemo(() => {
        if (!searchQuery) return users;
        const query = searchQuery.toLowerCase();
        return users.filter(user =>
            user.fullName.toLowerCase().includes(query) ||
            user.identifier.toLowerCase().includes(query) ||
            (user.email && user.email.toLowerCase().includes(query))
        );
    }, [users, searchQuery]);

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
                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                <button
                                    onClick={() => setEditingUser(user)}
                                    className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <form action={async () => {
                                    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
                                        await deleteUser(user.id);
                                    }
                                }}>
                                    <button className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </form>
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
    );
}

