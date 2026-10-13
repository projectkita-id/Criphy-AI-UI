
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type MotionDataPoint = {
  time: number;
  carA: number;
  carB: number;
};

type Props = {
  data: MotionDataPoint[];
};

export default function MotionGraph({ data }: Props) {
  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <h3 className="text-lg font-semibold">
        Grafik Kecepatan terhadap Waktu
      </h3>

      <p className="mt-1 text-sm text-text-secondary">
        Perbandingan kecepatan Mobil A dan Mobil B
      </p>

      <div
        className="mt-6 h-80 w-full"
        role="img"
        aria-label="Grafik kecepatan Mobil A dan Mobil B terhadap waktu berdasarkan data simulasi."
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 20,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
            />

            <XAxis
              dataKey="time"
              type="number"
              domain={["dataMin", "dataMax"]}
              tick={{ fontSize: 12 }}
              label={{
                value: "Waktu (detik)",
                position: "insideBottom",
                offset: -12,
              }}
            />

            <YAxis
              tick={{ fontSize: 12 }}
              domain={[0, "auto"]}
              width={45}
              label={{
                value: "Kecepatan (km/jam)",
                angle: -90,
                position: "insideLeft",
                style: {
                  textAnchor: "middle",
                  fontSize: 12,
                },
              }}
            />

            <Tooltip
              formatter={(value, name) => [
                `${value} km/jam`,
                String(name),
              ]}
              labelFormatter={(value) =>
                `Waktu: ${value} detik`
              }
            />

            <Legend verticalAlign="top" height={36} />

            <Line
              type="linear"
              dataKey="carA"
              name="Mobil A"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

            <Line
              type="linear"
              dataKey="carB"
              name="Mobil B"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 text-center text-xs text-text-secondary">
        Data simulasi untuk pengembangan antarmuka,
        bukan hasil pengukuran eksperimen.
      </p>
    </div>
  );
}
