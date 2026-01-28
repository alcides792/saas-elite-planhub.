'use client';

import { useState, useEffect } from 'react';
import { Users, UserPlus, Copy, Trash2, LogOut, Crown, Mail, Link as LinkIcon, Loader2, CheckCircle2 } from 'lucide-react';
import {
    getMyFamily,
    createFamily,
    inviteByEmail,
    getPendingInvites,
    removeMember,
    leaveFamily,
    getMemberSubscriptions,
} from '@/app/actions/family';
import { useUser } from '@/contexts/UserContext';
import SubscriptionLogo from '@/components/ui/subscription-logo';

export default function FamilyPage() {
    const { formatMoney } = useUser();
    const [loading, setLoading] = useState(true);
    const [family, setFamily] = useState<any>(null);
    const [invites, setInvites] = useState<any[]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [familyName, setFamilyName] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [processing, setProcessing] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [copiedLink, setCopiedLink] = useState<string | null>(null);
    const [auditingMember, setAuditingMember] = useState<any>(null);
    const [memberSubscriptions, setMemberSubscriptions] = useState<any[]>([]);
    const [loadingAudit, setLoadingAudit] = useState(false);

    useEffect(() => {
        loadFamilyData();
    }, []);

    async function loadFamilyData() {
        setLoading(true);
        const familyResult = await getMyFamily();

        if (familyResult.success && familyResult.family) {
            setFamily(familyResult.family);

            // Load pending invites
            const invitesResult = await getPendingInvites();
            if (invitesResult.success && invitesResult.invites) {
                setInvites(invitesResult.invites);
            }
        }

        setLoading(false);
    }

    async function handleCreateFamily(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        setMessage(null);

        const result = await createFamily(familyName);

        if (result.success) {
            setMessage({ type: 'success', text: 'Family created successfully!' });
            setShowCreateForm(false);
            setFamilyName('');
            await loadFamilyData();
        } else {
            setMessage({ type: 'error', text: result.error || 'Error creating family' });
        }

        setProcessing(false);
    }

    async function handleInvite(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        setMessage(null);

        const result = await inviteByEmail(inviteEmail);

        if (result.success && result.inviteLink) {
            setMessage({ type: 'success', text: 'Invite created! Copy the link below.' });
            setInviteEmail('');
            await loadFamilyData();

            // Auto-copy link
            navigator.clipboard.writeText(result.inviteLink);
            setCopiedLink(result.inviteLink);
            setTimeout(() => setCopiedLink(null), 3000);
        } else {
            setMessage({ type: 'error', text: result.error || 'Error creating invite' });
        }

        setProcessing(false);
    }

    async function handleRemoveMember(memberId: string) {
        if (!confirm('Are you sure you want to remove this member?')) return;

        setProcessing(true);
        const result = await removeMember(memberId);

        if (result.success) {
            setMessage({ type: 'success', text: 'Member removed successfully!' });
            await loadFamilyData();
        } else {
            setMessage({ type: 'error', text: result.error || 'Error removing member' });
        }

        setProcessing(false);
    }

    async function handleLeaveFamily() {
        if (!confirm('Are you sure you want to leave the family?')) return;

        setProcessing(true);
        const result = await leaveFamily();

        if (result.success) {
            setMessage({ type: 'success', text: 'You left the family' });
            await loadFamilyData();
        } else {
            setMessage({ type: 'error', text: result.error || 'Error leaving the family' });
        }

        setProcessing(false);
    }

    async function handleAuditMember(member: any) {
        if (!isOwner || member.role === 'owner') return;

        setAuditingMember(member);
        setLoadingAudit(true);
        const result = await getMemberSubscriptions(member.user_id);

        if (result.success && result.subscriptions) {
            setMemberSubscriptions(result.subscriptions);
        } else {
            console.error(result.error);
            setMemberSubscriptions([]);
        }
        setLoadingAudit(false);
    }

    function copyInviteLink(link: string) {
        const fullLink = `${window.location.origin}/invite/${link}`;
        navigator.clipboard.writeText(fullLink);
        setCopiedLink(link);
        setTimeout(() => setCopiedLink(null), 2000);
    }

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                </div>
            </div>
        );
    }

    // Empty state - No family
    if (!family) {
        return (
            <div className="max-w-4xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-2 leading-none">
                        Family.
                    </h1>
                    <p className="text-xl font-medium opacity-60">
                        Share subscriptions with your family
                    </p>
                </header>

                {message && (
                    <div
                        className={`mb-6 p-4 rounded-xl font-semibold ${message.type === 'success'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                {!showCreateForm ? (
                    <div className="plan-hub-card p-12 text-center">
                        <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mx-auto mb-6">
                            <Users size={40} strokeWidth={2} />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-3">Create your Family Group</h3>
                        <p className="text-zinc-300 font-medium mb-6 max-w-md mx-auto">
                            Share your subscriptions with family members and split costs intelligently.
                        </p>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-500/20"
                        >
                            Create Family Group
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleCreateFamily} className="plan-hub-card p-8">
                        <h3 className="text-xl font-black text-white mb-6">New Family</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-2 text-zinc-300">
                                    Family Name
                                </label>
                                <input
                                    type="text"
                                    value={familyName}
                                    onChange={(e) => setFamilyName(e.target.value)}
                                    placeholder="e.g. Smith Family"
                                    className="plan-hub-input rounded-xl px-4 py-3 text-sm font-medium"
                                    required
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                                >
                                    {processing ? 'Creating...' : 'Create Family'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateForm(false)}
                                    className="px-6 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-zinc-300 font-bold text-sm transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        );
    }

    // Has family - Show family management
    const isOwner = family.members.some((m: any) => m.user_id === family.owner_id && m.role === 'owner');
    const currentUserMember = family.members.find((m: any) => m.role === 'owner') || family.members[0];

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <header className="mb-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-2 leading-none">
                            {family.name}
                        </h1>
                        <p className="text-xl font-medium opacity-60">
                            {family.members.length} member{family.members.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    {!isOwner && (
                        <button
                            onClick={handleLeaveFamily}
                            disabled={processing}
                            className="px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 font-bold text-sm transition-all flex items-center gap-2"
                        >
                            <LogOut size={16} />
                            Leave Family
                        </button>
                    )}
                </div>
            </header>

            {/* Messages */}
            {message && (
                <div
                    className={`mb-6 p-4 rounded-xl font-semibold ${message.type === 'success'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                        }`}
                >
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Members List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="plan-hub-card p-8">
                        <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                            <Users size={20} />
                            Members
                        </h3>
                        <div className="space-y-3">
                            {family.members.map((member: any) => (
                                <div
                                    key={member.user_id}
                                    onClick={() => handleAuditMember(member)}
                                    className={`flex items-center justify-between p-4 bg-gray-500/5 dark:bg-white/5 rounded-xl transition-all ${isOwner && member.role !== 'owner' ? 'cursor-pointer hover:bg-indigo-500/5 border border-transparent hover:border-indigo-500/20' : ''} ${auditingMember?.user_id === member.user_id ? 'ring-2 ring-indigo-500/50 bg-indigo-500/5' : ''}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold border-2 border-indigo-500/5">
                                            {member.full_name?.[0]?.toUpperCase() || member.email[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-zinc-900 dark:text-white">
                                                    {member.full_name || member.email}
                                                </p>
                                                {member.role === 'owner' ? (
                                                    <Crown size={14} className="text-amber-500" />
                                                ) : (
                                                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider rounded-full border border-emerald-500/20">
                                                        Sponsored
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{member.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isOwner && member.role !== 'owner' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveMember(member.user_id);
                                                }}
                                                disabled={processing}
                                                className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-400 hover:text-red-500 transition-colors"
                                                title="Remove member"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Audit View for Admin */}
                    {isOwner && auditingMember && (
                        <div className="plan-hub-card p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-black text-zinc-900 dark:text-white">
                                        Auditing: {auditingMember.full_name || auditingMember.email}
                                    </h3>
                                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                        Real-time subscription audit for family transparency.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setAuditingMember(null)}
                                    className="text-xs font-black uppercase text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                                >
                                    Close Audit
                                </button>
                            </div>

                            {loadingAudit ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                                </div>
                            ) : memberSubscriptions.length > 0 ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1">
                                                Active Subscriptions
                                            </p>
                                            <p className="text-2xl font-black text-zinc-900 dark:text-white">
                                                {memberSubscriptions.filter(s => s.status === 'active').length}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">
                                                Estimated Monthly
                                            </p>
                                            <p className="text-2xl font-black text-zinc-900 dark:text-white">
                                                {formatMoney(memberSubscriptions
                                                    .filter(s => s.status === 'active')
                                                    .reduce((sum, s) => sum + (s.billing_type === 'yearly' ? s.amount / 12 : s.amount), 0)
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {memberSubscriptions.map((sub) => (
                                            <div
                                                key={sub.id}
                                                className="flex items-center justify-between p-4 bg-gray-500/5 dark:bg-white/5 rounded-xl border border-transparent hover:border-zinc-200 dark:hover:border-white/10 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <SubscriptionLogo
                                                        name={sub.name}
                                                        domain={sub.website?.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]}
                                                        size="sm"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-bold text-zinc-900 dark:text-white">{sub.name}</p>
                                                        <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 capitalize">
                                                            {sub.category} • {sub.billing_type}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-black text-zinc-900 dark:text-white">
                                                        {formatMoney(sub.amount)}
                                                    </p>
                                                    <p className={`text-[10px] font-black uppercase tracking-tighter ${sub.status === 'active' ? 'text-emerald-500' : 'text-zinc-400'}`}>
                                                        {sub.status}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 px-4 border-2 border-dashed border-zinc-100 dark:border-white/5 rounded-3xl">
                                    <p className="text-zinc-500 dark:text-zinc-400 font-medium italic">
                                        This member hasn't added any subscriptions yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Invite Section */}
                <div className="space-y-6">
                    {/* Invite Form */}
                    {isOwner && (
                        <div className="plan-hub-card p-6">
                            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                                <UserPlus size={18} />
                                Invite Member
                            </h3>
                            <form onSubmit={handleInvite} className="space-y-3">
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="email@example.com"
                                    className="plan-hub-input rounded-xl px-4 py-3 text-sm font-medium"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full px-4 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Mail size={16} />
                                            Send Invite
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Pending Invites */}
                    {isOwner && invites.length > 0 && (
                        <div className="plan-hub-card p-6">
                            <h3 className="text-lg font-black text-white mb-4">Pending Invites</h3>
                            <div className="space-y-3">
                                {invites.map((invite) => (
                                    <div key={invite.id} className="p-3 bg-white/5 rounded-lg">
                                        <p className="text-sm font-bold text-white mb-1">{invite.email}</p>
                                        <button
                                            onClick={() => copyInviteLink(invite.token)}
                                            className="text-xs text-indigo-500 hover:text-indigo-600 font-semibold flex items-center gap-1"
                                        >
                                            {copiedLink === invite.token ? (
                                                <>
                                                    <CheckCircle2 size={12} />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={12} />
                                                    Copy Link
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
