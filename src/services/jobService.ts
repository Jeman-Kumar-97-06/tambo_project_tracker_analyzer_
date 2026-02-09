import { connectToDatabase } from "@/lib/mongodb";
import {
  Job,
  JobInterview,
  JobActivity,
  JOBS_COLLECTION,
  JOB_INTERVIEWS_COLLECTION,
  JOB_ACTIVITIES_COLLECTION,
} from "@/models/Job";
import { ObjectId } from "mongodb";

export class JobService {
  // Create a new job application
  static async createJob(
    jobData: Omit<Job, "_id" | "applicationDate" | "createdAt" | "updatedAt">,
  ): Promise<Job> {
    const { db } = await connectToDatabase();

    const job: Job = {
      ...jobData,
      applicationDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection(JOBS_COLLECTION).insertOne(job);

    // Create activity log for application
    await this.addJobActivity({
      jobId: result.insertedId,
      company: job.company,
      role: job.role,
      activityType: "application",
      description: `Applied for ${job.role} at ${job.company}`,
      date: new Date(),
    });

    return { ...job, _id: result.insertedId };
  }

  // Get all jobs
  static async getAllJobs(filters?: {
    status?: Job["status"];
    company?: string;
    location?: string;
    dateRange?: { start: Date; end: Date };
  }): Promise<Job[]> {
    const { db } = await connectToDatabase();

    let query: any = {};
    if (filters) {
      if (filters.status) query.status = filters.status;
      if (filters.company)
        query.company = { $regex: filters.company, $options: "i" };
      if (filters.location)
        query.location = { $regex: filters.location, $options: "i" };
      if (filters.dateRange) {
        query.applicationDate = {
          $gte: filters.dateRange.start,
          $lte: filters.dateRange.end,
        };
      }
    }

    const jobs = await db
      .collection(JOBS_COLLECTION)
      .find(query)
      .sort({ applicationDate: -1 })
      .toArray();

    return jobs as Job[];
  }

  // Get job by ID
  static async getJobById(id: string): Promise<Job | null> {
    const { db } = await connectToDatabase();
    const job = await db
      .collection(JOBS_COLLECTION)
      .findOne({ _id: new ObjectId(id) });
    return job as Job | null;
  }

  // Get job by company and role
  static async getJobByCompanyAndRole(
    company: string,
    role: string,
  ): Promise<Job | null> {
    const { db } = await connectToDatabase();
    const job = await db.collection(JOBS_COLLECTION).findOne({ company, role });
    return job as Job | null;
  }

  // Update job
  static async updateJob(
    id: string,
    updateData: Partial<Omit<Job, "_id" | "applicationDate" | "createdAt">>,
  ): Promise<Job | null> {
    const { db } = await connectToDatabase();

    const result = await db.collection(JOBS_COLLECTION).findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    );

    // Log status changes
    if (updateData.status && result?.value) {
      await this.addJobActivity({
        jobId: new ObjectId(id),
        company: result.value.company,
        role: result.value.role,
        activityType: "status_update",
        description: `Status changed to ${updateData.status}`,
        date: new Date(),
      });
    }

    return result?.value as Job | null;
  }

  // Delete job
  static async deleteJob(id: string): Promise<boolean> {
    const { db } = await connectToDatabase();

    // Also delete all interviews and activities for this job
    await db
      .collection(JOB_INTERVIEWS_COLLECTION)
      .deleteMany({ jobId: new ObjectId(id) });
    await db
      .collection(JOB_ACTIVITIES_COLLECTION)
      .deleteMany({ jobId: new ObjectId(id) });

    const result = await db
      .collection(JOBS_COLLECTION)
      .deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  // Update job status
  static async updateJobStatus(
    id: string,
    status: Job["status"],
    rejectionReason?: string,
  ): Promise<Job | null> {
    const updateData: Partial<Job> = { status };
    if (status === "Rejected" && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    return this.updateJob(id, updateData);
  }

  // Add job interview
  static async addJobInterview(
    interviewData: Omit<JobInterview, "_id" | "createdAt" | "updatedAt">,
  ): Promise<JobInterview> {
    const { db } = await connectToDatabase();

    const interview: JobInterview = {
      ...interviewData,
      outcome: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection(JOB_INTERVIEWS_COLLECTION)
      .insertOne(interview);

    // Log interview scheduled activity
    await this.addJobActivity({
      jobId: interview.jobId,
      company: interview.company,
      role: interview.role,
      activityType: "interview_scheduled",
      description: `${interview.interviewType} interview scheduled for ${interview.interviewDate}`,
      date: new Date(),
    });

    return { ...interview, _id: result.insertedId };
  }

  // Get job interviews
  static async getJobInterviews(jobId: string): Promise<JobInterview[]> {
    const { db } = await connectToDatabase();
    const interviews = await db
      .collection(JOB_INTERVIEWS_COLLECTION)
      .find({ jobId: new ObjectId(jobId) })
      .sort({ interviewDate: 1 })
      .toArray();

    return interviews as JobInterview[];
  }

  // Update job interview
  static async updateJobInterview(
    interviewId: string,
    updateData: Partial<Omit<JobInterview, "_id" | "createdAt">>,
  ): Promise<JobInterview | null> {
    const { db } = await connectToDatabase();

    const result = await db
      .collection(JOB_INTERVIEWS_COLLECTION)
      .findOneAndUpdate(
        { _id: new ObjectId(interviewId) },
        {
          $set: {
            ...updateData,
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" },
      );

    return result?.value as JobInterview | null;
  }

  // Add job activity
  static async addJobActivity(
    activityData: Omit<JobActivity, "_id" | "createdAt">,
  ): Promise<JobActivity> {
    const { db } = await connectToDatabase();

    const activity: JobActivity = {
      ...activityData,
      createdAt: new Date(),
    };

    const result = await db
      .collection(JOB_ACTIVITIES_COLLECTION)
      .insertOne(activity);
    return { ...activity, _id: result.insertedId };
  }

  // Get job activities
  static async getJobActivities(jobId: string): Promise<JobActivity[]> {
    const { db } = await connectToDatabase();
    const activities = await db
      .collection(JOB_ACTIVITIES_COLLECTION)
      .find({ jobId: new ObjectId(jobId) })
      .sort({ date: -1 })
      .toArray();

    return activities as JobActivity[];
  }

  // Get job statistics
  static async getJobStats(): Promise<{
    total: number;
    byStatus: { status: string; count: number }[];
    responseRate: number;
    avgDaysToResponse: number;
    topCompanies: { company: string; applications: number }[];
    topRoles: { role: string; applications: number }[];
    monthlyApplications: { month: string; count: number }[];
  }> {
    const { db } = await connectToDatabase();

    const jobs = await this.getAllJobs();

    // Count by status
    const statusCounts: { [key: string]: number } = {};
    jobs.forEach((job) => {
      statusCounts[job.status] = (statusCounts[job.status] || 0) + 1;
    });

    // Calculate response rate
    const totalApplications = jobs.length;
    const responsesReceived = jobs.filter(
      (job) =>
        job.status === "Heard Back" ||
        job.status === "Interview" ||
        job.status === "Rejected",
    ).length;
    const responseRate =
      totalApplications > 0 ? (responsesReceived / totalApplications) * 100 : 0;

    // Calculate average days to response (simplified - would need activity tracking for accuracy)
    const avgDaysToResponse = 7; // Placeholder - implement based on activity logs

    // Top companies
    const companyCounts: { [key: string]: number } = {};
    jobs.forEach((job) => {
      companyCounts[job.company] = (companyCounts[job.company] || 0) + 1;
    });
    const topCompanies = Object.entries(companyCounts)
      .map(([company, applications]) => ({ company, applications }))
      .sort((a, b) => b.applications - a.applications)
      .slice(0, 5);

    // Top roles
    const roleCounts: { [key: string]: number } = {};
    jobs.forEach((job) => {
      roleCounts[job.role] = (roleCounts[job.role] || 0) + 1;
    });
    const topRoles = Object.entries(roleCounts)
      .map(([role, applications]) => ({ role, applications }))
      .sort((a, b) => b.applications - a.applications)
      .slice(0, 5);

    // Monthly applications (last 6 months)
    const monthlyData: { [key: string]: number } = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toISOString().substring(0, 7); // YYYY-MM format
      monthlyData[monthKey] = 0;
    }

    jobs.forEach((job) => {
      const monthKey = job.applicationDate.toISOString().substring(0, 7);
      if (monthlyData.hasOwnProperty(monthKey)) {
        monthlyData[monthKey]++;
      }
    });

    const monthlyApplications = Object.entries(monthlyData).map(
      ([month, count]) => ({ month, count }),
    );

    return {
      total: totalApplications,
      byStatus: Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
      })),
      responseRate: Math.round(responseRate * 100) / 100,
      avgDaysToResponse,
      topCompanies,
      topRoles,
      monthlyApplications,
    };
  }

  // Search jobs
  static async searchJobs(searchTerm: string): Promise<Job[]> {
    const { db } = await connectToDatabase();

    const jobs = await db
      .collection(JOBS_COLLECTION)
      .find({
        $or: [
          { company: { $regex: searchTerm, $options: "i" } },
          { role: { $regex: searchTerm, $options: "i" } },
          { location: { $regex: searchTerm, $options: "i" } },
          { jobDescription: { $regex: searchTerm, $options: "i" } },
        ],
      })
      .sort({ applicationDate: -1 })
      .toArray();

    return jobs as Job[];
  }

  // Get upcoming interviews
  static async getUpcomingInterviews(
    days: number = 7,
  ): Promise<JobInterview[]> {
    const { db } = await connectToDatabase();

    const now = new Date();
    const endDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const interviews = await db
      .collection(JOB_INTERVIEWS_COLLECTION)
      .find({
        interviewDate: { $gte: now, $lte: endDate },
        outcome: "pending",
      })
      .sort({ interviewDate: 1 })
      .toArray();

    return interviews as JobInterview[];
  }

  // Get jobs requiring follow-up
  static async getJobsRequiringFollowUp(): Promise<Job[]> {
    const { db } = await connectToDatabase();

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 14); // 2 weeks ago

    const jobs = await db
      .collection(JOBS_COLLECTION)
      .find({
        status: { $in: ["Applied", "Waiting"] },
        applicationDate: { $lte: cutoffDate },
        followUpDate: { $exists: false },
      })
      .sort({ applicationDate: 1 })
      .toArray();

    return jobs as Job[];
  }

  // Mark follow-up done
  static async markFollowUpDone(jobId: string): Promise<Job | null> {
    const job = await this.updateJob(jobId, { followUpDate: new Date() });

    if (job) {
      await this.addJobActivity({
        jobId: new ObjectId(jobId),
        company: job.company,
        role: job.role,
        activityType: "follow_up",
        description: "Follow-up completed",
        date: new Date(),
      });
    }

    return job;
  }

  // Get rejection analysis
  static async getRejectionAnalysis(): Promise<{
    totalRejections: number;
    rejectionReasons: { reason: string; count: number }[];
    rejectionsByRole: { role: string; count: number }[];
    rejectionsByCompany: { company: string; count: number }[];
  }> {
    const rejectedJobs = await this.getAllJobs({ status: "Rejected" });

    const reasonCounts: { [key: string]: number } = {};
    rejectedJobs.forEach((job) => {
      if (job.rejectionReason) {
        reasonCounts[job.rejectionReason] =
          (reasonCounts[job.rejectionReason] || 0) + 1;
      }
    });

    const roleCounts: { [key: string]: number } = {};
    rejectedJobs.forEach((job) => {
      roleCounts[job.role] = (roleCounts[job.role] || 0) + 1;
    });

    const companyCounts: { [key: string]: number } = {};
    rejectedJobs.forEach((job) => {
      companyCounts[job.company] = (companyCounts[job.company] || 0) + 1;
    });

    return {
      totalRejections: rejectedJobs.length,
      rejectionReasons: Object.entries(reasonCounts)
        .map(([reason, count]) => ({ reason, count }))
        .sort((a, b) => b.count - a.count),
      rejectionsByRole: Object.entries(roleCounts)
        .map(([role, count]) => ({ role, count }))
        .sort((a, b) => b.count - a.count),
      rejectionsByCompany: Object.entries(companyCounts)
        .map(([company, count]) => ({ company, count }))
        .sort((a, b) => b.count - a.count),
    };
  }
}
