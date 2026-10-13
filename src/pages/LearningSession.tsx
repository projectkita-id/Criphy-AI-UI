
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

import {
  isSupportedLearningCase,
} from "../data/supportedLearningCases";

import {
  demoLearningContent,
} from "../data/demoLearningContent";

import type {
  CaseStudy as CaseStudyData,
  CaseStudyContext,
} from "../data/caseStudies";

import AICasePreparation from "../components/learning/AICasePreparation";

import {
  createIdleAIState,
  type AIServiceState,
} from "../types/aiServiceState";

import type { AIGeneratedCaseStudy } from "../types/aiLearning";

// Select the published case supported by
// the current five-phase demo.
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
    currentPhase: 1,
    context,
    caseStudy: selectPublishedCase(context),
    phaseOneResponse: null,
    phaseTwoResponse: null,
    phaseThreeResponse: null,
    phaseFourResponse: null,
  };
}

export default function LearningSession() {
  const navigate = useNavigate();
  const location = useLocation();

  const [aiState] = useState<
    AIServiceState<AIGeneratedCaseStudy>
  >(() => createIdleAIState<AIGeneratedCaseStudy>());

  const navigationContext: string | null =
    (
      location.state as {
        context?: string;
      } | null
    )?.context ?? null;


    const [session, setSession] = useState<LearningSessionData>(
      () => {
        const saved = loadLearningSession();

        // If the student selected a different context,
        // start a new session instead of resuming the old one.
        if (
          saved &&
          navigationContext &&
          saved.context !== navigationContext
        ) {
          return createInitialSession(navigationContext);
        }

        // Resume an existing supported session.
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
              caseStudy: selectedCase,
            };
          }

          // Do not resume unsupported old sessions.
          return createInitialSession(
            navigationContext ?? saved.context
          );
        }

        // No previous session: create a new one.
        return createInitialSession(navigationContext);
      }
    );


  // Persist learning progress.
  useEffect(() => {
    saveLearningSession(session);
  }, [session]);

  const updateSession = (
    updates: Partial<LearningSessionData>
  ) => {
    setSession((previous) => ({
      ...previous,
      ...updates,
    }));
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
    _response: ReflectionResponse
  ) => {
    const context = session.context;

    clearLearningSession();

    navigate("/learn/post-test", {
      state: { context },
    });
  };
  
  // Display the AI preparation interface when
  // no supported demo case is available.
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

      {/* Phase 1: Aktivasi Konsepsi Awal */}
      {session.currentPhase === 1 && (
        <PhaseOne
          question={
            demoLearningContent.phaseOne.question
          }
          onComplete={handlePhaseOneComplete}
        />
      )}

      {/* Phase 2: Konflik Kognitif */}
      {session.currentPhase === 2 &&
        session.phaseOneResponse && (
          <PhaseTwo
            initialAnswer={session.phaseOneResponse.answer}
            content={demoLearningContent.phaseTwo}
            onComplete={handlePhaseTwoComplete}
          />
        )}

      {/* Phase 3: Investigasi Berbasis Bukti */}
      {session.currentPhase === 3 &&
        session.phaseTwoResponse !== null && (
          <PhaseThree
            previousAnswer={session.phaseTwoResponse}
            content={demoLearningContent.phaseThree}
            onComplete={handlePhaseThreeComplete}
          />
        )}

      {/* Phase 4: Rekonstruksi Konsep */}
      {session.currentPhase === 4 &&
        session.phaseThreeResponse !== null && (
          <PhaseFour
            previousAnswer={session.phaseThreeResponse}
            content={demoLearningContent.phaseFour}
            onComplete={handlePhaseFourComplete}
          />
        )}

      {/* Phase 5: Refleksi dan Evaluasi */}
      {session.currentPhase === 5 &&
        session.phaseOneResponse &&
        session.phaseFourResponse && (
          <PhaseFive
            initialResponse={session.phaseOneResponse}
            reconstructionResponse={session.phaseFourResponse}
            content={demoLearningContent.phaseFive}
            onComplete={handlePhaseFiveComplete}
          />
        )}
    </div>
  );
}