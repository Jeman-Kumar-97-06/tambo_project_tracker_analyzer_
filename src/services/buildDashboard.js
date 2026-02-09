import { DashboardService } from './dashboardService';

/**
 * Build Dashboard Function
 * Aggregates data from habits, code issues, and jobs to create a unified dashboard view
 */
export async function buildDashboard() {
  try {
    console.log('Building dashboard...');

    // Get complete dashboard data
    const dashboardData = await DashboardService.getDashboardData();

    console.log('Dashboard built successfully:', {
      jobs: dashboardData.jobs.length,
      habits: dashboardData.habits.length,
      issues: dashboardData.issues.length,
      date: dashboardData.dateLabel
    });

    return dashboardData;

  } catch (error) {
    console.error('Error building dashboard:', error);

    // Return empty dashboard structure if error occurs
    return {
      dateLabel: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      jobs: [],
      habits: [],
      issues: [],
      summary: {
        totalJobs: 0,
        activeHabits: 0,
        openIssues: 0,
        upcomingInterviews: 0
      },
      stats: {
        jobStats: {
          total: 0,
          byStatus: [],
          responseRate: 0
        },
        habitStats: {
          totalHabits: 0,
          avgCompletionRate: 0
        },
        issueStats: {
          total: 0,
          byPriority: [],
          byStatus: []
        }
      }
    };
  }
}

/**
 * Build Dashboard Summary
 * Returns only summary statistics for quick dashboard overview
 */
export async function buildDashboardSummary() {
  try {
    const summary = await DashboardService.getDashboardSummary();
    console.log('Dashboard summary built:', summary);
    return summary;
  } catch (error) {
    console.error('Error building dashboard summary:', error);
    return {
      totalJobs: 0,
      activeHabits: 0,
      openIssues: 0,
      upcomingInterviews: 0
    };
  }
}

/**
 * Build Recent Activities
 * Returns recent activities across all systems
 */
export async function buildRecentActivities(limit = 10) {
  try {
    const activities = await DashboardService.getRecentActivities(limit);
    console.log(`Built ${activities.length} recent activities`);
    return activities;
  } catch (error) {
    console.error('Error building recent activities:', error);
    return [];
  }
}

/**
 * Build Productivity Insights
 * Returns insights about productivity across all tracked systems
 */
export async function buildProductivityInsights() {
  try {
    const insights = await DashboardService.getProductivityInsights();
    console.log('Productivity insights built successfully');
    return insights;
  } catch (error) {
    console.error('Error building productivity insights:', error);
    return {
      habitConsistency: [],
      jobSearchEffectiveness: {
        responseRate: 0,
        avgDaysToResponse: 0,
        mostSuccessfulRoles: []
      },
      issueResolutionEfficiency: {
        avgResolutionTime: 0,
        mostCommonIssueTypes: [],
        priorityDistribution: []
      }
    };
  }
}

/**
 * Export Dashboard Data
 * Creates a complete export of all dashboard data for backup or analysis
 */
export async function exportDashboardData() {
  try {
    const exportData = await DashboardService.exportDashboardData();
    console.log('Dashboard data exported successfully:', {
      totalRecords: exportData.metadata.totalRecords,
      exportDate: exportData.exportDate
    });
    return exportData;
  } catch (error) {
    console.error('Error exporting dashboard data:', error);
    throw error;
  }
}

// Default export
export default buildDashboard;
