import { LayoutGrid, MessageSquare, Settings, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";


export default function Sidebar() {
    return (
        <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col"
        >

            {/* Logo */}
            <div className="h-16 flex items-center px-6 text-lg font-semibold">
                Winden
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1">

                <NavLink to="/app" end>
                    {({ isActive }) => (
                        <NavItem
                            icon={LayoutGrid}
                            label="Dashboard"
                            active={isActive}
                        />
                    )}
                </NavLink>

                <NavLink to="/app/channels">
                    {({ isActive }) => (
                        <NavItem
                            icon={MessageSquare}
                            label="Channels"
                            active={isActive}
                        />
                    )}
                </NavLink>

                <NavLink to="/app/leads">
                    {({ isActive }) => (
                        <NavItem
                            icon={Briefcase}
                            label="CRM Board"
                            active={isActive}
                        />
                    )}
                </NavLink>

                <NavLink to="/app/settings">
                    {({ isActive }) => (
                        <NavItem
                            icon={Settings}
                            label="Settings"
                            active={isActive}
                        />
                    )}
                </NavLink>

            </nav>
        </motion.aside>
    );
}

function NavItem({ icon: Icon, label, active }) {
    return (
        <button
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all
  ${active
                    ? "bg-blue-600/15 text-blue-400"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                }`}

        >
            <Icon size={18} />
            {label}
        </button>
    );
}
