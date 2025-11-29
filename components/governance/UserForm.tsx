'use client';

import { createUser, updateUser } from '@/lib/actions/users';
import { useState } from 'react';
import { UserPlus, Save } from 'lucide-react';

interface Role {
    id: number;
    name: string;
}

interface UserFormProps {
    roles: Role[];
    initialData?: any;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function UserForm({ roles, initialData, onSuccess, onCancel }: UserFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEdit = !!initialData;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                {isEdit ? <Save className="w-5 h-5 text-primary" /> : <UserPlus className="w-5 h-5 text-primary" />}
                {isEdit ? 'Edit User' : 'Tambah User Baru'}
            </h2>
            <form action={async (formData) => {
                setIsSubmitting(true);
                try {
                    const data = {
                        fullName: formData.get('fullName') as string,
                        identifier: formData.get('identifier') as string,
                        email: formData.get('email') as string,
                        roleId: parseInt(formData.get('roleId') as string),
                        passwordHash: formData.get('password') as string || undefined,
                    };

                    if (isEdit) {
                        await updateUser(initialData.id, data);
                    } else {
                        if (!data.passwordHash) throw new Error('Password required for new user');
                        await createUser(data as any);
                    }

                    if (onSuccess) onSuccess();
                    if (!isEdit) {
                        const form = document.getElementById('user-form') as HTMLFormElement;
                        form?.reset();
                    }
                } catch (error: any) {
                    alert(error.message || 'Gagal menyimpan user');
                } finally {
                    setIsSubmitting(false);
                }
            }} id="user-form" className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                    <input
                        name="fullName"
                        defaultValue={initialData?.fullName}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NIM / NIDN</label>
                    <input
                        name="identifier"
                        defaultValue={initialData?.identifier}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        name="email"
                        type="email"
                        defaultValue={initialData?.email}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                        name="roleId"
                        defaultValue={initialData?.roleId}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="">Pilih Role</option>
                        {roles.map(role => (
                            <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isEdit ? 'Password (Kosongkan jika tidak ingin mengubah)' : 'Password'}
                    </label>
                    <input
                        name="password"
                        type="password"
                        required={!isEdit}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                <div className="md:col-span-2 flex gap-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#0F4C81] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0F4C81]/90 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? 'Menyimpan...' : 'Simpan User'}
                    </button>
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Batal
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
