"use client";

type ProgressBarProps = {
  current: number;
  total: number;
};

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div>
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-foreground/30">
        <span>
          Krok {current} z {total}
        </span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="mt-3 h-[2px] w-full bg-foreground/[0.08]">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            background: "linear-gradient(90deg, #ff6600, #ff7b1f)",
          }}
        />
      </div>
    </div>
  );
}

