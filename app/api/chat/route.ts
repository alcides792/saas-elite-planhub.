import OpenAI from 'openai';
import { createUIMessageStream, createUIMessageStreamResponse, generateId } from 'ai';
import { createClient } from '@/utils/supabase/server';

export const maxDuration = 30;

// Configuração do Cliente Groq
const getGroqClient = () => {
  const apiKey = (process.env.GROQ_API_KEY || '').trim();

  if (!apiKey) {
    console.error("❌ ERRO: GROQ_API_KEY não encontrada no ambiente.");
  }

  return new OpenAI({
    apiKey: apiKey,
    // Deixamos o SDK gerenciar o fetch e a baseURL padrão
    baseURL: 'https://api.groq.com/openai/v1',
  });
};

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const groqClient = getGroqClient();

    // 1. Contexto do Usuário (Supabase)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let textoSistema = `You are Kovr Assistant, a financial specialist. Respond in English. Be direct and concise.`;

    if (user) {
      const { data: assinaturas } = await supabase
        .from('subscriptions')
        .select('name, amount, currency, status, billing_type')
        .eq('user_id', user.id);

      const resumo = assinaturas?.length ? JSON.stringify(assinaturas) : "No subscriptions found.";
      textoSistema += `\n\nUSER DATA:\n${resumo}`;
    }

    // 2. Montagem e Limpeza de Mensagens
    const mensagensFinais: any[] = [
      { role: 'system', content: textoSistema }
    ];

    if (Array.isArray(messages)) {
      messages.forEach((m: any) => {
        if (m.role === 'user' || m.role === 'assistant') {
          let conteudoLimpo = '';
          if (typeof m.content === 'string') {
            conteudoLimpo = m.content;
          } else if (Array.isArray(m.content)) {
            conteudoLimpo = m.content.map((c: any) => c.text || '').join('');
          } else if (m.parts) {
            conteudoLimpo = m.parts.map((p: any) => p.text || '').join('');
          }

          if (conteudoLimpo && conteudoLimpo.trim().length > 0) {
            mensagensFinais.push({
              role: m.role,
              content: conteudoLimpo.trim()
            });
          }
        }
      });
    }

    console.log(`🚀 [v2-fresh] Enviando ${mensagensFinais.length} mensagens para Groq. Chave prefixo: ${process.env.GROQ_API_KEY?.substring(0, 7)}`);

    // 3. Chamada e Streaming
    const stream = createUIMessageStream({
      onError: (err) => {
        console.error("❌ Erro na Stream:", err);
        return err instanceof Error ? err.message : 'Ocorreu um erro durante a stream.';
      },
      execute: async ({ writer }) => {
        try {
          const response = await groqClient.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            stream: true,
            messages: mensagensFinais,
            temperature: 0.7,
          });

          const id = generateId();
          writer.write({ type: 'text-start', id });

          for await (const chunk of response) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) {
              writer.write({ type: 'text-delta', id, delta });
            }
          }

          writer.write({ type: 'text-end', id });
        } catch (streamError: any) {
          console.error("❌ ERRO DURANTE STREAM:", streamError);
          throw streamError;
        }
      },
    });

    return createUIMessageStreamResponse({ stream });

  } catch (error: any) {
    console.error("❌ ERRO API:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401, // Mantemos o status de erro se falhar na criação
      headers: { 'Content-Type': 'application/json' }
    });
  }
}