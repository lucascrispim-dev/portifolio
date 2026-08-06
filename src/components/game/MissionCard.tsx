"use client";

import { useEraTheme } from "@/components/game/EraThemeProvider";

export function MissionCard({
  label,
  lines,
}: {
  label: string;
  lines: string[];
}) {
  const theme = useEraTheme();

  return (
    <div
      className="flex flex-col gap-3 border p-5"
      style={{
        borderRadius: theme.radius,
        borderColor: `${theme.foreground}33`,
        backgroundColor: `${theme.foreground}14`,
      }}
    >
      <p
        className="text-xs font-semibold tracking-[0.2em]"
        style={{ color: theme.accent }}
      >
        {label}
      </p>
      <div className="flex flex-col gap-1.5 text-[15px] leading-relaxed">
        {lines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </div>
  );
}
