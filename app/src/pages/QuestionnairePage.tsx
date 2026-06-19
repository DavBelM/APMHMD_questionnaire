import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QUESTIONS, SECTIONS } from "../data/questions";
import QuestionField from "../components/QuestionField";
import { supabase } from "../lib/supabase";

type Answers = Record<string, string | string[] | undefined>;
type OtherAnswers = Record<string, string | undefined>;

const DRAFT_KEY = "questionnaire-draft";

export default function QuestionnairePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // index into SECTIONS
  const [answers, setAnswers] = useState<Answers>({});
  const [otherAnswers, setOtherAnswers] = useState<OtherAnswers>({});
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSaved, setAutoSaved] = useState(false);

  // Restore an in-progress draft (e.g. after an accidental page reload).
  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        if (draft.answers) setAnswers(draft.answers);
        if (draft.otherAnswers) setOtherAnswers(draft.otherAnswers);
        if (typeof draft.step === "number") setStep(draft.step);
      } catch {
        // Ignore corrupted drafts.
      }
    }
  }, []);

  // Auto-save the draft every 30 seconds so an accidental tab close
  // doesn't lose a partially completed response.
  const stateRef = useRef({ answers, otherAnswers, step });
  stateRef.current = { answers, otherAnswers, step };

  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(stateRef.current));
      setAutoSaved(true);
      setTimeout(() => setAutoSaved(false), 2000);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const sectionQuestions = useMemo(
    () => QUESTIONS.filter((q) => q.section === SECTIONS[step]),
    [step]
  );

  const totalSteps = SECTIONS.length;
  const isLastStep = step === totalSteps - 1;
  const progress = Math.round(((step + 1) / totalSteps) * 100);

  const setAnswer = (id: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const setOtherAnswer = (id: string, value: string) => {
    setOtherAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const isStepValid = () => {
    for (const q of sectionQuestions) {
      if (q.optional) continue;
      const v = answers[q.id];
      if (q.type === "multi") {
        if (!v || (v as string[]).length === 0) return false;
      } else if (!v) {
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!isStepValid()) {
      setError("Please answer all questions before continuing.");
      return;
    }
    if (isLastStep && !confirmed) {
      setError(
        "Please confirm that the answers are correct and complete before submitting."
      );
      return;
    }
    setError(null);
    if (!isLastStep) {
      setStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setError(null);
    if (step > 0) setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    const barriers = (answers["barriers"] as string[]) ?? [];
    const barrierOther = barriers.includes("Other")
      ? otherAnswers["barriers"]
      : null;

    const payload = {
      age: answers["age"],
      education: answers["education"],
      occupation: answers["occupation"],
      district: answers["district"],
      pregnancy_months: answers["pregnancy_months"],
      anc_attended: answers["anc_attended"],
      anc_visits: answers["anc_visits"] ?? null,
      distance_health_center: answers["distance_health_center"],
      travel_time_health_center: answers["travel_time_health_center"],
      owns_phone: answers["owns_phone"],
      heard_wearable: answers["heard_wearable"],
      willing_to_use: answers["willing_to_use"],
      barriers,
      barrier_other: barrierOther,
      prevent_complications: answers["prevent_complications"],
      allow_chw_alerts: answers["allow_chw_alerts"],
      additional_comments: (answers["additional_comments"] as string) || null,
    };

    const { error: submitError } = await supabase
      .from("responses")
      .insert(payload);

    setSubmitting(false);

    if (submitError) {
      setError(
        `Could not submit the response: ${submitError.message}. Please try again.`
      );
      return;
    }

    localStorage.removeItem(DRAFT_KEY);
    navigate("/thank-you");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 via-white to-amber-50 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-6 sm:p-10">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
            <span>
              Step {step + 1} of {totalSteps}
            </span>
            <span className="flex items-center gap-2">
              {autoSaved && (
                <span className="text-green-600 font-medium">
                  Draft saved
                </span>
              )}
              {progress}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-rose-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          {SECTIONS[step]}
        </h2>

        <div className="space-y-8">
          {sectionQuestions.map((q, idx) => (
            <div key={q.id}>
              <p className="text-lg font-medium text-gray-800 mb-3">
                {idx + 1 + QUESTIONS.findIndex((x) => x.section === q.section)}.{" "}
                {q.label}
                {q.optional && (
                  <span className="ml-2 text-sm font-normal text-gray-400">
                    (optional)
                  </span>
                )}
              </p>
              {q.researcherNote && (
                <p className="mb-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  Researcher note: {q.researcherNote}
                </p>
              )}
              <QuestionField
                question={q}
                value={answers[q.id]}
                otherValue={otherAnswers[q.id]}
                onChange={(v) => setAnswer(q.id, v)}
                onOtherChange={(v) => setOtherAnswer(q.id, v)}
              />
            </div>
          ))}
        </div>

        {isLastStep && (
          <label className="mt-8 flex items-start gap-3 rounded-xl border-2 border-gray-200 p-4 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 h-5 w-5 accent-rose-600"
            />
            <span className="text-gray-700">
              I confirm that the answers recorded for this participant are
              correct and complete, and the participant agrees to submit
              them.
            </span>
          </label>
        )}

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="mt-8 flex gap-3">
          {step > 0 && (
            <button
              onClick={handleBack}
              disabled={submitting}
              className="flex-1 rounded-xl border-2 border-gray-200 py-4 text-lg font-semibold text-gray-600 transition hover:bg-gray-50 active:scale-[0.99]"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={submitting}
            className="flex-1 rounded-xl bg-rose-600 py-4 text-lg font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-700 active:scale-[0.99] disabled:opacity-60"
          >
            {submitting ? "Submitting..." : isLastStep ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
