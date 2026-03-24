import { useState } from "react";
import { User, Palette, Bell, Shield, LogOut, CheckCircle2 } from "lucide-react";

export default function Settings() {
    const [activeTab, setActiveTab] = useState("profile");
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const username = localStorage.getItem("winden_user") || "User";

    return (
        <div className="max-w-5xl mx-auto p-6 h-full flex flex-col animate-in fade-in duration-300">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Settings
                </h1>
                <p className="text-neutral-400 mt-2 text-lg">
                    Manage your profile, appearance, and account preferences.
                </p>
            </div>

            <div className="flex flex-1 gap-8 overflow-hidden">
                {/* Sidebar Menu */}
                <div className="w-64 border-r border-neutral-800 pr-6 space-y-2">
                    <TabButton 
                        icon={User} label="My Profile" id="profile" 
                        active={activeTab} onClick={setActiveTab} 
                    />
                    <TabButton 
                        icon={Palette} label="Appearance" id="appearance" 
                        active={activeTab} onClick={setActiveTab} 
                    />
                    <TabButton 
                        icon={Bell} label="Notifications" id="notifications" 
                        active={activeTab} onClick={setActiveTab} 
                    />
                    <TabButton 
                        icon={Shield} label="Security" id="security" 
                        active={activeTab} onClick={setActiveTab} 
                    />
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto pr-4 pb-12">
                    
                    {activeTab === "profile" && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-xl font-semibold mb-4 text-white">Profile Information</h2>
                                <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                            <span className="text-4xl font-bold text-white shadow-sm">{username.charAt(0).toUpperCase()}</span>
                                        </div>
                                        <div>
                                            <button className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition cursor-not-allowed opacity-50">
                                                Change Avatar (Pro)
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-400 mb-1.5">Display Name</label>
                                            <input type="text" defaultValue={username} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-400 mb-1.5">About Me</label>
                                            <textarea rows="3" placeholder="I love using Winden chat!" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none"></textarea>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-4 border-t border-neutral-800 flex justify-end items-center gap-4">
                                        {saved && <span className="text-green-400 text-sm flex items-center gap-1 font-medium"><CheckCircle2 size={16}/> Saved</span>}
                                        <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40">
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "appearance" && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-xl font-semibold mb-4 text-white">Theme Preferences</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <button className="p-6 bg-neutral-950 border-2 border-blue-500 rounded-2xl flex flex-col items-center gap-3 transition shadow-lg shadow-blue-500/5">
                                        <div className="w-full h-24 bg-neutral-900 rounded-lg border border-neutral-800 flex items-center justify-center">
                                            <span className="text-white border border-neutral-700 px-3 py-1 rounded bg-neutral-800 text-xs font-medium">Dark Mode</span>
                                        </div>
                                        <span className="font-semibold text-white">Default Dark</span>
                                    </button>
                                    <button className="p-6 bg-neutral-900 border-2 border-transparent hover:border-neutral-700 rounded-2xl flex flex-col items-center gap-3 transition opacity-50 cursor-not-allowed grayscale">
                                        <div className="w-full h-24 bg-white rounded-lg border border-neutral-200 flex items-center justify-center">
                                            <span className="text-black border border-neutral-300 px-3 py-1 rounded bg-neutral-100 text-xs font-medium">Light Mode</span>
                                        </div>
                                        <span className="font-semibold text-white">Light Mode (Pro)</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "notifications" && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-xl font-semibold mb-4 text-white">Alerts & Sounds</h2>
                                <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-6">
                                    <ToggleRow title="Desktop Notifications" desc="Show popups when Winden is in the background." enabled={true} />
                                    <div className="w-full h-px bg-neutral-800"></div>
                                    <ToggleRow title="Message Sounds" desc="Play a 'ding' sound for new incoming messages." enabled={true} />
                                    <div className="w-full h-px bg-neutral-800"></div>
                                    <ToggleRow title="Mentions Only" desc="Only notify me when someone explicitly @mentions my name." enabled={false} />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h2 className="text-xl font-semibold mb-4 text-white">Account Management</h2>
                                <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-6">
                                    <div>
                                        <h3 className="text-red-400 font-medium mb-1 flex items-center gap-2"><LogOut size={16}/> Active Sessions</h3>
                                        <p className="text-sm text-neutral-400 mb-4">You are currently securely logged in on this device.</p>
                                        <button 
                                            onClick={() => {
                                                localStorage.removeItem("token");
                                                localStorage.removeItem("winden_user");
                                                window.location.href = "/login";
                                            }}
                                            className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm hover:shadow-red-500/10"
                                        >
                                            Log Out of Winden
                                        </button>
                                    </div>
                                    <div className="w-full h-px bg-neutral-800"></div>
                                    <div>
                                        <h3 className="text-red-600 font-medium mb-1 flex items-center gap-2">Danger Zone</h3>
                                        <p className="text-sm text-neutral-400 mb-4">Permanently delete your account and all associated messages.</p>
                                        <button 
                                            className="bg-red-900/40 text-red-700 border border-red-900/50 px-5 py-2.5 rounded-lg text-sm font-semibold transition cursor-not-allowed opacity-50"
                                            disabled
                                        >
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

function TabButton({ icon: Icon, label, id, active, onClick }) {
    const isActive = active === id;
    return (
        <button
            onClick={() => onClick(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm border border-transparent
                ${isActive 
                    ? "bg-neutral-800 text-white border-neutral-700 shadow-sm" 
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"
                }`}
        >
            <Icon size={18} className={isActive ? "text-blue-400" : "text-neutral-500"} />
            {label}
        </button>
    );
}

function ToggleRow({ title, desc, enabled }) {
    const [on, setOn] = useState(enabled);
    return (
        <div className="flex items-center justify-between">
            <div>
                <div className="font-semibold text-white mb-0.5 tracking-wide">{title}</div>
                <div className="text-sm text-neutral-400">{desc}</div>
            </div>
            <button 
                onClick={() => setOn(!on)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shadow-inner ${on ? "bg-blue-600" : "bg-neutral-700"}`}
            >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform shadow-md ${on ? "translate-x-7" : "translate-x-1"}`} />
            </button>
        </div>
    );
}
