import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const groq = createOpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: process.env.GROQ_API_KEY, // CERTO
    });

    // 1. CONVERSÃO MANUAL (Substitui o convertToCoreMessages) 🛠️
    // Como a importação falhou, fazemos a limpeza na mão.
    // Isso garante que o histórico vá completo para a IA (sem amnésia).
    const coreMessages = messages.map((m: any) => {
      let content = m.content;

      // Se o conteúdo vier picado (formato novo), junta tudo
      if (!content && m.parts) {
        content = m.parts.map((p: any) => p.text).join('');
      }

      // Garante que é string e trata roles estranhos
      return {
        role: (m.role === 'data' || m.role === 'system') ? 'user' : m.role,
        content: content || '.',
      };
    });

    console.log(`📥 Processando ${coreMessages.length} mensagens...`);

    // 2. Envia para a IA com o histórico limpo
    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      messages: coreMessages, // Usa a nossa lista limpa manualmente
      system: `Você é o Plan Hub Assistant, o especialista financeiro do Plan Hub. 
                Seu objetivo é ajudar o usuário a economizar dinheiro, gerenciar assinaturas e entender seus gastos recorrentes.
                Plan Hub é o central hub para todas as assinaturas e planos recorrentes.
                Tagline: "All your subscriptions. One hub."
                
                Seja profissional, amigável e focado em eficiência financeira.
                Você tem acesso aos dados de assinaturas do usuário (enviados no contexto abaixo).
                Use esses dados para dar insights personalizados.`,
    });

    // 3. Resposta (Usando o método antigo que sabemos que funciona no seu PC)
    return result.toTextStreamResponse();

  } catch (error: any) {
    console.error("❌ ERRO NO BACKEND:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}