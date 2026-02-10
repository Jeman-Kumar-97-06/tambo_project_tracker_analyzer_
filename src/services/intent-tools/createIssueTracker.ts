import { CodeIssueService } from "@/services/codeIssueService";

export interface CreateIssueTrackerInput {
  title: string;
  description: string;
  source?: "local" | "github";
}

export interface CreateIssueTrackerOutput {
  issueId: string;
  title: string;
  description: string;
  source: "local" | "github";
  priority: "low" | "medium" | "high";
  labels: string[];
}

export async function createIssueTracker(
  input: CreateIssueTrackerInput,
): Promise<CreateIssueTrackerOutput> {
  // Ensure this only runs on server side
  if (typeof window !== "undefined") {
    throw new Error(
      "createIssueTracker should only be called on the server side",
    );
  }

  try {
    const { title, description, source = "local" } = input;

    // Generate issue ID
    const issueId = `ISSUE-${Date.now().toString().slice(-6)}`;

    // Determine priority based on description content
    const priority = determinePriority(description, title);

    // Extract labels from title and description
    const labels = extractLabels(title, description);

    // Create issue in database
    const issue = await CodeIssueService.createCodeIssue({
      issueId,
      title,
      description,
      source,
      priority,
      labels,
      status: "open",
    });

    return {
      issueId: issue.issueId,
      title: issue.title,
      description: issue.description,
      source: issue.source,
      priority: issue.priority,
      labels: issue.labels,
    };
  } catch (error) {
    console.error("Error creating issue tracker:", error);

    // Return fallback data if database fails
    const issueId = `ISSUE-${Date.now().toString().slice(-6)}`;
    return {
      issueId,
      title: input.title,
      description: input.description,
      source: input.source || "local",
      priority: "medium",
      labels: ["bug"],
    };
  }
}

function determinePriority(
  description: string,
  title: string,
): "low" | "medium" | "high" {
  const text = `${title} ${description}`.toLowerCase();

  if (
    text.includes("critical") ||
    text.includes("urgent") ||
    text.includes("crash") ||
    text.includes("security") ||
    text.includes("data loss")
  ) {
    return "high";
  }

  if (
    text.includes("important") ||
    text.includes("blocking") ||
    text.includes("error") ||
    text.includes("broken") ||
    text.includes("not working")
  ) {
    return "medium";
  }

  return "low";
}

function extractLabels(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const labels: string[] = [];

  // Common issue types
  if (
    text.includes("bug") ||
    text.includes("error") ||
    text.includes("broken")
  ) {
    labels.push("bug");
  }
  if (text.includes("feature") || text.includes("enhancement")) {
    labels.push("enhancement");
  }
  if (
    text.includes("ui") ||
    text.includes("interface") ||
    text.includes("design")
  ) {
    labels.push("ui");
  }
  if (
    text.includes("auth") ||
    text.includes("login") ||
    text.includes("authentication")
  ) {
    labels.push("auth");
  }
  if (
    text.includes("api") ||
    text.includes("endpoint") ||
    text.includes("request")
  ) {
    labels.push("api");
  }
  if (
    text.includes("database") ||
    text.includes("db") ||
    text.includes("mongodb")
  ) {
    labels.push("database");
  }
  if (
    text.includes("performance") ||
    text.includes("slow") ||
    text.includes("speed")
  ) {
    labels.push("performance");
  }

  // Default label if none found
  if (labels.length === 0) {
    labels.push("general");
  }

  return labels;
}
