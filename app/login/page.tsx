'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { login } from '@/lib/actions/auth';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login({ email, password });
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Login gagal. Periksa kembali kredensial Anda.');
        } finally {
            setLoading(false);
        }
    };

    return (
        // Background Utama: #F3F4F6
        <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6] p-4 font-sans">

            {/* Card Container: #FFFFFF */}
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

                {/* Header Section */}
                <div className="p-8 pb-0 text-center">
                    {/* Logo Box (Branding) */}
                    <div className="mx-auto w-14 h-14 bg-[#0F4C81] rounded-xl flex items-center justify-center shadow-md mb-4">
                        <span className="text-white font-bold text-2xl">LF</span>
                    </div>

                    {/* Text Utama: #0F4C81 */}
                    <h1 className="text-2xl font-bold text-[#0F4C81] mb-2 tracking-tight">
                        Selamat Datang
                    </h1>
                    {/* Text Sekunder: #6B7280 */}
                    <p className="text-[#6B7280] text-sm">
                        Portal Laboratorium Informatika<br />Universitas Al Azhar Indonesia
                    </p>
                </div>

                <div className="p-8 pt-6">
                    {/* Error State: Danger Red #EF4444 */}
                    {error && (
                        <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-100 p-4 rounded-lg">
                            <div className="text-[#EF4444] text-sm font-medium">
                                {error}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Input Email/NIM */}
                        <div>
                            <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                                Email Universitas atau NIM
                            </label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0F4C81] transition-colors">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 text-[#1F2937] placeholder-gray-400 focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/20 outline-none transition-all"
                                    placeholder="nama@uai.ac.id atau NIM"
                                    required
                                />
                            </div>
                        </div>

                        {/* Input Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-semibold text-[#1F2937]">
                                    Password
                                </label>
                                {/* Aksi Sekunder: Accent Color #F59E0B (Untuk hover/link penting) */}
                                <Link
                                    href="/forgot-password"
                                    className="text-xs font-medium text-[#6B7280] hover:text-[#F59E0B] transition-colors"
                                >
                                    Lupa password?
                                </Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0F4C81] transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 text-[#1F2937] placeholder-gray-400 focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/20 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button: Primary #0F4C81 */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#0F4C81] hover:bg-[#1A365D] text-white font-bold py-3.5 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                'Masuk ke Portal'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Belum punya akun?{' '}
                        <Link href="/register" className="text-[#0F4C81] font-medium hover:underline">
                            Ajukan Pembuatan Akun
                        </Link>
                    </div>
                </div>

                {/* Footer Card */}
                <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-center">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#0F4C81] font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    );
}