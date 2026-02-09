import { CodeIssueService } from "../codeIssueService";

export async function createIssueTracker({
  title,
  description,
  source = "local",
}) {
  try {
    // Ensure this only runs on server side
    if (typeof window !== "undefined") {
      console.warn(
        "createIssueTracker should only be called on the server side, using fallback data",
      );
      throw new Error("Server-side only");
    }
    // Generate a unique issue ID
    const issueId = `ISS-${Math.floor(Math.random() * 900 + 100)}`;

    // Determine priority based on keywords in title/description
    let priority = "medium";
    const highPriorityKeywords = [
      "critical",
      "urgent",
      "blocking",
      "crash",
      "error",
      "bug",
    ];
    const lowPriorityKeywords = [
      "enhancement",
      "feature",
      "improvement",
      "docs",
    ];

    const combinedText = `${title} ${description}`.toLowerCase();

    if (
      highPriorityKeywords.some((keyword) => combinedText.includes(keyword))
    ) {
      priority = "high";
    } else if (
      lowPriorityKeywords.some((keyword) => combinedText.includes(keyword))
    ) {
      priority = "low";
    }

    // Generate labels based on content analysis
    const labels = [];
    if (source === "github") {
      labels.push("repository", "github");
    } else {
      labels.push("local");
    }

    // Add technology-specific labels based on description
    const techKeywords = {
      react: ["react", "jsx", "component", "hook", "state"],
      nodejs: ["node", "express", "server", "backend"],
      database: ["mongo", "sql", "db", "schema", "query"],
      api: ["api", "endpoint", "rest", "graphql"],
      ui: ["ui", "interface", "design", "layout", "css"],
      performance: ["slow", "performance", "optimization", "memory"],
      security: ["security", "auth", "permission", "vulnerability"],
    };

    Object.entries(techKeywords).forEach(([tech, keywords]) => {
      if (keywords.some((keyword) => combinedText.includes(keyword))) {
        labels.push(tech);
      }
    });

    // If no specific labels found, add general ones
    if (labels.length <= 1) {
      if (combinedText.includes("bug") || combinedText.includes("error")) {
        labels.push("bug");
      } else {
        labels.push("task");
      }
    }

    // Check if issue with same title already exists
    const existingIssue = await CodeIssueService.searchIssues(title);
    const duplicateIssue = existingIssue.find(
      (issue) => issue.title.toLowerCase() === title.toLowerCase(),
    );

    if (duplicateIssue) {
      console.log(
        `Issue with title "${title}" already exists, returning existing issue`,
      );
      return {
        issueId: duplicateIssue.issueId,
        title: duplicateIssue.title,
        description: duplicateIssue.description,
        source: duplicateIssue.source,
        priority: duplicateIssue.priority,
        labels: duplicateIssue.labels,
      };
    }

    // Create new issue in database
    const newIssue = await CodeIssueService.createCodeIssue({
      issueId,
      title,
      description,
      source,
      priority,
      labels,
    });

    console.log(`Created new code issue: ${title} (${issueId})`);

    return {
      issueId: newIssue.issueId,
      title: newIssue.title,
      description: newIssue.description,
      source: newIssue.source,
      priority: newIssue.priority,
      labels: newIssue.labels,
    };
  } catch (error) {
    console.error(`Error creating issue tracker for "${title}":`, error);

    // Return fallback response if database fails
    const fallbackIssueId = `ISS-${Math.floor(Math.random() * 900 + 100)}`;
    return {
      issueId: fallbackIssueId,
      title,
      description,
      source,
      priority: "high",
      labels:
        source === "github" ? ["repository", "analysis"] : ["local", "bug"],
    };
  }
}
