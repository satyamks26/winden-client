import { useState, useEffect } from "react";
import { Activity, Users, Zap, Hash, ArrowRight } from "lucide-react";

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalChannels: 0
    });

    useEffect(() => {
        // Fetch real channel count from your backend!
        fetch("http://localhost:5001/api/channels")
            .then(res => res.json())
            .then(data => {
                if (data.length) setStats({ totalChannels: data.length });
            })
            .catch(err => console.error("Failed to fetch dashboard stats", err));
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto p-6">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    Overview
                </h1>
                <p className="text-neutral-400 mt-2 text-lg">
                    Welcome back! Here's what's happening in your Winden workspace.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* 1. Activity Card */}
                <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6 hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/10 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
                            <Activity size={28} />
                        </div>
                    </div>
                    <h3 className="text-neutral-400 text-sm font-medium tracking-wide">TOTAL CHANNELS</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">{stats.totalChannels}</span>
                        <span className="text-sm text-green-400 font-medium bg-green-400/10 px-2 py-0.5 rounded-full">+ Active</span>
                    </div>
                </div>

                {/* 2. Network Card */}
                <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6 hover:border-emerald-500/50 transition-all hover:shadow-2xl hover:shadow-emerald-500/10 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                            <Users size={28} />
                        </div>
                    </div>
                    <h3 className="text-neutral-400 text-sm font-medium tracking-wide relative z-10">NETWORK STATUS</h3>
                    <div className="mt-2 flex items-center gap-3 relative z-10">
                        <span className="text-4xl font-bold text-white tracking-tight">Online</span>
                        <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5 bg-emerald-400/10 px-3 py-1 rounded-full shadow-inner">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></span>
                            Healthy
                        </span>
                    </div>
                </div>

                {/* 3. Quick Links Card */}
                <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 shadow-2xl shadow-indigo-900/40 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                    <div className="absolute -right-8 -top-8 text-white/10 group-hover:rotate-12 transition-transform duration-500">
                        <Zap size={140} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-blue-100 text-sm font-bold tracking-wider mb-5">QUICK JUMP</h3>
                        <div className="space-y-3">
                            <button 
                                onClick={() => window.location.href = '/channels'}
                                className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl transition-all backdrop-blur-md border border-white/5 hover:border-white/20 hover:pl-5 shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 p-1.5 rounded-md">
                                        <Hash size={16} className="text-blue-50" />
                                    </div>
                                    <span className="font-semibold tracking-wide">general</span>
                                </div>
                                <ArrowRight size={18} className="text-blue-100" />
                            </button>
                            <button 
                                onClick={() => window.location.href = '/channels'}
                                className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl transition-all backdrop-blur-md border border-white/5 hover:border-white/20 hover:pl-5 shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 p-1.5 rounded-md">
                                        <Hash size={16} className="text-blue-50" />
                                    </div>
                                    <span className="font-semibold tracking-wide">public</span>
                                </div>
                                <ArrowRight size={18} className="text-blue-100" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
