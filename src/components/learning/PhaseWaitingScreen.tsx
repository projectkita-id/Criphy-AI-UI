import { ArrowRight, Sparkles } from "lucide-react";

type Props = {
    phaseNumber: number;
    title: string;
    description: string;
    onStart: () => void;
};

export default function PhaseWaitingScreen({
    phaseNumber,
    title,
    description,
    onStart,
}: Props) {
    return (
        <div className="mx-auto flex min-h-[420px] max-w-3xl items-center justify-center">
            <div className="w-full rounded-3xl border border-border bg-white p-8 text-center shadow-sm sm:p-10">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                    Fase {phaseNumber}
                </p>

                <div className="mt-5 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-primary">
                        <Sparkles size={28} />
                    </div>
                </div>

                <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
                    {title}
                </h2>

                <p className="mt-4 text-lg text-text-secondary">
                    {description}
                </p>

                <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-left text-sm leading-relaxed text-blue-900">
                    Saat tombol di bawah ini ditekan, timer fase akan mulai dan anda akan masuk ke sesi pengerjaan soal. Anda dapat mengambil jeda sejenak sebelum memulai, tanpa memengaruhi waktu evaluasi yang benar-benar dihitung setelah fase dimulai.
                </div>

                <button
                    type="button"
                    onClick={onStart}
                    className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                    Mulai Fase {phaseNumber}
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
}
