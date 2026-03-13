interface LineData {
  x1: number;
  x2: number;
  y: number;
  hasVertical: boolean;
}

// Generated once at module load — stable across re-renders
const CIRCUIT_LINES: LineData[] = [...Array(18)].map((_, i) => {
  const x1 = Math.random() * 200;
  const x2 = x1 + 200 + Math.random() * 600;
  return { x1, x2, y: 40 + i * 60, hasVertical: i % 3 === 0 };
});

export default function CircuitBackground() {
  const lines = CIRCUIT_LINES;

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 30% 50%, #0a1a0f 0%, #060d08 40%, #050505 100%)",
      }}
    >
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0 opacity-[0.12]"
      >
        <defs>
          <linearGradient id="cg1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#065f46" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="g" />
            <feMerge>
              <feMergeNode in="g" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {lines.map((line, i) => (
          <g key={i} filter="url(#glow)">
            <line
              x1={line.x1}
              y1={line.y}
              x2={line.x2}
              y2={line.y}
              stroke="url(#cg1)"
              strokeWidth="1"
            />
            <circle cx={line.x1} cy={line.y} r="3" fill="#22c55e" />
            <circle cx={line.x2} cy={line.y} r="3" fill="#22c55e" />
            {line.hasVertical && (
              <line
                x1={line.x2}
                y1={line.y}
                x2={line.x2}
                y2={line.y + 60}
                stroke="url(#cg1)"
                strokeWidth="1"
              />
            )}
          </g>
        ))}
      </svg>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 80%, rgba(34,197,94,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(34,197,94,0.04) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}
