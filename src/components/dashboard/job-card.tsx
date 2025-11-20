import { Job } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Calendar, MapPin, Check, Save, X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const scoreColor = job.jobScore > 85 ? 'text-green-500' : job.jobScore > 70 ? 'text-yellow-500' : 'text-red-500';

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="font-headline text-lg">{job.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 pt-1">
              <Briefcase className="h-4 w-4" />
              {job.companyName}
            </CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex h-12 w-12 items-center justify-center rounded-full border bg-background">
                  <span className={`font-headline text-xl font-bold ${scoreColor}`}>
                    {job.jobScore}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Match Score</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{job.remoteType}</Badge>
          <Badge variant="secondary">{job.seniorityLevel}</Badge>
          <Badge variant="outline">{job.source}</Badge>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0" /> {job.location}
          </p>
          <p className="flex items-center gap-2">
            <Calendar className="h-4 w-4 flex-shrink-0" /> Posted on {job.datePosted}
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {job.skills.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="default" className="bg-primary/10 text-primary hover:bg-primary/20">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="w-1/3">
                <X className="h-4 w-4" />
                <span className="sr-only">Skip</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Skip Job</p></TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="w-1/3">
                <Save className="h-4 w-4" />
                 <span className="sr-only">Save</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Save for Later</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button className="flex-grow w-1/3" >
          <Check className="mr-2 h-4 w-4" /> Apply
        </Button>
      </CardFooter>
    </Card>
  );
}
