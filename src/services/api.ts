const API_BASE =
  (import.meta.env.VITE_API_URL ?? "http://localhost:5000/api").replace(/\/+$/, "");

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
  pagination?: unknown;
};

async function apiRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    ...init,
  });

  const text = await response.text();
  let payload: any = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { success: false, message: text };
    }
  }

  if (!response.ok || !payload?.success) {
    const message =
      payload?.message || `Permintaan gagal (${response.status}).`;
    throw new Error(message);
  }

  return (payload?.data ?? null) as T;
}

export interface StudentModuleAssignment {
  id: string;
  context: string;
  status: string;
  stage: string;
  assignedAt?: string;
  completedAt?: string | null;
  module?: {
    id: string;
    title: string;
    description?: string;
    topic?: string;
    version?: number;
    gradeLevel?: string | null;
    learningObjectives?: string[] | null;
    targetConcepts?: string[] | null;
    case?: {
      id: string;
      title: string;
      context: string;
      topic: string;
    };
    assessments?: Array<{
      id: string;
      title: string;
      type: string;
      status: string;
    }>;
  };
}

export async function fetchActiveModuleAssignment(): Promise<StudentModuleAssignment | null> {
  try {
    return await apiRequest<StudentModuleAssignment | null>(
      "/student/module-assignments/active"
    );
  } catch {
    return null;
  }
}

export async function createModuleAssignment(context: string) {
  try {
    return await apiRequest<StudentModuleAssignment>(
      "/student/module-assignments",
      {
        method: "POST",
        body: JSON.stringify({ context }),
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (/No eligible learning modules|not available|not found|404/i.test(message)) {
      return {
        id: `local-fallback-${context}`,
        context,
        status: "ACTIVE",
        stage: "PRE_TEST",
        module: {
          id: `local-module-${context}`,
          title: "Modul Pembelajaran Konteks",
          description: "Modul fallback untuk menjalankan alur pre-test dan proses pembelajaran.",
          topic: context,
          assessments: [],
        },
      } as StudentModuleAssignment;
    }

    throw error;
  }
}

export interface AssessmentQuestion {
  id: string;
  type: "MCQ" | "ESSAY";
  questionText: string;
  order: number;
  options?: Array<{ id: string; text: string }>;
  maxScore?: number;
  indicator?: string | null;
}

export interface AssessmentDetail {
  assessment: {
    id: string;
    title: string;
    type: string;
    status: string;
    moduleId: string;
    module: {
      title: string;
      topic: string;
    };
  };
  totalQuestions: number;
  questions: AssessmentQuestion[];
}

export async function fetchAssessmentDetail(assessmentId: string) {
  return apiRequest<AssessmentDetail>(`/student/assessments/${assessmentId}`);
}

export async function startAssessmentAttempt(assessmentId: string) {
  return apiRequest<{ id: string; assessmentId: string; status: string; startedAt: string }>(
    `/student/assessments/${assessmentId}/attempts`,
    { method: "POST" }
  );
}

export async function saveAssessmentAnswers(
  attemptId: string,
  answers: Array<{ questionId: string; answer: string }>
) {
  return apiRequest<{ success: boolean }>(`/student/attempts/${attemptId}/answers`, {
    method: "PUT",
    body: JSON.stringify({ answers }),
  });
}

export async function submitAssessmentAttempt(attemptId: string) {
  return apiRequest<{ success: boolean }>(`/student/attempts/${attemptId}/submit`, {
    method: "POST",
  });
}

export interface AttemptResultData {
  attempt: {
    id: string;
    status: string;
    startedAt: string;
    submittedAt: string | null;
    gradedAt: string | null;
  };
  assessment: {
    id: string;
    title: string;
    type: "PRE_TEST" | "POST_TEST";
  };
  module: {
    id: string;
    title: string;
    topic: string;
  };
  result: {
    totalQuestions: number;
    totalScore: number;
    maxScore: number;
    percentage: number;
    mcqScore?: number;
    mcqMaxScore?: number;
    mcqPercentage?: number;
    essayScore?: number;
    essayMaxScore?: number;
    essayPercentage?: number;
    isFullyGraded?: boolean;
    recommendation?: {
      status?: "MASTERY" | "NEEDS_REINFORCEMENT";
      action?: "MY_PROGRESS" | "CASE_CHALLENGE";
      message?: string;
    } | null;
  };
  questions: Array<{
    id: string;
    type: "MCQ" | "ESSAY";
    order: number;
    questionText: string;
    maxScore: number;
    rubric?: string | null;
    indicator?: string | null;
    options?: unknown;
    studentAnswer: {
      answer: string;
      score: number | null;
      feedback: string | null;
      gradedAt?: string | null;
      isCorrect?: boolean | null;
    } | null;
  }>;
  learningProgression?: {
    preTest: {
      totalScore: number;
      maxScore: number;
      percentage: number;
      mcqPercentage?: number;
      essayPercentage?: number;
    };
    postTest: {
      totalScore: number;
      maxScore: number;
      percentage: number;
      mcqPercentage?: number;
      essayPercentage?: number;
    };
    phaseEvaluation?: {
      phaseScore: number;
      cerScore: number;
      reflectionScore: number;
      summary: string;
      feedback: string;
      strengths: string[];
      growthAreas: string[];
    };
    scoreDifference: number;
    normalizedGain: number;
    progressionIndex: number;
    progressionLevel: string;
    progressionLevelLabel: string;
    progressionNarrative: string;
  } | null;
}

export async function fetchAttemptResults(attemptId: string): Promise<AttemptResultData> {
  return apiRequest<AttemptResultData>(`/student/attempts/${attemptId}/results`);
}

export async function fetchLatestLearningResults(): Promise<{
  module: { id: string; title: string; topic: string; context: string };
  status: string;
  stage: string;
  completedAt: string | null;
  preTest: AttemptResultData | null;
  postTest: AttemptResultData | null;
  phaseEvaluation: any | null;
  progression: any | null;
}> {
  return apiRequest<any>("/student/learning-results/latest");
}

export interface StudentLearningHistoryRecord {
  id: string;
  context: string | null;
  status: "COMPLETED" | "IN_PROGRESS";
  startedAt: string;
  completedAt: string | null;
  caseStudy: {
    id: string;
    title: string;
    context: string | null;
    topic: string | null;
    description?: string | null;
  };
  preTest: {
    type: "pre-test" | "post-test";
    context: string | null;
    answers: Array<{ questionId: string; answer: string }>;
    submittedAt: string;
    attemptId: string;
    percentage?: number | null;
  } | null;
  postTest: {
    type: "pre-test" | "post-test";
    context: string | null;
    answers: Array<{ questionId: string; answer: string }>;
    submittedAt: string;
    attemptId: string;
    percentage?: number | null;
  } | null;
  phaseOneResponse: Record<string, unknown> | null;
  phaseTwoResponse: string | Record<string, unknown> | null;
  phaseThreeResponse: string | Record<string, unknown> | null;
  phaseFourResponse: Record<string, unknown> | null;
  phaseFiveResponse: Record<string, unknown> | null;
}

export async function fetchStudentLearningHistory(): Promise<StudentLearningHistoryRecord[]> {
  const payload = await apiRequest<{ items?: StudentLearningHistoryRecord[]; data?: StudentLearningHistoryRecord[] }>(
    "/student/learning-history"
  );

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
}

export interface StudentListItem {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STUDENT";
  createdAt: string;
  updatedAt: string;
}

export async function listStudents(): Promise<StudentListItem[]> {
  const payload = await apiRequest<{ items?: StudentListItem[]; data?: StudentListItem[] }>(
    "/admin/users"
  );

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
}

export interface ApiCaseStudy {
  id: string;
  title: string;
  context: string;
  topic: string;
  version?: number;
  validationStatus?: string;
  validatedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  stimulus?: string;
  scientificData?: unknown;
  targetConcept?: string;
  possibleMisconceptions?: string[] | null;
  expertAnswer?: string | null;
}

export async function listCaseStudies(): Promise<ApiCaseStudy[]> {
  const payload = await apiRequest<{ items?: ApiCaseStudy[]; data?: ApiCaseStudy[] }>(
    "/cases?page=1&limit=100"
  );

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
}

export async function createCaseStudy(input: Record<string, unknown>) {
  return apiRequest<ApiCaseStudy>("/cases", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateCaseStudy(id: string, input: Record<string, unknown>) {
  return apiRequest<ApiCaseStudy>(`/cases/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteCaseStudy(id: string) {
  return apiRequest<{ success: true }>(`/cases/${id}`, {
    method: "DELETE",
  });
}

export async function submitCaseStudyForReview(id: string) {
  return apiRequest<ApiCaseStudy>(`/cases/${id}/submit`, {
    method: "PATCH",
  });
}

export async function approveCaseStudy(id: string) {
  return apiRequest<ApiCaseStudy>(`/cases/${id}/approve`, {
    method: "PATCH",
  });
}

export interface PromptConfigurationResponse {
  id?: string;
  name: string;
  role: string;
  objective: string;
  caseCharacteristics: string;
  guidanceStrategy: Record<string, string>;
  model: string;
  temperature: number;
  maxTokens: number;
  isActive: boolean;
  version?: number;
}

export async function fetchActivePromptConfiguration() {
  try {
    return await apiRequest<PromptConfigurationResponse>("/admin/prompts/active");
  } catch {
    return null;
  }
}

export async function createPromptConfiguration(input: Record<string, unknown>) {
  return apiRequest<PromptConfigurationResponse>("/admin/prompts", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updatePromptConfiguration(
  id: string,
  input: Record<string, unknown>
) {
  return apiRequest<PromptConfigurationResponse>(`/admin/prompts/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
