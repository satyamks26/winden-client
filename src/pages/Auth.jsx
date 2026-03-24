export default function Auth() {
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-neutral-950">
            <div className="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 p-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
                    <p className="text-sm text-neutral-400 mt-2">
                        Sign in to continue to Winden
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-5">
                    <Input label="Email" type="email" placeholder="you@company.com" />
                    <Input label="Password" type="password" placeholder="••••••••" />
                    <p className="text-sm text-red-400">
                        Invalid email or password
                    </p>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-neutral-400">
                            <input type="checkbox" className="accent-blue-500" />
                            Remember me
                        </label>
                        <button className="text-blue-400 hover:underline">
                            Forgot password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-4 rounded-lg bg-blue-600 py-2.5 font-medium
  hover:bg-blue-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled
                    >
                        Signing in…
                    </button>

                </form>

                {/* Footer */}
                <p className="text-sm text-neutral-400 mt-8 text-center">
                    Don’t have an account?{" "}
                    <span className="text-blue-400 cursor-pointer hover:underline">
                        Sign up
                    </span>
                </p>
            </div>
        </div>
    );
}

function Input({ label, ...props }) {
    return (
        <div className="relative">
            <input
                {...props}
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2
    text-sm text-neutral-100 placeholder-neutral-500
    focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            {props.type === "password" && (
                <span className="absolute right-3 top-2.5 text-sm text-neutral-400 cursor-pointer">
                    Show
                </span>
            )}
        </div>

    );
}
