// =========================
// TOOL IMPLEMENTATION
// =========================

// src/services/intent-tools/analyzeJobRejections.js

export async function analyzeJobRejections({ applications }) {
  const roleMap = {};

  applications.forEach((app) => {
    if (app.status === "Rejected") {
      roleMap[app.role] = (roleMap[app.role] || 0) + 1;
    }
  });

  return {
    rejectionData: Object.entries(roleMap).map(([role, count]) => ({
      role,
      count,
    })),
  };
}
