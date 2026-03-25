import { Bell, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../app/providers";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const username = localStorage.getItem("winden_user") || "User";
    const initial = username.charAt(0).toUpperCase();

    return (
        <header className="h-14 border-b border-neutral-800 bg-neutral-950/70 backdrop-blur-md flex items-center px-6 justify-between">
            {/* Left */}
            <div className="text-sm text-neutral-400 font-medium tracking-wide">Search…</div>

            {/* Right */}
            <div className="flex items-center gap-6 relative">

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-neutral-400 hover:text-red-400 transition-colors bg-neutral-900/50 hover:bg-neutral-800/80 px-3 py-1.5 rounded-md border border-neutral-800/50"
                    >
                        <LogOut size={14} />
                        Logout
                    </button>

                    <div className="h-5 w-px bg-neutral-800"></div>

                    <Bell size={18} className="text-neutral-400 hover:text-neutral-300 cursor-pointer transition-colors" />
                </div>

                {/* Dynamic Auth Avatar */}
                <div
                    title={username}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-400 shadow-lg shadow-blue-500/20 flex items-center justify-center text-sm font-bold text-white outline outline-2 outline-offset-2 outline-neutral-800 cursor-default select-none transition-transform hover:scale-105"
                >
                    {initial}
                </div>
            </div>
        </header>
    );
}
