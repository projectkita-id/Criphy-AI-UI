export type AssessmentQuestion =
  | {
      id: string;
      type: "MULTIPLE_CHOICE";
      question: string;
      options: { id: string; text: string }[];
    }
  | {
      id: string;
      type: "ESSAY";
      question: string;
    };

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: "q1",
    type: "MULTIPLE_CHOICE",
    question:
      "Sebuah mobil bergerak dengan kecepatan tetap 20 m/s. Bagaimana percepatan mobil tersebut?",
    options: [
      { id: "A", text: "0 m/s²" },
      { id: "B", text: "10 m/s²" },
      { id: "C", text: "20 m/s²" },
      { id: "D", text: "40 m/s²" },
    ],
  },
  {
    id: "q2",
    type: "ESSAY",
    question:
      "Dua mobil bergerak pada lintasan lurus. Mobil A memiliki kecepatan tetap 10 m/s, sedangkan mobil B memiliki kecepatan tetap 20 m/s. Apakah mobil B memiliki percepatan lebih besar? Jelaskan alasanmu.",
  },
  {
    id: "q3",
    type: "MULTIPLE_CHOICE",
    question:
      "Apa yang ditunjukkan oleh kemiringan grafik posisi terhadap waktu?",
    options: [
      { id: "A", text: "Massa benda" },
      { id: "B", text: "Kecepatan benda" },
      { id: "C", text: "Gaya benda" },
      { id: "D", text: "Energi benda" },
    ],
  },
  {
    id: "q4",
    type: "ESSAY",
    question:
      "Seorang siswa menyatakan bahwa benda yang bergerak lebih cepat pasti memiliki percepatan lebih besar. Apakah kamu setuju? Jelaskan dengan bukti atau contoh.",
  },
];