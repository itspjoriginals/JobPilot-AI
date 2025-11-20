'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { mockResumes } from '@/lib/data';
import { Upload } from 'lucide-react';
import { ResumeCard } from '@/components/dashboard/resumes/resume-card';
import { ResumeReviewDialog } from '@/components/dashboard/resumes/resume-review-dialog';
import type { Resume } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ResumesPage() {
  const [isReviewing, setIsReviewing] = useState(false);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

  const handleReview = (resume: Resume) => {
    setSelectedResume(resume);
    setIsReviewing(true);
  };

  const handleCloseDialog = () => {
    setIsReviewing(false);
    setSelectedResume(null);
  };

  return (
    <div className="container mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">Resume Hub</h1>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Resume
        </Button>
      </div>
      <p className="mb-8 text-muted-foreground">
        Manage your resume versions here. The AI will automatically select the best one for each job application.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockResumes.map((resume) => (
          <ResumeCard key={resume.id} resume={resume} onReview={handleReview} />
        ))}
         <Card className="flex flex-col items-center justify-center border-2 border-dashed">
            <CardHeader>
                <CardTitle className="font-headline">Upload New Resume</CardTitle>
            </CardHeader>
            <CardContent>
                <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Select File
                </Button>
            </CardContent>
         </Card>
      </div>

      <ResumeReviewDialog
        resume={selectedResume}
        isOpen={isReviewing}
        onClose={handleCloseDialog}
      />
    </div>
  );
}
