import { HabitService } from './habitService';
import { CodeIssueService } from './codeIssueService';
import { JobService } from './jobService';
import type { Habit, HabitEntry } from '@/models/Habit';
import type { CodeIssue } from '@/models/CodeIssue';
import type { Job, JobInterview } from '@/models/Job';

export interface DashboardData {
  dateLabel: string;
  jobs: {
    company: string;
    role: string;
    status: 'Applied' | 'Waiting' | 'Rejected' | 'Heard Back' | 'Interview';
    interviewDate?: string;
    location: string;
  }[];
  habits: {
    habitName: string;
    initialDate: string;
  }[];
  issues: {
    issueId: string;
    title: string;
    description?: string;
    source: 'local' | 'github';
    priority: 'low' | 'medium' | 'high';
    labels?: string[];
  }[];
  summary: {
    totalJobs: number;
    activeHabits: number;
    openIssues: number;
    upcomingInterviews: number;
  };
  stats: {
    jobStats: {
      total: number;
      byStatus: { status: string; count: number }[];
      responseRate: number;
    };
    habitStats: {
      totalHabits: number;
      avgCompletionRate: number;
    };
    issueStats: {
      total: number;
      byPriority: { priority: string; count: number }[];
      byStatus: { status: string; count: number }[];
    };
  };
}

export class DashboardService {
  // Get complete dashboard data
  static async getDashboardData(): Promise<DashboardData> {
    try {
      // Fetch data from all services
      const [jobs, habits, issues] = await Promise.all([
        JobService.getAllJobs(),
        HabitService.getAllHabits(),
        CodeIssueService.getAllCodeIssues()
      ]);

      // Get upcoming interviews
      const upcomingInterviews = await JobService.getUpcomingInterviews(7);

      // Transform data for dashboard format
      const dashboardJobs = jobs.map(job => ({
        company: job.company,
        role: job.role,
        status: job.status,
        interviewDate: job.interviewDate,
        location: job.location
      }));

      const dashboardHabits = habits.map(habit => ({
        habitName: habit.habitName,
        initialDate: habit.initialDate
      }));

      const dashboardIssues = issues.map(issue => ({
        issueId: issue.issueId,
        title: issue.title,
        description: issue.description,
        source: issue.source,
        priority: issue.priority,
        labels: issue.labels
      }));

      // Calculate summary stats
      const openIssues = issues.filter(issue => issue.status === 'open' || issue.status === 'in-progress');

      // Get detailed stats
      const [jobStats, issueStats] = await Promise.all([
        JobService.getJobStats(),
        CodeIssueService.getIssueStats()
      ]);

      // Calculate habit completion rates
      const habitCompletionRates: number[] = [];
      for (const habit of habits) {
        try {
          const stats = await HabitService.getHabitStats(habit._id!.toString(), 30);
          habitCompletionRates.push(stats.completionRate);
        } catch (error) {
          console.warn(`Could not get stats for habit ${habit.habitName}:`, error);
          habitCompletionRates.push(0);
        }
      }

      const avgCompletionRate = habitCompletionRates.length > 0
        ? habitCompletionRates.reduce((sum, rate) => sum + rate, 0) / habitCompletionRates.length
        : 0;

      const dateLabel = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      return {
        dateLabel,
        jobs: dashboardJobs,
        habits: dashboardHabits,
        issues: dashboardIssues,
        summary: {
          totalJobs: jobs.length,
          activeHabits: habits.length,
          openIssues: openIssues.length,
          upcomingInterviews: upcomingInterviews.length
        },
        stats: {
          jobStats: {
            total: jobStats.total,
            byStatus: jobStats.byStatus,
            responseRate: jobStats.responseRate
          },
          habitStats: {
            totalHabits: habits.length,
            avgCompletionRate: Math.round(avgCompletionRate * 100) / 100
          },
          issueStats: {
            total: issueStats.total,
            byPriority: issueStats.byPriority,
            byStatus: issueStats.byStatus
          }
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw new Error('Failed to fetch dashboard data');
    }
  }

  // Get dashboard summary only (lighter weight)
  static async getDashboardSummary(): Promise<DashboardData['summary']> {
    try {
      const [jobs, habits, issues, upcomingInterviews] = await Promise.all([
        JobService.getAllJobs(),
        HabitService.getAllHabits(),
        CodeIssueService.getAllCodeIssues({ status: 'open' }),
        JobService.getUpcomingInterviews(7)
      ]);

      return {
        totalJobs: jobs.length,
        activeHabits: habits.length,
        openIssues: issues.length,
        upcomingInterviews: upcomingInterviews.length
      };
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw new Error('Failed to fetch dashboard summary');
    }
  }

  // Get recent activities across all systems
  static async getRecentActivities(limit: number = 10): Promise<{
    type: 'job' | 'habit' | 'issue';
    title: string;
    description: string;
    date: Date;
    priority?: 'low' | 'medium' | 'high';
    status?: string;
  }[]> {
    try {
      const activities: {
        type: 'job' | 'habit' | 'issue';
        title: string;
        description: string;
        date: Date;
        priority?: 'low' | 'medium' | 'high';
        status?: string;
      }[] = [];

      // Get recent jobs
      const recentJobs = await JobService.getAllJobs();
      recentJobs.slice(0, 5).forEach(job => {
        activities.push({
          type: 'job',
          title: `${job.role} at ${job.company}`,
          description: `Application status: ${job.status}`,
          date: job.applicationDate,
          status: job.status
        });
      });

      // Get recent issues
      const recentIssues = await CodeIssueService.getAllCodeIssues();
      recentIssues.slice(0, 5).forEach(issue => {
        activities.push({
          type: 'issue',
          title: issue.title,
          description: `${issue.source} issue - ${issue.status}`,
          date: issue.createdAt,
          priority: issue.priority,
          status: issue.status
        });
      });

      // Get recent habits (simplified - would need habit entries for real activity)
      const recentHabits = await HabitService.getAllHabits();
      recentHabits.slice(0, 3).forEach(habit => {
        activities.push({
          type: 'habit',
          title: habit.habitName,
          description: `Habit tracking started`,
          date: habit.createdAt
        });
      });

      // Sort by date and limit
      return activities
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, limit);

    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw new Error('Failed to fetch recent activities');
    }
  }

  // Get productivity insights
  static async getProductivityInsights(): Promise<{
    habitConsistency: {
      habitName: string;
      completionRate: number;
      streak: number;
    }[];
    jobSearchEffectiveness: {
      responseRate: number;
      avgDaysToResponse: number;
      mostSuccessfulRoles: string[];
    };
    issueResolutionEfficiency: {
      avgResolutionTime: number;
      mostCommonIssueTypes: string[];
      priorityDistribution: { priority: string; count: number }[];
    };
  }> {
    try {
      // Get habit consistency data
      const habits = await HabitService.getAllHabits();
      const habitConsistency = [];

      for (const habit of habits.slice(0, 5)) { // Limit to top 5 habits
        try {
          const stats = await HabitService.getHabitStats(habit._id!.toString(), 30);
          habitConsistency.push({
            habitName: habit.habitName,
            completionRate: stats.completionRate,
            streak: stats.streak
          });
        } catch (error) {
          console.warn(`Could not get stats for habit ${habit.habitName}:`, error);
        }
      }

      // Get job search effectiveness
      const jobStats = await JobService.getJobStats();
      const jobSearchEffectiveness = {
        responseRate: jobStats.responseRate,
        avgDaysToResponse: jobStats.avgDaysToResponse,
        mostSuccessfulRoles: jobStats.topRoles.slice(0, 3).map(role => role.role)
      };

      // Get issue resolution efficiency
      const issueStats = await CodeIssueService.getIssueStats();
      const allLabels = await CodeIssueService.getAllLabels();
      const issueResolutionEfficiency = {
        avgResolutionTime: issueStats.avgResolutionTime,
        mostCommonIssueTypes: allLabels.slice(0, 5),
        priorityDistribution: issueStats.byPriority
      };

      return {
        habitConsistency,
        jobSearchEffectiveness,
        issueResolutionEfficiency
      };

    } catch (error) {
      console.error('Error fetching productivity insights:', error);
      throw new Error('Failed to fetch productivity insights');
    }
  }

  // Export dashboard data (for backup or analysis)
  static async exportDashboardData(): Promise<{
    exportDate: string;
    jobs: Job[];
    habits: Habit[];
    issues: CodeIssue[];
    metadata: {
      totalRecords: number;
      exportVersion: string;
    };
  }> {
    try {
      const [jobs, habits, issues] = await Promise.all([
        JobService.getAllJobs(),
        HabitService.getAllHabits(),
        CodeIssueService.getAllCodeIssues()
      ]);

      return {
        exportDate: new Date().toISOString(),
        jobs,
        habits,
        issues,
        metadata: {
          totalRecords: jobs.length + habits.length + issues.length,
          exportVersion: '1.0'
        }
      };

    } catch (error) {
      console.error('Error exporting dashboard data:', error);
      throw new Error('Failed to export dashboard data');
    }
  }
}
