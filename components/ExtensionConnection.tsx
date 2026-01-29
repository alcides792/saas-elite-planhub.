'use client';

import { useState, useEffect } from 'react';
import { generateApiKey, getApiKey, revokeApiKey } from '@/app/actions/api-keys';
import { Copy, Key, RefreshCw, Trash2, Sparkles, Shield, CheckCircle2 } from 'lucide-react';

export function ExtensionConnection() {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showFullKey, setShowFullKey] = useState(false);

    useEffect(() => {
        loadApiKey();
    }, []);

    async function loadApiKey() {
        setLoading(true);
        const result = await getApiKey();
        if (result.success) {
            setApiKey(result.apiKey ?? null);
        }
        setLoading(false);
    }

    async function handleGenerateKey() {
        setGenerating(true);
        const result = await generateApiKey();

        if (result.success && result.apiKey) {
            setApiKey(result.apiKey);
            setShowFullKey(true);

            // Auto-hide full key after 10 seconds
            setTimeout(() => {
                setShowFullKey(false);
            }, 10000);
        } else {
            alert(result.error || 'Erro ao gerar chave');
        }

        setGenerating(false);
    }

    async function handleRevokeKey() {
        if (!confirm('⚠️ Tem certeza? A extensão Chrome parará de funcionar até que você gere uma nova chave.')) {
            return;
        }

        setGenerating(true);
        const result = await revokeApiKey();

        if (result.success) {
            setApiKey(null);
            setShowFullKey(false);
        } else {
            alert(result.error || 'Erro ao revogar chave');
        }

        setGenerating(false);
    }

    function handleCopyKey() {
        if (!apiKey) return;

        navigator.clipboard.writeText(apiKey);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }

    function obfuscateKey(key: string): string {
        if (key.length <= 12) return key;
        return `${key.substring(0, 8)}${'•'.repeat(20)}${key.substring(key.length - 4)}`;
    }

    if (loading) {
        return (
            <div className="extension-connection-card">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="extension-connection-card">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="cyber-icon-wrapper">
                        <Sparkles className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            Kovr Extension Connection
                            {apiKey && (
                                <span className="cyber-badge-success">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Conectado
                                </span>
                            )}
                        </h3>
                        <p className="text-sm text-zinc-400 mt-1">
                            Conecte a extensão Chrome para rastreamento automático de assinaturas
                        </p>
                    </div>
                </div>
            </div>

            {/* API Key Display or Connect Button */}
            {apiKey ? (
                <div className="space-y-4">
                    {/* API Key Display */}
                    <div className="cyber-key-display">
                        <div className="flex items-center gap-2 mb-2">
                            <Key className="w-4 h-4 text-purple-400" />
                            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                                Sua API Key
                            </span>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                readOnly
                                value={showFullKey ? apiKey : obfuscateKey(apiKey)}
                                className="cyber-input font-mono text-sm"
                                onClick={() => setShowFullKey(!showFullKey)}
                            />

                            {!showFullKey && (
                                <button
                                    onClick={() => setShowFullKey(true)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                                >
                                    Mostrar
                                </button>
                            )}
                        </div>

                        {showFullKey && (
                            <p className="text-xs text-amber-400 mt-2 flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                Chave visível. Copie e guarde em local seguro.
                            </p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleCopyKey}
                            disabled={generating}
                            className="cyber-button-primary flex-1"
                        >
                            {copied ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    Copiado!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    Copiar Chave
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleGenerateKey}
                            disabled={generating}
                            className="cyber-button-secondary"
                            title="Gerar nova chave (a anterior será invalidada)"
                        >
                            <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
                            Rotacionar
                        </button>

                        <button
                            onClick={handleRevokeKey}
                            disabled={generating}
                            className="cyber-button-danger"
                            title="Revogar chave"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Instructions */}
                    <div className="cyber-instructions">
                        <h4 className="text-sm font-semibold text-white mb-2">
                            📋 Como usar na extensão:
                        </h4>
                        <ol className="text-xs text-zinc-300 space-y-1 list-decimal list-inside">
                            <li>Copie a API Key acima</li>
                            <li>Abra a extensão Kovr no Chrome</li>
                            <li>Cole a chave nas configurações da extensão</li>
                            <li>Pronto! Suas assinaturas serão sincronizadas automaticamente</li>
                        </ol>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8">
                    <div className="cyber-icon-large mb-4">
                        <Key className="w-12 h-12 text-purple-400" />
                    </div>

                    <h4 className="text-lg font-semibold text-white mb-2">
                        Conecte sua Extensão Chrome
                    </h4>

                    <p className="text-sm text-zinc-400 mb-6 max-w-md mx-auto">
                        Gere uma API Key para conectar a extensão Kovr e começar a rastrear suas assinaturas automaticamente.
                    </p>

                    <button
                        onClick={handleGenerateKey}
                        disabled={generating}
                        className="cyber-button-primary-large"
                    >
                        {generating ? (
                            <>
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                Gerando...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Gerar API Key
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
