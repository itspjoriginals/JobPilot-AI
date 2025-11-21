
'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { mockResumes } from '@/lib/data';
import { Upload, FileText } from 'lucide-react';
import { ResumeCard } from '@/components/dashboard/resumes/resume-card';
import { ResumeReviewDialog } from '@/components/dashboard/resumes/resume-review-dialog';
import type { Resume } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { parseResume } from '@/ai/flows/parse-resume-flow';

function ResumesSkeleton() {
    return (
      <div className="container mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        <Skeleton className="h-5 w-full max-w-2xl mb-8" />
  
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
             <Card key={i}>
                <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-32 mt-2" />
                    </div>
                    <Skeleton className="h-8 w-8" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

export default function ResumesPage() {
  const { loading: authLoading } = useAuth();
  const [isReviewing, setIsReviewing] = useState(false);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [resumes, setResumes] = useState<Resume[]>(mockResumes);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReview = (resume: Resume) => {
    setSelectedResume(resume);
    setIsReviewing(true);
  };

  const handleCloseDialog = () => {
    setIsReviewing(false);
    setSelectedResume(null);
  };
  
  const handleUpdateResume = (updatedResume: Resume) => {
    setResumes(prev => prev.map(r => r.id === updatedResume.id ? updatedResume : r));
    toast({
        title: 'Success',
        description: 'Resume updated successfully.'
    });
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: 'Upload Failed',
        description: 'Please upload a PDF file.',
        variant: 'destructive',
      });
      return;
    }

    setUploadProgress(0);
    const newResumeId = `resume-${resumes.length + 1}`;
    
    const progressInterval = setInterval(() => {
        setUploadProgress(prev => (prev !== null && prev < 80 ? prev + 5 : prev));
    }, 100);

    try {
      // Dynamically import pdf-parse and set up workerSrc for browser environment
      const pdf = (await import('pdf-parse')).default;
      if (typeof window !== 'undefined') {
          (pdf as any).workerSrc = `//unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js`;
      }
      
      const arrayBuffer = await file.arrayBuffer();
      const data = await pdf(Buffer.from(arrayBuffer));
      const resumeText = data.text;
      
      const { parsedData } = await parseResume({ resumeText });
      
      const newResume: Resume = {
        id: newResumeId,
        name: file.name,
        fileUrl: URL.createObjectURL(file),
        createdAt: new Date().toISOString(),
        parsedData: parsedData,
      };
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        setResumes((prevResumes) => [newResume, ...prevResumes]);
        setUploadProgress(null);
        toast({
          title: 'Upload & Parsing Successful',
          description: `${file.name} has been parsed.`,
        });
      }, 500);

    } catch (error: any) {
      clearInterval(progressInterval);
      setUploadProgress(null);
      console.error("Error parsing resume:", error);
      toast({
        title: 'Parsing Failed',
        description: error.message || 'The AI could not parse this resume. Please try another file.',
        variant: 'destructive',
      });
    } finally {
        if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };


  if (authLoading) {
    return <ResumesSkeleton />;
  }

  return (
    <div className="container mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">Resume Hub</h1>
        <Button onClick={handleUploadClick} disabled={uploadProgress !== null}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Resume
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf"
        />
      </div>
      <p className="mb-8 text-muted-foreground">
        Manage your resume versions here. The AI will automatically select the best one for each job application.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {uploadProgress !== null && (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Uploading & Parsing...</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Progress value={uploadProgress} />
                    <p className="text-sm text-muted-foreground">{uploadProgress}% complete</p>
                </CardContent>
            </Card>
        )}
        {resumes.map((resume) => (
          <ResumeCard key={resume.id} resume={resume} onReview={handleReview} />
        ))}
         <Card className="flex flex-col items-center justify-center border-2 border-dashed bg-muted/50 hover:border-primary/50 hover:bg-muted/80 transition-colors">
            <CardHeader>
                <CardTitle className="font-headline">Upload New Resume</CardTitle>
            </CardHeader>
            <CardContent>
                <Button variant="outline" onClick={handleUploadClick} disabled={uploadProgress !== null}>
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
        onSave={handleUpdateResume}
      />
    </div>
  );
}
