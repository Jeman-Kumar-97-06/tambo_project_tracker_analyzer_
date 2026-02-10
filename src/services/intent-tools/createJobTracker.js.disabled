import { JobService } from "../jobService";

export async function createJobTracker({
  company,
  role,
  status = "Applied",
  interviewDate,
  location = "Remote",
}) {
  try {
    // Ensure this only runs on server side
    if (typeof window !== "undefined") {
      console.warn(
        "createJobTracker should only be called on the server side, using fallback data",
      );
      throw new Error("Server-side only");
    }
    // Check if job application already exists for this company and role
    const existingJob = await JobService.getJobByCompanyAndRole(company, role);

    if (existingJob) {
      console.log(
        `Job application for ${role} at ${company} already exists, returning existing job`,
      );
      return {
        company: existingJob.company,
        role: existingJob.role,
        status: existingJob.status,
        interviewDate: existingJob.interviewDate,
        location: existingJob.location,
      };
    }

    // Create new job application in database
    const newJob = await JobService.createJob({
      company,
      role,
      status,
      interviewDate,
      location,
      // Set additional default fields
      notes: `Application for ${role} position at ${company}`,
      referralSource: "direct_application",
    });

    console.log(`Created new job application: ${role} at ${company}`);

    return {
      company: newJob.company,
      role: newJob.role,
      status: newJob.status,
      interviewDate: newJob.interviewDate,
      location: newJob.location,
    };
  } catch (error) {
    console.error(
      `Error creating job tracker for ${role} at ${company}:`,
      error,
    );

    // Return fallback response if database fails
    return {
      company,
      role,
      status,
      interviewDate,
      location,
    };
  }
}
