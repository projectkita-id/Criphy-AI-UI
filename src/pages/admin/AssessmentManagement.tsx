
import { useState } from "react";
import { ClipboardList, Plus } from "lucide-react";

import AssessmentStats from "../../components/admin/assessment/AssessmentStats";
import QuestionCard from "../../components/admin/assessment/QuestionCard";
import QuestionFormModal from "../../components/admin/assessment/QuestionFormModal";
import DeleteQuestionModal from "../../components/admin/assessment/DeleteQuestionModal";

import {
  loadManagedQuestions,
  saveManagedQuestions,
  type ManagedQuestion,
} from "../../utils/assessmentQuestionStorage";

export default function AssessmentManagement() {
  const [questions, setQuestions] = useState<ManagedQuestion[]>(
    loadManagedQuestions
  );

  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] =
    useState<ManagedQuestion | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const persistQuestions = (next: ManagedQuestion[]): boolean => {
    try {
      saveManagedQuestions(next);
      setQuestions(next);
      setError("");
      return true;
    } catch {
      setError("Gagal menyimpan data ke browser.");
      return false;
    }
  };

  const handleCreate = () => {
    setEditingQuestion(null);
    setError("");
    setShowForm(true);
  };

  const handleEdit = (question: ManagedQuestion) => {
    setEditingQuestion(question);
    setError("");
    setShowForm(true);
  };

  const handleSave = (question: ManagedQuestion): boolean => {
    const exists = questions.some((item) => item.id === question.id);

    const next = exists
      ? questions.map((item) =>
          item.id === question.id ? question : item
        )
      : [...questions, question];

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
      {/* Header */}
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
            Kelola bank soal untuk asesmen awal dan akhir.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Tambah Soal
        </button>
      </div>

      {/* Demo Notice */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        Mode demo: perubahan soal disimpan di browser.
        Belum terhubung ke database atau sistem penilaian siswa.
      </div>

      {/* Statistics */}
      <AssessmentStats questions={questions} />

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Question List */}
      <div className="space-y-4">
        {questions.length === 0 && (
          <div className="rounded-2xl border border-border bg-white p-10 text-center text-text-secondary">
            Belum ada soal. Klik Tambah Soal untuk memulai.
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

      {/* Create / Edit Modal */}
      {showForm && (
        <QuestionFormModal
          editingQuestion={editingQuestion}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <DeleteQuestionModal
          onCancel={() => setDeleteId(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
