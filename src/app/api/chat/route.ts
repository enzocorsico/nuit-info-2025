import { streamText } from "ai";
import { createOllama } from "ollama-ai-provider-v2";
import {
  checkRateLimit,
  validateMessageContent,
  getCachedResponse,
  cacheResponse,
  getClientId,
  createCacheKey,
} from "@/lib/abusePreventionMiddleware";

// Fallback responses when Ollama is not available
const fallbackResponses = [
  "🏴‍☠️ Mon cerveau numérique a besoin d'une pause...",
  "⚡ Mes circuits se recalibrent! Réessaie dans un instant.",
  "🎃 Je dois mettre à jour ma connexion. Reviens bientôt!",
];

// Create Ollama instance
const ollamaBaseURL = "http://ollama:11434/api";
const ollama = createOllama({
  baseURL: ollamaBaseURL,
});

interface ChatRequest {
  message: string;
  missionId?: string;
  stepId?: string;
  context?: {
    missionTitle?: string;
    stepTitle?: string;
  };
  type?: "mission-help" | "normal";
}

export async function POST(request: Request) {
  try {
    const body: ChatRequest = await request.json();
    const { message, type = "normal", missionId, context } = body;

    // Get client ID for rate limiting
    const clientId = getClientId(request);

    // Check rate limit
    const rateLimitCheck = checkRateLimit(clientId);
    if (!rateLimitCheck.allowed) {
      return Response.json(
        { error: rateLimitCheck.message },
        { status: 429 }
      );
    }

    // Validate message content
    const validation = validateMessageContent(message);
    if (!validation.valid) {
      return Response.json(
        { error: validation.reason },
        { status: 400 }
      );
    }

    // Check cache for duplicate messages
    const cacheKey = createCacheKey(message, missionId);
    const cachedResult = getCachedResponse(cacheKey);
    if (cachedResult.cached && cachedResult.response) {
      return Response.json({
        response: cachedResult.response,
        cached: true,
      });
    }

    const existingModels = await fetch(`${ollamaBaseURL}/tags`).then(res => res.json());
    const modelNames = existingModels.models.map((model: { name: string; }) => model.name);

    // Create the models if they don't exist
    if (!modelNames.includes("voyageur-temporel-v2")) {
      await fetch(`${ollamaBaseURL}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "voyageur-temporel-v2",
          from: "mistral",
          system: `Tu es Chat'bruti, un voyageur temporel raté.
Tu penses connaître le passé et le futur, mais tu confonds les époques.

Réponds TRÈS BRIÈVEMENT en 1-2 phrases max. Sois absurde mais compréhensible.`,
          stream: false
        }),
      })
    }

    // Create pedagogical assistant model for mission help
    if (type === "mission-help" && !modelNames.includes("assistant-pedagogue")) {
      await fetch(`${ollamaBaseURL}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "assistant-pedagogue",
          from: "mistral",
          system: `Tu es un assistant pédagogique pour l'IT responsable et l'éthique numérique.

RÈGLES IMPORTANTES:
- Réponds TRÈS BRIÈVEMENT en 2-3 phrases MAX
- Sois simple et clair, évite le jargon
- N'ajoute JAMAIS de salutation (Bonjour, Bienvenue) à chaque message
- Sois direct et pédagogique
- Aide à comprendre les enjeux éthiques

${context?.stepTitle ? `Contexte: ${context.stepTitle}` : ""}`,
          stream: false
        }),
      })
    }

    // Use appropriate model based on type
    const modelName = type === "mission-help" ? "assistant-pedagogue" : "voyageur-temporel-v2";

    try {
      const result = streamText({
        model: ollama(modelName),
        prompt: message,
        temperature: 0.7,
      });

      return result.toTextStreamResponse();
    } catch (ollamaError: unknown) {
      const errorMsg = ollamaError instanceof Error ? ollamaError.message : "Unknown error";
      console.warn("Ollama connection failed:", errorMsg);

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
        response: "😅 Erreur. Réessaie!",
      },
      { status: 500 }
    );
  }
}
