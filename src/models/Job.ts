import { ObjectId } from 'mongodb';

export interface Job {
  _id?: ObjectId;
  company: string;
  role: string;
  status: 'Applied' | 'Waiting' | 'Rejected' | 'Heard Back' | 'Interview';
  interviewDate?: string;
  location: string;
  applicationDate: Date;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  jobDescription?: string;
  requirements?: string[];
  benefits?: string[];
  contactPerson?: {
    name: string;
    email: string;
    phone?: string;
  };
  notes?: string;
  applicationUrl?: string;
  referralSource?: string;
  followUpDate?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobInterview {
  _id?: ObjectId;
  jobId: ObjectId;
  company: string;
  role: string;
  interviewType: 'phone' | 'video' | 'onsite' | 'technical' | 'behavioral' | 'panel';
  interviewDate: Date;
  duration?: number; // in minutes
  interviewer?: {
    name: string;
    title: string;
    email?: string;
  };
  location?: string;
  meetingLink?: string;
  questions?: string[];
  notes?: string;
  outcome?: 'pending' | 'passed' | 'failed' | 'next_round';
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobActivity {
  _id?: ObjectId;
  jobId: ObjectId;
  company: string;
  role: string;
  activityType: 'application' | 'follow_up' | 'interview_scheduled' | 'status_update' | 'rejection' | 'offer';
  description: string;
  date: Date;
  createdAt: Date;
}

export const JOBS_COLLECTION = 'jobs';
export const JOB_INTERVIEWS_COLLECTION = 'job_interviews';
export const JOB_ACTIVITIES_COLLECTION = 'job_activities';
