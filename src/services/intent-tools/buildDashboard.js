// =========================
// TOOL IMPLEMENTATION
// =========================

// src/services/intent-tools/buildDashboard.js

import { DashboardService } from "../dashboardService";

export async function buildDashboard() {
  try {
    // Ensure this only runs on server side
    if (typeof window !== "undefined") {
      console.warn(
        "buildDashboard should only be called on the server side, using fallback data",
      );
      throw new Error("Server-side only");
    }

    // Use the database service to get real data
    const dashboardData = await DashboardService.getDashboardData();

    console.log("Dashboard data fetched from database:", {
      jobs: dashboardData.jobs.length,
      habits: dashboardData.habits.length,
      issues: dashboardData.issues.length,
    });

    return dashboardData;
  } catch (error) {
    console.error("Error fetching dashboard data from database:", error);

    // Fallback to mock data if database fails
    const fallbackDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return {
      dateLabel: fallbackDate,

      jobs: [
        {
          company: "Google",
          role: "L4 Frontend",
          status: "Interview",
          interviewDate: "2024-02-10",
          location: "Remote",
        },
        {
          company: "Vercel",
          role: "Product Engineer",
          status: "Heard Back",
          location: "Remote",
        },
      ],

      habits: [
        {
          habitName: "Practice C Syntax",
          initialDate: new Date().toISOString().split("T")[0],
        },
        {
          habitName: "Leetcode Medium",
          initialDate: new Date().toISOString().split("T")[0],
        },
        {
          habitName: "FastAPI Docs",
          initialDate: new Date().toISOString().split("T")[0],
        },
      ],

      issues: [
        {
          issueId: "BUG-404",
          title: "Hydration Error in Navbar",
          source: "local",
          priority: "high",
          labels: ["react", "ui"],
        },
        {
          issueId: "PR-22",
          title: "Integrate MCP Weather Tool",
          source: "github",
          priority: "medium",
          labels: ["python", "mcp"],
        },
        {
          issueId: "TASK-89",
          title: "Update MongoDB Schema",
          source: "local",
          priority: "low",
          labels: ["database"],
        },
      ],
    };
  }
}
