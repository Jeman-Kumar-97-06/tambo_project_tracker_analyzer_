import { NextRequest, NextResponse } from "next/server";
import {
  performEnvironmentCheck,
  generateEnvironmentReport,
  MOCK_DATA_CONFIG
} from "@/lib/env-check";

export async function GET(request: NextRequest) {
  try {
    // Perform comprehensive environment check
    const checks = performEnvironmentCheck();
    const report = generateEnvironmentReport();

    // Determine if system is ready
    const isReady = checks.mongodb.isValid && checks.tambo.isValid && checks.serverSide.isValid;

    return NextResponse.json({
      success: true,
      message: "Environment check completed",
      ready: isReady,
      checks: {
        mongodb: {
          status: checks.mongodb.isValid ? "✅ Valid" : "❌ Invalid",
          message: checks.mongodb.message,
          details: checks.mongodb.details
        },
        tambo: {
          status: checks.tambo.isValid ? "✅ Valid" : "❌ Invalid",
          message: checks.tambo.message,
          details: checks.tambo.details
        },
        nodeEnv: {
          status: "ℹ️ Info",
          message: checks.nodeEnv.message,
          details: checks.nodeEnv.details
        },
        serverSide: {
          status: checks.serverSide.isValid ? "✅ Valid" : "⚠️ Warning",
          message: checks.serverSide.message,
          details: checks.serverSide.details
        }
      },
      report: report.split('\n'),
      mockDataEnabled: !isReady,
      mockData: !isReady ? MOCK_DATA_CONFIG : null,
      timestamp: new Date().toISOString(),
      recommendations: !isReady ? [
        ...(checks.mongodb.isValid ? [] : ["Set up MongoDB connection in .env.local"]),
        ...(checks.tambo.isValid ? [] : ["Configure Tambo API key in .env.local"]),
        "Run 'npm run dev' to start development server",
        "Visit /api/test to test database connection"
      ] : [
        "Environment is ready!",
        "You can now use the chat interface to create habits, jobs, and issues",
        "Visit the dashboard to see your data"
      ]
    });

  } catch (error) {
    console.error("Environment check failed:", error);

    return NextResponse.json({
      success: false,
      message: "Environment check failed",
      error: error instanceof Error ? error.message : "Unknown error",
      ready: false,
      mockDataEnabled: true,
      mockData: MOCK_DATA_CONFIG,
      recommendations: [
        "Check .env.local file exists with correct variables",
        "Verify MongoDB connection string format",
        "Ensure NEXT_PUBLIC_TAMBO_API_KEY is set",
        "See MONGODB_TROUBLESHOOTING.md for detailed help"
      ],
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "validate") {
      // Strict validation that throws errors
      const checks = performEnvironmentCheck();

      const errors: string[] = [];

      if (!checks.mongodb.isValid) {
        errors.push(`MongoDB: ${checks.mongodb.message}`);
      }

      if (!checks.tambo.isValid) {
        errors.push(`Tambo: ${checks.tambo.message}`);
      }

      if (!checks.serverSide.isValid) {
        errors.push(`Server: ${checks.serverSide.message}`);
      }

      if (errors.length > 0) {
        return NextResponse.json({
          success: false,
          message: "Validation failed",
          errors,
          ready: false
        }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: "All environment checks passed",
        ready: true
      });

    } else if (action === "report") {
      // Generate detailed text report
      const report = generateEnvironmentReport();

      return NextResponse.json({
        success: true,
        message: "Environment report generated",
        report,
        timestamp: new Date().toISOString()
      });

    } else {
      return NextResponse.json({
        success: false,
        message: "Invalid action. Supported actions: validate, report"
      }, { status: 400 });
    }

  } catch (error) {
    console.error("Environment check action failed:", error);

    return NextResponse.json({
      success: false,
      message: "Environment check action failed",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
