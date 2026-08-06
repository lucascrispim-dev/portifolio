"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useEraTheme } from "@/components/game/EraThemeProvider";

type ChoiceButtonVariant = "primary" | "secondary" | "ghost";

type ChoiceButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ChoiceButtonVariant;
  children: ReactNode;
};

export function ChoiceButton({
  variant = "primary",
  children,
  className = "",
  style,
  ...rest
}: ChoiceButtonProps) {
  const theme = useEraTheme();

  const variantStyle: Record<ChoiceButtonVariant, React.CSSProperties> = {
    primary: {
      backgroundColor: theme.foreground,
      color: theme.buttonTextColor,
      border: "1px solid transparent",
    },
    secondary: {
      backgroundColor: "transparent",
      color: theme.foreground,
      border: `1.5px solid ${theme.foreground}`,
    },
    ghost: {
      backgroundColor: "transparent",
      color: theme.foreground,
      border: "1px solid transparent",
      textDecoration: "underline",
    },
  };

  return (
    <button
      type="button"
      className={`min-h-11 w-full px-6 py-3 text-[15px] font-semibold tracking-wide transition-transform duration-150 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
      style={{
        ...variantStyle[variant],
        borderRadius: theme.radius,
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
