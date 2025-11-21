'use client';
import { mockAdminData } from '@/lib/data';
import { StatCard } from '@/components/dashboard/stat-card';
import { AutomationSuccessRateChart, ProxyPerformanceChart } from '@/components/dashboard/admin/charts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Server, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

const statusVariant: { [key: string]: 'default' | 'destructive' | 'secondary' } = {
  online: 'default',
  error: 'destructive',
  offline: 'secondary',
};

function AdminDashboardSkeleton() {
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="mt-2 h-5 w-96" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="mt-1 h-4 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="mt-1 h-5 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-5 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="mt-1 h-5 w-72" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


export default function AdminPage() {
  const { loading: authLoading } = useAuth();
  const {
    scraperHealth,
    automationSuccessRate,
    proxyPerformance,
    sessionExpiryAlerts,
    highRejectionAlerts,
  } = mockAdminData;

  if (authLoading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="container mx-auto">
        <div className="mb-8">
            <h1 className="font-headline text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor the health and performance of JobPilot AI.</p>
        </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <AutomationSuccessRateChart rate={automationSuccessRate} />
        <StatCard title="Session Expiry Alerts" value={sessionExpiryAlerts} icon={AlertTriangle} description="Sessions needing reconnection" />
        <StatCard title="High Rejection Alerts" value={highRejectionAlerts} icon={ShieldAlert} description="Unusual application failures" />
        <StatCard title="Active Scrapers" value={scraperHealth.filter(s => s.status === 'online').length} icon={Server} description={`${scraperHealth.length} total scrapers`} />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Scraper Health</CardTitle>
            <CardDescription>Status of job ingestion pipelines.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Last Run</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scraperHealth.map((scraper) => (
                  <TableRow key={scraper.source}>
                    <TableCell className="font-medium">{scraper.source}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[scraper.status]}>{scraper.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {new Date(scraper.lastRun).toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <ProxyPerformanceChart data={proxyPerformance} />
      </div>
    </div>
  );
}
