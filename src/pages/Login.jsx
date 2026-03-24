import { useState } from "react";
import AuthLayout from "../components/layout/AuthLayout";
import { useAuth } from "../app/providers";
import { useNavigate } from "react-router-dom";

export default function Login() {

    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const res = await fetch("http://localhost:5001/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password
                }),
            });

            const data = await res.json();

            console.log("Login response:", data);

            if (!res.ok) {
                alert(data.error || "Login failed");
                return;
            }

            // 🔐 Save token
            localStorage.setItem("token", data.token);

            // 👤 Save username for UI
            localStorage.setItem("winden_user", data.user.username);

            // ✅ Update Auth Context (IMPORTANT)
            console.log("TOKEN BEFORE LOGIN:", data.token);

            login(data.token);

            console.log("LOGIN FUNCTION CALLED");

            // redirect
            navigate("/app/channels");

        } catch (err) {

            console.error("Login error:", err);
            alert("Server error");

        }

    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to continue to Winden"
            footer={
                <>
                    Don’t have an account?{" "}
                    <span className="text-blue-400 cursor-pointer hover:underline">
                        Sign up
                    </span>
                </>
            }
        >

            <form className="space-y-5" onSubmit={handleLogin}>

                <Input
                    label="Email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    type="submit"
                    className="w-full mt-4 rounded-lg bg-blue-600 py-2.5 font-medium hover:bg-blue-500 transition"
                >
                    Sign in
                </button>

            </form>

        </AuthLayout>
    );
}

function Input({ label, ...props }) {
    return (
        <div className="space-y-1">
            <label className="text-sm text-neutral-400">{label}</label>
            <input
                {...props}
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2
        text-sm text-neutral-100 placeholder-neutral-500
        focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
        </div>
    );
}