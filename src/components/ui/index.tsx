"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "sm",
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center cursor-pointer justify-center gap-1 font-medium transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed";

  // ── VARIANTS ─────────────────────────────
  const variants = {
    primary: "bg-foreground text-white hover:bg-accent-hover",
    secondary: "bg-surface-sunken text-foreground hover:bg-accent-hover",
    ghost: "bg-transparent text-foreground hover:bg-surface-sunken",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  // ── SIZES ────────────────────────────────
  const sizes = {
    sm: "text-base px-3 h-7 rounded-sm",
    md: "text-base px-4 h-9 rounded-sm",
    lg: "text-base px-5 h-11 rounded-lg",
  };

  return (
    <button
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {leftIcon && leftIcon}
      {children}
      {rightIcon && rightIcon}
    </button>
  );
}
