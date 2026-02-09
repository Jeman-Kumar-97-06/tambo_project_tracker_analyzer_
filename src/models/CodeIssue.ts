import { ObjectId } from 'mongodb';

export interface CodeIssue {
  _id?: ObjectId;
  issueId: string;
  title: string;
  description: string;
  source: 'local' | 'github';
  priority: 'low' | 'medium' | 'high';
  labels: string[];
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  repoName?: string;
  issueUrl?: string;
  assignee?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface CodeIssueComment {
  _id?: ObjectId;
  issueId: ObjectId;
  comment: string;
  author: string;
  createdAt: Date;
}

export interface CodeIssueResolutionStep {
  _id?: ObjectId;
  issueId: ObjectId;
  step: string;
  completed: boolean;
  completedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const CODE_ISSUES_COLLECTION = 'code_issues';
export const CODE_ISSUE_COMMENTS_COLLECTION = 'code_issue_comments';
export const CODE_ISSUE_RESOLUTION_STEPS_COLLECTION = 'code_issue_resolution_steps';
