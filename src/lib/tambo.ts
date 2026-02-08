/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import { Graph, graphSchema } from "@/components/tambo/graph";
import { DataCard, dataCardSchema } from "@/components/ui/card-data";
import RecipeCard from "@/components/RecipeCard";
import HabitCard from "@/components/Habit";
import IssueTrackerCard from "@/components/CodeIssueTracker";
import JobTrackerCard from "@/components/JobTracker";
import {
  getCountryPopulations,
  getGlobalPopulationTrend,
} from "@/services/population-stats";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";
import TableView from "@/components/TableView";
import { createTracker } from "@/services/intent-tools/createTracker";
import { createHabitTracker } from "@/services/intent-tools/createHabitTracker";
import { createIssueTracker } from "@/services/intent-tools/createIssueTracker";
import { createJobTracker } from "@/services/intent-tools/createJobTracker";

/**
 * tools
 *
 * This array contains all the Tambo tools that are registered for use within the application.
 * Each tool is defined with its name, description, and expected props. The tools
 * can be controlled by AI to dynamically fetch data based on user interactions.
 */

export const tools: TamboTool[] = [
  {
    name: "countryPopulation",
    description:
      "A tool to get population statistics by country with advanced filtering options",
    tool: getCountryPopulations,
    inputSchema: z.object({
      continent: z.string().optional(),
      sortBy: z.enum(["population", "growthRate"]).optional(),
      limit: z.number().optional(),
      order: z.enum(["asc", "desc"]).optional(),
    }),
    outputSchema: z.array(
      z.object({
        countryCode: z.string(),
        countryName: z.string(),
        continent: z.enum([
          "Asia",
          "Africa",
          "Europe",
          "North America",
          "South America",
          "Oceania",
        ]),
        population: z.number(),
        year: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
  {
    name: "get-available-ingredients",
    description:
      "Get a list of all the available ingredients that can be used in a recipe.",
    tool: () => [
      "pizza dough",
      "mozzarella cheese",
      "tomatoes",
      "basil",
      "olive oil",
      "chicken breast",
      "ground beef",
      "onions",
      "garlic",
      "bell peppers",
      "mushrooms",
      "pasta",
      "rice",
      "eggs",
      "bread",
    ],
    inputSchema: z.object({}),
    outputSchema: z.array(z.string()),
  },
  {
    name: "globalPopulation",
    description:
      "A tool to get global population trends with optional year range filtering",
    tool: getGlobalPopulationTrend,
    inputSchema: z.object({
      startYear: z.number().optional(),
      endYear: z.number().optional(),
    }),
    outputSchema: z.array(
      z.object({
        year: z.number(),
        population: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
  // Add more tools here
  {
    name: "createTracker",
    description:
      "Creates a structured tracker with columns and rows that must be rendered as a TableView UI component",
    tool: createTracker,
    inputSchema: z.object({
      entity: z.string(),
    }),
    outputSchema: z.object({
      title: z.string(),
      columns: z.array(
        z.object({
          key: z.string(),
          label: z.string(),
        }),
      ),
      rows: z.array(
        z.object({
          company: z.string(),
          role: z.string(),
          status: z.string(),
          deadline: z.string(),
        }),
      ),
    }),
  },
  {
    name: "createHabitTracker",
    description:
      "Creates a habit tracker card for a single habit that the user wants to track daily.",
    tool: createHabitTracker,
    inputSchema: z.object({
      habit: z.string().describe("The habit the user wants to track"),
    }),
    outputSchema: z.object({
      habitName: z.string(),
      initialDate: z.string(),
    }),
  },
  {
    name: "createIssueTracker",
    description:
      "Analyzes a code issue, bug report, or repository input and creates a structured issue tracker entry.",
    tool: createIssueTracker,
    inputSchema: z.object({
      title: z.string().describe("Short summary of the issue"),
      description: z
        .string()
        .describe("Detailed description or analysis of the issue"),
      source: z
        .enum(["local", "github"])
        .optional()
        .describe("Source of the issue"),
    }),
    outputSchema: z.object({
      issueId: z.string(),
      title: z.string(),
      description: z.string(),
      source: z.enum(["local", "github"]),
      priority: z.enum(["low", "medium", "high"]),
      labels: z.array(z.string()),
    }),
  },
  {
    name: "createJobTracker",
    description:
      "Creates a job application tracker entry for a specific company and role.",
    tool: createJobTracker,
    inputSchema: z.object({
      company: z.string(),
      role: z.string(),
      status: z
        .enum(["Applied", "Waiting", "Rejected", "Heard Back", "Interview"])
        .optional(),
      interviewDate: z.string().optional(),
      location: z.string().optional(),
    }),
    outputSchema: z.object({
      company: z.string(),
      role: z.string(),
      status: z.enum([
        "Applied",
        "Waiting",
        "Rejected",
        "Heard Back",
        "Interview",
      ]),
      interviewDate: z.string().optional(),
      location: z.string(),
    }),
  },
];

/**
 * components
 *
 * This array contains all the Tambo components that are registered for use within the application.
 * Each component is defined with its name, description, and expected props. The components
 * can be controlled by AI to dynamically render UI elements based on user interactions.
 */
export const components: TamboComponent[] = [
  {
    name: "Graph",
    description:
      "A component that renders various types of charts (bar, line, pie) using Recharts. Supports customizable data visualization with labels, datasets, and styling options.",
    component: Graph,
    propsSchema: graphSchema,
  },
  {
    name: "DataCard",
    description:
      "A component that displays options as clickable cards with links and summaries with the ability to select multiple items.",
    component: DataCard,
    propsSchema: dataCardSchema,
  },
  // Add more components here
  {
    name: "RecipeCard",
    description: "A component that renders a recipe card",
    component: RecipeCard,
    propsSchema: z.object({
      title: z.string().describe("The title of the recipe"),
      description: z.string().describe("The description of the recipe"),
      prepTime: z.number().describe("The prep time of the recipe in minutes"),
      cookTime: z.number().describe("The cook time of the recipe in minutes"),
      originalServings: z
        .number()
        .describe("The original servings of the recipe"),
      ingredients: z
        .array(
          z.object({
            name: z.string().describe("The name of the ingredient"),
            amount: z.number().describe("The amount of the ingredient"),
            unit: z.string().describe("The unit of the ingredient"),
          }),
        )
        .describe("The ingredients of the recipe"),
    }),
  },
  {
    name: "TableView",
    description:
      "Renders tracker data returned by createTracker as a table UI. Use this whenever columns and rows are present.",
    component: TableView,
    propsSchema: z.object({
      title: z.string(),
      columns: z.array(
        z.object({
          key: z.string(),
          label: z.string(),
        }),
      ),
      rows: z.array(
        z.object({
          company: z.string(),
          role: z.string(),
          status: z.string(),
          deadline: z.string(),
        }),
      ),
    }),
  },
  {
    name: "HabitCard",
    description:
      "Displays a habit tracker card where the user can mark a habit as done or missed for a specific date.",
    component: HabitCard,
    propsSchema: z.object({
      habitName: z.string().describe("The name of the habit being tracked"),
      initialDate: z
        .string()
        .describe(
          "The date for which the habit is tracked, formatted as a readable string",
        ),
    }),
  },
  {
    name: "IssueTrackerCard",
    description:
      "Displays a tracked code or bug issue with priority, labels, and resolution status. Used for code issues and bug tracking.",
    component: IssueTrackerCard,
    propsSchema: z.object({
      issueId: z.string().describe("Unique identifier for the issue"),
      title: z.string().describe("Short title summarizing the issue"),
      description: z.string().describe("Detailed description of the issue"),
      source: z
        .enum(["local", "github"])
        .describe("Where the issue originated from"),
      priority: z
        .enum(["low", "medium", "high"])
        .describe("Priority level of the issue"),
      labels: z
        .array(z.string())
        .describe("Tags or labels associated with the issue"),
    }),
  },
  {
    name: "JobTrackerCard",
    description:
      "Displays a job application tracker card with company, role, status, interview date, and location.",
    component: JobTrackerCard,
    propsSchema: z.object({
      company: z.string(),
      role: z.string(),
      status: z.enum([
        "Applied",
        "Waiting",
        "Rejected",
        "Heard Back",
        "Interview",
      ]),
      interviewDate: z.string().optional(),
      location: z.string(),
    }),
  },
];
