export async function createTracker({ entity }) {
  // entity could be: job, bug, task (for now we’ll support job)

  if (entity === "job") {
    return {
      title: "Job Application Tracker",
      columns: [
        { key: "company", label: "Company" },
        { key: "role", label: "Role" },
        { key: "status", label: "Status" },
        { key: "deadline", label: "Deadline" },
      ],
      rows: [
        {
          company: "Google",
          role: "Frontend Engineer",
          status: "Applied",
          deadline: "2026-02-20",
        },
        {
          company: "Stripe",
          role: "Full Stack Engineer",
          status: "Interview",
          deadline: "2026-02-18",
        },
      ],
    };
  }

  // fallback
  return {
    title: "Generic Tracker",
    columns: [],
    rows: [],
  };
}
