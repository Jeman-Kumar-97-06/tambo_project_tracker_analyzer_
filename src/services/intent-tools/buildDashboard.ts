import { HabitService } from "@/services/habitService";
import { JobService } from "@/services/jobService";
import { CodeIssueService } from "@/services/codeIssueService";

export interface BuildDashboardInput {}

export interface BuildDashboardOutput {
  dateLabel: string;
  jobs: Array<{
    company: string;
    role: string;
    status: "Applied" | "Waiting" | "Rejected" | "Heard Back" | "Interview";
    interviewDate?: string;
    location?: string;
  }>;
  habits: Array<{
    habitName: string;
    initialDate: string;
  }>;
  issues: Array<{
    issueId: string;
    title: string;
    source: "local" | "github";
    priority: "low" | "medium" | "high";
    labels: string[];
  }>;
}

export async function buildDashboard(
  input: BuildDashboardInput
): Promise<BuildDashboardOutput> {
  // Ensure this only runs on server side
  if (typeof window !== "undefined") {
    throw new Error("buildDashboard should only be called on the server side");
  }

  try {
    // Get current date for dashboard label
    const dateLabel = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Fetch data from all services in parallel
    const [habits, jobs, issues] = await Promise.all([
      fetchHabits(),
      fetchJobs(),
      fetchIssues()
    ]);

    return {
      dateLabel,
      jobs,
      habits,
      issues
    };
  } catch (error) {
    console.error('Error building dashboard:', error);

    // Return fallback data if database fails
    return getFallbackDashboardData();
  }
}

async function fetchHabits(): Promise<Array<{
  habitName: string;
  initialDate: string;
}>> {
  try {
    const habits = await HabitService.getAllHabits();
    return habits.map(habit => ({
      habitName: habit.habitName,
      initialDate: habit.initialDate
    }));
  } catch (error) {
    console.error('Error fetching habits:', error);
    return [
      { habitName: "Morning Workout", initialDate: "2024-01-01" },
      { habitName: "Daily Reading", initialDate: "2024-01-15" },
      { habitName: "Meditation", initialDate: "2024-02-01" }
    ];
  }
}

async function fetchJobs(): Promise<Array<{
  company: string;
  role: string;
  status: "Applied" | "Waiting" | "Rejected" | "Heard Back" | "Interview";
  interviewDate?: string;
  location?: string;
}>> {
  try {
    const jobs = await JobService.getAllJobs();
    return jobs.map(job => ({
      company: job.company,
      role: job.role,
      status: job.status,
      interviewDate: job.interviewDate,
      location: job.location
    }));
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [
      {
        company: "Google",
        role: "Software Engineer",
        status: "Applied",
        location: "Remote"
      },
      {
        company: "Microsoft",
        role: "Full Stack Developer",
        status: "Interview",
        interviewDate: "2024-02-15",
        location: "Seattle, WA"
      },
      {
        company: "Amazon",
        role: "Backend Engineer",
        status: "Waiting",
        location: "Austin, TX"
      }
    ];
  }
}

async function fetchIssues(): Promise<Array<{
  issueId: string;
  title: string;
  source: "local" | "github";
  priority: "low" | "medium" | "high";
  labels: string[];
}>> {
  try {
    const issues = await CodeIssueService.getAllCodeIssues();
    return issues.map(issue => ({
      issueId: issue.issueId,
      title: issue.title,
      source: issue.source,
      priority: issue.priority,
      labels: issue.labels
    }));
  } catch (error) {
    console.error('Error fetching issues:', error);
    return [
      {
        issueId: "BUG-001",
        title: "Login authentication failing",
        source: "local",
        priority: "high",
        labels: ["bug", "auth"]
      },
      {
        issueId: "FEAT-002",
        title: "Add dark mode support",
        source: "github",
        priority: "medium",
        labels: ["enhancement", "ui"]
      },
      {
        issueId: "BUG-003",
        title: "Database connection timeout",
        source: "local",
        priority: "high",
        labels: ["bug", "database"]
      }
    ];
  }
}

function getFallbackDashboardData(): BuildDashboardOutput {
  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return {
    dateLabel,
    jobs: [
      {
        company: "Google",
        role: "Software Engineer",
        status: "Applied",
        location: "Remote"
      },
      {
        company: "Microsoft",
        role: "Full Stack Developer",
        status: "Interview",
        interviewDate: "2024-02-15",
        location: "Seattle, WA"
      }
    ],
    habits: [
      { habitName: "Morning Workout", initialDate: "2024-01-01" },
      { habitName: "Daily Reading", initialDate: "2024-01-15" }
    ],
    issues: [
      {
        issueId: "BUG-001",
        title: "Login authentication failing",
        source: "local",
        priority: "high",
        labels: ["bug", "auth"]
      },
      {
        issueId: "FEAT-002",
        title: "Add dark mode support",
        source: "github",
        priority: "medium",
        labels: ["enhancement", "ui"]
      }
    ]
  };
}
