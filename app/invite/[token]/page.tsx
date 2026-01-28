'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { acceptInvite } from '@/app/actions/family';

export default function InvitePage({ params }: { params: { token: string } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        handleAcceptInvite();
    }, []);

    async function handleAcceptInvite() {
        setLoading(true);
        const result = await acceptInvite(params.token);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                router.push('/family');
            }, 2000);
        } else {
            setError(result.error || 'Erro ao aceitar convite');
        }

        setLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="plan-hub-card p-12 text-center">
                    {loading && (
                        <>
                            <Loader2 className="w-16 h-16 animate-spin text-indigo-500 mx-auto mb-6" />
                            <h2 className="text-2xl font-black text-white mb-3">
                                Processando Convite...
                            </h2>
                            <p className="text-zinc-300 font-medium">
                                Aguarde enquanto adicionamos você à família
                            </p>
                        </>
                    )}

                    {success && (
                        <>
                            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-green-400" />
                            </div>
                            <h2 className="text-2xl font-black text-green-400 mb-3">
                                Convite Aceito!
                            </h2>
                            <p className="text-zinc-300 font-medium mb-4">
                                Você agora faz parte da família
                            </p>
                            <p className="text-sm text-slate-500">
                                Redirecionando para a página da família...
                            </p>
                        </>
                    )}

                    {error && (
                        <>
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                                <XCircle className="w-10 h-10 text-red-400" />
                            </div>
                            <h2 className="text-2xl font-black text-red-400 mb-3">
                                Erro ao Aceitar Convite
                            </h2>
                            <p className="text-zinc-300 font-medium mb-6">
                                {error}
                            </p>
                            <button
                                onClick={() => router.push('/family')}
                                className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-500/20"
                            >
                                Ir para Família
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
