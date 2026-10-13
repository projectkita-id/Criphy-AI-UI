
export type StudentStatus = "ACTIVE" | "INACTIVE";

export type Student = {
  id: string;
  name: string;
  email: string;
  className: string;
  status: StudentStatus;
  completedSessions: number;
  averageScore: number | null;
  lastActivity: string | null;
};

export const studentStatuses: Record<StudentStatus, string> = {
  ACTIVE: "Aktif",
  INACTIVE: "Tidak Aktif",
};

// Illustrative records only. Not real student data.
export const demoStudents: Student[] = [
  {
    id: "student-001",
    name: "Andi Pratama",
    email: "andi@example.com",
    className: "XI IPA 1",
    status: "ACTIVE",
    completedSessions: 5,
    averageScore: 85,
    lastActivity: "2026-10-12T09:30:00.000Z",
  },
  {
    id: "student-002",
    name: "Siti Rahmawati",
    email: "siti@example.com",
    className: "XI IPA 2",
    status: "ACTIVE",
    completedSessions: 3,
    averageScore: 92,
    lastActivity: "2026-10-11T08:15:00.000Z",
  },
  {
    id: "student-003",
    name: "Budi Santoso",
    email: "budi@example.com",
    className: "XI IPA 1",
    status: "INACTIVE",
    completedSessions: 0,
    averageScore: null,
    lastActivity: null,
  },
  {
    id: "student-004",
    name: "Dewi Anggraini",
    email: "dewi@example.com",
    className: "XI IPA 3",
    status: "ACTIVE",
    completedSessions: 7,
    averageScore: 78,
    lastActivity: "2026-10-10T13:45:00.000Z",
  },
  {
    id: "student-005",
    name: "Rizky Maulana",
    email: "rizky@example.com",
    className: "XI IPA 2",
    status: "ACTIVE",
    completedSessions: 2,
    averageScore: 88,
    lastActivity: "2026-10-09T10:00:00.000Z",
  },
];
