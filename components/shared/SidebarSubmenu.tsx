'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface SubMenuItem {
    name: string;
    href: string;
    icon: ReactNode;
}

interface SidebarSubmenuProps {
    name: string;
    icon: ReactNode;
    items: SubMenuItem[];
}

export default function SidebarSubmenu({ name, icon, items }: SidebarSubmenuProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Check if any child is active
    const isActive = items.some(child => pathname === child.href);

    // Auto-expand if a child is active
    useEffect(() => {
        if (isActive) {
            setIsOpen(true);
        }
    }, [isActive]);

    return (
        <div className="space-y-1">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all group
                    ${isActive
                        ? 'text-[#0F4C81] font-semibold bg-gray-50'
                        : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#0F4C81]'
                    }
                `}
            >
                <div className="flex items-center gap-3">
                    {icon}
                    <span>{name}</span>
                </div>
                {isOpen ? (
                    <ChevronDown className="w-4 h-4" />
                ) : (
                    <ChevronRight className="w-4 h-4" />
                )}
            </button>

            {isOpen && (
                <div className="pl-4 space-y-1">
                    {items.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                            <Link
                                key={child.href}
                                href={child.href}
                                className={`
                                    flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm
                                    ${isChildActive
                                        ? 'bg-[#0F4C81]/10 text-[#0F4C81] font-semibold'
                                        : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#0F4C81]'
                                    }
                                `}
                            >
                                {child.icon}
                                <span>{child.name}</span>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
