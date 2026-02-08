export async function createJobTracker({
  company,
  role,
  status = "Applied",
  interviewDate,
  location = "Remote",
}) {
  return {
    company,
    role,
    status,
    interviewDate,
    location,
  };
}
