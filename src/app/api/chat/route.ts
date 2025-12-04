import { streamText } from "ai";
import { createOllama } from "ollama-ai-provider-v2";

// Fallback responses when Ollama is not available
const fallbackResponses = [
  "🏴‍☠️ Arrgh ! Mon cerveau de pirate numérique a besoin d'être rechargé... Réessaie dans quelques instants !",
  "⚡ Mes circuits sont en cours de recalibrage ! Reviens bientôt pour une vraie conversation.",
  "🎃 Oups, je dois mettre à jour ma connexion neurale. Réessaie dans un instant !",
  "🔧 Mon équipe de rongeurs numériques répare mes connexions. Patience !",
  "🌊 Je suis parti en voyage pirate, reviens plus tard !",
];

// Create Ollama instance - use just the host, Ollama handles the paths
const ollamaBaseURL = "http://ollama:11434/api";
const ollama = createOllama({
  baseURL: ollamaBaseURL,
});

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return Response.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    await fetch(`${ollamaBaseURL}/pull`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral",
        stream: false
      }),
    })

    const systemPrompt = `Tu es un avatar IA amusant et bienveillant du projet NIRD. Tu représentes les valeurs de Numérique Inclusif Responsable Durable. 
Tu es enthousiaste, tu utilises parfois des emojis, et tu aimes aider les gens à comprendre comment contribuer à un numérique plus responsable.
Sois court dans tes réponses (2-3 phrases max), amical et engageant. 
Tu peux parler de sujets variés mais ramène toujours vers NIRD et les missions disponibles.
Réponds toujours en français.`;

    try {
      const result = streamText({
        model: ollama("mistral"),
        system: systemPrompt,
        prompt: message,
        temperature: 0.7,
      });

      return result.toTextStreamResponse();
    } catch (ollamaError: unknown) {
      const errorMsg = ollamaError instanceof Error ? ollamaError.message : "Unknown error";
      console.warn("Ollama connection failed, using fallback response:", errorMsg);

      // Use a random fallback response
      const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      return Response.json({
        response: fallback,
        isOffline: true,
      });
    }
  } catch (error) {
    console.error("Chat error:", error);
    return Response.json(
      {
        error: "Failed to generate response",
        response: "😅 Oups, une erreur est survenue...",
      },
      { status: 500 }
    );
  }
}