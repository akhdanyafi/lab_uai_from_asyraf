import Link from 'next/link';
import { Search, LogIn } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0F4C81] rounded-lg flex items-center justify-center shadow-sm">
                        <span className="text-white font-bold text-lg">LF</span>
                    </div>

                    <div className="flex flex-col justify-center">
                        <h1 className="font-bold text-xl text-[#0F4C81] leading-tight tracking-tight">
                            Lab Informatika
                        </h1>
                        <span className="text-xs font-medium text-[#6B7280] tracking-wider">
                            UNIVERSITAS AL AZHAR INDONESIA
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 text-[#6B7280] hover:text-[#0F4C81] hover:bg-gray-100 rounded-full transition-colors">
                        <Search className="w-5 h-5" />
                    </button>

                    <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
                    <Link
                        href="/login"
                        className="flex items-center gap-2 bg-[#0F4C81] hover:bg-[#1A365D] text-white px-5 py-2 rounded-full font-medium text-sm transition-all shadow-sm hover:shadow-md"
                    >
                        <LogIn className="w-4 h-4" />
                        <span>Login</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}