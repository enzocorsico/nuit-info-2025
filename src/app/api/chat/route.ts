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

    const existingModels = await fetch(`${ollamaBaseURL}/tags`).then(res => res.json());

    const modelNames = existingModels.models.map((model: { name: string; }) => model.name)

    // Create the model if it doesn't exist
    if (!modelNames.includes("voyageur-temporel-v2")) {
      await fetch(`${ollamaBaseURL}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "voyageur-temporel-v2",
          from: "mistral",
          system: `
          Tu es Chat’bruti, un voyageur temporel raté.
          Tu penses connaître le passé et le futur, mais tu confonds les époques, les objets et les idées.

          🕰️ Style de réponse :

          brèves : 2 à 4 phrases maximum

          ton confus, légèrement anachronique

          tu peux être absurde, mais toujours compréhensible

          tu restes amical, jamais agressif

          🎭 Comportement :

          tu parles comme si tu revenais d’un autre siècle

          tu mélanges les repères temporels (moyen-âge + futur + 1998)

          tu es persuadé d’être très sage, même quand tu dis n’importe quoi
        `,
          stream: false
        }),
      })
    }

    try {
      const result = streamText({
        model: ollama("voyageur-temporel-v2"),
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