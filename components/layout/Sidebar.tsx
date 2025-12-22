import Link from 'next/link';
import SidebarLink from './SidebarLink';
import SidebarSubmenu from './SidebarSubmenu';
import LogoutButton from './LogoutButton';

interface MenuItem {
    name: string;
    href: string;
    icon: any;
    children?: MenuItem[];
}

interface SidebarProps {
    subtitle: string;
    menuItems: MenuItem[];
    user: {
        fullName: string;
        secondaryText: string;
        initial: string;
    };
    currentPath?: string; // Deprecated but kept for compatibility
    profileHref?: string;
}

export default function Sidebar({ subtitle, menuItems, user, profileHref }: SidebarProps) {
    return (
        <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-30 flex flex-col font-sans">

            {/* --- HEADER: LOGO & SUBTITLE --- */}
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                {/* Logo Box Branding */}
                <div className="w-10 h-10 bg-[#0F4C81] rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                    <span className="text-white font-bold text-lg">LF</span>
                </div>

                <div className="overflow-hidden">
                    <h1 className="text-lg font-bold text-[#0F4C81] leading-tight truncate">
                        Lab Informatika
                    </h1>
                    <p className="text-xs font-medium text-[#6B7280] truncate mt-0.5">
                        {subtitle}
                    </p>
                </div>
            </div>

            {/* --- NAVIGATION MENU --- */}
            <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => (
                    item.children ? (
                        <SidebarSubmenu
                            key={item.name}
                            name={item.name}
                            icon={<item.icon className="w-5 h-5" />}
                            items={item.children.map(child => ({
                                name: child.name,
                                href: child.href,
                                icon: <child.icon className="w-4 h-4" />
                            }))}
                        />
                    ) : (
                        <SidebarLink key={item.href} href={item.href}>
                            <item.icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </SidebarLink>
                    )
                ))}
            </nav>

            {/* --- FOOTER: USER & LOGOUT --- */}
            <div className="p-4 border-t border-gray-100 bg-[#F3F4F6]/50">
                {/* User Profile */}
                {profileHref ? (
                    <Link href={profileHref} className="block group">
                        <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-lg bg-white border border-gray-100 shadow-sm group-hover:border-[#0F4C81]/30 transition-colors cursor-pointer">
                            <div
                                className="w-9 h-9 rounded-full bg-[#0F4C81]/10 flex items-center justify-center text-[#0F4C81] font-bold text-sm shrink-0"
                                suppressHydrationWarning
                            >
                                {user.initial}
                            </div>
                            <div className="overflow-hidden min-w-0">
                                <p className="text-sm font-semibold text-[#1F2937] truncate">
                                    {user.fullName}
                                </p>
                                <p className="text-xs text-[#6B7280] truncate">
                                    {user.secondaryText}
                                </p>
                            </div>
                        </div>
                    </Link>
                ) : (
                    <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-lg bg-white border border-gray-100 shadow-sm">
                        <div
                            className="w-9 h-9 rounded-full bg-[#0F4C81]/10 flex items-center justify-center text-[#0F4C81] font-bold text-sm shrink-0"
                            suppressHydrationWarning
                        >
                            {user.initial}
                        </div>
                        <div className="overflow-hidden min-w-0">
                            <p className="text-sm font-semibold text-[#1F2937] truncate">
                                {user.fullName}
                            </p>
                            <p className="text-xs text-[#6B7280] truncate">
                                {user.secondaryText}
                            </p>
                        </div>
                    </div>
                )}

                {/* Logout Action */}
                <LogoutButton />
            </div>
        </aside>
    );
}