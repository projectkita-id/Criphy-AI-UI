
import type { LearningContent } from "../types/learningContent";

export const genericLearningContent: LearningContent = {
  phaseOne: {
    question:
      "Berdasarkan studi kasus di atas, bagaimana prediksimu tentang gerak benda yang terlibat? Jelaskan alasanmu menggunakan konsep fisika yang telah kamu ketahui.",
  },

  phaseTwo: {
    title: "Meninjau Kembali Prediksi Awal",
    description:
      "Perhatikan kembali situasi pada studi kasus. Pertimbangkan apakah terdapat informasi atau kemungkinan lain yang dapat memengaruhi prediksimu.",
    question:
      "Apakah prediksi awalmu selalu berlaku untuk setiap kondisi? Jelaskan informasi tambahan apa yang diperlukan untuk menguji prediksimu.",
    hint:
      "Pertimbangkan besaran fisika yang relevan, seperti waktu, jarak, kecepatan, atau percepatan. Informasi apa yang perlu diukur?",
  },

  // No evidence is invented for the prototype.
  phaseThree: null,

  phaseFour: {
    title: "Membangun Penjelasan Ilmiah",
    description:
      "Susun penjelasan berdasarkan klaim, bukti, dan penalaran yang relevan dengan studi kasus.",
  },

  phaseFive: {
    title: "Refleksi Pemahaman",
    description:
      "Bandingkan pemahaman awalmu dengan penjelasan ilmiah yang telah kamu susun.",
  },
};