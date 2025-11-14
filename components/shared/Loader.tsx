"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type LoaderProps = {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
};

export function Loader({ size = "md", label, className }: LoaderProps) {
  const sizeClasses =
    size === "sm"
      ? "h-4 w-4 border-2"
      : size === "lg"
      ? "h-8 w-8 border-4"
      : "h-6 w-6 border-2";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-green-600 border-t-transparent",
          sizeClasses
        )}
        aria-hidden="true"
      />
      {label && (
        <span className="text-sm text-muted-foreground">{label}</span>
      )}
    </div>
  );
}
