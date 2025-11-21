'use client';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/dashboard/applications/columns';
import { mockApplicationLogs } from '@/lib/data';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';

function ApplicationsSkeleton() {
    return (
        <div className="container mx-auto">
            <Skeleton className="h-9 w-64 mb-6" />
            <Skeleton className="h-5 w-96 mb-8" />
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                            <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                            <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                            <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                            <TableHead><Skeleton className="h-5 w-10" /></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(5)].map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default function ApplicationsPage() {
    const { loading: authLoading } = useAuth();

    if (authLoading) {
        return <ApplicationsSkeleton />;
    }
  
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
