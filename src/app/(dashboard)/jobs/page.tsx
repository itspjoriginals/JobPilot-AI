'use client';
import { JobCard } from "@/components/dashboard/job-card";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { findRelevantJobs } from "@/ai/flows/find-relevant-jobs";
import type { Job } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

function JobsSkeleton() {
  return (
    <div className="container mx-auto">
      <Skeleton className="h-9 w-72 mb-6" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="flex h-full flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32 mt-2" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="flex flex-wrap gap-1">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-2">
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-10 w-1/3" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}


export default function DashboardJobsPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchJobs = async () => {
        setLoadingJobs(true);
        try {
          const userProfileForJobs = {
            name: user.displayName || 'User',
            // This is a simplified example. A real app would get skills/experience
            // from the user's profile stored in Firestore.
            skills: ['React', 'TypeScript', 'Node.js', 'Web Development'],
            experience: [{
              title: 'Software Engineer',
              company: 'Tech Co',
              description: 'Developed full-stack web applications.'
            }],
            location: 'Remote'
          };

          const result = await findRelevantJobs({ userProfile: userProfileForJobs });
          setJobs(result.jobs);
        } catch (error) {
          console.error("Failed to fetch jobs:", error);
          toast({
            title: "Error",
            description: "Could not fetch job recommendations. Please try again later.",
            variant: "destructive",
          });
        } finally {
          setLoadingJobs(false);
        }
      };
      fetchJobs();
    }
  }, [user, toast]);
  
  if (authLoading || loadingJobs) {
    return <JobsSkeleton />;
  }

  const handleJobAction = (jobId: string, action: 'skip' | 'save' | 'apply') => {
    toast({
      title: 'Action Received',
      description: `Job ${jobId} action: ${action}`,
    });
    // Here you would implement logic to handle the action,
    // e.g., update state, call an API, etc.
    setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
  };


  return (
    <div className="container mx-auto">
      <h1 className="mb-6 font-headline text-3xl font-bold">Recommended Jobs</h1>
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {jobs.map((job) => (
            <JobCard key={job.id} job={job} onAction={handleJobAction} />
            ))}
        </div>
      ) : (
        <div className="text-center py-12">
            <p className="text-muted-foreground">No job recommendations available at the moment.</p>
        </div>
      )}
    </div>
  );
}
