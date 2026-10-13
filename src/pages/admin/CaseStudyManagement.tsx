
import { useState } from "react";
import { BookOpen, Plus, Search } from "lucide-react";

import CaseStudyCard from "../../components/admin/cases/CaseStudyCard";
import CaseStudyStats from "../../components/admin/cases/CaseStudyStats";
import CaseStudyFormModal, {
  type CaseStudyFormData,
} from "../../components/admin/cases/CaseStudyFormModal";
import DeleteCaseStudyModal from "../../components/admin/cases/DeleteCaseStudyModal";

import {
  caseStudyContexts,
  type CaseStudy,
  type CaseStudyContext,
  type CaseStudyStatus,
} from "../../data/caseStudies";

import {
  loadCaseStudies,
  saveCaseStudies,
} from "../../utils/caseStudyStorage";

type ContextFilter = CaseStudyContext | "ALL";
type StatusFilter = CaseStudyStatus | "ALL";

export default function CaseStudyManagement() {
  // Case study data
  const [caseStudies, setCaseStudies] =
    useState<CaseStudy[]>(loadCaseStudies);

  // Search and filters
  const [search, setSearch] = useState("");
  const [contextFilter, setContextFilter] =
    useState<ContextFilter>("ALL");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  // Create / Edit modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCase, setEditingCase] =
    useState<CaseStudy | null>(null);

  // Delete confirmation modal
  const [deletingCase, setDeletingCase] =
    useState<CaseStudy | null>(null);
  const [deleteError, setDeleteError] = useState("");

  // Feedback
  const [message, setMessage] = useState("");

  // Filter case studies
  const filteredCases = caseStudies.filter((item) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.topic.toLowerCase().includes(query);

    const matchesContext =
      contextFilter === "ALL" ||
      item.context === contextFilter;

    const matchesStatus =
      statusFilter === "ALL" ||
      item.status === statusFilter;

    return matchesSearch && matchesContext && matchesStatus;
  });

  // Create case study
  const handleCreate = () => {
    setEditingCase(null);
    setIsFormOpen(true);
    setMessage("");
  };

  // Edit case study
  const handleEdit = (caseStudy: CaseStudy) => {
    setEditingCase(caseStudy);
    setIsFormOpen(true);
    setMessage("");
  };

  // Close create/edit modal
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCase(null);
  };

  // Save new or edited case study
  const handleSave = (data: CaseStudyFormData): boolean => {
    const nextCases: CaseStudy[] = editingCase
      ? caseStudies.map((item) =>
          item.id === editingCase.id
            ? { ...item, ...data }
            : item
        )
      : [
          {
            id: crypto.randomUUID(),
            ...data,
            createdAt: new Date().toISOString(),
          },
          ...caseStudies,
        ];

    try {
      // Persist before updating the interface.
      saveCaseStudies(nextCases);

      setCaseStudies(nextCases);

      setMessage(
        editingCase
          ? "Studi kasus berhasil diperbarui."
          : "Studi kasus berhasil ditambahkan."
      );

      handleCloseForm();
      return true;
    } catch {
      return false;
    }
  };

  // Open delete confirmation
  const handleDelete = (caseStudy: CaseStudy) => {
    setDeletingCase(caseStudy);
    setDeleteError("");
    setMessage("");
  };

  // Cancel deletion
  const handleCancelDelete = () => {
    setDeletingCase(null);
    setDeleteError("");
  };

  // Confirm deletion
  const handleConfirmDelete = () => {
    if (!deletingCase) {
      return;
    }

    const nextCases = caseStudies.filter(
      (item) => item.id !== deletingCase.id
    );

    try {
      // Save first to avoid displaying a deletion
      // that failed to persist.
      saveCaseStudies(nextCases);

      setCaseStudies(nextCases);
      setDeletingCase(null);
      setDeleteError("");

      setMessage("Studi kasus berhasil dihapus.");
    } catch {
      setDeleteError(
        "Gagal menghapus studi kasus. Silakan coba lagi."
      );
    }
  };

  // Clear search and filters
  const handleClearFilters = () => {
    setSearch("");
    setContextFilter("ALL");
    setStatusFilter("ALL");
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    contextFilter !== "ALL" ||
    statusFilter !== "ALL";

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <BookOpen size={18} />
            MANAJEMEN STUDI KASUS
          </div>

          <h1 className="mt-2 text-3xl font-bold">
            Studi Kasus
          </h1>

          <p className="mt-2 text-text-secondary">
            Kelola studi kasus fisika untuk pembelajaran
            berbasis konflik kognitif.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus size={18} />
          Tambah Studi Kasus
        </button>
      </div>

      {/* Demo Notice */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-relaxed text-blue-800">
        Mode demo: perubahan studi kasus disimpan di browser.
        Belum terhubung ke database, AI, atau sesi pembelajaran siswa.
      </div>

      {/* Success Message */}
      {message && (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
        >
          {message}
        </div>
      )}

      {/* Statistics */}
      <CaseStudyStats caseStudies={caseStudies} />

      {/* Search and Filters */}
      <section className="rounded-2xl border border-border bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari studi kasus..."
              aria-label="Cari studi kasus"
              className="w-full rounded-xl border border-border py-3 pl-11 pr-4 text-sm outline-none focus:border-primary"
            />
          </div>

          {/* Context Filter */}
          <select
            value={contextFilter}
            onChange={(event) =>
              setContextFilter(event.target.value as ContextFilter)
            }
            aria-label="Filter konteks"
            className="rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
          >
            <option value="ALL">Semua Konteks</option>

            {Object.entries(caseStudyContexts).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              )
            )}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            aria-label="Filter status"
            className="rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
          >
            <option value="ALL">Semua Status</option>
            <option value="PUBLISHED">Dipublikasikan</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-sm font-medium text-primary hover:underline"
            >
              Reset Filter
            </button>
          </div>
        )}
      </section>

      {/* Case Study List */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold">
            Daftar Studi Kasus
          </h2>

          <p className="text-sm text-text-secondary">
            {filteredCases.length} studi kasus ditemukan
          </p>
        </div>

        {filteredCases.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white p-12 text-center">
            <Search
              size={32}
              className="mx-auto text-slate-400"
            />

            <h3 className="mt-4 font-semibold">
              {caseStudies.length === 0
                ? "Belum Ada Studi Kasus"
                : "Tidak Ada Studi Kasus"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
              {caseStudies.length === 0
                ? "Belum ada studi kasus yang tersedia. Tambahkan studi kasus baru untuk memulai."
                : "Tidak ada studi kasus yang sesuai dengan pencarian atau filter yang dipilih."}
            </p>

            {caseStudies.length === 0 ? (
              <button
                type="button"
                onClick={handleCreate}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Plus size={17} />
                Tambah Studi Kasus
              </button>
            ) : (
              hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-6 rounded-xl border border-border px-5 py-3 text-sm font-medium hover:bg-slate-50"
                >
                  Reset Filter
                </button>
              )
            )}
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {filteredCases.map((caseStudy) => (
              <CaseStudyCard
                key={caseStudy.id}
                caseStudy={caseStudy}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>

      {/* Create / Edit Modal */}
      {isFormOpen && (
        <CaseStudyFormModal
          key={editingCase?.id ?? "new-case"}
          caseStudy={editingCase}
          onClose={handleCloseForm}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingCase && (
        <DeleteCaseStudyModal
          caseStudy={deletingCase}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          error={deleteError}
        />
      )}
    </div>
  );
}