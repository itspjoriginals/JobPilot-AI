import { mockAdminData } from '@/lib/data';
import { StatCard } from '@/components/dashboard/stat-card';
import { AutomationSuccessRateChart, ProxyPerformanceChart } from '@/components/dashboard/admin/charts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Server, AlertTriangle, ShieldAlert } from 'lucide-react';

const statusVariant: { [key: string]: 'default' | 'destructive' | 'secondary' } = {
  online: 'default',
  error: 'destructive',
  offline: 'secondary',
};

export default function AdminPage() {
  const {
    scraperHealth,
    automationSuccessRate,
    proxyPerformance,
    sessionExpiryAlerts,
    highRejectionAlerts,
  } = mockAdminData;

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
