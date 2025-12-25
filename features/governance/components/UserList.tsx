'use client';

import { deleteUser } from '@/features/users/actions';
import { Trash2, Edit, User } from 'lucide-react';
import { useState } from 'react';
import UserForm from './UserForm';

interface UserListProps {
    users: any[];
    roles: any[];
}

export default function UserList({ users, roles }: UserListProps) {
    const [editingUser, setEditingUser] = useState<any>(null);

    if (editingUser) {
        return (
            <UserForm
                roles={roles}
                initialData={editingUser}
                onSuccess={() => setEditingUser(null)}
                onCancel={() => setEditingUser(null)}
            />
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                    {users.map((user) => (
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
                    {users.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                Belum ada data user.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
