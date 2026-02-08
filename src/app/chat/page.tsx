"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

/**
 * Chat page component that provides a full-screen chat experience.
 *
 * Since chat is now available globally via the sidebar, this page
 * provides a focused, full-screen chat interface for users who
 * prefer a dedicated chat experience.
 */
export default function ChatPage() {
  const { actualTheme } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-bold text-foreground">
          Chat with Tambo AI
        </h1>

        <p className="text-lg text-muted-foreground">
          You can now chat with Tambo AI from any page using the sidebar on the
          left. This persistent chat interface allows you to get assistance
          while browsing different sections of the application.
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg text-left">
            <h3 className="font-semibold mb-2">
              💡 Tips for using the chat sidebar:
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Ask questions about any content on the current page</li>
              <li>• Generate charts, tables, and interactive components</li>
              <li>• Get help with data analysis and visualization</li>
              <li>• Create custom tools and workflows</li>
              <li>• Switch themes using the toggle in the sidebar header</li>
            </ul>
          </div>

          <div className="p-4 bg-card border border-border rounded-lg text-left">
            <h3 className="font-semibold mb-3 text-card-foreground">
              🎨 Dark Mode Features:
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Current theme:{" "}
                  <span className="font-medium text-foreground capitalize">
                    {actualTheme}
                  </span>
                </span>
                <div
                  className={`w-3 h-3 rounded-full ${actualTheme === "dark" ? "bg-slate-800" : "bg-yellow-400"}`}
                ></div>
              </div>
              <div className="text-sm text-muted-foreground">
                Try asking the AI to generate components that adapt to your
                current theme!
              </div>
              <ThemeToggle variant="inline" className="justify-start" />
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <a
              href="/"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              ← Back to Home
            </a>
            <a
              href="/interactables"
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
            >
              Try Interactables →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
