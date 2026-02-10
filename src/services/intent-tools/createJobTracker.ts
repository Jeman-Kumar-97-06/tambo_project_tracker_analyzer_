import { JobService } from "@/services/jobService";

export interface CreateJobTrackerInput {
  company: string;
  role: string;
  status?: "Applied" | "Waiting" | "Rejected" | "Heard Back" | "Interview";
  interviewDate?: string;
  location?: string;
}

export interface CreateJobTrackerOutput {
  company: string;
  role: string;
  status: "Applied" | "Waiting" | "Rejected" | "Heard Back" | "Interview";
  interviewDate?: string;
  location: string;
}

export async function createJobTracker(
  input: CreateJobTrackerInput,
): Promise<CreateJobTrackerOutput> {
  // Ensure this only runs on server side
  if (typeof window !== "undefined") {
    throw new Error(
      "createJobTracker should only be called on the server side",
    );
  }

  try {
    const {
      company,
      role,
      status = "Applied",
      interviewDate,
      location = "Remote",
    } = input;

    // Create job application in database
    const job = await JobService.createJob({
      company,
      role,
      status,
      location,
      interviewDate,
      notes: `Job application for ${role} at ${company}`,
    });

    return {
      company: job.company,
      role: job.role,
      status: job.status,
      interviewDate: job.interviewDate,
      location: job.location,
    };
  } catch (error) {
    console.error("Error creating job tracker:", error);

    // Return fallback data if database fails
    return {
      company: input.company,
      role: input.role,
      status: input.status || "Applied",
      interviewDate: input.interviewDate,
      location: input.location || "Remote",
    };
  }
}
