import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell() {
    return (
        <div className="flex h-screen w-screen bg-neutral-950 text-neutral-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 relative overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}