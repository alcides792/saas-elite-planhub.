import OpenAI from 'openai';
import { createUIMessageStream, createUIMessageStreamResponse, generateId } from 'ai';
import { createClient } from '@/utils/supabase/server';
import { requireProPlan } from '@/utils/gatekeeper';
import { NextResponse } from 'next/server';

export const maxDuration = 30;

// Groq Client Configuration
const getGroqClient = () => {
  const apiKey = (process.env.GROQ_API_KEY || '').trim();

  if (!apiKey) {
    console.error("❌ ERROR: GROQ_API_KEY not found in environment.");
  }

  return new OpenAI({
    apiKey: apiKey,
    // Let SDK manage fetch and default baseURL
    baseURL: 'https://api.groq.com/openai/v1',
  });
};

export async function POST(req: Request) {
  try {
    // 🔒 SECURITY GATE
    const isPro = await requireProPlan();
    if (!isPro) {
      return NextResponse.json(
        { error: "Blocked: AI features are exclusive to the Pro plan." },
        { status: 403 }
      );
    }

    const { messages } = await req.json();
    const groqClient = getGroqClient();

    // 1. User Context (Supabase)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let systemPrompt = `You are Kovr Assistant, a financial specialist. Respond in English. Be direct and concise.`;

    if (user) {
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('name, amount, currency, status, billing_type')
        .eq('user_id', user.id);

      const summary = subscriptions?.length ? JSON.stringify(subscriptions) : "No subscriptions found.";
      systemPrompt += `\n\nUSER DATA:\n${summary}`;
    }

    // 2. Message Assembly and Cleaning
    const finalMessages: any[] = [
      { role: 'system', content: systemPrompt }
    ];

    if (Array.isArray(messages)) {
      messages.forEach((m: any) => {
        if (m.role === 'user' || m.role === 'assistant') {
          let cleanContent = '';
          if (typeof m.content === 'string') {
            cleanContent = m.content;
          } else if (Array.isArray(m.content)) {
            cleanContent = m.content.map((c: any) => c.text || '').join('');
          } else if (m.parts) {
            cleanContent = m.parts.map((p: any) => p.text || '').join('');
          }

          if (cleanContent && cleanContent.trim().length > 0) {
            finalMessages.push({
              role: m.role,
              content: cleanContent.trim()
            });
          }
        }
      });
    }

    console.log(`🚀 [v2-fresh] Sending ${finalMessages.length} messages to Groq. Key prefix: ${process.env.GROQ_API_KEY?.substring(0, 7)}`);

    // 3. Call and Streaming
    const stream = createUIMessageStream({
      onError: (err) => {
        console.error("❌ Stream Error:", err);
        return err instanceof Error ? err.message : 'An error occurred during the stream.';
      },
      execute: async ({ writer }) => {
        try {
          const response = await groqClient.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            stream: true,
            messages: finalMessages,
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
          console.error("❌ ERROR DURING STREAM:", streamError);
          throw streamError;
        }
      },
    });

    return createUIMessageStreamResponse({ stream });

  } catch (error: any) {
    console.error("❌ API ERROR:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401, // Mantemos o status de erro se falhar na criação
      headers: { 'Content-Type': 'application/json' }
    });
  }
}