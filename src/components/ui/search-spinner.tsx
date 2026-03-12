"use client";

interface SearchSpinnerProps {
  size?: number;

  color?: string;

  label?: string;

  showLabel?: boolean;

  className?: string;
}

export default function SearchSpinner({
  size = 26,
  color = "#0F2E35",
  label = "Searching",
  showLabel = true,
  className = "",
}: SearchSpinnerProps) {
  return (
    <div
      className={`flex flex-col items-center gap-2 ${className}`}
      role="status"
      aria-label={label}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 26 26"
        fill="none"
        aria-hidden="true"
        style={{
          animation: "searchSpinnerRotate 3s linear infinite",
        }}
      >
        <circle
          cx="13"
          cy="13"
          r="10.5"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="5 3.2"
        />
      </svg>

      {showLabel && (
        <span className="text-[13px] font-normal select-none" style={{ color }}>
          {label}
        </span>
      )}

      <style>{`
        @keyframes searchSpinnerRotate {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
