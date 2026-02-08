"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ThemeToggleProps {
  className?: string;
  variant?: "icon" | "dropdown" | "inline";
  size?: "sm" | "md" | "lg";
}

export function ThemeToggle({
  className,
  variant = "dropdown",
  size = "md"
}: ThemeToggleProps) {
  const { theme, setTheme, actualTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  // Simple icon toggle (cycles through themes)
  if (variant === "icon") {
    const handleClick = () => {
      const themes = ["light", "dark", "system"] as const;
      const currentIndex = themes.indexOf(theme);
      const nextIndex = (currentIndex + 1) % themes.length;
      setTheme(themes[nextIndex]);
    };

    const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

    return (
      <button
        onClick={handleClick}
        className={cn(
          "rounded-lg border border-border bg-background hover:bg-accent transition-colors flex items-center justify-center",
          sizeClasses[size],
          className
        )}
        title={`Current theme: ${theme === "system" ? `system (${actualTheme})` : theme}`}
      >
        <Icon className={iconSizeClasses[size]} />
      </button>
    );
  }

  // Inline toggle (shows all options side by side)
  if (variant === "inline") {
    return (
      <div className={cn("flex rounded-lg border border-border p-1 bg-background", className)}>
        {[
          { value: "light", icon: Sun, label: "Light" },
          { value: "dark", icon: Moon, label: "Dark" },
          { value: "system", icon: Monitor, label: "System" }
        ].map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            onClick={() => setTheme(value as any)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
              theme === value
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent/50 text-muted-foreground"
            )}
            title={`Switch to ${label.toLowerCase()} theme`}
          >
            <Icon className="w-4 h-4" />
            <span className="sr-only sm:not-sr-only">{label}</span>
          </button>
        ))}
      </div>
    );
  }

  // Dropdown toggle (default)
  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onBlur={(e) => {
          // Close dropdown when clicking outside
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsOpen(false);
          }
        }}
        className={cn(
          "rounded-lg border border-border bg-background hover:bg-accent transition-colors flex items-center justify-center",
          sizeClasses[size]
        )}
        title={`Current theme: ${theme === "system" ? `system (${actualTheme})` : theme}`}
      >
        <Icon className={iconSizeClasses[size]} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-popover border border-border rounded-lg shadow-lg py-1 z-50 min-w-[120px]">
          {[
            { value: "light", icon: Sun, label: "Light" },
            { value: "dark", icon: Moon, label: "Dark" },
            { value: "system", icon: Monitor, label: "System" }
          ].map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => {
                setTheme(value as any);
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent transition-colors text-left",
                theme === value && "bg-accent text-accent-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
              {value === "system" && (
                <span className="ml-auto text-xs text-muted-foreground">
                  ({actualTheme})
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Simplified hook for quick theme switching
export function useThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const themes = ["light", "dark", "system"] as const;
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return { theme, toggleTheme };
}
