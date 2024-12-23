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
import CallService from '@/src/services/callService';
import SMSService from '@/src/services/smsService';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Define an interface for our statistics
interface StatData {
  name: string;
  value: string;
  change: string;
  increasing: boolean;
  icon: any; // Using 'any' for brevity, but you might want to be more specific
}

interface DayWiseStats {
  date: string;
  total: number;
  success: number;
  failed: number;
  pending: number;
  notSent: number;
  others: number;
  refund: number;
}

interface DateRange {
  label: string;
  fromDate: Date;
  toDate: Date;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatData[]>([]);
  const [dayWiseStats, setDayWiseStats] = useState<DayWiseStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState<string>('7');

  const getDateRange = (days: number): { fromDate: Date; toDate: Date } => {
    const toDate = new Date();
    const fromDate = new Date(toDate.getTime() - days * 24 * 60 * 60 * 1000);
    return { fromDate, toDate };
  };

  const fetchStats = async (days: number = 7) => {
    try {
      setLoading(true);
      const { toDate, fromDate } = getDateRange(days);
      const previousFromDate = new Date(fromDate.getTime() - days * 24 * 60 * 60 * 1000);

      let [currentPeriodCalls, previousPeriodCalls] = await Promise.all([
        CallService.getSummaryReport({
          fromDate: fromDate.toISOString().split('T')[0],
          toDate: toDate.toISOString().split('T')[0]
        }),
        CallService.getSummaryReport({
          fromDate: previousFromDate.toISOString().split('T')[0],
          toDate: fromDate.toISOString().split('T')[0]
        }),
      ]);
      currentPeriodCalls = currentPeriodCalls.response;
      previousPeriodCalls = previousPeriodCalls.response;

      // console.log(currentPeriodCalls, previousPeriodCalls);
      
      const lastWeek = currentPeriodCalls.report_summaryList;
      const thisWeek = previousPeriodCalls.report_summaryList;
      console.log(lastWeek, thisWeek);

      // Calculate totals for last week
      const lastWeekTotal = lastWeek.reduce((acc: number, curr: any) => acc + curr.total, 0);
      const lastWeekTotalSuccess = lastWeek.reduce((acc: number, curr: any) => acc + curr.success, 0);
      const lastWeekTotalFailed = lastWeek.reduce((acc: number, curr: any) => acc + curr.failed, 0);

      // Calculate totals for this week
      const thisWeekTotal = thisWeek.reduce((acc: number, curr: any) => acc + curr.total, 0);
      const thisWeekTotalSuccess = thisWeek.reduce((acc: number, curr: any) => acc + curr.success, 0);
      const thisWeekTotalFailed = thisWeek.reduce((acc: number, curr: any) => acc + curr.failed, 0);

      // Calculate percentage changes
      const totalChange = thisWeekTotal > 0
        ? ((lastWeekTotal - thisWeekTotal) / thisWeekTotal) * 100
        : 0;
      const successChange = thisWeekTotalSuccess > 0
        ? ((lastWeekTotalSuccess - thisWeekTotalSuccess) / thisWeekTotalSuccess) * 100
        : 0;
      const failedChange = thisWeekTotalFailed > 0
        ? ((lastWeekTotalFailed - thisWeekTotalFailed) / thisWeekTotalFailed) * 100
        : 0;

      const updatedStats = [
        {
          name: 'Total Calls',
          value: lastWeekTotal.toString(),
          change: `${totalChange.toFixed(1)}%`,
          increasing: totalChange > 0,
          icon: Phone,
        },
        {
          name: 'Successful Calls',
          value: lastWeekTotalSuccess.toString(),
          change: `${successChange.toFixed(1)}%`,
          increasing: successChange > 0,
          icon: MessageSquare,
        },
        {
          name: 'Failed Calls',
          value: lastWeekTotalFailed.toString(),
          change: `${failedChange.toFixed(1)}%`,
          increasing: failedChange > 0,
          icon: Calendar,
        },
      ];

      // Prepare day-wise stats
      const combinedDayStats = [...lastWeek, ...thisWeek].map(day => ({
        date: new Date(day.date).toLocaleDateString(),
        total: day.total,
        success: day.success,
        failed: day.failed,
        pending: day.pending,
        notSent: day.notSent,
        others: day.others,
        refund: day.refund,
      }));

      setStats(updatedStats);
      setDayWiseStats(combinedDayStats);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(Number(selectedRange));
  }, [selectedRange]);

  if (loading) {
    return <div>Loading statistics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-4">
          <Select
            value={selectedRange}
            onValueChange={(value) => setSelectedRange(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline"
            onClick={() => fetchStats(Number(selectedRange))}
          >
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
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
                <span className={stat.increasing ? 'text-green-500' : 'text-red-500'}>
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Day-wise Stats Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Success</TableHead>
                  <TableHead>Failed</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Not Sent</TableHead>
                  <TableHead>Others</TableHead>
                  <TableHead>Refund</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dayWiseStats.map((day, index) => (
                  <TableRow key={index}>
                    <TableCell>{day.date}</TableCell>
                    <TableCell>{day.total}</TableCell>
                    <TableCell>{day.success}</TableCell>
                    <TableCell>{day.failed}</TableCell>
                    <TableCell>{day.pending}</TableCell>
                    <TableCell>{day.notSent}</TableCell>
                    <TableCell>{day.others}</TableCell>
                    <TableCell>{day.refund}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}