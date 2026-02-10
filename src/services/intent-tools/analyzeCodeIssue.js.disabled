// =========================
// TOOL IMPLEMENTATION
// =========================

// src/services/intent-tools/analyzeCodeIssue.js

export async function analyzeCodeIssue({
  issueName,
  repoName,
  source = "local",
}) {
  return {
    issueName,
    repoName,
    issueLink:
      source === "github" ? "https://github.com/user/repo/issues/42" : "#",
    source,
    steps: [
      "Identify where the resource or connection is initialized.",
      "Check lifecycle or cleanup logic for missing teardown.",
      "Refactor shared logic into a singleton or controlled scope.",
      "Add logging or profiling to confirm resource release.",
      "Re-test under load to verify the fix.",
    ],
  };
}
