"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [actualTheme, setActualTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Get theme from localStorage on mount
    const storedTheme = localStorage.getItem("theme") as Theme;
    if (storedTheme && ["light", "dark", "system"].includes(storedTheme)) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove existing theme classes
    root.classList.remove("light", "dark");

    let effectiveTheme: "light" | "dark";

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      effectiveTheme = systemTheme;
    } else {
      effectiveTheme = theme;
    }

    // Apply theme class
    root.classList.add(effectiveTheme);
    setActualTheme(effectiveTheme);

    // Store theme preference
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    // Listen for system theme changes when using system preference
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleChange = () => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");

        const systemTheme = mediaQuery.matches ? "dark" : "light";
        root.classList.add(systemTheme);
        setActualTheme(systemTheme);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    actualTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
