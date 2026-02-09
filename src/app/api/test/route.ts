import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { HabitService } from "@/services/habitService";
import { JobService } from "@/services/jobService";
import { CodeIssueService } from "@/services/codeIssueService";

export async function GET(request: NextRequest) {
  try {
    // Test basic database connection
    const { db } = await connectToDatabase();

    // Test collections existence/creation
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    // Test each service with a simple read operation
    const testResults = {
      connection: "success",
      collections: collectionNames,
      services: {
        habits: {
          status: "pending" as const,
          count: 0,
          error: null as string | null,
        },
        jobs: {
          status: "pending" as const,
          count: 0,
          error: null as string | null,
        },
        issues: {
          status: "pending" as const,
          count: 0,
          error: null as string | null,
        },
      },
    };

    // Test Habit Service
    try {
      const habits = await HabitService.getAllHabits();
      testResults.services.habits = {
        status: "success" as const,
        count: habits.length,
        error: null as string | null,
      };
    } catch (error) {
      testResults.services.habits = {
        status: "error" as const,
        count: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }

    // Test Job Service
    try {
      const jobs = await JobService.getAllJobs();
      testResults.services.jobs = {
        status: "success" as const,
        count: jobs.length,
        error: null as string | null,
      };
    } catch (error) {
      testResults.services.jobs = {
        status: "error" as const,
        count: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }

    // Test Code Issue Service
    try {
      const issues = await CodeIssueService.getAllCodeIssues();
      testResults.services.issues = {
        status: "success" as const,
        count: issues.length,
        error: null as string | null,
      };
    } catch (error) {
      testResults.services.issues = {
        status: "error" as const,
        count: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }

    return NextResponse.json({
      success: true,
      message: "Database connection and services test completed",
      data: testResults,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database test failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    let result;

    switch (action) {
      case "create-test-habit":
        result = await HabitService.createHabit({
          habitName: data.habitName || "Test Habit",
          initialDate: new Date().toISOString().split("T")[0],
        });
        break;

      case "create-test-job":
        result = await JobService.createJob({
          company: data.company || "Test Company",
          role: data.role || "Test Role",
          status: data.status || "Applied",
          location: data.location || "Remote",
        });
        break;

      case "create-test-issue":
        result = await CodeIssueService.createCodeIssue({
          issueId: `TEST-${Date.now()}`,
          title: data.title || "Test Issue",
          description: data.description || "Test issue description",
          source: data.source || "local",
          priority: data.priority || "medium",
          labels: data.labels || ["test"],
          status: "open",
        });
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid action. Supported actions: create-test-habit, create-test-job, create-test-issue",
          },
          { status: 400 },
        );
    }

    return NextResponse.json({
      success: true,
      message: `Test ${action} completed successfully`,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Test action failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Test action failed",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
