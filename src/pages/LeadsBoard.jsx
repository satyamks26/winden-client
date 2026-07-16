import { useState, useEffect } from "react";
import { Plus, Building, DollarSign, GripVertical } from "lucide-react";

export default function LeadsBoard() {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    const COLUMNS = ["NEW", "CONTACTED", "NEGOTIATING", "WON", "LOST"];

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/leads`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setLeads(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDragStart = (e, id) => {
        e.dataTransfer.setData("leadId", id);
    };

    const handleDrop = async (e, newStatus) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("leadId");

        if (!id) return;

        // Optimistically update UI dynamically
        setLeads(prev => prev.map(l => l._id === id ? { ...l, status: newStatus } : l));

        try {
            const token = localStorage.getItem("token");
            await fetch(`${API_URL}/api/leads/${id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
        } catch (err) {
            console.error(err);
            fetchLeads(); // Fallback on failure
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Must prevent default to allow drop
    };

    const createLead = async () => {
        const name = prompt("Enter Lead Name:");
        if (!name) return;
        const company = prompt("Enter Company:");
        if (!company) return;
        const value = prompt("Enter Deal Value ($):", "1000");

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/leads`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name, company, value })
            });
            const data = await res.json();
            setLeads([data, ...leads]);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-8 text-neutral-400 font-medium tracking-wide">Loading pipeline matrices...</div>;

    return (
        <div className="h-full flex flex-col p-6 text-white overflow-hidden animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">Sales Pipeline</h1>
                    <p className="text-neutral-400 mt-1">Organize and visually track lead conversions via drag-and-drop mechanics.</p>
                </div>
                <button
                    onClick={createLead}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
                >
                    <Plus size={18} /> New Lead
                </button>
            </div>

            {/* Kanban Board Core Layout */}
            <div className="flex-1 flex gap-6 overflow-x-auto pb-6 snap-x">
                {COLUMNS.map(col => {
                    const colLeads = leads.filter(l => l.status === col);
                    return (
                        <div
                            key={col}
                            onDrop={(e) => handleDrop(e, col)}
                            onDragOver={handleDragOver}
                            className="min-w-[320px] max-w-[320px] bg-neutral-900/40 border border-neutral-800/80 rounded-2xl flex flex-col snap-center shadow-2xl backdrop-blur-sm"
                        >
                            <div className="p-4 border-b border-neutral-800/80 flex justify-between items-center bg-gradient-to-b from-neutral-800/40 to-transparent rounded-t-2xl">
                                <h3 className="font-bold tracking-wider text-sm text-neutral-300">{col}</h3>
                                <span className="bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs px-3 py-1 rounded-full font-bold shadow-inner">
                                    {colLeads.length}
                                </span>
                            </div>

                            <div className="flex-1 p-3 overflow-y-auto space-y-3">
                                {colLeads.map(lead => (
                                    <div
                                        key={lead._id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, lead._id)}
                                        className="bg-neutral-950/80 border border-neutral-800 p-4 rounded-xl cursor-grab active:cursor-grabbing hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all group backdrop-blur-md"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-semibold text-blue-50">{lead.name}</h4>
                                            <GripVertical size={16} className="text-neutral-600 group-hover:text-blue-400 transition-colors" />
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-neutral-400 font-medium">
                                                <Building size={14} className="text-neutral-500" />
                                                <span className="truncate">{lead.company}</span>
                                            </div>
                                            <div className="flex justify-between items-center mt-4 pt-3 border-t border-neutral-800/50">
                                                <span className="text-xs font-medium tracking-wide text-neutral-500">VALUE</span>
                                                <span className="font-bold text-emerald-400 flex items-center bg-emerald-400/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                                    <DollarSign size={13} className="mr-0.5" />
                                                    {lead.value.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {colLeads.length === 0 && (
                                    <div className="h-24 border-2 border-dashed border-neutral-800/50 rounded-xl flex items-center justify-center text-neutral-500 text-sm font-medium tracking-wide bg-neutral-900/20">
                                        Drop leads here
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
