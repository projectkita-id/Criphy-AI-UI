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

function createInitialSession(
  context: string | null
): LearningSessionData {
  return {
    currentPhase: 1,
    context,
    phaseOneResponse: null,
    phaseTwoResponse: null,
    phaseThreeResponse: null,
    phaseFourResponse: null,
  };
}

export default function LearningSession() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationContext: string | null =
    location.state?.context ?? null;

  const [session, setSession] = useState<LearningSessionData>(
    () => {
      const saved = loadLearningSession();

      // Resume an existing session when available.
      // Otherwise start from Phase 1.
      return saved ?? createInitialSession(navigationContext);
    }
  );

  // Save whenever the session changes.
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

      {/* Progress */}
      <PhaseProgress currentPhase={session.currentPhase} />

      {/* Case study */}
      <CaseStudy />

      {/* Phase 1 */}
      {session.currentPhase === 1 && (
        <PhaseOne onComplete={handlePhaseOneComplete} />
      )}

      {/* Phase 2 */}
      {session.currentPhase === 2 &&
        session.phaseOneResponse && (
          <PhaseTwo
            initialAnswer={session.phaseOneResponse.answer}
            onComplete={handlePhaseTwoComplete}
          />
        )}

      {/* Phase 3 */}
      {session.currentPhase === 3 &&
        session.phaseTwoResponse !== null && (
          <PhaseThree
            previousAnswer={session.phaseTwoResponse}
            onComplete={handlePhaseThreeComplete}
          />
        )}

      {/* Phase 4 */}
      {session.currentPhase === 4 &&
        session.phaseThreeResponse !== null && (
          <PhaseFour
            previousAnswer={session.phaseThreeResponse}
            onComplete={handlePhaseFourComplete}
          />
        )}

      {/* Phase 5 */}
      {session.currentPhase === 5 &&
        session.phaseOneResponse &&
        session.phaseFourResponse && (
          <PhaseFive
            initialResponse={session.phaseOneResponse}
            reconstructionResponse={session.phaseFourResponse}
            onComplete={handlePhaseFiveComplete}
          />
        )}
    </div>
  );
}