
export type CaseStudyContext =
  | "DAILY_LIFE"
  | "ENVIRONMENT"
  | "TECHNOLOGY";

export type CaseStudyStatus = "DRAFT" | "PUBLISHED";

export type CaseStudy = {
  id: string;
  title: string;
  description: string;
  context: CaseStudyContext;
  topic: string;
  status: CaseStudyStatus;
  createdAt: string;
};

export const caseStudyContexts: Record<
  CaseStudyContext,
  string
> = {
  DAILY_LIFE: "Kehidupan Sehari-hari",
  ENVIRONMENT: "Lingkungan",
  TECHNOLOGY: "Teknologi",
};

export const caseStudyStatuses: Record<
  CaseStudyStatus,
  string
> = {
  DRAFT: "Draft",
  PUBLISHED: "Dipublikasikan",
};

// Illustrative data for frontend development only.
export const demoCaseStudies: CaseStudy[] = [
  {
    id: "case-001",
    title: "Dua Mobil di Jalan Raya",
    description:
      "Dua mobil bergerak pada lintasan lurus dengan karakteristik " +
      "gerak yang berbeda. Siswa diminta membandingkan kecepatan " +
      "dan percepatan berdasarkan bukti.",
    context: "DAILY_LIFE",
    topic: "GLB dan GLBB",
    status: "PUBLISHED",
    createdAt: "2026-10-10T08:00:00.000Z",
  },
  {
    id: "case-002",
    title: "Gerak Air di Saluran Irigasi",
    description:
      "Siswa mengeksplorasi perubahan posisi terhadap waktu " +
      "melalui ilustrasi pergerakan objek di aliran air.",
    context: "ENVIRONMENT",
    topic: "Grafik Gerak",
    status: "DRAFT",
    createdAt: "2026-10-11T09:00:00.000Z",
  },
  {
    id: "case-003",
    title: "Pengujian Kendaraan Otomatis",
    description:
      "Sebuah kendaraan otomatis menjalani pengujian gerak lurus. " +
      "Siswa menganalisis hubungan antara kecepatan, waktu, " +
      "dan percepatan.",
    context: "TECHNOLOGY",
    topic: "GLBB",
    status: "DRAFT",
    createdAt: "2026-10-12T10:00:00.000Z",
  },
];