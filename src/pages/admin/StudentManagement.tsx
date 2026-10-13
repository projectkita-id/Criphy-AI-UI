
import { useState } from "react";
import { Search, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

import StudentStats from "../../components/admin/students/StudentStats";
import StudentTable from "../../components/admin/students/StudentTable";

import {
  demoStudents,
  type Student,
  type StudentStatus,
} from "../../data/students";

type StatusFilter = StudentStatus | "ALL";

export default function StudentManagement() {
  const [students] = useState<Student[]>(demoStudents);

  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");
  const [classFilter, setClassFilter] = useState("ALL");

  const classes = Array.from(
    new Set(students.map((student) => student.className))
  ).sort();

  const filteredStudents = students.filter((student) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "ALL" ||
      student.status === statusFilter;

    const matchesClass =
      classFilter === "ALL" ||
      student.className === classFilter;

    return matchesSearch && matchesStatus && matchesClass;
  });

    const handleView = (student: Student) => {
    navigate(`/admin/students/${student.id}`);
    };

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setClassFilter("ALL");
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    statusFilter !== "ALL" ||
    classFilter !== "ALL";

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Users size={18} />
          MANAJEMEN SISWA
        </div>

        <h1 className="mt-2 text-3xl font-bold">
          Data Siswa
        </h1>

        <p className="mt-2 text-text-secondary">
          Pantau data siswa dan ringkasan aktivitas pembelajaran.
        </p>
      </div>

      {/* Demo Notice */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        Mode demo: seluruh data siswa dan statistik bersifat
        ilustratif. Belum terhubung ke akun siswa atau database.
      </div>

      {/* Statistics */}
      <StudentStats students={students} />

      {/* Filters */}
      <section className="rounded-2xl border border-border bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama atau email siswa..."
              aria-label="Cari siswa"
              className="w-full rounded-xl border border-border py-3 pl-11 pr-4 text-sm outline-none focus:border-primary"
            />
          </div>

          <select
            value={classFilter}
            onChange={(event) =>
              setClassFilter(event.target.value)
            }
            aria-label="Filter kelas"
            className="rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
          >
            <option value="ALL">Semua Kelas</option>

            {classes.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            aria-label="Filter status"
            className="rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
          >
            <option value="ALL">Semua Status</option>
            <option value="ACTIVE">Aktif</option>
            <option value="INACTIVE">Tidak Aktif</option>
          </select>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-sm font-medium text-primary hover:underline"
            >
              Reset Filter
            </button>
          </div>
        )}
      </section>

      {/* Student List */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">
            Daftar Siswa
          </h2>

          <p className="text-sm text-text-secondary">
            {filteredStudents.length} siswa ditemukan
          </p>
        </div>

        <StudentTable
          students={filteredStudents}
          onView={handleView}
        />
      </section>
    </div>
  );
}