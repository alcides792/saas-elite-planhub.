'use client';

import { useChat, type UIMessage } from '@ai-sdk/react';
import { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, ArrowUp, MoreVertical } from 'lucide-react';
import ProModal from '@/components/ProModal';
import { toast } from 'sonner';

export default function KovrChat() {
    const { messages, sendMessage, status, error, setMessages } = useChat();
    const [input, setInput] = useState('');
    const [isProModalOpen, setIsProModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isLoading = status === 'streaming' || status === 'submitted';

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        sendMessage({ text: input });
        setInput('');
    };

    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Persistence: Load
    useEffect(() => {
        const savedChat = localStorage.getItem('kovr_ai_chat');
        if (savedChat) {
            try {
                const data = JSON.parse(savedChat);
                const isValid = (Date.now() - data.timestamp) < 30 * 60 * 1000; // 30 minutes

                if (isValid && data.messages) {
                    setMessages(data.messages);
                } else {
                    localStorage.removeItem('kovr_ai_chat');
                }
            } catch (e) {
                console.error("Error retrieving chat:", e);
                localStorage.removeItem('kovr_ai_chat');
            }
        }
    }, [setMessages]);

    // Persistence: Save
    useEffect(() => {
        if (messages.length > 0) {
            const data = {
                messages,
                timestamp: Date.now()
            };
            localStorage.setItem('kovr_ai_chat', JSON.stringify(data));
        }
    }, [messages]);

    const clearChat = () => {
        setMessages([]);
        localStorage.removeItem('kovr_ai_chat');
        setIsMenuOpen(false);
    };

    const openProModal = () => setIsProModalOpen(true);

    // Detecção de erro Pro
    useEffect(() => {
        if (error) {
            if (error.message?.includes("Blocked") || error.message?.includes("Pro")) {
                openProModal();
            } else {
                toast.error("An error occurred. Please try again.");
            }
        }
    }, [error]);

    return (
        <div className="flex flex-col h-[700px] w-full bg-transparent overflow-hidden transition-colors duration-200">


            {/* Mensagens */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center px-4">
                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 flex items-center justify-center mb-4 shadow-sm">
                            <Bot size={24} className="text-gray-900 dark:text-white" />
                        </div>
                        <h3 className="text-gray-900 dark:text-white font-bold mb-1">Start a conversation</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[240px]">
                            Hello! I am Kovr AI. How can I help with your finances today?
                        </p>
                    </div>
                )}

                {messages.map((m: UIMessage) => {
                    const textContent = m.parts
                        ? m.parts
                            .filter(p => p.type === 'text')
                            .map(p => (p.type === 'text' ? p.text : ""))
                            .join('')
                        : '';

                    return (
                        <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${m.role === 'user'
                                ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-900 dark:text-white'
                                }`}>
                                {m.role === 'assistant' && (
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-5 h-5 rounded-md bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 flex items-center justify-center">
                                            <Bot size={12} className="text-gray-900 dark:text-white" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Kovr AI</span>
                                    </div>
                                )}
                                <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed">
                                    <ReactMarkdown>{textContent}</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Loading Indicator */}
                {isLoading && (
                    <div className="flex justify-start items-center gap-3 animate-in fade-in duration-300">
                        <div className="w-8 h-8 rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-sm">
                            <Bot size={16} className="text-gray-900 dark:text-white animate-pulse" />
                        </div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Thinking...</span>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-6 bg-transparent">
                <form onSubmit={handleFormSubmit} className="relative max-w-4xl mx-auto">
                    <input
                        className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 pr-14 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-white/20 transition-all shadow-sm placeholder:text-gray-400 dark:placeholder:text-zinc-600"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask Kovr Agent..."
                    />
                    <button
                        type="submit"
                        className="absolute right-2.5 top-2.5 p-2 bg-black text-white dark:bg-white dark:text-black rounded-xl hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                        disabled={isLoading || !input}
                    >
                        <ArrowUp size={20} className="group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                </form>
            </div>

            {/* Pro Modal */}
            <ProModal
                isOpen={isProModalOpen}
                onClose={() => setIsProModalOpen(false)}
            />
        </div>
    );
}