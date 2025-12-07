"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, ClipboardList, User } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useAppContext } from "@/context/AppContext";

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { currentUser } = useAppContext();
    const router = useRouter();

    useEffect(() => {
        if (!currentUser) {
            router.push('/');
        }
    }, [currentUser, router]);

    if (!currentUser) return null;

    return (
        <div className="flex flex-col min-h-screen-safe w-full bg-slate-950 pb-20">
            {children}

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 glass-panel bg-slate-900/80 border-t border-white/5 pb-safe z-50">
                <div className="flex justify-around items-center h-16">
                    <Link href="/app" className={`flex flex-col items-center gap-1 ${pathname === '/app' ? 'text-blue-400' : 'text-slate-500'}`}>
                        <Home className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Home</span>
                    </Link>
                    <Link href="/app/tasks" className={`flex flex-col items-center gap-1 ${pathname.startsWith('/app/tasks') ? 'text-blue-400' : 'text-slate-500'}`}>
                        <ClipboardList className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Tasks</span>
                    </Link>
                    <Link href="/app/profile" className={`flex flex-col items-center gap-1 ${pathname === '/app/profile' ? 'text-blue-400' : 'text-slate-500'}`}>
                        <User className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Profile</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}
