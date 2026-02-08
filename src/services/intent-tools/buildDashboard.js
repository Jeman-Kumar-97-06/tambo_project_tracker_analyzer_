// =========================
// TOOL IMPLEMENTATION
// =========================

// src/services/intent-tools/buildDashboard.js

export async function buildDashboard() {
  return {
    dateLabel: "Monday, Feb 9, 2026",

    jobs: [
      {
        company: "Google",
        role: "L4 Frontend",
        status: "Interview",
        interviewDate: "Feb 10",
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
        initialDate: new Date().toLocaleDateString(),
      },
      {
        habitName: "Leetcode Medium",
        initialDate: new Date().toLocaleDateString(),
      },
      {
        habitName: "FastAPI Docs",
        initialDate: new Date().toLocaleDateString(),
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
