import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const predefinedQuestions = [
    "Best dry fruits for memory?",
    "Weight gain ke liye kya khau?",
    "Heart health ke liye kya best hai?",
    "Roz kitne badam khane chahiye?",
    "Energy ke liye kaunsa dry fruit?",
    "Immunity badhane ke liye kya khau?",
];

// Local storage key
const CHAT_STORAGE_KEY = 'alAnsarChatMessages';

// Default initial message
const DEFAULT_MESSAGES = [{
    text: "Hii! I'm Ansari, your AI assistant for AL-Ansar Stores. How can I help you today?",
    sender: "bot",
    products: [],
    timestamp: new Date(),
}];

const ChatBot = () => {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState(() => {
        // Load messages from localStorage on initial render
        const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
        if (savedMessages) {
            try {
                // Parse saved messages
                const parsed = JSON.parse(savedMessages);
                // Check if parsed is an array and has items
                if (Array.isArray(parsed) && parsed.length > 0) {
                    // Convert timestamp strings back to Date objects
                    return parsed.map(msg => ({
                        ...msg,
                        products: Array.isArray(msg.products) ? msg.products : [],
                        timestamp: new Date(msg.timestamp)
                    }));
                }
            } catch (e) {
                console.error('Failed to parse saved messages:', e);
                // If error, clear invalid data
                localStorage.removeItem(CHAT_STORAGE_KEY);
            }
        }
        // Default initial message if no valid saved messages
        return DEFAULT_MESSAGES;
    });

    const [isTyping, setIsTyping] = useState(false);
    const [hasGreeted, setHasGreeted] = useState(false);
    const [hasShownQuestions, setHasShownQuestions] = useState(() => {
        // Check if we should show questions based on message count
        const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
        if (savedMessages) {
            try {
                const parsed = JSON.parse(savedMessages);
                // Check if parsed is an array before checking length
                if (Array.isArray(parsed)) {
                    return parsed.length > 1;
                }
            } catch (e) {
                return false;
            }
        }
        return false;
    });
    const [showTooltip, setShowTooltip] = useState(true);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    // Auto-hide tooltip every 10 seconds
    useEffect(() => {
        if (!open) {
            // Show tooltip initially
            setShowTooltip(true);

            // Set up interval to toggle tooltip
            const interval = setInterval(() => {
                setShowTooltip(prev => !prev);
            }, 10000); // 10 seconds

            // Cleanup interval on unmount or when chat opens
            return () => clearInterval(interval);
        } else {
            // Hide tooltip when chat is open
            setShowTooltip(false);
        }
    }, [open]);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        try {
            // Ensure messages is an array before saving
            if (Array.isArray(messages)) {
                localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
            } else {
                console.error('Messages is not an array:', messages);
                // Reset to default if messages is not an array
                setMessages(DEFAULT_MESSAGES);
            }
        } catch (e) {
            console.error('Failed to save messages:', e);
        }
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Close chat on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, []);

    const formatTime = (date) => {
        if (!date || !(date instanceof Date) || isNaN(date)) {
            return '';
        }
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Safe function to get messages array
    const getSafeMessages = () => {
        return Array.isArray(messages) ? messages : DEFAULT_MESSAGES;
    };

    const sendMessage = async (text) => {
        const msg = text || input;
        if (!msg.trim()) return;

        const userMessage = {
            text: msg,
            sender: "user",
            products: [],
            timestamp: new Date(),
        };
        setMessages((prev) => {
            const prevArray = Array.isArray(prev) ? prev : DEFAULT_MESSAGES;
            return [...prevArray, userMessage];
        });
        setInput("");

        // Mark that user has interacted
        if (!hasGreeted) setHasGreeted(true);
        // Hide suggested questions after first interaction
        if (!hasShownQuestions) setHasShownQuestions(true);

        // Show typing indicator
        setIsTyping(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: msg }),
            });

            const data = await res.json();

            // Small delay to show typing indicator
            setTimeout(() => {
                const botMessage = {
                    text: data.reply,
                    sender: "bot",
                    products: Array.isArray(data.products) ? data.products : [],
                    timestamp: new Date(),
                };
                setMessages((prev) => {
                    const prevArray = Array.isArray(prev) ? prev : DEFAULT_MESSAGES;
                    return [...prevArray, botMessage];
                });

                // Add follow-up message after a short delay
                setTimeout(() => {
                    const followUpMessage = {
                        text: "Is there anything else I can help you with? 😊",
                        sender: "bot",
                        products: [],
                        timestamp: new Date(),
                    };
                    setMessages((prev) => {
                        const prevArray = Array.isArray(prev) ? prev : DEFAULT_MESSAGES;
                        return [...prevArray, followUpMessage];
                    });
                }, 1000);

                setIsTyping(false);
            }, 600);
        } catch (err) {
            setTimeout(() => {
                setMessages((prev) => {
                    const prevArray = Array.isArray(prev) ? prev : DEFAULT_MESSAGES;
                    return [
                        ...prevArray,
                        {
                            text: "Sorry, I couldn't connect to the server.",
                            sender: "bot",
                            products: [],
                            timestamp: new Date(),
                        },
                    ];
                });
                setIsTyping(false);
            }, 600);
        }
    };

    // Floating button animation
    const buttonVariants = {
        initial: { scale: 0, opacity: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20
            }
        },
        hover: {
            scale: 1.1,
            rotate: [0, -5, 5, -5, 0],
            transition: { duration: 0.3 }
        },
        tap: { scale: 0.9 }
    };

    // Get safe messages for rendering
    const safeMessages = getSafeMessages();

    return (
        <>
            {/* Floating Button with Animation */}
            <motion.button
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
                onClick={() => setOpen(!open)}
                className="fixed bottom-5 right-5 group z-50"
            >
                <motion.div
                    className="relative flex items-center"
                    animate={{
                        width: open ? '56px' : 'auto',
                    }}
                    transition={{ type: "spring", damping: 20 }}
                >
                    {/* Expandable text - only shows when not open and showTooltip is true */}
                    <AnimatePresence>
                        {!open && showTooltip && (
                            <motion.span
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="absolute right-16 bg-white text-amber-800 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap shadow-lg border border-amber-200"
                            >
                                Ask me something! 💬
                                {/* Triangle pointer */}
                                <span className="absolute right-[-6px] top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white border-r border-t border-amber-200 rotate-45"></span>
                            </motion.span>
                        )}
                    </AnimatePresence>

                    {/* Main button */}
                    <div className={`bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-xl border-2 border-amber-300 relative ${!open && showTooltip ? 'animate-pulse' : ''}`}>
                        {open ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <img
                                src="/ansari.png"
                                alt="Ansari"
                                className="w-full h-full object-cover rounded-full"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/40/amber/white?text=A";
                                }}
                            />
                        )}
                    </div>
                </motion.div>
            </motion.button>

            {/* Chat Window with Slide Animation */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.3 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.3 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-20 right-5 w-80 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-amber-200"
                    >
                        {/* Header with WhatsApp style */}
                        <div className="bg-gradient-to-r from-amber-700 to-amber-800 text-white p-3 flex items-center space-x-3">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md"
                            >
                                <img
                                    src="/ansari.png"
                                    alt="Ansari"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://via.placeholder.com/40/amber/white?text=A";
                                    }}
                                />
                            </motion.div>
                            <div className="flex-1">
                                <div className="font-semibold">Ansari <span className="font-semibold">- Your AI Assistant
                                </span> </div>
                                <div className="text-xs text-amber-100 flex items-center">
                                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                                    Online
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setOpen(false)}
                                className="text-white hover:text-amber-200 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                            </motion.button>
                        </div>

                        {/* Messages - WhatsApp style bubbles */}
                        <div className="flex-1 p-3 overflow-y-auto bg-[#e5ddd5] bg-opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 10px 10px, rgba(255,255,255,0.2) 2px, transparent 2px)', backgroundSize: '20px 20px' }}>
                            {safeMessages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`mb-3 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {msg.sender === "bot" && (
                                        <div className="w-6 h-6 rounded-full overflow-hidden mr-2 flex-shrink-0 border border-amber-200">
                                            <img src="/ansari.png" alt="Ansari" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className={`max-w-[75%] ${msg.sender === "user" ? "order-1" : "order-2"}`}>
                                        {/* Message bubble */}
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            className={`relative p-2 rounded-lg text-sm break-words ${msg.sender === "user"
                                                ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white"
                                                : "bg-white text-gray-800 shadow-sm border border-gray-100"
                                                }`}
                                        >
                                            {msg.text}
                                            {/* Timestamp */}
                                            <div className={`text-[9px] mt-1 ${msg.sender === "user" ? "text-amber-100" : "text-gray-400"} flex items-center justify-end gap-1`}>
                                                {formatTime(msg.timestamp)}
                                                {msg.sender === "user" && (
                                                    <span>✓✓</span>
                                                )}
                                            </div>
                                        </motion.div>

                                        {/* Product slider - ensure products is array */}
                                        {msg.products && Array.isArray(msg.products) && msg.products.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex gap-2 overflow-x-auto mt-2 pb-1 scrollbar-thin scrollbar-thumb-amber-200"
                                            >
                                                {msg.products.map((p) => (
                                                    <motion.div
                                                        key={p.id}
                                                        whileHover={{ scale: 1.05, y: -2 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => {
                                                            navigate(`/product/${p.id}`);
                                                            setOpen(false);
                                                        }}
                                                        className="min-w-[100px] bg-white border border-amber-100 rounded-lg p-2 cursor-pointer shadow-sm hover:shadow-md transition-all"
                                                    >
                                                        <img
                                                            src={p.image}
                                                            alt={p.name}
                                                            className="w-full h-16 object-cover rounded"
                                                        />
                                                        <div className="text-xs mt-1 font-medium truncate text-gray-700">
                                                            {p.name}
                                                        </div>
                                                        <div className="text-xs text-amber-700 font-semibold">
                                                            ₹{p.price}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Typing indicator */}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start mb-3"
                                >
                                    <div className="w-6 h-6 rounded-full overflow-hidden mr-2 flex-shrink-0 border border-amber-200">
                                        <img src="/ansari.png" alt="Ansari" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                                        <div className="flex space-x-1">
                                            <motion.div
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                                className="w-2 h-2 bg-amber-400 rounded-full"
                                            />
                                            <motion.div
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                                className="w-2 h-2 bg-amber-500 rounded-full"
                                            />
                                            <motion.div
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                                className="w-2 h-2 bg-amber-600 rounded-full"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Predefined questions - only show at start */}
                            {!hasShownQuestions && !isTyping && safeMessages.length === 1 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="mt-3"
                                >
                                    <p className="text-xs text-gray-500 mb-2 ml-2">Suggested questions:</p>
                                    <div className="space-y-2">
                                        {predefinedQuestions.map((q, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 + i * 0.1 }}
                                                whileHover={{ scale: 1.02, x: 5 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => sendMessage(q)}
                                                className="bg-white text-sm px-3 py-2 rounded-lg w-fit cursor-pointer shadow-sm hover:shadow-md border border-amber-200 text-gray-700 hover:border-amber-400 transition-all"
                                            >
                                                {q}
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input - WhatsApp style */}
                        <div className="bg-white border-t border-amber-100 p-2 flex items-center space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-2 outline-none text-sm bg-gray-50 rounded-full border border-gray-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") sendMessage();
                                }}
                            />
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => sendMessage()}
                                className={`p-2 rounded-full ${input.trim()
                                    ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    } transition-all`}
                                disabled={!input.trim()}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatBot;