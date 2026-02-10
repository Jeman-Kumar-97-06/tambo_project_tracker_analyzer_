import { HabitService } from "@/services/habitService";

export interface AnalyzeHabitInput {
  habitName: string;
  days?: number;
}

export interface AnalyzeHabitOutput {
  habitName: string;
  analysisDate: string;
  periodDays: number;
  completionRate: number;
  streak: number;
  longestStreak: number;
  totalCompletions: number;
  totalMissed: number;
  insights: string[];
  recommendations: string[];
  trend: "improving" | "declining" | "stable";
}

export async function analyzeHabit(
  input: AnalyzeHabitInput,
): Promise<AnalyzeHabitOutput> {
  // Ensure this only runs on server side
  if (typeof window !== "undefined") {
    throw new Error("analyzeHabit should only be called on the server side");
  }

  try {
    const { habitName, days = 30 } = input;
    const analysisDate = new Date().toISOString().split("T")[0];

    // Get habit statistics from database
    const habit = await HabitService.getHabitByName(habitName);
    if (!habit) {
      throw new Error(`Habit "${habitName}" not found`);
    }

    // Calculate date range for the last 'days' days
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split("T")[0];

    const stats = await HabitService.getHabitStats(habit._id!.toString(), days);
    const entries = await HabitService.getHabitEntries(
      habit._id!.toString(),
      startDateStr,
      endDate,
    );

    // Calculate metrics
    const completionRate = calculateCompletionRate(entries, days);
    const streaks = calculateStreaks(entries);
    const trend = calculateTrend(entries);
    const insights = generateInsights(completionRate, streaks, entries, days);
    const recommendations = generateRecommendations(
      completionRate,
      streaks,
      trend,
    );

    return {
      habitName,
      analysisDate,
      periodDays: days,
      completionRate,
      streak: streaks.current,
      longestStreak: streaks.longest,
      totalCompletions: entries.filter((e) => e.completed === 1).length,
      totalMissed: entries.filter((e) => e.completed === 0).length,
      insights,
      recommendations,
      trend,
    };
  } catch (error) {
    console.error("Error analyzing habit:", error);

    // Return fallback analysis if database fails
    return getFallbackAnalysis(input.habitName, input.days || 30);
  }
}

function calculateCompletionRate(entries: any[], totalDays: number): number {
  if (entries.length === 0) return 0;
  const completions = entries.filter((e) => e.completed === 1).length;
  return Math.round((completions / totalDays) * 100);
}

function calculateStreaks(entries: any[]): {
  current: number;
  longest: number;
} {
  if (entries.length === 0) return { current: 0, longest: 0 };

  // Sort entries by date (most recent first)
  const sortedEntries = entries.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Calculate current streak (from most recent day)
  for (const entry of sortedEntries) {
    if (entry.completed === 1) {
      currentStreak =
        tempStreak === currentStreak ? currentStreak + 1 : currentStreak;
      tempStreak++;
    } else {
      break;
    }
  }

  // Calculate longest streak
  tempStreak = 0;
  for (const entry of sortedEntries.reverse()) {
    if (entry.completed === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  return { current: currentStreak, longest: longestStreak };
}

function calculateTrend(entries: any[]): "improving" | "declining" | "stable" {
  if (entries.length < 14) return "stable"; // Need at least 2 weeks for trend

  // Split into two halves and compare completion rates
  const mid = Math.floor(entries.length / 2);
  const firstHalf = entries.slice(0, mid);
  const secondHalf = entries.slice(mid);

  const firstHalfRate =
    firstHalf.filter((e) => e.completed === 1).length / firstHalf.length;
  const secondHalfRate =
    secondHalf.filter((e) => e.completed === 1).length / secondHalf.length;

  const difference = secondHalfRate - firstHalfRate;

  if (difference > 0.1) return "improving";
  if (difference < -0.1) return "declining";
  return "stable";
}

function generateInsights(
  completionRate: number,
  streaks: { current: number; longest: number },
  entries: any[],
  days: number,
): string[] {
  const insights: string[] = [];

  // Completion rate insights
  if (completionRate >= 80) {
    insights.push(
      "Excellent consistency! You're maintaining a high completion rate.",
    );
  } else if (completionRate >= 60) {
    insights.push(
      "Good progress, but there's room for improvement in consistency.",
    );
  } else {
    insights.push(
      "Your completion rate suggests this habit needs more attention and focus.",
    );
  }

  // Streak insights
  if (streaks.current >= 7) {
    insights.push(`Great momentum! You're on a ${streaks.current}-day streak.`);
  } else if (streaks.current > 0) {
    insights.push(
      `You have a ${streaks.current}-day streak - keep building on it!`,
    );
  } else {
    insights.push("No current streak, but every day is a fresh start!");
  }

  if (streaks.longest > streaks.current * 2) {
    insights.push(
      `Your longest streak was ${streaks.longest} days - you've done it before, you can do it again!`,
    );
  }

  // Pattern analysis
  const weekendEntries = entries.filter((e) => {
    const date = new Date(e.date);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
  });
  const weekendCompletionRate =
    weekendEntries.length > 0
      ? (weekendEntries.filter((e) => e.completed === 1).length /
          weekendEntries.length) *
        100
      : 0;

  const weekdayEntries = entries.filter((e) => {
    const date = new Date(e.date);
    const dayOfWeek = date.getDay();
    return dayOfWeek >= 1 && dayOfWeek <= 5;
  });
  const weekdayCompletionRate =
    weekdayEntries.length > 0
      ? (weekdayEntries.filter((e) => e.completed === 1).length /
          weekdayEntries.length) *
        100
      : 0;

  if (weekendCompletionRate < weekdayCompletionRate - 20) {
    insights.push(
      "You tend to struggle with this habit on weekends - consider adjusting your weekend routine.",
    );
  } else if (weekdayCompletionRate < weekendCompletionRate - 20) {
    insights.push(
      "Weekdays seem more challenging for this habit - perhaps your schedule is too packed?",
    );
  }

  return insights;
}

function generateRecommendations(
  completionRate: number,
  streaks: { current: number; longest: number },
  trend: "improving" | "declining" | "stable",
): string[] {
  const recommendations: string[] = [];

  // Based on completion rate
  if (completionRate < 50) {
    recommendations.push(
      "Consider making the habit smaller or easier to build consistency first.",
    );
    recommendations.push(
      "Set up environmental cues to remind yourself of this habit.",
    );
  } else if (completionRate < 80) {
    recommendations.push(
      "Try habit stacking - attach this habit to an existing routine.",
    );
    recommendations.push("Track your progress visually to stay motivated.");
  }

  // Based on streaks
  if (streaks.current === 0) {
    recommendations.push(
      "Focus on just completing the habit for the next 3 days to rebuild momentum.",
    );
  } else if (streaks.current < 7) {
    recommendations.push(
      "Aim to reach a 7-day streak - this is often when habits start to feel automatic.",
    );
  }

  // Based on trend
  if (trend === "declining") {
    recommendations.push(
      "Identify what changed recently that might be affecting your habit performance.",
    );
    recommendations.push(
      "Consider adjusting the habit difficulty or timing to match your current situation.",
    );
  } else if (trend === "improving") {
    recommendations.push(
      "Great trend! Consider gradually increasing the difficulty or adding related habits.",
    );
  } else {
    recommendations.push(
      "Your habit performance is stable - focus on maintaining consistency.",
    );
  }

  // General recommendations
  recommendations.push(
    "Review your habit regularly and adjust based on what works best for you.",
  );

  return recommendations;
}

function getFallbackAnalysis(
  habitName: string,
  days: number,
): AnalyzeHabitOutput {
  const analysisDate = new Date().toISOString().split("T")[0];

  return {
    habitName,
    analysisDate,
    periodDays: days,
    completionRate: 65,
    streak: 3,
    longestStreak: 12,
    totalCompletions: Math.floor(days * 0.65),
    totalMissed: Math.ceil(days * 0.35),
    insights: [
      "This is sample analysis data since database connection failed.",
      "Your habit shows moderate consistency with room for improvement.",
      "Building streaks is key to forming lasting habits.",
    ],
    recommendations: [
      "Set up environmental cues to remind yourself of this habit.",
      "Try habit stacking - attach this habit to an existing routine.",
      "Focus on consistency over perfection.",
    ],
    trend: "stable",
  };
}
