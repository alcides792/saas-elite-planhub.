'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Lightbulb, Plus, ArrowUp } from 'lucide-react';
import { getFeedbackPosts, createFeedbackPost, toggleVote } from '@/app/actions/feedback';
import { toast } from 'sonner';

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
    { value: 'all', label: 'All', color: 'bg-zinc-800 text-zinc-300' },
    { value: 'idea', label: 'Idea', color: 'bg-yellow-500/20 text-yellow-400' },
    { value: 'issue', label: 'Issue', color: 'bg-red-500/20 text-red-400' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-blue-500/20 text-blue-400' },
    { value: 'completed', label: 'Completed', color: 'bg-emerald-500/20 text-emerald-400' },
];

export default function FeedbackPage() {
    const [posts, setPosts] = useState<FeedbackPost[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newPost, setNewPost] = useState({ title: '', content: '', category: 'idea' as const });

    useEffect(() => {
        loadPosts();
    }, [selectedCategory]);

    const loadPosts = async () => {
        setIsLoading(true);
        setError(null);

        const { data, error: fetchError } = await getFeedbackPosts(selectedCategory);

        if (fetchError) {
            setError('Failed to load posts. Make sure feedback_schema.sql is applied in Supabase.');
            console.error('Fetch error:', fetchError);
        } else if (data) {
            setPosts(data as FeedbackPost[]);
        }
        setIsLoading(false);
    };

    const handleCreatePost = async () => {
        if (!newPost.title.trim() || !newPost.content.trim()) {
            toast.error('Please fill in both title and content');
            return;
        }

        setIsLoading(true);
        setError(null);

        const { data, error: createError } = await createFeedbackPost(newPost);

        if (createError) {
            setError(`Failed to create post: ${createError}`);
            console.error('Create error:', createError);
            toast.error(`Error: ${createError}`);
        } else {
            setNewPost({ title: '', content: '', category: 'idea' });
            setIsCreating(false);
            await loadPosts();
            toast.success('✅ Post created successfully!');
        }

        setIsLoading(false);
    };

    const handleVote = async (postId: string) => {
        const { error: voteError } = await toggleVote(postId);
        if (voteError) {
            console.error('Vote error:', voteError);
        } else {
            await loadPosts();
        }
    };

    const getCategoryColor = (category: string) => {
        return CATEGORIES.find(c => c.value === category)?.color || 'bg-gray-100 text-gray-700';
    };

    // Helper to get user display name
    const getUserDisplayName = (post: FeedbackPost) => {
        if (post.profiles?.full_name) {
            return post.profiles.full_name;
        }
        return `User ${post.user_id.slice(0, 8)}`;
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Header */}
            <header className="mb-12">
                <h1 className="text-4xl font-black tracking-tight mb-2 text-white">Feedback</h1>
                <p className="text-zinc-300 font-medium">
                    Share new features, report bugs, and share ideas
                </p>
            </header>

            {/* Community Feedback Section */}
            <div className="plan-hub-card p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-white">Community Feedback</h2>
                        <p className="text-sm text-zinc-400">
                            Vote on ideas and help us build the best product
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreating(!isCreating)}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-bold rounded-xl transition-colors"
                    >
                        <Plus size={18} />
                        New Post
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                        <p className="text-sm text-red-700 font-bold mb-1">⚠️ {error}</p>
                        <p className="text-xs text-red-600">
                            Run this SQL in Supabase: <code className="bg-red-100 px-2 py-0.5 rounded font-mono">database/feedback_schema.sql</code>
                        </p>
                    </div>
                )}

                {/* Category Filter */}
                <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => setSelectedCategory(cat.value)}
                            className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${selectedCategory === cat.value
                                ? cat.color + ' ring-2 ring-offset-2 ring-current'
                                : 'bg-gray-100 text-zinc-400 hover:bg-gray-200'
                                }`}
                        >
                            {cat.label}
                            {cat.value !== 'all' && (
                                <span className="ml-2 text-xs opacity-70">
                                    {posts.filter(p => p.category === cat.value).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Create Post Form */}
                {isCreating && (
                    <div className="mb-6 p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl border-2 border-pink-200">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Lightbulb size={20} className="text-yellow-500" />
                            Create New Post
                        </h3>
                        <input
                            type="text"
                            placeholder="Post title..."
                            value={newPost.title}
                            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                            className="plan-hub-input"
                        />
                        <textarea
                            placeholder="Describe your idea, issue, or feedback..."
                            value={newPost.content}
                            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                            rows={4}
                            className="plan-hub-input resize-none"
                        />
                        <div className="flex items-center gap-3">
                            <select
                                value={newPost.category}
                                onChange={(e) => setNewPost({ ...newPost, category: e.target.value as any })}
                                className="plan-hub-input h-11"
                            >
                                <option value="idea">💡 Idea</option>
                                <option value="issue">🐛 Issue</option>
                                <option value="in-progress">🚧 In Progress</option>
                                <option value="completed">✅ Completed</option>
                            </select>
                            <button
                                onClick={handleCreatePost}
                                disabled={isLoading || !newPost.title.trim() || !newPost.content.trim()}
                                className="px-6 py-2 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
                            >
                                {isLoading ? '⏳ Creating...' : '✨ Create Post'}
                            </button>
                            <button
                                onClick={() => setIsCreating(false)}
                                disabled={isLoading}
                                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-bold rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && !isCreating && (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent"></div>
                        <p className="mt-2 text-sm text-zinc-400">Loading posts...</p>
                    </div>
                )}

                {/* Posts List */}
                {!isLoading && posts.length === 0 && (
                    <div className="text-center py-16">
                        <Lightbulb size={48} className="mx-auto mb-4 text-yellow-500" />
                        <h3 className="text-xl font-bold text-white mb-2">Be the first to share!</h3>
                        <p className="text-zinc-400 mb-6">
                            Start the conversation by sharing a feature request, bug report, or idea.
                        </p>
                        <button
                            onClick={() => setIsCreating(true)}
                            className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl transition-colors"
                        >
                            + Create First Post
                        </button>
                    </div>
                )}

                {!isLoading && posts.length > 0 && (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                className="flex items-start gap-4 p-6 bg-zinc-800/50 border-white/5 rounded-xl hover:bg-zinc-800/80 transition-all"
                            >
                                {/* Vote Button */}
                                <button
                                    onClick={() => handleVote(post.id)}
                                    className="flex flex-col items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-pink-100 rounded-lg transition-colors group"
                                >
                                    <ArrowUp size={18} className="text-gray-700 group-hover:text-pink-600" />
                                    <span className="text-sm font-bold text-white">{post.votes}</span>
                                </button>

                                {/* Post Content */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-bold text-white text-lg">{post.title}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getCategoryColor(post.category)}`}>
                                            {post.category.charAt(0).toUpperCase() + post.category.slice(1).replace('-', ' ')}
                                        </span>
                                    </div>
                                    <p className="text-zinc-400 mb-3 leading-relaxed">{post.content}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span className="font-medium">
                                            {getUserDisplayName(post)}
                                        </span>
                                        <span>•</span>
                                        <span>
                                            {new Date(post.created_at).toLocaleDateString('en-US', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
