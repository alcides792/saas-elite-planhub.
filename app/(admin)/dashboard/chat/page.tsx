'use client';
import { useChat, type UIMessage } from '@ai-sdk/react';
import { useRef, useEffect, useState } from 'react';

export default function ChatPage() {
    const { messages, sendMessage, status, error } = useChat();
    const [input, setInput] = useState('');
    const isLoading = status === 'streaming' || status === 'submitted';
    const bottomRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input || !input.trim() || isLoading) return;

        // @ts-ignore
        sendMessage({ text: input });
        setInput('');
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto p-4">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
                {messages.length === 0 && (
                    <div className="text-center text-zinc-500 mt-20 font-medium">Hello! How can I help with your finances today?</div>
                )}
                {messages.map((m: UIMessage) => {
                    // Tenta obter o texto das 'parts' ou direto de 'content' (compatibilidade de versões)
                    const textFromParts = m.parts
                        ? m.parts
                            .filter(p => p.type === 'text')
                            .map(p => (p.type === 'text' ? p.text : ""))
                            .join('')
                        : '';

                    // @ts-ignore - Fallback para versões onde content ainda existe
                    const textContent = textFromParts || m.content || '';

                    if (!textContent && m.role === 'assistant' && !isLoading) return null;

                    return (
                        <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                            <div className={`max-w-[80%] p-4 rounded-2xl ${m.role === 'user'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/10'
                                : 'bg-zinc-800 text-zinc-100 border border-white/5 active:scale-[0.99] transition-transform'
                                }`}>
                                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {textContent}
                                </div>
                            </div>
                        </div>
                    );
                })}
                {isLoading && (
                    <div className="flex justify-start animate-pulse">
                        <div className="bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-white/5">
                            Typing...
                        </div>
                    </div>
                )}
                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs mt-2">
                        <strong>Error:</strong> {error.message}
                    </div>
                )}
                <div ref={bottomRef} />
            </div>
            <form onSubmit={handleFormSubmit} className="relative">
                <input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your question..."
                    className="w-full p-4 pr-16 rounded-2xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-xl"
                />
                <button
                    type="submit"
                    disabled={isLoading || !input || !input.trim()}
                    className="absolute right-3 top-2.5 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors disabled:opacity-50 shadow-lg shadow-indigo-500/20"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </form>
        </div>
    );
}
