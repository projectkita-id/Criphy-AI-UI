export const learningPhases = [
  {
    id: 1,
    title: "Aktivasi Konsepsi Awal",
    description: "Mengidentifikasi pemahaman awal siswa.",
  },
  {
    id: 2,
    title: "Konflik Kognitif",
    description: "Menguji prediksi melalui situasi yang menantang.",
  },
  {
    id: 3,
    title: "Investigasi Berbasis Bukti",
    description: "Menganalisis data dan bukti.",
  },
  {
    id: 4,
    title: "Rekonstruksi Konsep",
    description: "Membangun penjelasan berdasarkan bukti.",
  },
  {
    id: 5,
    title: "Refleksi dan Evaluasi",
    description: "Mengevaluasi perubahan pemahaman.",
  },
];

export const mockCase = {
  id: "case-001",
  title: "Gerak Dua Kendaraan",
  topic: "Kinematika Gerak Lurus",
  context: "Kehidupan Sehari-hari",
  description:
    "Dua kendaraan bergerak di jalan lurus. Kendaraan A bergerak dengan kecepatan tetap, sedangkan kendaraan B meningkatkan kecepatannya.",
  initialQuestion:
    "Menurutmu, kendaraan mana yang mengalami percepatan? Jelaskan alasanmu.",
};

export const mockConflict = {
  title: "Apakah Kecepatan Tinggi Berarti Percepatan Tinggi?",

  scenario:
    "Mobil A bergerak dengan kecepatan tetap 100 km/jam. " +
    "Mobil B bergerak dari 20 km/jam menjadi 40 km/jam " +
    "dalam waktu 5 detik.",

  question:
    "Mobil manakah yang mengalami percepatan lebih besar? " +
    "Apakah kecepatan tinggi selalu berarti percepatan tinggi? " +
    "Jelaskan alasanmu.",

  hint:
    "Perhatikan apakah kecepatan masing-masing mobil berubah " +
    "selama interval waktu tersebut.",
};

export const mockInvestigation = {
  title: "Analisis Kecepatan Dua Mobil",

  description:
    "Perhatikan data kecepatan Mobil A dan Mobil B selama " +
    "5 detik. Mobil A bergerak dengan kecepatan tetap, " +
    "sedangkan Mobil B mengalami peningkatan kecepatan.",

  data: [
    { time: 0, carA: 100, carB: 20 },
    { time: 1, carA: 100, carB: 24 },
    { time: 2, carA: 100, carB: 28 },
    { time: 3, carA: 100, carB: 32 },
    { time: 4, carA: 100, carB: 36 },
    { time: 5, carA: 100, carB: 40 },
  ],

  question:
    "Berdasarkan tabel dan grafik, mobil manakah yang " +
    "mengalami percepatan? Gunakan perubahan kecepatan " +
    "dan interval waktu sebagai bukti untuk mendukung " +
    "jawabanmu.",

  hint:
    "Bandingkan kecepatan setiap mobil pada detik ke-0 " +
    "dan detik ke-5. Kemudian perhatikan perubahan " +
    "kecepatan terhadap waktu.",
};

export const mockReconstruction = {
  title: "Membangun Pemahaman Ilmiah",

  description:
    "Gunakan hasil investigasi sebelumnya untuk menyusun " +
    "penjelasan ilmiah mengenai gerak dan percepatan kedua mobil.",

  claim: {
    label: "Claim — Klaim",
    question:
      "Apa kesimpulan ilmiahmu mengenai percepatan Mobil A dan Mobil B?",
    placeholder: "Tuliskan kesimpulan ilmiahmu...",
    hint:
      "Pertimbangkan apakah kecepatan masing-masing mobil berubah terhadap waktu.",
  },

  evidence: {
    label: "Evidence — Bukti",
    question:
      "Data apa dari tabel atau grafik yang mendukung kesimpulanmu?",
    placeholder: "Sebutkan data atau perubahan kecepatan yang relevan...",
    hint:
      "Gunakan nilai kecepatan pada detik ke-0 dan detik ke-5 sebagai bukti.",
  },

  reasoning: {
    label: "Reasoning — Penalaran",
    question:
      "Mengapa bukti tersebut mendukung klaimmu berdasarkan konsep percepatan?",
    placeholder: "Hubungkan bukti dengan konsep fisika...",
    hint:
      "Percepatan merupakan perubahan kecepatan per satuan waktu. Perhatikan satuan yang digunakan.",
  },
};

export const mockReflection = {
  title: "Refleksi Perubahan Pemahaman",

  description:
    "Bandingkan prediksi awalmu dengan penjelasan ilmiah " +
    "yang telah kamu susun. Renungkan bagaimana bukti " +
    "dan investigasi memengaruhi pemahamanmu.",

  understandingQuestion:
    "Setelah melakukan investigasi, bagaimana pemahamanmu " +
    "tentang percepatan berubah?",

  evidenceQuestion:
    "Bukti atau informasi apa yang paling memengaruhi " +
    "pemahamanmu? Jelaskan alasannya.",

  understandingPlaceholder:
    "Jelaskan pemahamanmu sekarang dan bandingkan dengan prediksi awal...",

  evidencePlaceholder:
    "Sebutkan bukti dari tabel, grafik, atau investigasi...",
};