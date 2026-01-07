"use client";

import { useState, type ButtonHTMLAttributes, type MouseEventHandler } from "react";
import { cn } from "@/lib/utils";

type ToggleProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  size?: "sm" | "md";
  variant?: "default" | "outline" | "ghost";
};

export function Toggle({
  pressed: pressedProp,
  onPressedChange,
  size = "md",
  variant = "default",
  className,
  onClick: onClickProp,
  ...props
}: ToggleProps) {
  const [uncontrolled, setUncontrolled] = useState(false);
  const pressed = pressedProp ?? uncontrolled;

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    const next = !pressed;
    if (pressedProp === undefined) {
      setUncontrolled(next);
    }
    onPressedChange?.(next);
    onClickProp?.(event);
  };

  const sizeClasses = size === "sm" ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm";

  const variantClasses =
    variant === "outline"
      ? "border border-zinc-300 bg-transparent text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800/50"
      : variant === "ghost"
      ? "bg-transparent text-zinc-900 hover:bg-zinc-200/80 dark:text-zinc-50 dark:hover:bg-zinc-800/40"
      : "bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700";

  return (
    <button
      {...props}
      type="button"
      data-state={pressed ? "on" : "off"}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        sizeClasses,
        variantClasses,
        className
      )}
      aria-pressed={pressed}
      onClick={handleClick}
    />
  );
}
