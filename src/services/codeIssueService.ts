import { connectToDatabase } from "@/lib/mongodb";
import {
  CodeIssue,
  CodeIssueComment,
  CodeIssueResolutionStep,
  CODE_ISSUES_COLLECTION,
  CODE_ISSUE_COMMENTS_COLLECTION,
  CODE_ISSUE_RESOLUTION_STEPS_COLLECTION,
} from "@/models/CodeIssue";
import { ObjectId } from "mongodb";

export class CodeIssueService {
  // Create a new code issue
  static async createCodeIssue(
    issueData: Omit<CodeIssue, "_id" | "createdAt" | "updatedAt">,
  ): Promise<CodeIssue> {
    const { db } = await connectToDatabase();

    const issue: CodeIssue = {
      ...issueData,
      status: "open",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection(CODE_ISSUES_COLLECTION).insertOne(issue);
    return { ...issue, _id: result.insertedId };
  }

  // Get all code issues
  static async getAllCodeIssues(filters?: {
    status?: CodeIssue["status"];
    priority?: CodeIssue["priority"];
    source?: CodeIssue["source"];
    assignee?: string;
  }): Promise<CodeIssue[]> {
    const { db } = await connectToDatabase();

    let query: any = {};
    if (filters) {
      if (filters.status) query.status = filters.status;
      if (filters.priority) query.priority = filters.priority;
      if (filters.source) query.source = filters.source;
      if (filters.assignee) query.assignee = filters.assignee;
    }

    const issues = await db
      .collection(CODE_ISSUES_COLLECTION)
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return issues as CodeIssue[];
  }

  // Get code issue by ID
  static async getCodeIssueById(id: string): Promise<CodeIssue | null> {
    const { db } = await connectToDatabase();
    const issue = await db
      .collection(CODE_ISSUES_COLLECTION)
      .findOne({ _id: new ObjectId(id) });
    return issue as CodeIssue | null;
  }

  // Get code issue by issueId
  static async getCodeIssueByIssueId(
    issueId: string,
  ): Promise<CodeIssue | null> {
    const { db } = await connectToDatabase();
    const issue = await db
      .collection(CODE_ISSUES_COLLECTION)
      .findOne({ issueId });
    return issue as CodeIssue | null;
  }

  // Update code issue
  static async updateCodeIssue(
    id: string,
    updateData: Partial<Omit<CodeIssue, "_id" | "createdAt">>,
  ): Promise<CodeIssue | null> {
    const { db } = await connectToDatabase();

    // If status is being updated to resolved, set resolvedAt
    if (updateData.status === "resolved") {
      updateData.resolvedAt = new Date();
    }

    const result = await db.collection(CODE_ISSUES_COLLECTION).findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    );

    return result?.value as CodeIssue | null;
  }

  // Delete code issue
  static async deleteCodeIssue(id: string): Promise<boolean> {
    const { db } = await connectToDatabase();

    // Also delete all comments and resolution steps for this issue
    await db
      .collection(CODE_ISSUE_COMMENTS_COLLECTION)
      .deleteMany({ issueId: new ObjectId(id) });
    await db
      .collection(CODE_ISSUE_RESOLUTION_STEPS_COLLECTION)
      .deleteMany({ issueId: new ObjectId(id) });

    const result = await db
      .collection(CODE_ISSUES_COLLECTION)
      .deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  // Add comment to code issue
  static async addComment(
    commentData: Omit<CodeIssueComment, "_id" | "createdAt">,
  ): Promise<CodeIssueComment> {
    const { db } = await connectToDatabase();

    const comment: CodeIssueComment = {
      ...commentData,
      createdAt: new Date(),
    };

    const result = await db
      .collection(CODE_ISSUE_COMMENTS_COLLECTION)
      .insertOne(comment);
    return { ...comment, _id: result.insertedId };
  }

  // Get comments for a code issue
  static async getComments(issueId: string): Promise<CodeIssueComment[]> {
    const { db } = await connectToDatabase();
    const comments = await db
      .collection(CODE_ISSUE_COMMENTS_COLLECTION)
      .find({ issueId: new ObjectId(issueId) })
      .sort({ createdAt: 1 })
      .toArray();

    return comments as CodeIssueComment[];
  }

  // Add resolution step to code issue
  static async addResolutionStep(
    stepData: Omit<CodeIssueResolutionStep, "_id" | "createdAt" | "updatedAt">,
  ): Promise<CodeIssueResolutionStep> {
    const { db } = await connectToDatabase();

    const resolutionStep: CodeIssueResolutionStep = {
      ...stepData,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection(CODE_ISSUE_RESOLUTION_STEPS_COLLECTION)
      .insertOne(resolutionStep);
    return { ...resolutionStep, _id: result.insertedId };
  }

  // Get resolution steps for a code issue
  static async getResolutionSteps(
    issueId: string,
  ): Promise<CodeIssueResolutionStep[]> {
    const { db } = await connectToDatabase();
    const steps = await db
      .collection(CODE_ISSUE_RESOLUTION_STEPS_COLLECTION)
      .find({ issueId: new ObjectId(issueId) })
      .sort({ createdAt: 1 })
      .toArray();

    return steps as CodeIssueResolutionStep[];
  }

  // Update resolution step
  static async updateResolutionStep(
    stepId: string,
    updateData: Partial<Omit<CodeIssueResolutionStep, "_id" | "createdAt">>,
  ): Promise<CodeIssueResolutionStep | null> {
    const { db } = await connectToDatabase();

    // If marking as completed, set completedAt
    if (updateData.completed === true) {
      updateData.completedAt = new Date();
    } else if (updateData.completed === false) {
      updateData.completedAt = undefined;
    }

    const result = await db
      .collection(CODE_ISSUE_RESOLUTION_STEPS_COLLECTION)
      .findOneAndUpdate(
        { _id: new ObjectId(stepId) },
        {
          $set: {
            ...updateData,
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" },
      );

    return result?.value as CodeIssueResolutionStep | null;
  }

  // Get issue statistics
  static async getIssueStats(): Promise<{
    total: number;
    byStatus: { status: string; count: number }[];
    byPriority: { priority: string; count: number }[];
    bySource: { source: string; count: number }[];
    avgResolutionTime: number; // in days
  }> {
    const { db } = await connectToDatabase();

    const issues = await this.getAllCodeIssues();

    // Count by status
    const statusCounts: { [key: string]: number } = {};
    issues.forEach((issue) => {
      statusCounts[issue.status] = (statusCounts[issue.status] || 0) + 1;
    });

    // Count by priority
    const priorityCounts: { [key: string]: number } = {};
    issues.forEach((issue) => {
      priorityCounts[issue.priority] =
        (priorityCounts[issue.priority] || 0) + 1;
    });

    // Count by source
    const sourceCounts: { [key: string]: number } = {};
    issues.forEach((issue) => {
      sourceCounts[issue.source] = (sourceCounts[issue.source] || 0) + 1;
    });

    // Calculate average resolution time
    const resolvedIssues = issues.filter(
      (issue) => issue.status === "resolved" && issue.resolvedAt,
    );
    const avgResolutionTime =
      resolvedIssues.length > 0
        ? resolvedIssues.reduce((total, issue) => {
            const resolutionTime =
              (issue.resolvedAt!.getTime() - issue.createdAt.getTime()) /
              (1000 * 60 * 60 * 24);
            return total + resolutionTime;
          }, 0) / resolvedIssues.length
        : 0;

    return {
      total: issues.length,
      byStatus: Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
      })),
      byPriority: Object.entries(priorityCounts).map(([priority, count]) => ({
        priority,
        count,
      })),
      bySource: Object.entries(sourceCounts).map(([source, count]) => ({
        source,
        count,
      })),
      avgResolutionTime: Math.round(avgResolutionTime * 100) / 100,
    };
  }

  // Search issues by title or description
  static async searchIssues(searchTerm: string): Promise<CodeIssue[]> {
    const { db } = await connectToDatabase();

    const issues = await db
      .collection(CODE_ISSUES_COLLECTION)
      .find({
        $or: [
          { title: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
        ],
      })
      .sort({ createdAt: -1 })
      .toArray();

    return issues as CodeIssue[];
  }

  // Get issues by labels
  static async getIssuesByLabels(labels: string[]): Promise<CodeIssue[]> {
    const { db } = await connectToDatabase();

    const issues = await db
      .collection(CODE_ISSUES_COLLECTION)
      .find({ labels: { $in: labels } })
      .sort({ createdAt: -1 })
      .toArray();

    return issues as CodeIssue[];
  }

  // Get all unique labels
  static async getAllLabels(): Promise<string[]> {
    const { db } = await connectToDatabase();

    const pipeline = [
      { $unwind: "$labels" },
      { $group: { _id: "$labels" } },
      { $sort: { _id: 1 } },
    ];

    const result = await db
      .collection(CODE_ISSUES_COLLECTION)
      .aggregate(pipeline)
      .toArray();
    return result.map((item) => item._id);
  }

  // Assign issue to someone
  static async assignIssue(
    issueId: string,
    assignee: string,
  ): Promise<CodeIssue | null> {
    return this.updateCodeIssue(issueId, { assignee });
  }

  // Change issue priority
  static async changePriority(
    issueId: string,
    priority: CodeIssue["priority"],
  ): Promise<CodeIssue | null> {
    return this.updateCodeIssue(issueId, { priority });
  }

  // Change issue status
  static async changeStatus(
    issueId: string,
    status: CodeIssue["status"],
  ): Promise<CodeIssue | null> {
    return this.updateCodeIssue(issueId, { status });
  }

  // Add labels to issue
  static async addLabels(
    issueId: string,
    newLabels: string[],
  ): Promise<CodeIssue | null> {
    const { db } = await connectToDatabase();

    const result = await db.collection(CODE_ISSUES_COLLECTION).findOneAndUpdate(
      { _id: new ObjectId(issueId) },
      {
        $addToSet: { labels: { $each: newLabels } },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: "after" },
    );

    return result?.value as CodeIssue | null;
  }

  // Remove labels from issue
  static async removeLabels(
    issueId: string,
    labelsToRemove: string[],
  ): Promise<CodeIssue | null> {
    const { db } = await connectToDatabase();

    // Remove labels one by one to avoid typing issues
    for (const label of labelsToRemove) {
      await db.collection(CODE_ISSUES_COLLECTION).updateOne(
        { _id: new ObjectId(issueId) },
        {
          $pull: { labels: label },
          $set: { updatedAt: new Date() },
        },
      );
    }

    // Get the updated document
    const result = await db
      .collection(CODE_ISSUES_COLLECTION)
      .findOne({ _id: new ObjectId(issueId) });
    return result as CodeIssue | null;
  }
}
