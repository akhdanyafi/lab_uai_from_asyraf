'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateUserProfile } from '@/lib/actions/users';

interface ProfileFormProps {
    user: {
        fullName: string;
        identifier: string;
        email: string;
        roleName?: string;
        batch?: number;
        studyType?: string;
    };
}

export default function ProfileForm({ user }: ProfileFormProps) {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        const formData = new FormData(e.currentTarget);
        const data = {
            fullName: formData.get('fullName') as string || undefined,
            identifier: formData.get('identifier') as string || undefined,
            currentPassword: formData.get('currentPassword') as string,
            newEmail: formData.get('newEmail') as string || undefined,
            newPassword: formData.get('newPassword') as string || undefined,
            confirmNewPassword: formData.get('confirmNewPassword') as string || undefined,
        };

        try {
            if (!data.currentPassword) {
                throw new Error('Password saat ini diperlukan untuk menyimpan perubahan.');
            }

            if (data.newEmail && !data.newEmail.includes('@')) {
                throw new Error('Format email tidak valid.');
            }

            if (data.newPassword) {
                if (data.newPassword.length < 6) {
                    throw new Error('Password baru minimal 6 karakter.');
                }
                if (data.newPassword !== data.confirmNewPassword) {
                    throw new Error('Konfirmasi password baru tidak sesuai.');
                }
            }

            // Only call server action for Allowed fields
            await updateUserProfile({
                fullName: data.fullName,
                identifier: data.identifier,
                currentPassword: data.currentPassword,
                newEmail: data.newEmail,
                newPassword: data.newPassword,
                confirmNewPassword: data.confirmNewPassword
            });

            setSuccess('Profil berhasil diperbaharui.');
            // Clear passwords and new email field only, preserve identity fields
            const form = e.target as HTMLFormElement;
            (form.querySelector('input[name="currentPassword"]') as HTMLInputElement).value = '';
            (form.querySelector('input[name="newPassword"]') as HTMLInputElement).value = '';
            (form.querySelector('input[name="confirmNewPassword"]') as HTMLInputElement).value = '';
            (form.querySelector('input[name="newEmail"]') as HTMLInputElement).value = '';

            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Gagal memperbarui profil');
        } finally {
            setSubmitting(false);
        }
    };

    const isAdmin = user.roleName === 'Admin';

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Profil Pengguna</h2>

            {error && (
                <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 rounded-lg">
                    {success}
                </div>
            )}


            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Read-Only Identity Fields - Editable for Admins */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            defaultValue={user.fullName}
                            readOnly={!isAdmin}
                            disabled={!isAdmin}
                            className={`w-full px-3 py-2 border border-gray-200 rounded-lg ${isAdmin
                                ? 'bg-white text-gray-900 focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none transition-all'
                                : 'bg-gray-50 text-gray-500 cursor-not-allowed'
                                }`}
                        />
                        {!isAdmin && <p className="mt-1 text-xs text-gray-400">Hubungi admin untuk mengubah nama.</p>}
                    </div>

                    <div>
                        <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">NIM / NIDN</label>
                        <input
                            id="identifier"
                            name="identifier"
                            type="text"
                            defaultValue={user.identifier}
                            readOnly={!isAdmin}
                            disabled={!isAdmin}
                            className={`w-full px-3 py-2 border border-gray-200 rounded-lg ${isAdmin
                                ? 'bg-white text-gray-900 focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none transition-all'
                                : 'bg-gray-50 text-gray-500 cursor-not-allowed'
                                }`}
                        />
                        {!isAdmin && <p className="mt-1 text-xs text-gray-400">Hubungi admin untuk mengubah NIM/NIDN.</p>}
                    </div>

                    {user.batch && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Angkatan</label>
                            <input
                                type="text"
                                value={user.batch}
                                readOnly
                                disabled
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                            />
                        </div>
                    )}

                    {user.studyType && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Studi</label>
                            <input
                                type="text"
                                value={user.studyType}
                                readOnly
                                disabled
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                            />
                        </div>
                    )}
                </div>

                {/* Editable Fields */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900">Ubah Data Kontak & Keamanan</h3>

                    <div>
                        <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-1">Email Baru</label>
                        <input
                            id="newEmail"
                            name="newEmail"
                            type="email"
                            placeholder={user.email}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none transition-all"
                        />
                        <p className="mt-1 text-xs text-gray-500">Kosongkan jika tidak ingin mengubah email.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                            <input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
                            <input
                                id="confirmNewPassword"
                                name="confirmNewPassword"
                                type="password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500">Kosongkan kolom password jika tidak ingin mengubah password.</p>
                </div>

                {/* Verification Field */}
                <div className="pt-4 border-t border-gray-100">
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-900 mb-1">
                        Password Saat Ini <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        required
                        placeholder="Masukkan password saat ini untuk menyimpan perubahan"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2 bg-[#0F4C81] text-white text-sm font-semibold rounded-lg hover:bg-[#0F4C81]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>
        </div>
    );
}
