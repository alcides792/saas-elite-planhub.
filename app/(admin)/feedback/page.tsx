'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import {
    Lightbulb, Plus, MessageSquare, AlertCircle, CheckCircle2,
    ChevronUp, Loader2, Sparkles, X, ChevronDown, Filter
} from 'lucide-react';
import { getFeedbackPosts, createFeedbackPost, toggleVote } from '@/app/actions/feedback';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackPost {
    id: string;
    user_id: string;
    title: string;
    content: string;
    category: 'idea' | 'issue' | 'in-progress' | 'completed';
    votes: number;
    created_at: string;
    profiles?: {
        full_name: string | null;
    } | null;
}

const CATEGORIES = [
    { value: 'all', label: 'All', icon: MessageSquare, color: 'text-zinc-500 dark:text-zinc-400', activeColor: 'text-white', bg: 'bg-zinc-100 dark:bg-white/5', activeBg: 'bg-zinc-800 dark:bg-white/10' },
    { value: 'idea', label: 'Idea', icon: Lightbulb, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/20' },
    { value: 'issue', label: 'Issue', icon: AlertCircle, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10', border: 'border-rose-200 dark:border-rose-500/20' },
    { value: 'in-progress', label: 'In Progress', icon: Sparkles, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-500/10', border: 'border-violet-200 dark:border-violet-500/20' },
    { value: 'completed', label: 'Completed', icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20' },
];

export default function FeedbackPage() {
    const [posts, setPosts] = useState<FeedbackPost[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newPost, setNewPost] = useState({ title: '', content: '', category: 'idea' as const });
    const [votingIds, setVotingIds] = useState<string[]>([]);

    useEffect(() => {
        loadPosts();
    }, [selectedCategory]);

    const loadPosts = async () => {
        setIsLoading(true);
        setError(null);

        const { data, error: fetchError } = await getFeedbackPosts(selectedCategory);

        if (fetchError) {
            setError('Could not sync with roadmap. Please check your connection.');
            console.error('Fetch error:', fetchError);
        } else if (data) {
            setPosts(data as FeedbackPost[]);
        }
        setIsLoading(false);
    };

    const handleCreatePost = async () => {
        if (!newPost.title.trim() || !newPost.content.trim()) {
            toast.error('Details matter! Please fill in all fields.');
            return;
        }

        setIsLoading(true);
        const { error: createError } = await createFeedbackPost(newPost);

        if (createError) {
            toast.error('Failed to submit. Try again in a moment.');
        } else {
            setNewPost({ title: '', content: '', category: 'idea' });
            setIsCreating(false);
            await loadPosts();
            toast.success('Roadmap updated! Thanks for your feedback.');
        }
        setIsLoading(false);
    };

    const handleVote = async (postId: string) => {
        if (votingIds.includes(postId)) return;

        setVotingIds(prev => [...prev, postId]);
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, votes: p.votes + 1 } : p));

        const { error: voteError } = await toggleVote(postId);
        if (voteError) {
            toast.error('Vote sync failed.');
            await loadPosts();
        }
        setVotingIds(prev => prev.filter(id => id !== postId));
    };

    const styles = (cat: string) => CATEGORIES.find(c => c.value === cat) || CATEGORIES[0];

    return (
        <div className="w-full animate-fade-in">
            {/* STICKY HEADER AREA */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="h-px w-8 bg-primary/40 block"></span>
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/70">Communit Focus</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        Feedback
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-md">
                        Your input drives our development. Vote on features or suggest new ones.
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsCreating(true)}
                    className="h-12 px-6 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2"
                >
                    <Plus size={18} />
                    New Request
                </motion.button>
            </div>

            {/* CATEGORY NAV */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex items-center gap-2 p-1 bg-zinc-100 dark:bg-white/5 rounded-2xl border border-zinc-200 dark:border-white/5">
                    {CATEGORIES.map((cat) => {
                        const isSelected = selectedCategory === cat.value;
                        const Icon = cat.icon;
                        return (
                            <button
                                key={cat.value}
                                onClick={() => setSelectedCategory(cat.value)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${isSelected
                                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm ring-1 ring-zinc-200 dark:ring-white/10'
                                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
                                    }`}
                            >
                                <Icon size={14} className={isSelected ? 'text-primary' : 'opacity-50'} />
                                {cat.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LIST SECTION */}
                <div className="lg:col-span-12 space-y-4">
                    <AnimatePresence mode="popLayout">
                        {isCreating && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                className="overflow-hidden mb-8"
                            >
                                <div className="p-6 md:p-8 bg-white/90 dark:bg-zinc-900/70 backdrop-blur-2xl border border-zinc-200 dark:border-white/10 rounded-3xl shadow-2xl relative ring-1 ring-primary/10">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                <Lightbulb size={18} />
                                            </div>
                                            Share your thoughts
                                        </h3>
                                        <button onClick={() => setIsCreating(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full transition-colors">
                                            <X size={20} className="text-zinc-400" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2 block ml-1">Subject</label>
                                                <input
                                                    type="text"
                                                    placeholder="A short, descriptive title"
                                                    value={newPost.title}
                                                    onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                                                    className="w-full h-12 bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-none dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2 block ml-1">Category</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {['idea', 'issue'].map((type) => (
                                                        <button
                                                            key={type}
                                                            onClick={() => setNewPost({ ...newPost, category: type as any })}
                                                            className={`h-11 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${newPost.category === type
                                                                ? 'bg-primary/10 border-primary/50 text-primary'
                                                                : 'bg-zinc-50 dark:bg-black/10 border-zinc-200 dark:border-white/5 text-zinc-500'
                                                                }`}
                                                        >
                                                            {type === 'idea' ? <Lightbulb size={14} /> : <AlertCircle size={14} />}
                                                            {type === 'idea' ? 'Idea' : 'Bug Report'}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2 block ml-1">Context / Details</label>
                                            <textarea
                                                placeholder="Tell us more about the impact of this request..."
                                                value={newPost.content}
                                                onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                                                rows={5}
                                                className="w-full bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-none resize-none dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end mt-8">
                                        <button
                                            onClick={handleCreatePost}
                                            disabled={isLoading}
                                            className="px-8 h-12 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl flex items-center gap-2 disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-rose-500/30"
                                        >
                                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                                            Share
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {isLoading && !isCreating && (
                        <div className="flex flex-col items-center justify-center py-32 space-y-4">
                            <Loader2 size={40} className="animate-spin text-primary/40" />
                            <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase">Syncing with server</p>
                        </div>
                    )}

                    {!isLoading && posts.length === 0 && (
                        <div className="py-32 text-center bg-zinc-50 dark:bg-white/[0.02] border border-dashed border-zinc-200 dark:border-white/10 rounded-3xl">
                            <p className="text-zinc-400 font-medium">Clear skies! No requests found for this filter.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                        {posts.map((post, i) => {
                            const cat = styles(post.category);
                            const Icon = cat.icon;
                            const isVoting = votingIds.includes(post.id);

                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={post.id}
                                    className="group flex gap-4 p-5 md:p-6 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-2xl hover:border-primary/30 dark:hover:border-primary/30 transition-all shadow-lg hover:shadow-xl ring-1 ring-black/5 dark:ring-white/5"
                                >
                                    <button
                                        onClick={() => handleVote(post.id)}
                                        disabled={isVoting}
                                        className={`shrink-0 h-16 w-14 rounded-xl border flex flex-col items-center justify-center transition-all ${isVoting
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-zinc-50 dark:bg-black/20 border-zinc-200 dark:border-white/10 text-zinc-400 hover:border-primary/50 group-hover:bg-primary/5'
                                            }`}
                                    >
                                        <ChevronUp size={24} className={isVoting ? '' : 'group-hover:-translate-y-1 transition-transform'} />
                                        <span className="text-sm font-bold">{post.votes}</span>
                                    </button>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                                            <h3 className="text-base md:text-lg font-bold text-zinc-900 dark:text-white truncate">
                                                {post.title}
                                            </h3>
                                            <div className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tight border ${cat.bg} ${cat.border} ${cat.color}`}>
                                                {cat.label}
                                            </div>
                                        </div>
                                        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-2 group-hover:line-clamp-none transition-all duration-500">
                                            {post.content}
                                        </p>
                                        <div className="flex items-center gap-4 text-[11px] font-bold text-zinc-400 border-t border-zinc-100 dark:border-white/5 pt-3 mt-auto">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[8px] text-primary">
                                                    {(post.profiles?.full_name || 'U').charAt(0)}
                                                </div>
                                                <span className="text-zinc-600 dark:text-zinc-300">
                                                    {post.profiles?.full_name || 'Anonymous User'}
                                                </span>
                                            </div>
                                            <span>•</span>
                                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
