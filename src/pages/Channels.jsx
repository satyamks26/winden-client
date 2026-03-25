import { Hash, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import socket from "../lib/socket";

export default function Channels() {

    /* ---------------- STATE ---------------- */

    const [channels, setChannels] = useState([]);
    const [activeChannel, setActiveChannel] = useState("general");
    const [joinedChannels, setJoinedChannels] = useState(new Set());

    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [typingUsers, setTypingUsers] = useState([]);
    const [input, setInput] = useState("");
    const [newChannel, setNewChannel] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);

    const [unread, setUnread] = useState({});

    const username =
        localStorage.getItem("winden_user") || "You";

    const activeRef = useRef(activeChannel);
    const typingTimeout = useRef(null);
    const endRef = useRef(null);


    /* ---------------- LOAD CHANNELS ---------------- */

    useEffect(() => {

        const loadChannels = async () => {

            try {

                const token = localStorage.getItem("token");

                const payload = JSON.parse(
                    atob(token.split(".")[1])
                );

                const userId = payload.id;

                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/channels`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (res.status === 401) {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                    return;
                }

                if (!res.ok) throw new Error("Failed fetching channels");

                const data = await res.json();
                setChannels(data);

            } catch (err) {
                console.error("Failed to load channels:", err);
            }

        };

        loadChannels();

    }, []);


    /* ---------------- ACTIVE CHANNEL REF ---------------- */

    useEffect(() => {
        activeRef.current = activeChannel;
    }, [activeChannel]);

    /* ---------------- SOCKET CONNECT ---------------- */

    useEffect(() => {
        socket.auth = { token: localStorage.getItem("token") };

        const handleConnect = () => {
            socket.emit("identify", username);

            if (activeChannel) {
                socket.emit("channel:join", { channelId: activeChannel });
            }

            channels.forEach(ch => {
                socket.emit("channel:join", { channelId: ch.name });
            });
        };

        if (socket.connected) {
            handleConnect();
        } else {
            socket.connect();
        }

        socket.on("connect", handleConnect);

        const handleConnectError = (err) => {
            console.error("Socket connect error:", err);
            if (err.message === "Invalid token" || err.message === "Authentication required") {
                alert("Your session has expired. Please sign in again.");
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
        };
        socket.on("connect_error", handleConnectError);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("connect_error", handleConnectError);
        };
    }, [channels, activeChannel, username]);

    /* ---------------- SOCKET LISTENERS ---------------- */

    useEffect(() => {
        const onChannelNew = (channel) => {

            setChannels(prev => {

                if (prev.find(c => c._id === channel._id)) return prev;

                return [...prev, channel];

            });

        };

        socket.on("channel:new", onChannelNew);

        const onMessage = (msg) => {

            if (msg.channelId === activeRef.current) {
                setMessages(p => [...p, msg]);
            }
            else {

                setUnread(p => ({
                    ...p,
                    [msg.channelId]:
                        (p[msg.channelId] || 0) + 1
                }));

            }

        };

        const onPresence = ({ channelId, users }) => {
            if (channelId === activeRef.current) {
                setOnlineUsers(users);
            }
        };

        const onHistory = (msgs) => {
            setMessages(msgs);
        };

        const onMessageDeleted = ({ messageId }) => {
            setMessages(prev => prev.filter(m => m._id !== messageId));
        };

        const onTyping = ({ user, channelId, isTyping }) => {

            if (channelId !== activeRef.current) return;

            const name =
                typeof user === "object"
                    ? user.username
                    : user;

            setTypingUsers(prev => {

                if (isTyping) {

                    if (prev.includes(name))
                        return prev;

                    return [...prev, name];

                }

                return prev.filter(u => u !== name);

            });

        };

        socket.on("message:new", onMessage);
        socket.on("presence:update", onPresence);
        socket.on("channel:history", onHistory);
        socket.on("typing:update", onTyping);
        socket.on("message:deleted", onMessageDeleted);

        return () => {

            socket.off("message:new", onMessage);
            socket.off("presence:update", onPresence);
            socket.off("channel:history", onHistory);
            socket.off("typing:update", onTyping);
            socket.off("message:deleted", onMessageDeleted);

        };

    }, []);

    /* ---------------- CHANNEL SWITCH ---------------- */

    useEffect(() => {

        if (!activeChannel) return;

        activeRef.current = activeChannel;
        setMessages([]);
        setTypingUsers([]);
        setOnlineUsers([]);

        socket.emit("channel:history", {
            channelId: activeChannel
        });

        socket.emit("channel:join", {

            channelId: activeChannel
        });
        socket.emit("channel:joinMember", {
            channelId: activeChannel
        });

        setUnread(p => ({
            ...p,
            [activeChannel]: 0
        }));

    }, [activeChannel]);

    /* ---------------- SEND MESSAGE ---------------- */

    const sendMessage = () => {

        if (!input.trim()) return;

        socket.emit("message:send", {

            channelId: activeChannel,
            user: username,
            text: input.trim()

        });

        socket.emit("typing:stop", {
            channelId: activeChannel
        });

        setInput("");

    };

    /* ---------------- TYPING ---------------- */

    const handleTyping = (value) => {

        setInput(value);

        socket.emit("typing:start", {
            channelId: activeChannel
        });

        clearTimeout(typingTimeout.current);

        typingTimeout.current = setTimeout(() => {

            socket.emit("typing:stop", {
                channelId: activeChannel
            });

        }, 800);

    };

    /* ---------------- AUTOSCROLL ---------------- */

    useEffect(() => {

        endRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages]);

    /* ---------------- UI ---------------- */

    const activeChannelObj = channels.find(c => c.name === activeChannel);
    const isActiveJoined = activeChannelObj ? joinedChannels.has(activeChannelObj._id) : false;

    return (

        <div className="h-full flex overflow-hidden bg-[#0A0A0A]">

            <aside className="w-64 border-r border-neutral-800/60 p-4 flex flex-col bg-neutral-900/20 backdrop-blur-xl h-full shadow-xl z-10 transition-all">

                <div className="mb-6 flex flex-col gap-3">
                    <div className="flex gap-2 items-start">
                        <input
                            value={newChannel}
                            onChange={(e) => setNewChannel(e.target.value)}
                            placeholder="New channel group"
                            className="flex-1 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500 shadow-inner text-neutral-100 placeholder-neutral-500"
                        />
                        <button
                            onClick={() => {
                                if (!newChannel.trim()) return;
                                socket.emit("channel:create", { name: newChannel, isPrivate });
                                setNewChannel("");
                                setIsPrivate(false);
                            }}
                            className="bg-blue-600 px-3 py-1.5 rounded-md font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center text-sm text-white border border-blue-400/30 w-9 h-8"
                        >
                            +
                        </button>
                    </div>
                    <label className="flex items-center gap-2 text-[11px] font-medium text-neutral-400 cursor-pointer w-fit hover:text-neutral-300 ml-1 select-none">
                        <input
                            type="checkbox"
                            checked={isPrivate}
                            onChange={(e) => setIsPrivate(e.target.checked)}
                            className="rounded border-neutral-700 bg-neutral-900/50 cursor-pointer w-3.5 h-3.5 accent-blue-500"
                        />
                        <span>Private Guest Login 🔒</span>
                    </label>
                </div>

                <h2 className="text-neutral-500 mb-3 text-[10px] font-bold tracking-widest uppercase flex items-center justify-between border-b border-neutral-800/50 pb-2">
                    Your Matrix
                </h2>

                {channels.map(ch => (
                    <ChannelItem
                        key={ch._id}
                        channel={ch}
                        active={activeChannel === ch.name}
                        unread={unread[ch.name]}
                        onClick={() => setActiveChannel(ch.name)}
                        isJoined={joinedChannels.has(ch._id)}
                        onJoin={() => setJoinedChannels(prev => new Set(prev).add(ch._id))}
                        onLeave={() => {
                            setJoinedChannels(prev => {
                                const next = new Set(prev);
                                next.delete(ch._id);
                                return next;
                            });
                        }}
                    />
                ))}

            </aside>

            <section className="flex-1 flex flex-col">

                <div className="h-14 border-b px-6 flex justify-between items-center">

                    <div className="flex gap-2">
                        <Hash size={18} />
                        {activeChannel}
                    </div>

                    <span>
                        {onlineUsers.length} online
                    </span>

                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-3">

                    {messages.map((m, i) => (
                        <Message key={m._id || i} {...m} />
                    ))}

                    <div ref={endRef} />

                </div>

                <div className="px-6 h-6 italic text-sm">

                    {typingUsers.length > 0 &&
                        `${typingUsers.join(", ")} typing...`}

                </div>

                <div className="border-t p-4 flex gap-3">

                    <input
                        disabled={!isActiveJoined}
                        value={input}
                        onChange={e =>
                            handleTyping(e.target.value)
                        }
                        placeholder={isActiveJoined ? "Type a message..." : "You must join this channel to send a message"}
                        className="flex-1 bg-neutral-900 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        onKeyDown={e => {

                            if (e.key === "Enter") {

                                e.preventDefault();
                                sendMessage();

                            }

                        }}
                    />

                    <button
                        disabled={!isActiveJoined}
                        onClick={sendMessage}
                        className="bg-blue-600 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Send
                    </button>

                </div>

            </section>

        </div>

    );

}

/* ---------------- COMPONENTS ---------------- */

function ChannelItem({ channel, active, unread, onClick, isJoined, onJoin, onLeave }) {

    const username = localStorage.getItem("winden_user");

    return (
        <div
            className={`w-full flex justify-between flex-col px-3 py-2 rounded mb-1 transition-all duration-200
      ${active ? "bg-blue-600/20" : "hover:bg-neutral-800"}`}
        >

            <div
                onClick={onClick}
                className="flex items-center justify-between w-full cursor-pointer"
            >
                <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                    {channel.isPrivate ? (
                        <span className="text-yellow-500 shrink-0 text-xs drop-shadow-md">🔒</span>
                    ) : (
                        <Hash size={14} className={active ? "text-blue-400 shrink-0" : "text-neutral-400 shrink-0"} />
                    )}
                    <span className={`truncate font-medium ${active ? "text-blue-50 drop-shadow-sm" : "text-neutral-300"}`}>
                        {channel.name}
                    </span>
                </div>
                {unread > 0 && (
                    <span className="bg-blue-600 text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 shadow-lg shadow-blue-500/20 transform hover:scale-110 transition-transform">
                        {unread}
                    </span>
                )}
            </div>

            {/* Action Buttons - Only show for active channel to save space */}
            {active && (
                <div className="flex gap-2 items-center mt-3 pt-3 border-t border-blue-500/10">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            socket.emit("channel:joinMember", {
                                channelId: channel._id
                            });
                            onJoin();
                            onClick();
                        }}
                        className={`text-xs flex-1 px-2 py-1.5 rounded-md font-medium transition-colors shadow-sm ${isJoined
                            ? "bg-green-600/20 text-green-400 border border-green-500/30 cursor-default"
                            : "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20"
                            }`}
                        disabled={isJoined}
                    >
                        {isJoined ? "Joined ✓" : "Join"}
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            socket.emit("channel:leaveMember", {
                                channelId: channel._id
                            });
                            onLeave();
                            // Page reload purposely removed! 
                        }}
                        className="text-xs flex-1 bg-neutral-700/80 px-2 py-1.5 rounded-md hover:bg-neutral-600 font-medium transition-colors"
                    >
                        Leave
                    </button>

                    {channel.createdBy === username && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                socket.emit("channel:delete", {
                                    channelId: channel._id
                                });
                                setTimeout(() => window.location.reload(), 200);
                            }}
                            className="text-xs flex-1 bg-red-500/80 px-2 py-1.5 rounded-md hover:bg-red-400 font-medium transition-colors hover:shadow-sm hover:shadow-red-500/20"
                        >
                            Delete
                        </button>
                    )}
                </div>
            )}

        </div>
    );
}
function Message({ _id, channelId, user, text }) {

    const me = localStorage.getItem("winden_user") || "You";
    const own = user === me;
    const isBot = user === "Winden AI";
    const isSystem = user === "Winden System";

    return (
        <div className={`group flex ${own ? "justify-end" : ""} ${(isBot || isSystem) ? "mt-4 drop-shadow-md" : ""}`}>
            <div className={`relative px-4 py-2.5 rounded-2xl max-w-[80%] 
                ${own
                    ? "bg-blue-600 text-white rounded-tr-md"
                    : isSystem
                        ? "bg-emerald-950/60 border border-emerald-500/30 backdrop-blur-md text-emerald-100 rounded-md font-medium text-[13px] shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                        : isBot
                            ? "bg-gradient-to-r from-purple-800/40 to-indigo-800/40 border border-indigo-500/40 backdrop-blur-sm text-indigo-50 rounded-tl-md"
                            : "bg-neutral-800 text-neutral-200 rounded-tl-md border border-neutral-700/50"
                }`}>

                {!own && !isBot && !isSystem && (
                    <div className="text-xs mb-1 font-medium text-neutral-400">
                        {typeof user === "object" ? user.username : user}
                    </div>
                )}

                {isBot && (
                    <div className="flex items-center gap-2 text-xs mb-1.5 font-bold bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)] animate-pulse"></span>
                        Winden AI
                    </div>
                )}

                <div className="leading-relaxed whitespace-pre-wrap">{text}</div>

                {/* Sender Delete Button Node */}
                {own && _id && (
                    <button
                        onClick={() => {
                            if (window.confirm("Permanently delete this message?")) {
                                socket.emit("message:delete", { messageId: _id, channelId });
                            }
                        }}
                        className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-400 transition-all p-1.5 rounded-md hover:bg-neutral-800"
                        title="Delete message"
                    >
                        <Trash2 size={14} />
                    </button>
                )}
            </div>
        </div>
    );
}