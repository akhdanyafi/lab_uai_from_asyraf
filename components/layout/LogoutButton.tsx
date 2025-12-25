'use client';

import { logout } from '@/features/auth/actions';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
    return (
        <form action={logout}>
            <button
                type="submit"
                className="w-full flex items-center gap-2 px-3 py-2.5 text-[#6B7280] rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-medium group"
            >
                <LogOut className="w-5 h-5" />
                <span>Keluar</span>
            </button>
        </form>
    );
}
