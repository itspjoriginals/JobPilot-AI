import { JobCard } from "@/components/dashboard/job-card";
import { mockJobs } from "@/lib/data";

export default function DashboardJobsPage() {
  return (
    <div className="container mx-auto">
      <h1 className="mb-6 font-headline text-3xl font-bold">Recommended Jobs</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mockJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
