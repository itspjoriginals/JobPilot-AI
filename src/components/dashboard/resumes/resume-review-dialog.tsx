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
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface ResumeReviewDialogProps {
  resume: Resume | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeReviewDialog({ resume, isOpen, onClose }: ResumeReviewDialogProps) {
  if (!resume) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="font-headline">Review Parsed Resume: {resume.name}</DialogTitle>
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
                  <Textarea defaultValue={resume.parsedData.skills.technical.join(', ')} />
                </div>
                <div>
                  <Label>Tools & Technologies</Label>
                  <Textarea defaultValue={resume.parsedData.skills.tools.join(', ')} />
                </div>
                 <div>
                  <Label>Soft Skills</Label>
                  <Textarea defaultValue={resume.parsedData.skills.soft.join(', ')} />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="font-headline">Work Experience</AccordionTrigger>
              <AccordionContent className="space-y-6 p-1">
                {resume.parsedData.experience.map((exp, index) => (
                  <div key={index} className="space-y-2 rounded-md border p-4">
                    <Label>Job Title</Label>
                    <Input defaultValue={exp.title} />
                    <Label>Company</Label>
                    <Input defaultValue={exp.company} />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Start Date</Label>
                        <Input type="date" defaultValue={exp.startDate} />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input type="date" defaultValue={exp.endDate} />
                      </div>
                    </div>
                    <Label>Description</Label>
                    <Textarea defaultValue={exp.description} rows={4} />
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="font-headline">Projects</AccordionTrigger>
              <AccordionContent className="space-y-6 p-1">
                {resume.parsedData.projects.map((proj, index) => (
                   <div key={index} className="space-y-2 rounded-md border p-4">
                    <Label>Project Name</Label>
                    <Input defaultValue={proj.name} />
                    <Label>Description</Label>
                    <Textarea defaultValue={proj.description} rows={3}/>
                     <Label>Tags</Label>
                    <Input defaultValue={proj.tags.join(', ')} />
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onClose}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
