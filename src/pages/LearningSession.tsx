
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import PhaseProgress from "../components/learning/PhaseProgress";
import CaseStudy from "../components/learning/CaseStudy";

import PhaseOne, {
  type PhaseOneResponse,
} from "../components/learning/PhaseOne";

import PhaseTwo from "../components/learning/PhaseTwo";
import PhaseThree from "../components/learning/PhaseThree";

import PhaseFour, {
  type CERResponse,
} from "../components/learning/PhaseFour";

import PhaseFive, {
  type ReflectionResponse,
} from "../components/learning/PhaseFive";

import {
  saveLearningSession,
  loadLearningSession,
  clearLearningSession,
  type LearningSessionData,
} from "../utils/learningStorage";

import { loadCaseStudies } from "../utils/caseStudyStorage";

import { isSupportedLearningCase } from "../data/supportedLearningCases";

import type {
  CaseStudy as CaseStudyData,
  CaseStudyContext,
} from "../data/caseStudies";

import AICasePreparation from "../components/learning/AICasePreparation";
import PhaseWaitingScreen from "../components/learning/PhaseWaitingScreen";

import {
  createIdleAIState,
  type AIServiceState,
} from "../types/aiServiceState";

import type { AIGeneratedCaseStudy } from "../types/aiLearning";

// Select a published case supported by the current demo.
function selectPublishedCase(
  context: string | null
): CaseStudyData | null {
  if (
    context !== "DAILY_LIFE" &&
    context !== "ENVIRONMENT" &&
    context !== "TECHNOLOGY"
  ) {
    return null;
  }

  const selectedContext: CaseStudyContext = context;

  const supportedCase = loadCaseStudies().find(
    (caseStudy) =>
      caseStudy.context === selectedContext &&
      isSupportedLearningCase(caseStudy)
  );

  if (!supportedCase) {
    return null;
  }

  return structuredClone(supportedCase);
}

// Create a new learning session.
function createInitialSession(
  context: string | null
): LearningSessionData {
  return {
    id: crypto.randomUUID(),
    startedAt: new Date().toISOString(),
    status: "IN_PROGRESS",
    currentPhase: 1,
    context,
    caseStudy: selectPublishedCase(context),
    phaseOneResponse: null,
    phaseTwoResponse: null,
    phaseThreeResponse: null,
    phaseFourResponse: null,
    phaseFiveResponse: null,
  };
}

const contextLabels: Record<string, string> = {
  DAILY_LIFE: "Kehidupan Sehari-hari",
  ENVIRONMENT: "Lingkungan",
  TECHNOLOGY: "Teknologi",
};

function buildPhaseContent(
  caseStudy: CaseStudyData | null | undefined,
  context: string | null
) {
  const resolvedContext =
    (context as CaseStudyContext | null) ??
    caseStudy?.context ??
    "DAILY_LIFE";

  const caseTitle = caseStudy?.title ?? "Studi kasus pembelajaran";
  const topic = caseStudy?.topic ?? "konsep utama";
  const contextLabel =
    contextLabels[resolvedContext] ?? "Konteks pembelajaran";

  return {
    phaseOne: {
      question: `Berdasarkan ${caseTitle}, apa prediksi awalmu tentang ${topic}? Jelaskan alasanmu dan seberapa yakin kamu dengan jawaban tersebut.`,
    },
    phaseTwo: {
      title: `Mengecek Prediksi Awal pada ${contextLabel}`,
      scenario: `Pada ${caseTitle}, terdapat situasi yang bisa menantang prediksi awalmu. Perhatikan konteks ${contextLabel} dan bandingkan hasil pengamatanmu dengan dugaan yang sebelumnya kamu buat.`,
      question: "Apakah prediksi awalmu masih konsisten dengan situasi yang kamu amati? Jelaskan mengapa ada kemungkinan yang sesuai atau bertentangan.",
      hint: "Jangan langsung menganggap prediksi awal benar atau salah. Fokus pada bukti yang muncul dari situasi dan kemungkinan penjelasan lain yang masuk akal.",
    },
    phaseThree: {
      title: `Investigasi Bukti untuk ${caseTitle}`,
      description: `Gunakan data dan pengamatan berikut untuk menguji apakah prediksi awalmu masih sesuai dengan bukti yang tersedia dalam konteks ${contextLabel}.`,
      data: [
        { time: 0, carA: 18, carB: 12 },
        { time: 1, carA: 18, carB: 15 },
        { time: 2, carA: 18, carB: 19 },
        { time: 3, carA: 18, carB: 23 },
        { time: 4, carA: 18, carB: 27 },
        { time: 5, carA: 18, carB: 31 },
      ],
      question: "Berbasis data di atas, apa yang bisa kamu simpulkan tentang perubahan kondisi yang terjadi? Gunakan bukti yang spesifik dan jelaskan alasanmu.",
      hint: "Perhatikan perubahan dari satu waktu ke waktu berikutnya, bukan hanya nilai satu titik. Bandingkan pola perubahan tersebut dengan prediksi awalmu.",
    },
    phaseFour: {
      title: "Menyusun Argumen Berdasarkan Bukti",
      description: `Susun penjelasan ilmiah untuk ${caseTitle} dengan menggunakan klaim, bukti, dan penalaran yang relevan dalam konteks ${contextLabel}.`,
      claim: {
        label: "Claim — Klaim",
        question: "Apa kesimpulan utama yang paling tepat berdasarkan bukti yang kamu lihat?",
        placeholder: "Tuliskan kesimpulanmu secara ringkas...",
        hint: "Klaim harus menjawab pertanyaan utama secara langsung dan tidak terlalu umum.",
      },
      evidence: {
        label: "Evidence — Bukti",
        question: "Bukti apa yang paling kuat mendukung klaimmu?",
        placeholder: "Sebutkan data, pola, atau observasi yang relevan...",
        hint: "Gunakan informasi spesifik yang dapat diamati dan diperiksa kembali.",
      },
      reasoning: {
        label: "Reasoning — Penalaran",
        question: "Bagaimana bukti itu menjelaskan hubungan sebab-akibat atau prinsip yang relevan?",
        placeholder: "Jelaskan mengapa bukti itu mendukung klaimmu...",
        hint: "Hubungkan bukti dengan konsep utama, bukan hanya menyebutkan datanya saja.",
      },
    },
    phaseFive: {
      title: "Refleksi Perubahan Pemahaman",
      description: `Bandingkan prediksi awal dan pemahaman barumu untuk ${caseTitle}. Perubahan jawaban tidak selalu lebih baik, tetapi kualitas alasan dan bukti adalah yang paling penting.`,
      understandingQuestion: "Setelah mengeksplorasi bukti, bagaimana pemahamanmu terhadap konsep ini berubah atau tetap sama?",
      evidenceQuestion: "Bukti atau pengalaman apa yang paling memengaruhi perubahan atau penguatan pandanganmu?",
      understandingPlaceholder: "Bandingkan pemahamanmu saat ini dengan prediksi awal...",
      evidencePlaceholder: "Sebutkan bukti, pola, atau data yang paling berpengaruh...",
    },
  };
}

export default function LearningSession() {
  const navigate = useNavigate();
  const location = useLocation();

  const [aiState] = useState<
    AIServiceState<AIGeneratedCaseStudy>
  >(() => createIdleAIState<AIGeneratedCaseStudy>());

  const [phaseStarted, setPhaseStarted] = useState<Record<number, boolean>>({
    1: false,
  });

  const navigationContext: string | null =
    (
      location.state as {
        context?: string;
      } | null
    )?.context ?? null;

  // Initialize or resume learning session.
  const [session, setSession] = useState<LearningSessionData>(
    () => {
      const saved = loadLearningSession();

      // Only redirect to the final assessment after Phase 5 is actually completed.
      if (
        saved?.status === "AWAITING_POST_TEST" &&
        saved.phaseFiveResponse
      ) {
        return saved;
      }

      // Switching contexts starts a new session.
      if (
        saved &&
        navigationContext &&
        saved.context !== navigationContext
      ) {
        return createInitialSession(navigationContext);
      }

      // Resume a supported learning session.
      if (saved) {
        const selectedCase =
          saved.caseStudy ??
          selectPublishedCase(saved.context);

        if (
          selectedCase &&
          isSupportedLearningCase(selectedCase)
        ) {
          return {
            ...saved,
            id: saved.id ?? crypto.randomUUID(),
            startedAt:
              saved.startedAt ?? new Date().toISOString(),
            status: saved.status ?? "IN_PROGRESS",
            phaseFiveResponse:
              saved.phaseFiveResponse ?? null,
            caseStudy: selectedCase,
          };
        }

        // Unsupported sessions cannot resume the demo.
        return createInitialSession(
          navigationContext ?? saved.context
        );
      }

      // No saved session.
      return createInitialSession(navigationContext);
    }
  );

  // Persist learning progress.
  useEffect(() => {
    saveLearningSession(session);
  }, [session]);

  const activePhase =
    (session.currentPhase && session.currentPhase >= 1 && session.currentPhase <= 5
      ? session.currentPhase
      : 1);

  const hasStartedCurrentPhase = Boolean(
    phaseStarted[activePhase]
  );

  const handleStartCurrentPhase = () => {
    setPhaseStarted((previous) => ({
      ...previous,
      [activePhase]: true,
    }));
  };

  // Redirect students to the post-test after Phase 5.
  useEffect(() => {
    if (session.status === "AWAITING_POST_TEST") {
      navigate("/learn/post-test", {
        replace: true,
        state: { context: session.context },
      });
    }
  }, [session.status, session.context, navigate]);

  // Update session state.
  const updateSession = (
    updates: Partial<LearningSessionData>
  ) => {
    setSession((previous) => {
      const nextSession = {
        ...previous,
        ...updates,
      };

      saveLearningSession(nextSession);
      return nextSession;
    });
  };

  // Phase 1 → Phase 2
  const handlePhaseOneComplete = (
    response: PhaseOneResponse
  ) => {
    updateSession({
      phaseOneResponse: response,
      currentPhase: 2,
    });
  };

  // Phase 2 → Phase 3
  const handlePhaseTwoComplete = (answer: string) => {
    updateSession({
      phaseTwoResponse: answer,
      currentPhase: 3,
    });
  };

  // Phase 3 → Phase 4
  const handlePhaseThreeComplete = (answer: string) => {
    updateSession({
      phaseThreeResponse: answer,
      currentPhase: 4,
    });
  };

  // Phase 4 → Phase 5
  const handlePhaseFourComplete = (
    response: CERResponse
  ) => {
    updateSession({
      phaseFourResponse: response,
      currentPhase: 5,
    });
  };

  // Phase 5 → Post-Test
  const handlePhaseFiveComplete = (
    response: ReflectionResponse
  ) => {
    const completedSession: LearningSessionData = {
      ...session,
      status: "AWAITING_POST_TEST",
      phaseFiveResponse: response,
    };

    try {
      // Save before redirecting.
      saveLearningSession(completedSession);

      // The redirect effect handles navigation.
      setSession(completedSession);
    } catch (error) {
      console.error(
        "Failed to preserve completed learning session:",
        error
      );
    }
  };

  const phaseContent = buildPhaseContent(
    session.caseStudy,
    session.context
  );

  const currentPhaseMeta =
    session.currentPhase >= 1 && session.currentPhase <= 5
      ? (
          [
            { id: 1, title: "Activation of Prior Conceptions", description: "Menentukan prediksi awal dan keyakinanmu sebelum eksplorasi lebih lanjut." },
            { id: 2, title: "Cognitive Conflict", description: "Mengurai perbedaan antara prediksi awal dan situasi yang diamati." },
            { id: 3, title: "Evidence Investigation", description: "Menganalisis pola data dan bukti untuk membangun penjelasan yang kuat." },
            { id: 4, title: "Concept Reconstruction", description: "Menyusun klaim, bukti, dan alasan sebagai argumen ilmiah." },
            { id: 5, title: "Reflection and Evaluation", description: "Mengevaluasi perubahan pemahaman dan kualitas penalaran." },
          ] as const
        )[session.currentPhase - 1]
      : {
          id: 1,
          title: "Activation of Prior Conceptions",
          description: "Menentukan prediksi awal dan keyakinanmu sebelum eksplorasi lebih lanjut.",
        };

  // Display AI preparation if no supported case exists.
  if (!session.caseStudy) {
    const validContext: CaseStudyContext | null =
      session.context === "DAILY_LIFE" ||
      session.context === "ENVIRONMENT" ||
      session.context === "TECHNOLOGY"
        ? session.context
        : null;

    return (
      <AICasePreparation
        context={validContext}
        state={aiState}
        onBack={() => {
          clearLearningSession();
          navigate("/learn");
        }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      {/* Page heading */}
      <div>
        <p className="text-sm font-semibold text-primary">
          PEMBELAJARAN INTERAKTIF
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Sesi Pembelajaran
        </h1>

        <p className="mt-2 text-text-secondary">
          Pelajari konsep fisika melalui eksplorasi,
          prediksi, dan penalaran.
        </p>
      </div>

      {/* Learning progress */}
      <PhaseProgress
        currentPhase={session.currentPhase}
      />

      {/* Selected supported case */}
      <CaseStudy caseStudy={session.caseStudy} />

      {!hasStartedCurrentPhase && (
        <PhaseWaitingScreen
          phaseNumber={session.currentPhase}
          title={currentPhaseMeta.title}
          description={currentPhaseMeta.description}
          onStart={handleStartCurrentPhase}
        />
      )}

      {/* Phase 1: Aktivasi Konsepsi Awal */}
      {session.currentPhase === 1 && hasStartedCurrentPhase && (
        <PhaseOne
          question={phaseContent.phaseOne.question}
          onComplete={handlePhaseOneComplete}
        />
      )}

      {/* Phase 2: Konflik Kognitif */}
      {session.currentPhase === 2 &&
        session.phaseOneResponse &&
        hasStartedCurrentPhase && (
          <PhaseTwo
            initialAnswer={session.phaseOneResponse.answer}
            content={phaseContent.phaseTwo}
            onComplete={handlePhaseTwoComplete}
          />
        )}

      {/* Phase 3: Investigasi Berbasis Bukti */}
      {session.currentPhase === 3 &&
        session.phaseTwoResponse !== null &&
        hasStartedCurrentPhase && (
          <PhaseThree
            previousAnswer={session.phaseTwoResponse}
            content={phaseContent.phaseThree}
            onComplete={handlePhaseThreeComplete}
          />
        )}

      {/* Phase 4: Rekonstruksi Konsep */}
      {session.currentPhase === 4 &&
        session.phaseThreeResponse !== null &&
        hasStartedCurrentPhase && (
          <PhaseFour
            previousAnswer={session.phaseThreeResponse}
            content={phaseContent.phaseFour}
            onComplete={handlePhaseFourComplete}
          />
        )}

      {/* Phase 5: Refleksi dan Evaluasi */}
      {session.currentPhase === 5 &&
        session.phaseOneResponse &&
        session.phaseFourResponse &&
        hasStartedCurrentPhase && (
          <PhaseFive
            initialResponse={session.phaseOneResponse}
            reconstructionResponse={session.phaseFourResponse}
            content={phaseContent.phaseFive}
            onComplete={handlePhaseFiveComplete}
          />
        )}
    </div>
  );
}
