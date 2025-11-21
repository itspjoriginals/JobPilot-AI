import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Resume } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useEffect } from 'react';

interface ResumeReviewDialogProps {
  resume: Resume | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (resume: Resume) => void;
}

export function ResumeReviewDialog({ resume, isOpen, onClose, onSave }: ResumeReviewDialogProps) {
  const [editableResume, setEditableResume] = useState<Resume | null>(resume);

  useEffect(() => {
    setEditableResume(resume);
  }, [resume]);

  if (!editableResume) return null;

  const handleSave = () => {
    onSave(editableResume);
    onClose();
  };

  const handleFieldChange = (section: string, index: number, field: string, value: any) => {
    setEditableResume(prev => {
        if (!prev) return null;
        const newResume = { ...prev };
        if (section === 'skills') {
            (newResume.parsedData.skills as any)[field] = value.split(',').map((s: string) => s.trim());
        } else if (section === 'experience') {
            (newResume.parsedData.experience[index] as any)[field] = value;
        } else if (section === 'projects') {
            if (field === 'tags') {
                newResume.parsedData.projects[index].tags = value.split(',').map((s: string) => s.trim());
            } else {
                (newResume.parsedData.projects[index] as any)[field] = value;
            }
        }
        return newResume;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="font-headline">Review Parsed Resume: {editableResume.name}</DialogTitle>
          <DialogDescription>
            Verify and edit the information parsed from your resume. This data will be used for auto-filling applications.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] p-1">
          <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-headline">Skills</AccordionTrigger>
              <AccordionContent className="space-y-4 p-1">
                <div>
                  <Label>Technical Skills</Label>
                  <Textarea
                    defaultValue={editableResume.parsedData.skills.technical.join(', ')}
                    onChange={(e) => handleFieldChange('skills', 0, 'technical', e.target.value)}
                   />
                </div>
                <div>
                  <Label>Tools & Technologies</Label>
                  <Textarea 
                    defaultValue={editableResume.parsedData.skills.tools.join(', ')}
                    onChange={(e) => handleFieldChange('skills', 0, 'tools', e.target.value)}
                   />
                </div>
                 <div>
                  <Label>Soft Skills</Label>
                  <Textarea
                    defaultValue={editableResume.parsedData.skills.soft.join(', ')}
                    onChange={(e) => handleFieldChange('skills', 0, 'soft', e.target.value)}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="font-headline">Work Experience</AccordionTrigger>
              <AccordionContent className="space-y-6 p-1">
                {editableResume.parsedData.experience.map((exp, index) => (
                  <div key={index} className="space-y-2 rounded-md border p-4">
                    <Label>Job Title</Label>
                    <Input defaultValue={exp.title} onChange={(e) => handleFieldChange('experience', index, 'title', e.target.value)} />
                    <Label>Company</Label>
                    <Input defaultValue={exp.company} onChange={(e) => handleFieldChange('experience', index, 'company', e.target.value)} />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Start Date</Label>
                        <Input type="date" defaultValue={exp.startDate} onChange={(e) => handleFieldChange('experience', index, 'startDate', e.target.value)} />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input defaultValue={exp.endDate} onChange={(e) => handleFieldChange('experience', index, 'endDate', e.target.value)} />
                      </div>
                    </div>
                    <Label>Description</Label>
                    <Textarea defaultValue={exp.description} rows={4} onChange={(e) => handleFieldChange('experience', index, 'description', e.target.value)} />
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="font-headline">Projects</AccordionTrigger>
              <AccordionContent className="space-y-6 p-1">
                {editableResume.parsedData.projects.map((proj, index) => (
                   <div key={index} className="space-y-2 rounded-md border p-4">
                    <Label>Project Name</Label>
                    <Input defaultValue={proj.name} onChange={(e) => handleFieldChange('projects', index, 'name', e.target.value)} />
                    <Label>Description</Label>
                    <Textarea defaultValue={proj.description} rows={3} onChange={(e) => handleFieldChange('projects', index, 'description', e.target.value)} />
                     <Label>Tags</Label>
                    <Input defaultValue={proj.tags.join(', ')} onChange={(e) => handleFieldChange('projects', index, 'tags', e.target.value)} />
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
