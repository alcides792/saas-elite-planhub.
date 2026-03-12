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
        avatar_url: string | null;
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
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        Feedback Center
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md">
                        Your input drives our development. Vote on features or suggest new ones.
                    </p>
                </div>

                <motion.button
                    whileHover={{ opacity: 0.9 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsCreating(true)}
                    className="h-10 px-4 bg-gray-900 dark:bg-white text-white dark:text-black font-medium rounded-md transition-all flex items-center justify-center gap-2 text-sm"
                >
                    <Plus size={16} />
                    New Request
                </motion.button>
            </div>

            {/* CATEGORY NAV */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5">
                    {CATEGORIES.map((cat) => {
                        const isSelected = selectedCategory === cat.value;
                        const Icon = cat.icon;
                        return (
                            <button
                                key={cat.value}
                                onClick={() => setSelectedCategory(cat.value)}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[11px] font-medium uppercase tracking-wider transition-all ${isSelected
                                    ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-white/10'
                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                                    }`}
                            >
                                <Icon size={12} className={isSelected ? 'text-gray-900 dark:text-white' : 'opacity-50'} />
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
                                <div className="p-6 md:p-8 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-lg shadow-xl relative">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-lg font-semibold flex items-center gap-3 text-gray-900 dark:text-white uppercase tracking-tight">
                                            Share your thoughts
                                        </h3>
                                        <button onClick={() => setIsCreating(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors">
                                            <X size={18} className="text-gray-400" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 block ml-1">Subject</label>
                                                <input
                                                    type="text"
                                                    placeholder="A short, descriptive title"
                                                    value={newPost.title}
                                                    onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                                                    className="w-full h-10 bg-transparent border border-gray-200 dark:border-[#333] rounded-md px-4 text-sm focus:ring-1 focus:ring-gray-900 dark:focus:ring-white transition-all outline-none text-gray-900 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 block ml-1">Category</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {['idea', 'issue'].map((type) => (
                                                        <button
                                                            key={type}
                                                            onClick={() => setNewPost({ ...newPost, category: type as any })}
                                                            className={`h-10 rounded-md text-[11px] font-semibold uppercase tracking-wider border transition-all flex items-center justify-center gap-2 ${newPost.category === type
                                                                ? 'bg-gray-900 dark:bg-white text-white dark:text-black border-transparent'
                                                                : 'bg-transparent border-gray-200 dark:border-[#333] text-gray-500 dark:text-gray-400'
                                                                }`}
                                                        >
                                                            {type === 'idea' ? <Lightbulb size={12} /> : <AlertCircle size={12} />}
                                                            {type === 'idea' ? 'Idea' : 'Bug Report'}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 block ml-1">Context / Details</label>
                                            <textarea
                                                placeholder="Tell us more about the impact of this request..."
                                                value={newPost.content}
                                                onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                                                rows={5}
                                                className="w-full bg-transparent border border-gray-200 dark:border-[#333] rounded-md p-4 text-sm focus:ring-1 focus:ring-gray-900 dark:focus:ring-white transition-all outline-none resize-none text-gray-900 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end mt-8">
                                        <button
                                            onClick={handleCreatePost}
                                            disabled={isLoading}
                                            className="px-6 h-10 bg-gray-900 dark:bg-white text-white dark:text-black font-medium rounded-md flex items-center gap-2 disabled:opacity-50 transition-all text-sm"
                                        >
                                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                            Submit
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
                        <div className="py-24 text-center bg-transparent border border-dashed border-gray-200 dark:border-[#222] rounded-lg">
                            <p className="text-gray-400 text-sm">Clear skies! No requests found for this filter.</p>
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
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={post.id}
                                    className="group flex gap-5 p-5 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none hover:border-gray-300 dark:hover:border-[#333] transition-all"
                                >
                                    <button
                                        onClick={() => handleVote(post.id)}
                                        disabled={isVoting}
                                        className={`shrink-0 h-14 w-12 rounded-md border flex flex-col items-center justify-center transition-all ${isVoting
                                            ? 'bg-gray-900 dark:bg-white text-white dark:text-black border-transparent'
                                            : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 hover:border-gray-400 dark:hover:border-white/20'
                                            }`}
                                    >
                                        <ChevronUp size={18} className={isVoting ? '' : 'group-hover:-translate-y-0.5 transition-transform'} />
                                        <span className="text-xs font-semibold">{post.votes}</span>
                                    </button>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                                            <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white uppercase tracking-tight">
                                                {post.title}
                                            </h3>
                                            <div className={`px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-widest border ${cat.bg} ${cat.border} ${cat.color}`}>
                                                {cat.label}
                                            </div>
                                        </div>
                                        <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">
                                            {post.content}
                                        </p>
                                        <div className="flex items-center gap-4 text-[10px] font-medium text-gray-400 border-t border-gray-100 dark:border-white/5 pt-3 mt-auto uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary overflow-hidden border border-zinc-200 dark:border-white/10 shrink-0">
                                                    {post.profiles?.avatar_url ? (
                                                        <img
                                                            src={post.profiles.avatar_url}
                                                            alt={post.profiles.full_name || 'User'}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        (post.profiles?.full_name || 'U').charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <span className="text-zinc-600 dark:text-zinc-300">
                                                    {post.profiles?.full_name || 'Kovr User'}
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
