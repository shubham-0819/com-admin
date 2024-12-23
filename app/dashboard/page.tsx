'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Phone,
  MessageSquare,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { CallService } from '@/src/services/callService';
import { SMSService } from '@/src/services/smsService';

// Define an interface for our statistics
interface StatData {
  name: string;
  value: string;
  change: string;
  increasing: boolean;
  icon: any; // Using 'any' for brevity, but you might want to be more specific
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const callService = new CallService();
        const smsService = new SMSService();

        // Fetch actual data from services
        const [callStats, smsStats] = await Promise.all([
          callService.getCallStatistics(),
          smsService.getSMSStatistics(),
        ]);

        const updatedStats = [
          {
            name: 'Total Voice Calls',
            value: callStats.totalCalls.toString(),
            change: `${callStats.percentageChange}%`,
            increasing: callStats.percentageChange > 0,
            icon: Phone,
          },
          {
            name: 'Total SMS Sent',
            value: smsStats.totalSMS.toString(),
            change: `${smsStats.percentageChange}%`,
            increasing: smsStats.percentageChange > 0,
            icon: MessageSquare,
          },
        ];

        setStats(updatedStats);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        // You might want to show an error message to the user
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading statistics...</div>; // Consider using a proper loading component
  }

  // Rest of the component remains the same
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-sm">
                {stat.increasing ? (
                  <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                )}
                <span
                  className={
                    stat.increasing ? 'text-green-500' : 'text-red-500'
                  }
                >
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}