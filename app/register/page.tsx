'use client';

import { useState } from 'react';
import { register } from '@/lib/actions/register';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);
        try {
            await register(formData);
        } catch (e: any) {
            setError(e.message);
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Pendaftaran Akun</h1>
                    <p className="text-gray-500 mt-2">Buat akun baru untuk mengakses laboratorium</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6">
                        {error}
                    </div>
                )}

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <input
                            name="fullName"
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none transition-all"
                            placeholder="Contoh: Budi Santoso"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">NIM</label>
                        <input
                            name="identifier"
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none transition-all"
                            placeholder="Contoh: 0102521001"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none transition-all"
                            placeholder="nama@student.uai.ac.id"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#0F4C81] text-white py-2.5 rounded-lg font-medium hover:bg-[#0F4C81]/90 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Mendaftar...
                            </>
                        ) : (
                            'Daftar'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Sudah punya akun?{' '}
                    <Link href="/login" className="text-[#0F4C81] font-medium hover:underline">
                        Masuk disini
                    </Link>
                </div>
            </div>
        </div>
    );
}
