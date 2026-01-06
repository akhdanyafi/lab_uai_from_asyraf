'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/features/users/register';
import Link from 'next/link';
import { Loader2, Eye, EyeOff } from 'lucide-react';

interface Lecturer {
    id: number;
    fullName: string;
    identifier: string;
}

interface RegisterFormProps {
    lecturers: Lecturer[];
}

export default function RegisterForm({ lecturers }: RegisterFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);

        const result = await register(formData);

        if (result.success) {
            router.push('/login?registered=true');
        } else {
            setError(result.error);
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

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Angkatan</label>
                            <select
                                name="batch"
                                required
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none transition-all bg-white"
                            >
                                <option value="">Pilih Tahun</option>
                                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
                            <select
                                name="studyType"
                                required
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none transition-all bg-white"
                            >
                                <option value="">Pilih Tipe</option>
                                <option value="Reguler">Reguler</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Program Studi</label>
                            <input
                                name="programStudi"
                                type="text"
                                defaultValue="Informatika"
                                required
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none transition-all"
                                placeholder="Contoh: Informatika"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dosen Pembimbing <span className="text-red-500">*</span></label>
                            <select
                                name="dosenPembimbing"
                                required
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none transition-all bg-white"
                            >
                                <option value="">Pilih Dosen</option>
                                {lecturers.map(lecturer => (
                                    <option key={lecturer.id} value={lecturer.fullName}>
                                        {lecturer.fullName}
                                    </option>
                                ))}
                            </select>
                        </div>
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
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full px-4 py-2 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0F4C81] transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                        <div className="relative">
                            <input
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                className="w-full px-4 py-2 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0F4C81] transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
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
