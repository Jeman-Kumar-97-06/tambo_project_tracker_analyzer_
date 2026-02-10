export interface CreateTrackerInput {
  entity: string;
}

export interface CreateTrackerOutput {
  title: string;
  columns: Array<{
    key: string;
    label: string;
  }>;
  rows: Array<{
    company: string;
    role: string;
    status: string;
    deadline: string;
  }>;
}

export async function createTracker(
  input: CreateTrackerInput
): Promise<CreateTrackerOutput> {
  // Ensure this only runs on server side
  if (typeof window !== "undefined") {
    throw new Error("createTracker should only be called on the server side");
  }

  try {
    const { entity } = input;

    // Generate appropriate tracker based on entity type
    const tracker = generateTrackerStructure(entity);

    return tracker;
  } catch (error) {
    console.error('Error creating tracker:', error);

    // Return fallback tracker if anything fails
    return createFallbackTracker(input.entity);
  }
}

function generateTrackerStructure(entity: string): CreateTrackerOutput {
  const entityLower = entity.toLowerCase();

  if (entityLower.includes("job") || entityLower.includes("application") || entityLower.includes("career")) {
    return {
      title: "Job Application Tracker",
      columns: [
        { key: "company", label: "Company" },
        { key: "role", label: "Role" },
        { key: "status", label: "Status" },
        { key: "deadline", label: "Follow-up Date" }
      ],
      rows: [
        {
          company: "Google",
          role: "Software Engineer",
          status: "Applied",
          deadline: getDateString(7)
        },
        {
          company: "Microsoft",
          role: "Full Stack Developer",
          status: "Interview",
          deadline: getDateString(3)
        },
        {
          company: "Amazon",
          role: "Backend Engineer",
          status: "Waiting",
          deadline: getDateString(14)
        }
      ]
    };
  }

  if (entityLower.includes("habit") || entityLower.includes("routine") || entityLower.includes("daily")) {
    return {
      title: "Habit Tracker",
      columns: [
        { key: "company", label: "Habit" },
        { key: "role", label: "Frequency" },
        { key: "status", label: "Status" },
        { key: "deadline", label: "Next Due" }
      ],
      rows: [
        {
          company: "Morning Workout",
          role: "Daily",
          status: "Active",
          deadline: getTomorrowString()
        },
        {
          company: "Read Books",
          role: "Daily",
          status: "Active",
          deadline: getTomorrowString()
        },
        {
          company: "Meditation",
          role: "Daily",
          status: "Paused",
          deadline: getTomorrowString()
        }
      ]
    };
  }

  if (entityLower.includes("issue") || entityLower.includes("bug") || entityLower.includes("code")) {
    return {
      title: "Issue Tracker",
      columns: [
        { key: "company", label: "Issue ID" },
        { key: "role", label: "Title" },
        { key: "status", label: "Status" },
        { key: "deadline", label: "Due Date" }
      ],
      rows: [
        {
          company: "BUG-001",
          role: "Login not working",
          status: "Open",
          deadline: getDateString(5)
        },
        {
          company: "FEAT-002",
          role: "Add dark mode",
          status: "In Progress",
          deadline: getDateString(10)
        },
        {
          company: "BUG-003",
          role: "Database connection error",
          status: "Resolved",
          deadline: getDateString(-2)
        }
      ]
    };
  }

  // Generic tracker for unknown entities
  return createFallbackTracker(entity);
}

function createFallbackTracker(entity: string): CreateTrackerOutput {
  return {
    title: `${entity} Tracker`,
    columns: [
      { key: "company", label: "Item" },
      { key: "role", label: "Type" },
      { key: "status", label: "Status" },
      { key: "deadline", label: "Date" }
    ],
    rows: [
      {
        company: `Sample ${entity} 1`,
        role: "Type A",
        status: "Active",
        deadline: getTodayString()
      },
      {
        company: `Sample ${entity} 2`,
        role: "Type B",
        status: "Pending",
        deadline: getDateString(7)
      },
      {
        company: `Sample ${entity} 3`,
        role: "Type C",
        status: "Completed",
        deadline: getDateString(-3)
      }
    ]
  };
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function getTomorrowString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

function getDateString(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
}
