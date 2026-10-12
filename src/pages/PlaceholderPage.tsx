import { Construction } from "lucide-react";

type PlaceholderPageProps = {
  title: string;
};

export default function PlaceholderPage({
  title,
}: PlaceholderPageProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-5 rounded-2xl bg-blue-50 p-5 text-primary">
        <Construction size={36} />
      </div>

      <h1 className="text-2xl font-bold">{title}</h1>

      <p className="mt-3 max-w-md text-text-secondary">
        Halaman ini sedang dalam tahap pengembangan.
      </p>
    </div>
  );
}