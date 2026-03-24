export default function AuthLayout({ title, subtitle, children, footer }) {
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-neutral-950">
            <div className="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 p-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
                    <p className="text-sm text-neutral-400 mt-2">{subtitle}</p>
                </div>

                {/* Content */}
                {children}

                {/* Footer */}
                {footer && (
                    <div className="mt-8 text-center text-sm text-neutral-400">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
