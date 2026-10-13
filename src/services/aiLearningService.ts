
import type {
  AICaseGenerationRequest,
  AICaseGenerationResponse,
  AILearningFeedbackRequest,
  AILearningFeedbackResponse,
} from "../types/aiLearning";

// API configuration.
// This is a proposed endpoint structure.
// Confirm the actual paths with the backend developer.
const AI_API_BASE_URL =
  import.meta.env.VITE_AI_API_URL ?? "";

function getAIBaseURL(): string {
  if (!AI_API_BASE_URL) {
    throw new Error(
      "Layanan AI belum dikonfigurasi. Atur VITE_AI_API_URL."
    );
  }

  return AI_API_BASE_URL.replace(/\/+$/, "");
}

// Shared request helper.
async function postAIRequest<TRequest, TResponse>(
  endpoint: string,
  payload: TRequest
): Promise<TResponse> {
  const baseURL = getAIBaseURL();

  const response = await fetch(`${baseURL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      `Permintaan ke layanan AI gagal (${response.status}).`
    );
  }

  return (await response.json()) as TResponse;
}

// Request an AI-generated cognitive-conflict case study.
export async function generateAICaseStudy(
  request: AICaseGenerationRequest
): Promise<AICaseGenerationResponse> {
  return postAIRequest<
    AICaseGenerationRequest,
    AICaseGenerationResponse
  >("/cases/generate", request);
}

// Submit an answer and request adaptive feedback.
export async function submitAILearningAnswer(
  request: AILearningFeedbackRequest
): Promise<AILearningFeedbackResponse> {
  return postAIRequest<
    AILearningFeedbackRequest,
    AILearningFeedbackResponse
  >("/learning/feedback", request);
}