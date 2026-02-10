// =========================
// TOOL IMPLEMENTATION
// =========================

// src/services/intent-tools/analyzeHabit.js

export async function analyzeHabit({ habitName, history }) {
  const reasons = history.map((d) => d.reason).filter(Boolean);

  return {
    habitName,
    data: history.map((d) => ({
      date: d.date,
      completed: d.completed,
      reason: d.reason || "",
    })),
    reasons,
  };
}
