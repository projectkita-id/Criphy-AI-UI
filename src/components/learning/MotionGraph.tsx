import { mockInvestigation } from "../../data/learningSession";

export default function MotionGraph() {
  const data = mockInvestigation.data;

  const width = 700;
  const height = 320;

  const padding = {
    top: 30,
    right: 30,
    bottom: 55,
    left: 65,
  };

  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const maxTime = 5;
  const maxSpeed = 120;

  const x = (time: number) =>
    padding.left + (time / maxTime) * graphWidth;

  const y = (speed: number) =>
    padding.top +
    graphHeight -
    (speed / maxSpeed) * graphHeight;

  const createLine = (key: "carA" | "carB") =>
    data
      .map(
        (point, index) =>
          `${index === 0 ? "M" : "L"} ${x(point.time)} ${y(
            point[key]
          )}`
      )
      .join(" ");

  const speedTicks = [0, 20, 40, 60, 80, 100, 120];

  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <h3 className="text-lg font-semibold">
        Grafik Kecepatan terhadap Waktu
      </h3>

      <p className="mt-1 text-sm text-text-secondary">
        Perbandingan kecepatan Mobil A dan Mobil B
      </p>

      <div className="mt-6 w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto min-w-[480px] w-full"
          role="img"
          aria-label="Grafik kecepatan terhadap waktu. Mobil A tetap pada 100 kilometer per jam, sedangkan Mobil B meningkat dari 20 menjadi 40 kilometer per jam dalam lima detik."
        >
          {/* Horizontal grid lines */}
          {speedTicks.map((tick) => (
            <g key={tick}>
              <line
                x1={padding.left}
                y1={y(tick)}
                x2={width - padding.right}
                y2={y(tick)}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
              />

              <text
                x={padding.left - 12}
                y={y(tick) + 4}
                textAnchor="end"
                fontSize="12"
                fill="#64748b"
              >
                {tick}
              </text>
            </g>
          ))}

          {/* Time labels */}
          {data.map((point) => (
            <text
              key={point.time}
              x={x(point.time)}
              y={height - padding.bottom + 23}
              textAnchor="middle"
              fontSize="12"
              fill="#64748b"
            >
              {point.time}
            </text>
          ))}

          {/* Axes */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={height - padding.bottom}
            stroke="#94a3b8"
            strokeWidth="1.5"
          />

          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="#94a3b8"
            strokeWidth="1.5"
          />

          {/* Car A */}
          <path
            d={createLine("carA")}
            fill="none"
            stroke="#2563eb"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Car B */}
          <path
            d={createLine("carB")}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((point) => (
            <g key={point.time}>
              <circle
                cx={x(point.time)}
                cy={y(point.carA)}
                r="4"
                fill="#2563eb"
                stroke="white"
                strokeWidth="2"
              />

              <circle
                cx={x(point.time)}
                cy={y(point.carB)}
                r="4"
                fill="#10b981"
                stroke="white"
                strokeWidth="2"
              />
            </g>
          ))}

          {/* Axis labels */}
          <text
            x={width / 2}
            y={height - 8}
            textAnchor="middle"
            fontSize="13"
            fill="#475569"
          >
            Waktu (detik)
          </text>

          <text
            transform={`translate(17 ${height / 2}) rotate(-90)`}
            textAnchor="middle"
            fontSize="13"
            fill="#475569"
          >
            Kecepatan (km/jam)
          </text>
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-6">
        <div className="flex items-center gap-2 text-sm">
          <span className="h-3 w-3 rounded-full bg-blue-600" />
          Mobil A
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="h-3 w-3 rounded-full bg-emerald-500" />
          Mobil B
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-text-secondary">
        Data simulasi untuk pengembangan antarmuka,
        bukan hasil pengukuran eksperimen.
      </p>
    </div>
  );
}