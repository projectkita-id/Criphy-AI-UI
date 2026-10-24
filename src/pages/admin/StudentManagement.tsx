
import { useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

import StudentStats from "../../components/admin/students/StudentStats";
import StudentTable from "../../components/admin/students/StudentTable";

import {
  type Student,
  type StudentStatus,
} from "../../data/students";
import { listStudents } from "../../services/api";

type StatusFilter = StudentStatus | "ALL";

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadStudents = async () => {
      try {
        const data = await listStudents();

        if (!isMounted) return;

        const mappedStudents: Student[] = data.map((item) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          className: "Belum diatur",
          status: "ACTIVE",
          completedSessions: 0,
          averageScore: null,
          lastActivity: item.updatedAt ?? item.createdAt ?? null,
        }));

        setStudents(mappedStudents);
      } catch (error) {
        console.error("Failed to fetch students:", error);
        if (isMounted) {
          setStudents([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadStudents();

    return () => {
      isMounted = false;
    };
  }, []);

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

          {/* Statistics */}
      <StudentStats students={students} />

      {loading && (
        <div className="rounded-2xl border border-border bg-white p-5 text-sm text-text-secondary">
          Memuat daftar siswa dari database...
        </div>
      )}

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