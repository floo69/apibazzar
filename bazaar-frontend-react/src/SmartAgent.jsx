import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, X, ArrowRight, Check, Loader2, Zap } from 'lucide-react';

const SUGGESTIONS = [
    "Build a fintech app for India",
    "I need to verify user identities",
    "Setup an e-commerce backend",
    "Create a stock market dashboard"
];

const SmartAgent = ({ onSelectStack, onClose, availableApis }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'agent',
            text: "Hi! I'm BazaarBot, your AI Solution Architect. Describe your project, and I'll design the perfect API stack for you."
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = async (text) => {
        const userText = text || inputValue;
        if (!userText.trim()) return;

        // Add user message
        const userMsg = { id: Date.now(), type: 'user', text: userText };
        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        // Simulate AI thinking delay
        setTimeout(() => {
            const aiResponse = generateAIResponse(userText);
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const generateAIResponse = (query) => {
        const lowerQuery = query.toLowerCase();
        let recommendedIds = [];
        let explanation = "";

        // Simple pattern matching for the hackathon demo
        if (lowerQuery.includes("fintech") || lowerQuery.includes("bank") || lowerQuery.includes("finance")) {
            recommendedIds = ['razorpay', 'penny-drop', 'account-aggregator', 'zynflux-aadhar'];
            explanation = "For a robust Fintech application in India, you need secure payments and regulatory compliance. I've selected a stack including **Razorpay** for transactions, **Penny Drop** for bank verification, and **Account Aggregator** for financial data fetching.";
        } else if (lowerQuery.includes("e-commerce") || lowerQuery.includes("shop") || lowerQuery.includes("store")) {
            recommendedIds = ['payment', 'email', 'notification', 'gst'];
            explanation = "Building an E-commerce platform requires handling orders and communications beautifully. I recommend **Stripe** for global payments, **Resend** for transactional emails, and **Twilio** for order updates. I've also added **GST** verification for B2B merchants.";
        } else if (lowerQuery.includes("verify") || lowerQuery.includes("identity") || lowerQuery.includes("kyc")) {
            recommendedIds = ['zynflux-aadhar', 'signzy', 'digilocker', 'voter-id'];
            explanation = "Identity verification is critical. I've assembled a comprehensive KYC suite: **Zynflux** for Aadhar, **Signzy** for PAN checks, and **DigiLocker** for document retrieval. This covers 99% of Indian user verification needs.";
        } else if (lowerQuery.includes("stock") || lowerQuery.includes("market") || lowerQuery.includes("trade")) {
            recommendedIds = ['finance', 'currency'];
            explanation = "For a trading platform, real-time data is king. I've selected the **Alpha Vantage** Stock API for market data and the **ExchangeRate API** for multi-currency support.";
        } else {
            // Default fallback
            recommendedIds = ['email', 'notification', 'login']; // login isn't real but allows generic flow
            explanation = "That sounds interesting! To get you started with a solid foundation, I recommend our core communication stack: **Email Service** and **SMS Gateway**. This will handle all your user engagement needs. (Mock)";
        }

        // Filter to ensure we only recommend IDs that actually exist in availableApis
        const validIds = recommendedIds.filter(id => availableApis.find(api => api.id === id));
        const stackDetails = validIds.map(id => availableApis.find(api => api.id === id));

        return {
            id: Date.now() + 1,
            type: 'agent',
            text: explanation,
            stack: stackDetails.length > 0 ? stackDetails : null
        };
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white">BazaarBot AI</h2>
                            <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest">Stack Architect Agent</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-4 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.type === 'agent' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-600'
                                }`}>
                                {msg.type === 'agent' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                            </div>

                            <div className={`space-y-4 max-w-[85%] ${msg.type === 'user' ? 'items-end flex flex-col' : ''}`}>
                                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.type === 'user'
                                    ? 'bg-slate-900 text-white rounded-tr-none'
                                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                                    }`}>
                                    {/* Render text with bold formatting */}
                                    {msg.text.split('**').map((part, i) =>
                                        i % 2 === 1 ? <strong key={i} className={msg.type === 'user' ? 'text-indigo-300' : 'text-indigo-600'}>{part}</strong> : part
                                    )}
                                </div>

                                {/* Recommended Stack Card */}
                                {msg.stack && (
                                    <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-lg shadow-indigo-100/50 w-full animate-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">Recommended Stack</span>
                                            <span className="bg-indigo-50 text-indigo-700 text-[10px] px-2 py-1 rounded-full font-bold">{msg.stack.length} APIs</span>
                                        </div>
                                        <div className="space-y-3 mb-4">
                                            {msg.stack.map(api => (
                                                <div key={api.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                                                        <Zap className="w-4 h-4 text-indigo-600" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-bold text-slate-900 text-sm truncate">{api.name}</div>
                                                        <div className="text-[10px] text-slate-500 truncate">{api.provider}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => {
                                                onSelectStack(msg.stack.map(api => api.id));
                                                onClose();
                                            }}
                                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            Deploy This Stack
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                    {/* Quick Suggestions */}
                    {messages.length === 1 && (
                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 hide-scrollbar">
                            {SUGGESTIONS.map((sug, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSendMessage(sug)}
                                    className="whitespace-nowrap px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold rounded-lg transition-colors border border-indigo-100"
                                >
                                    {sug}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Ask me to build something..."
                            className="w-full pl-5 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-inner"
                            disabled={isTyping}
                        />
                        <button
                            onClick={() => handleSendMessage()}
                            disabled={!inputValue.trim() || isTyping}
                            className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20"
                        >
                            {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartAgent;
