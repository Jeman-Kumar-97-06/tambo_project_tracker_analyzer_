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
import DevDashboard from "@/components/DashBoard";
import HabitAnalyzer from "@/components/HabitAnalyzer";
import CodeIssueAnalyzer from "@/components/CodeAnalyzer";
import JobRejectionAnalyzer from "@/components/JobAnalyzer";
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
import { buildDashboard } from "@/services/intent-tools/buildDashboard";
import { analyzeHabit } from "@/services/intent-tools/analyzeHabit";
import { analyzeCodeIssue } from "@/services/intent-tools/analyzeCodeIssue";
import { analyzeJobRejections } from "@/services/intent-tools/analyzeJobRejections";
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
      "Creates a habit tracker entry for a habit the user wants to track daily.",
    tool: createHabitTracker,
    inputSchema: z.object({
      habitName: z.string(),
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
  {
    name: "buildDashboard",
    description:
      "Builds a system overview dashboard by aggregating job trackers, habit trackers, and engineering issue trackers.",
    tool: buildDashboard,
    inputSchema: z.object({}),
    outputSchema: z.object({
      dateLabel: z.string(),
      jobs: z.array(
        z.object({
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
          location: z.string().optional(),
        }),
      ),
      habits: z.array(
        z.object({
          habitName: z.string(),
          initialDate: z.string(),
        }),
      ),
      issues: z.array(
        z.object({
          issueId: z.string(),
          title: z.string(),
          source: z.enum(["local", "github"]),
          priority: z.enum(["low", "medium", "high"]),
          labels: z.array(z.string()),
        }),
      ),
    }),
  },
  {
    name: "analyzeHabit",
    description:
      "Analyzes habit completion history and identifies consistency trends and common blockers.",
    tool: analyzeHabit,
    inputSchema: z.object({
      habitName: z.string(),
      history: z.array(
        z.object({
          date: z.string(),
          completed: z.number(),
          reason: z.string().optional(),
        }),
      ),
    }),
    outputSchema: z.object({
      habitName: z.string(),
      data: z.array(
        z.object({
          date: z.string(),
          completed: z.number(),
          reason: z.string(),
        }),
      ),
      reasons: z.array(z.string()),
    }),
  },
  {
    name: "analyzeCodeIssue",
    description:
      "Analyzes a reported code issue or repository problem and generates a structured resolution plan.",
    tool: analyzeCodeIssue,
    inputSchema: z.object({
      issueName: z.string(),
      repoName: z.string(),
      source: z.enum(["github", "local"]).optional(),
    }),
    outputSchema: z.object({
      issueName: z.string(),
      repoName: z.string(),
      issueLink: z.string(),
      source: z.enum(["github", "local"]),
      steps: z.array(z.string()),
    }),
  },
  {
    name: "analyzeJobRejections",
    description:
      "Analyzes job application history and extracts rejection patterns by role.",
    tool: analyzeJobRejections,
    inputSchema: z.object({
      applications: z.array(
        z.object({
          role: z.string(),
          status: z.enum([
            "Applied",
            "Waiting",
            "Rejected",
            "Heard Back",
            "Interview",
          ]),
        }),
      ),
    }),
    outputSchema: z.object({
      rejectionData: z.array(
        z.object({
          role: z.string(),
          count: z.number(),
        }),
      ),
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
      "Displays a habit tracker card where the user can mark a habit as done or missed and optionally provide a reason.",
    component: HabitCard,
    propsSchema: z.object({
      habitName: z.string(),
      initialDate: z.string(),
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
  {
    name: "DevDashboard",
    description:
      "Renders a unified dashboard combining job trackers, habit trackers, and engineering issue trackers into a single system overview.",
    component: DevDashboard,
    propsSchema: z.object({
      jobs: z.array(
        z.object({
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
          location: z.string().optional(),
        }),
      ),
      habits: z.array(
        z.object({
          habitName: z.string(),
          initialDate: z.string(),
        }),
      ),
      issues: z.array(
        z.object({
          issueId: z.string(),
          title: z.string(),
          description: z.string().optional(),
          source: z.enum(["local", "github"]),
          priority: z.enum(["low", "medium", "high"]),
          labels: z.array(z.string()).optional(),
        }),
      ),
      dateLabel: z.string(),
    }),
  },
  {
    name: "HabitAnalyzer",
    description:
      "Analyzes a habit over time, showing consistency trends and the most common reasons for missed days.",
    component: HabitAnalyzer,
    propsSchema: z.object({
      habitName: z.string(),
      data: z.array(
        z.object({
          date: z.string(),
          completed: z.number(), // 1 or 0
          reason: z.string().optional(),
        }),
      ),
      reasons: z.array(z.string()),
    }),
  },
  {
    name: "CodeIssueAnalyzer",
    description:
      "Analyzes a code or repository issue and presents a step-by-step resolution checklist with progress tracking.",
    component: CodeIssueAnalyzer,
    propsSchema: z.object({
      issueName: z.string(),
      repoName: z.string(),
      issueLink: z.string(),
      source: z.enum(["github", "local"]),
      steps: z.array(z.string()),
    }),
  },
  {
    name: "JobRejectionAnalyzer",
    description:
      "Analyzes job rejection patterns across roles and highlights the most common rejection areas.",
    component: JobRejectionAnalyzer,
    propsSchema: z.object({
      rejectionData: z.array(
        z.object({
          role: z.string(),
          count: z.number(),
        }),
      ),
    }),
  },
];
