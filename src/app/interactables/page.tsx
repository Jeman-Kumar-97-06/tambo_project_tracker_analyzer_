"use client";

import { SettingsPanel } from "./components/settings-panel";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { ChatLayout } from "@/components/ChatLayout";

/**
 * Interactables demo page that showcases interactive components
 * that can be controlled and modified by AI through the global chat sidebar.
 *
 * This page demonstrates how AI can dynamically update UI components
 * based on user interactions and requests.
 */
export default function InteractablesPage() {
  const { actualTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Interactive Components Demo
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Use the chat sidebar to interact with and modify the components
              below. Ask the AI to update settings, change values, or generate
              new content.
            </p>

            {/* Theme Status Indicator */}
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-card border border-border rounded-lg">
              <span className="text-sm text-muted-foreground">
                Current theme:
              </span>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${actualTheme === "dark" ? "bg-slate-800" : "bg-yellow-400"}`}
                ></div>
                <span className="text-sm font-medium text-foreground capitalize">
                  {actualTheme}
                </span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-muted rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              💡 Try these commands:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Settings Panel:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• "Update the theme to dark mode"</li>
                  <li>• "Change the notification frequency to daily"</li>
                  <li>• "Enable auto-save feature"</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Data Visualization:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• "Show a chart with population data"</li>
                  <li>• "Create a pie chart of user preferences"</li>
                  <li>• "Generate a data table with sample data"</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Interactive Components */}
          <div className="space-y-8">
            {/* Theme Showcase Section */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">
                🎨 Theme Showcase
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-card-foreground">
                    Theme Controls
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Icon Toggle:
                      </span>
                      <ThemeToggle variant="icon" size="sm" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Dropdown:
                      </span>
                      <ThemeToggle variant="dropdown" size="md" />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <span className="text-sm text-muted-foreground">
                        Inline Options:
                      </span>
                      <ThemeToggle variant="inline" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-card-foreground">
                    Color Preview
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-background border border-border p-3 rounded">
                      <div className="text-foreground font-medium">
                        Background
                      </div>
                      <div className="text-muted-foreground">Foreground</div>
                    </div>
                    <div className="bg-primary p-3 rounded">
                      <div className="text-primary-foreground font-medium">
                        Primary
                      </div>
                      <div className="text-primary-foreground/80">
                        Primary Text
                      </div>
                    </div>
                    <div className="bg-secondary p-3 rounded">
                      <div className="text-secondary-foreground font-medium">
                        Secondary
                      </div>
                      <div className="text-secondary-foreground/80">
                        Secondary Text
                      </div>
                    </div>
                    <div className="bg-accent p-3 rounded">
                      <div className="text-accent-foreground font-medium">
                        Accent
                      </div>
                      <div className="text-accent-foreground/80">
                        Accent Text
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <SettingsPanel />

            {/* Placeholder for AI-generated content */}
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center bg-card/50">
              <h3 className="text-lg font-semibold mb-2 text-card-foreground">
                AI Generated Content Area
              </h3>
              <p className="text-muted-foreground">
                Content generated by AI through chat interactions will appear
                here. Try asking: "Create a dark-themed data table" or "Generate
                a chart with current theme colors"
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 pt-8">
            <a
              href="/"
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
            >
              ← Back to Home
            </a>
            <a
              href="/chat"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Full-Screen Chat →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
