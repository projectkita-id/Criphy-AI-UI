
import { useMemo, useState } from "react";
import { ClipboardList, Plus } from "lucide-react";

import AssessmentStats from "../../components/admin/assessment/AssessmentStats";
import QuestionCard from "../../components/admin/assessment/QuestionCard";
import QuestionFormModal from "../../components/admin/assessment/QuestionFormModal";
import DeleteQuestionModal from "../../components/admin/assessment/DeleteQuestionModal";

import {
  getAvailableAssessmentContexts,
  loadManagedQuestions,
  saveManagedQuestions,
  type ManagedQuestion,
  type QuestionStage,
} from "../../utils/assessmentQuestionStorage";
import type { CaseStudyContext } from "../../data/caseStudies";

const contextLabels: Record<CaseStudyContext, string> = {
  DAILY_LIFE: "Kehidupan Sehari-hari",
  ENVIRONMENT: "Lingkungan",
  TECHNOLOGY: "Teknologi",
};

export default function AssessmentManagement() {
  const [selectedContext, setSelectedContext] = useState<CaseStudyContext>("DAILY_LIFE");
  const [questions, setQuestions] = useState<ManagedQuestion[]>(() =>
    loadManagedQuestions("DAILY_LIFE")
  );

  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] =
    useState<ManagedQuestion | null>(null);
  const [defaultStage, setDefaultStage] = useState<QuestionStage>("PRE_TEST");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const availableContexts = useMemo(() => getAvailableAssessmentContexts(), []);

  const persistQuestions = (next: ManagedQuestion[]): boolean => {
    try {
      saveManagedQuestions(selectedContext, next);
      setQuestions(next);
      setError("");
      return true;
    } catch {
      setError("Gagal menyimpan data ke browser.");
      return false;
    }
  };

  const handleContextChange = (context: CaseStudyContext) => {
    setSelectedContext(context);
    setQuestions(loadManagedQuestions(context));
    setError("");
  };

  const handleCreate = (stage: QuestionStage = "PRE_TEST") => {
    setDefaultStage(stage);
    setEditingQuestion(null);
    setError("");
    setShowForm(true);
  };

  const handleEdit = (question: ManagedQuestion) => {
    setEditingQuestion(question);
    setDefaultStage(question.stage ?? "PRE_TEST");
    setError("");
    setShowForm(true);
  };

  const handleSave = (question: ManagedQuestion): boolean => {
    const normalizedQuestion = {
      ...question,
      context: selectedContext,
      stage: question.stage ?? defaultStage,
    };

    const exists = questions.some((item) => item.id === normalizedQuestion.id);

    const next = exists
      ? questions.map((item) =>
          item.id === normalizedQuestion.id ? normalizedQuestion : item
        )
      : [...questions, normalizedQuestion];

    return persistQuestions(next);
  };

  const handleDelete = () => {
    if (!deleteId) return;

    const next = questions.filter(
      (question) => question.id !== deleteId
    );

    if (persistQuestions(next)) {
      setDeleteId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <ClipboardList size={18} />
            MANAJEMEN ASESMEN
          </div>

          <h1 className="mt-2 text-3xl font-bold">
            Kelola Asesmen
          </h1>

          <p className="mt-2 text-text-secondary">
            Kelola bank soal untuk asesmen awal dan akhir di setiap konteks pembelajaran.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedContext}
            onChange={(event) => handleContextChange(event.target.value as CaseStudyContext)}
            className="rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
            aria-label="Pilih konteks asesmen"
          >
            {availableContexts.map((context) => (
              <option key={context} value={context}>
                {contextLabels[context]}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => handleCreate("PRE_TEST")}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Tambah Pre-test
          </button>

          <button
            type="button"
            onClick={() => handleCreate("POST_TEST")}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Plus size={18} />
            Tambah Post-test
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        Kumpulan soal saat ini dipisahkan per konteks: <span className="font-semibold text-slate-900">{contextLabels[selectedContext]}</span>.
      </div>

      <AssessmentStats questions={questions} />

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="space-y-4">
        {questions.length === 0 && (
          <div className="rounded-2xl border border-border bg-white p-10 text-center text-text-secondary">
            Belum ada soal di konteks ini. Klik tombol di atas untuk menambahkan soal pre-test atau post-test.
          </div>
        )}

        {questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index}
            onEdit={handleEdit}
            onDelete={(id) => {
              setError("");
              setDeleteId(id);
            }}
          />
        ))}
      </div>

      {showForm && (
        <QuestionFormModal
          editingQuestion={editingQuestion}
          defaultStage={defaultStage}
          context={selectedContext}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}

      {deleteId && (
        <DeleteQuestionModal
          onCancel={() => setDeleteId(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
