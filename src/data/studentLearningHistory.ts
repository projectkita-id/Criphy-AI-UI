
export type StudentLearningSession = {
  id: string;
  studentId: string;
  title: string;
  context: "DAILY_LIFE" | "ENVIRONMENT" | "TECHNOLOGY";
  completedAt: string;
  preTestScore: number;
  postTestScore: number;
  status: "COMPLETED";
};

export const demoStudentLearningHistory: StudentLearningSession[] = [
  {
    id: "session-001",
    studentId: "student-001",
    title: "GLB dan GLBB",
    context: "DAILY_LIFE",
    completedAt: "2026-10-12T09:30:00.000Z",
    preTestScore: 60,
    postTestScore: 85,
    status: "COMPLETED",
  },
  {
    id: "session-002",
    studentId: "student-001",
    title: "Grafik Gerak",
    context: "TECHNOLOGY",
    completedAt: "2026-10-10T10:00:00.000Z",
    preTestScore: 70,
    postTestScore: 90,
    status: "COMPLETED",
  },
  {
    id: "session-003",
    studentId: "student-002",
    title: "Gerak Lurus Berubah Beraturan",
    context: "ENVIRONMENT",
    completedAt: "2026-10-11T08:15:00.000Z",
    preTestScore: 65,
    postTestScore: 92,
    status: "COMPLETED",
  },
  {
    id: "session-004",
    studentId: "student-004",
    title: "Analisis Percepatan",
    context: "TECHNOLOGY",
    completedAt: "2026-10-10T13:45:00.000Z",
    preTestScore: 55,
    postTestScore: 78,
    status: "COMPLETED",
  },
  {
    id: "session-005",
    studentId: "student-005",
    title: "Gerak Lurus Beraturan",
    context: "DAILY_LIFE",
    completedAt: "2026-10-09T10:00:00.000Z",
    preTestScore: 70,
    postTestScore: 88,
    status: "COMPLETED",
  },
];