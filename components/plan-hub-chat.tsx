'use client';

// A importação que estava falhando agora vai funcionar com a v6 do SDK
import { useChat, type UIMessage } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot } from 'lucide-react'; // Assuming lucide-react is installed for the Bot icon

export default function PlanHubChat() {
    const { messages, sendMessage, status } = useChat();
    const [input, setInput] = useState('');
    const isLoading = status === 'streaming' || status === 'submitted';

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        sendMessage({ text: input });
        setInput('');
    };

    const scrollRef = useRef<HTMLDivElement>(null);

    // Scroll automático
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-[500px] w-full border border-white/10 rounded-xl bg-black/40 backdrop-blur-md overflow-hidden">

            {/* Header */}
            <div className="p-4 bg-zinc-900 border-b border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-bold text-white text-sm">Plan Hub Financial AI</span>
            </div>

            {/* Mensagens */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 1 && ( // Only the initial welcome message
                    <div className="text-center text-zinc-500 mt-20 text-sm">
                        Type &quot;How to invest $100?&quot; to start.
                    </div>
                )}

                {messages.map((m: UIMessage) => {
                    // Adaptando para v6: extrai o texto das partes
                    const textContent = m.parts
                        .filter(p => p.type === 'text')
                        .map(p => (p.type === 'text' ? p.text : ""))
                        .join('');

                    return (
                        <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-lg text-sm ${m.role === 'user'
                                ? 'bg-violet-600 text-white'
                                : 'bg-zinc-800 text-zinc-200 border border-white/10'
                                }`}>
                                <strong className="block text-[10px] opacity-50 mb-1 uppercase">
                                    {m.role === 'user' ? 'You' : 'Plan Hub AI'}
                                </strong>
                                {/* Renderiza Markdown (Negrito, Listas) */}
                                <ReactMarkdown>{textContent}</ReactMarkdown>
                            </div>
                        </div>
                    );
                })}

                {/* Loading Indicator */}
                {isLoading && (
                    <div className="flex justify-start items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white">
                            <Bot size={16} />
                        </div>
                        <span className="font-bold text-sm text-zinc-900 dark:text-white">Plan Hub AI is thinking...</span>
                    </div>
                )}

                {/* Mostra erro visual se houver */}
                {/* The useChat hook in the provided edit does not expose 'error' directly,
                    so this block would need adjustment if error handling is still desired.
                    For now, removing it as per the provided edit's implied changes.
                */}
            </div>

            {/* Input */}
            <form onSubmit={handleFormSubmit} className="p-3 bg-zinc-900 border-t border-white/10 flex gap-2">
                <input
                    className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Your question..."
                />
                <button
                    type="submit"
                    className="bg-violet-600 hover:bg-violet-500 text-white px-4 rounded-lg text-sm font-bold transition-colors"
                    disabled={isLoading || !input}
                >
                    Send
                </button>
            </form>
        </div>
    );
}