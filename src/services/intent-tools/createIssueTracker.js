export async function createIssueTracker({
  title,
  description,
  source = "local",
}) {
  // In real life, this could:
  // - analyze logs
  // - parse stack traces
  // - scan repo files
  // For MVP, we keep it deterministic

  return {
    issueId: `ISS-${Math.floor(Math.random() * 900 + 100)}`,
    title,
    description,
    source,
    priority: "high",
    labels: source === "github" ? ["repository", "analysis"] : ["local", "bug"],
  };
}
