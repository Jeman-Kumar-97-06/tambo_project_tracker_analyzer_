"use client";

import { useTambo } from "@tambo-ai/react";

import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";

/**
 * Home page component that showcases the Tambo AI application features.
 *
 * The canvas space is now handled by ChatLayout and covers the entire right side.
 * This page content is minimal since the main interaction happens through the canvas.
 */
export default function Home() {
  const { sendThreadMessage } = useTambo();

  const createTracker = async () => {
    await sendThreadMessage(
      "Create a structured job application tracker and render it as a table.",
      { streamResponse: true },
    );
  };

  const createChart = async () => {
    await sendThreadMessage(
      "Create a bar chart showing population data for different countries.",
      { streamResponse: true },
    );
  };

  const generateRecipe = async () => {
    await sendThreadMessage(
      "Create a recipe card for a simple pasta dish using available ingredients.",
      { streamResponse: true },
    );
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-2xl">
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="text-sm text-muted-foreground">Theme:</span>
          <ThemeToggle variant="inline" />
        </div>

        <h1 className="text-4xl font-bold text-foreground mb-4">
          Welcome to Tambo AI
        </h1>

        <p className="text-lg text-muted-foreground mb-8">
          Use the chat interface on the left to generate interactive components.
          The canvas on the right will display your AI-generated content in
          full-screen.
        </p>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={createChart}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Generate Chart
          </button>
          <button
            onClick={createTracker}
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
          >
            Create Tracker
          </button>
          <button
            onClick={generateRecipe}
            className="px-6 py-3 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors"
          >
            Generate Recipe
          </button>
        </div>

        <div className="text-sm text-muted-foreground">
          💡 Try asking the AI to create charts, tables, interactive components,
          or any visual content!
        </div>
      </div>
    </div>
  );
}
