import { Bell, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../app/providers";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
    const [open, setOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="h-14 border-b border-neutral-800 bg-neutral-950/70 backdrop-blur-md flex items-center px-6 justify-between">
            {/* Left */}
            <div className="text-sm text-neutral-400">Search…</div>

            {/* Right */}
            <div className="flex items-center gap-4 relative">
                <Bell size={18} className="text-neutral-400" />

                {/* Avatar */}
                <button
                    onClick={() => setOpen(!open)}
                    className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium"
                >
                    U
                </button>

                {/* Dropdown */}
                {open && (
                    <div className="absolute right-0 top-12 w-40 rounded-lg bg-neutral-900 border border-neutral-800 shadow-lg">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800"
                        >
                            <LogOut size={14} />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
