import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/dashboard/applications/columns';
import { mockApplicationLogs } from '@/lib/data';

export default function ApplicationsPage() {
  return (
    <div className="container mx-auto">
      <h1 className="mb-6 font-headline text-3xl font-bold">Application Log</h1>
      <p className="mb-8 text-muted-foreground">
        Track the status of every job application attempt made by JobPilot AI.
      </p>
      <DataTable columns={columns} data={mockApplicationLogs} filterColumn="jobTitle" />
    </div>
  );
}
