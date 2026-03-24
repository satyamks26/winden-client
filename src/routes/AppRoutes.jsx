import { Routes, Route } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Dashboard from "../pages/Dashboard";

export default function AppRoutes() {
    return (
        <AppShell>
            <Routes>
                <Route path="/app" element={<AppLayout />}>

                    <Route index element={<Dashboard />} />

                    <Route path="channels" element={<Channels />} />

                    <Route path="settings" element={<Settings />} />

                </Route>
            </Routes>
        </AppShell>
    );
}
