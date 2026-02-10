export interface AnalyzeJobRejectionsInput {
  timeframe?: number; // days to look back, default 90
}

export interface AnalyzeJobRejectionsOutput {
  analysisDate: string;
  timeframeDays: number;
  totalApplications: number;
  totalRejections: number;
  rejectionRate: number;
  averageResponseTime: number; // days
  patterns: {
    commonReasons: Array<{
      reason: string;
      count: number;
      percentage: number;
    }>;
    companySizes: Array<{
      size: string;
      applications: number;
      rejections: number;
      rate: number;
    }>;
    industries: Array<{
      industry: string;
      applications: number;
      rejections: number;
      rate: number;
    }>;
    roleTypes: Array<{
      roleType: string;
      applications: number;
      rejections: number;
      rate: number;
    }>;
  };
  insights: string[];
  recommendations: string[];
  trend: "improving" | "declining" | "stable";
}

export async function analyzeJobRejections(
  input: AnalyzeJobRejectionsInput,
): Promise<AnalyzeJobRejectionsOutput> {
  // Ensure this only runs on server side
  if (typeof window !== "undefined") {
    throw new Error(
      "analyzeJobRejections should only be called on the server side",
    );
  }

  try {
    const { timeframe = 90 } = input;
    const analysisDate = new Date().toISOString().split("T")[0];

    // For now, return fallback data since complex database queries need more time
    // TODO: Implement full database integration once MongoDB connection is stable
    return getFallbackAnalysis(timeframe);
  } catch (error) {
    console.error("Error analyzing job rejections:", error);
    return getFallbackAnalysis(input.timeframe || 90);
  }
}

function getFallbackAnalysis(timeframe: number): AnalyzeJobRejectionsOutput {
  const analysisDate = new Date().toISOString().split("T")[0];

  return {
    analysisDate,
    timeframeDays: timeframe,
    totalApplications: 15,
    totalRejections: 9,
    rejectionRate: 60,
    averageResponseTime: 14,
    patterns: {
      commonReasons: [
        { reason: "Not a good fit", count: 4, percentage: 44 },
        { reason: "Chose another candidate", count: 3, percentage: 33 },
        { reason: "No reason provided", count: 2, percentage: 22 },
      ],
      companySizes: [
        { size: "Startup", applications: 6, rejections: 2, rate: 33 },
        { size: "Mid-size", applications: 5, rejections: 3, rate: 60 },
        { size: "Large Corp", applications: 4, rejections: 4, rate: 100 },
      ],
      industries: [
        { industry: "Tech", applications: 10, rejections: 5, rate: 50 },
        { industry: "Finance", applications: 3, rejections: 3, rate: 100 },
        { industry: "Other", applications: 2, rejections: 1, rate: 50 },
      ],
      roleTypes: [
        { roleType: "Full Stack", applications: 8, rejections: 4, rate: 50 },
        { roleType: "Frontend", applications: 4, rejections: 3, rate: 75 },
        { roleType: "Backend", applications: 3, rejections: 2, rate: 67 },
      ],
    },
    insights: [
      "This is sample analysis data for demo purposes.",
      "Your rejection rate is within normal range for job searching.",
      "Consider focusing on roles that closely match your experience.",
    ],
    recommendations: [
      "Focus on applying to roles that closely match your experience and skills.",
      "Keep detailed notes on interview feedback to identify recurring themes.",
      "Network within your target industry to get referrals and insider information.",
    ],
    trend: "stable",
  };
}
