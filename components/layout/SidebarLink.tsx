'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarLinkProps {
    href: string;
    children: React.ReactNode;
}

export default function SidebarLink({ href, children }: SidebarLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative
                ${isActive
                    ? 'bg-[#0F4C81]/10 text-[#0F4C81] font-semibold' // Active State
                    : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#0F4C81]' // Inactive State
                }
            `}
        >
            {/* Indikator Aktif (Garis Emas) */}
            {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#F59E0B] rounded-r-full"></span>
            )}
            {children}
        </Link>
    );
}
