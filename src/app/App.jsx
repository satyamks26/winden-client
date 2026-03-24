import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import AppShell from "../components/layout/AppShell";
import ProtectedRoute from "../routes/ProtectedRoute";
import Channels from "../pages/Channels";
import Dashboard from "../pages/Dashboard";
import Settings from "../pages/Settings";
import LeadsBoard from "../pages/LeadsBoard";
import { useEffect } from "react";
import socket from "../lib/socket";

export default function App() {


  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="channels" element={<Channels />} />
        <Route path="settings" element={<Settings />} />
        <Route path="leads" element={<LeadsBoard />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
