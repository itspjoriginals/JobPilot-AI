import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, MoreVertical, Trash2, Edit } from 'lucide-react';
import { Resume } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ResumeCardProps {
  resume: Resume;
  onReview: (resume: Resume) => void;
}

export function ResumeCard({ resume, onReview }: ResumeCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="font-headline text-lg">{resume.name}</CardTitle>
          <CardDescription className="flex items-center gap-2 pt-1 text-sm">
            <Calendar className="h-4 w-4" />
            Created on {new Date(resume.createdAt).toLocaleDateString()}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-muted-foreground" />
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onReview(resume)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Review & Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="w-full" onClick={() => onReview(resume)}>
          Review Parsed Data
        </Button>
      </CardContent>
    </Card>
  );
}
