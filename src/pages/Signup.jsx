import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";

export default function Signup() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSignup = async (e) => {

        e.preventDefault();
        setErrorMsg("");

        try {

            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorMsg(data.error || "Signup failed");
                return;
            }

            navigate("/login");

        } catch (err) {
            console.error(err);
            setErrorMsg("Server error: Could not physically connect.");
        }
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Get started with Winden"
            footer={
                <>
                    Already have an account?{" "}
                    <span
                        className="text-blue-400 cursor-pointer hover:underline"
                        onClick={() => navigate("/login")}
                    >
                        Sign in
                    </span>
                </>
            }
        >
            <form className="space-y-5" onSubmit={handleSignup}>

                <Input
                    label="Full name"
                    placeholder="Your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

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
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {errorMsg && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-sm font-medium">
                        {errorMsg}
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full mt-4 rounded-lg bg-blue-600 py-2.5 font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-colors"
                >
                    Create account
                </button>

            </form>
        </AuthLayout>
    );
}

function Input({ label, ...props }) {
    return (
        <div className="space-y-1">
            <label className="text-sm text-neutral-400">{label}</label>
            <div className="relative">
                <input
                    {...props}
                    className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2
          text-sm text-neutral-100 placeholder-neutral-500
          focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
            </div>
        </div>
    );
}