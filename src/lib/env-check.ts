/**
 * Environment Check Utility for MongoDB Setup
 * This utility helps diagnose MongoDB connection issues and environment setup
 */

interface EnvCheckResult {
  isValid: boolean;
  message: string;
  details?: string;
}

interface EnvironmentCheck {
  mongodb: EnvCheckResult;
  tambo: EnvCheckResult;
  nodeEnv: EnvCheckResult;
  serverSide: EnvCheckResult;
}

/**
 * Check if MongoDB URL is properly configured
 */
export function checkMongoDBEnv(): EnvCheckResult {
  const mongoUrl = process.env.NEXT_MONGO_URL;

  if (!mongoUrl) {
    return {
      isValid: false,
      message: "MongoDB URL not found",
      details: "Please add NEXT_MONGO_URL to your .env.local file"
    };
  }

  if (!mongoUrl.startsWith('mongodb://') && !mongoUrl.startsWith('mongodb+srv://')) {
    return {
      isValid: false,
      message: "Invalid MongoDB URL format",
      details: "URL should start with mongodb:// or mongodb+srv://"
    };
  }

  if (!mongoUrl.includes('tambo_dashboard')) {
    return {
      isValid: false,
      message: "Database name missing",
      details: "MongoDB URL should include /tambo_dashboard database name"
    };
  }

  return {
    isValid: true,
    message: "MongoDB configuration is valid"
  };
}

/**
 * Check if Tambo API key is configured
 */
export function checkTamboEnv(): EnvCheckResult {
  const tamboKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;

  if (!tamboKey) {
    return {
      isValid: false,
      message: "Tambo API key not found",
      details: "Please add NEXT_PUBLIC_TAMBO_API_KEY to your .env.local file"
    };
  }

  if (tamboKey === 'api-key-here' || tamboKey === 'your-tambo-api-key') {
    return {
      isValid: false,
      message: "Default Tambo API key detected",
      details: "Please replace with your actual Tambo API key"
    };
  }

  return {
    isValid: true,
    message: "Tambo API key is configured"
  };
}

/**
 * Check Node environment
 */
export function checkNodeEnv(): EnvCheckResult {
  const nodeEnv = process.env.NODE_ENV;

  return {
    isValid: true,
    message: `Environment: ${nodeEnv || 'development'}`,
    details: nodeEnv === 'production' ? 'Production mode' : 'Development mode'
  };
}

/**
 * Check if running on server side
 */
export function checkServerSide(): EnvCheckResult {
  const isServer = typeof window === 'undefined';

  return {
    isValid: isServer,
    message: isServer ? "Running on server side" : "Running on client side",
    details: isServer ? "MongoDB access allowed" : "MongoDB access restricted"
  };
}

/**
 * Perform comprehensive environment check
 */
export function performEnvironmentCheck(): EnvironmentCheck {
  return {
    mongodb: checkMongoDBEnv(),
    tambo: checkTamboEnv(),
    nodeEnv: checkNodeEnv(),
    serverSide: checkServerSide()
  };
}

/**
 * Generate environment report
 */
export function generateEnvironmentReport(): string {
  const checks = performEnvironmentCheck();

  let report = "=== Environment Check Report ===\n\n";

  // MongoDB Check
  report += `MongoDB: ${checks.mongodb.isValid ? '✅' : '❌'} ${checks.mongodb.message}\n`;
  if (checks.mongodb.details) {
    report += `  Details: ${checks.mongodb.details}\n`;
  }
  report += "\n";

  // Tambo Check
  report += `Tambo API: ${checks.tambo.isValid ? '✅' : '❌'} ${checks.tambo.message}\n`;
  if (checks.tambo.details) {
    report += `  Details: ${checks.tambo.details}\n`;
  }
  report += "\n";

  // Node Environment
  report += `Node.js: ✅ ${checks.nodeEnv.message}\n`;
  if (checks.nodeEnv.details) {
    report += `  Details: ${checks.nodeEnv.details}\n`;
  }
  report += "\n";

  // Server Side Check
  report += `Server Side: ${checks.serverSide.isValid ? '✅' : '⚠️'} ${checks.serverSide.message}\n`;
  if (checks.serverSide.details) {
    report += `  Details: ${checks.serverSide.details}\n`;
  }
  report += "\n";

  // Overall Status
  const allValid = checks.mongodb.isValid && checks.tambo.isValid && checks.serverSide.isValid;
  report += `Overall Status: ${allValid ? '✅ Ready' : '❌ Issues Found'}\n`;

  if (!allValid) {
    report += "\n=== Required Actions ===\n";
    if (!checks.mongodb.isValid) {
      report += "1. Set up MongoDB connection string in .env.local\n";
    }
    if (!checks.tambo.isValid) {
      report += "2. Configure Tambo API key in .env.local\n";
    }
    if (!checks.serverSide.isValid) {
      report += "3. This check should only run on server side\n";
    }
  }

  return report;
}

/**
 * Log environment check results
 */
export function logEnvironmentCheck(): void {
  const report = generateEnvironmentReport();
  console.log(report);
}

/**
 * Quick environment validation (throws error if invalid)
 */
export function validateEnvironment(): void {
  const checks = performEnvironmentCheck();

  if (!checks.serverSide.isValid) {
    throw new Error("Environment check should only run on server side");
  }

  const errors: string[] = [];

  if (!checks.mongodb.isValid) {
    errors.push(`MongoDB: ${checks.mongodb.message}`);
  }

  if (!checks.tambo.isValid) {
    errors.push(`Tambo: ${checks.tambo.message}`);
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }
}

/**
 * Safe environment check for client side
 */
export function safeEnvironmentCheck(): Partial<EnvironmentCheck> {
  if (typeof window !== 'undefined') {
    // Client side - only check public variables
    return {
      tambo: checkTamboEnv(),
      serverSide: checkServerSide()
    };
  }

  // Server side - check everything
  return performEnvironmentCheck();
}

/**
 * Get MongoDB connection string (server side only)
 */
export function getMongoDBConnectionString(): string {
  if (typeof window !== 'undefined') {
    throw new Error("MongoDB connection string should only be accessed on server side");
  }

  const checks = checkMongoDBEnv();
  if (!checks.isValid) {
    throw new Error(`MongoDB configuration invalid: ${checks.message}`);
  }

  return process.env.NEXT_MONGO_URL!;
}

/**
 * Mock data fallback configuration
 */
export const MOCK_DATA_CONFIG = {
  enabled: true,
  reason: "MongoDB connection unavailable",
  habits: [
    {
      habitName: "Daily Coding",
      initialDate: new Date().toISOString().split('T')[0]
    },
    {
      habitName: "Morning Exercise",
      initialDate: new Date().toISOString().split('T')[0]
    }
  ],
  jobs: [
    {
      company: "Google",
      role: "Software Engineer",
      status: "Applied" as const,
      location: "Remote"
    },
    {
      company: "Microsoft",
      role: "Full Stack Developer",
      status: "Interview" as const,
      location: "Seattle"
    }
  ],
  issues: [
    {
      issueId: "DEMO-001",
      title: "Setup MongoDB Connection",
      source: "local" as const,
      priority: "high" as const,
      labels: ["setup", "database"]
    },
    {
      issueId: "DEMO-002",
      title: "Configure Environment Variables",
      source: "local" as const,
      priority: "medium" as const,
      labels: ["config", "env"]
    }
  ]
};
