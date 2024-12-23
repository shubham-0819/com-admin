'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Phone, Search, Plus } from 'lucide-react';
import { NewCallDialog } from '@/components/voice-calls/new-call-dialog';
import CallService from '@/src/services/callService';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

// Update interface to match API response
interface CallRecord {
  uuid: string;
  mobile: string;
  status: string;
  duration: string;
  date: string;
  cause?: string;
  deliveryTime: string;
  audioType: string;
  channel: string;
  msgId: number;
  pickUp: number;
  audioLength: number;
  globalErrorCode: number;
  submitTime: number;
  pulse: number;
}

interface DLRResponse {
  identifier: string;
    amount: number;
    deliveryTime: number;
    answeredDuration: number;
    audioType: string;
    channel: string;
    msgId: number;
    cause: string;
    pickUp: number;
    audioLength: number;
    mobileNo: number;
    uuId: string;
    globalErrorCode: number;
    cursorId: number;
    hangUp: number;
    submitTime: number;
    pulse: number;
    status: string;
}

function formatDeliveryTime(deliveryTime: string): string {
  const deliveryDate = new Date(deliveryTime);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - deliveryDate.getTime()) / (1000 * 60));
  
  if (deliveryDate.toDateString() === now.toDateString()) {
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
  }
  
  return deliveryDate.toLocaleTimeString();
}

function CallDetailsDialog({ call, open, onOpenChange }: { 
  call: CallRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!call) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Call Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="font-semibold text-foreground">Phone Number:</div>
            <div className="text-muted-foreground">{call.mobile}</div>
            <div className="font-semibold text-foreground">Status:</div>
            <div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                call.status === 'FAILED' 
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                {call.status}
              </span>
            </div>
            <div className="font-semibold text-foreground">Duration:</div>
            <div className="text-muted-foreground">{call.duration || 'N/A'}</div>
            <div className="font-semibold text-foreground">Audio Type:</div>
            <div className="text-muted-foreground">{call.audioType}</div>
            <div className="font-semibold text-foreground">Channel:</div>
            <div className="text-muted-foreground">{call.channel}</div>
            <div className="font-semibold text-foreground">Message ID:</div>
            <div className="text-muted-foreground">{call.msgId}</div>
            <div className="font-semibold text-foreground">Cause:</div>
            <div className="text-muted-foreground">{call.cause || 'N/A'}</div>
            <div className="font-semibold text-foreground">Submit Time:</div>
            <div className="text-muted-foreground">{new Date(call.submitTime).toLocaleString()}</div>
            <div className="font-semibold text-foreground">Delivery Time:</div>
            <div className="text-muted-foreground">{call.deliveryTime}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function VoiceCallsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewCallDialog, setShowNewCallDialog] = useState(false);
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [callDetails, setCallDetails] = useState<CallRecord | null>(null);
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [showCallDetails, setShowCallDetails] = useState(false);
  const [fromDate, setFromDate] = useState(new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [libraries, setLibraries] = useState<{ id: string; name: string }[]>([
    { id: '1', name: 'Default Library' },
    { id: '2', name: 'Welcome Message' },
    { id: '3', name: 'Payment Reminder' },
    { id: '4', name: 'Appointment Reminder' },
    { id: '5', name: 'Emergency Alert' }
  ]);

  // Fetch call reports when component mounts
  useEffect(() => {
    fetchCallReports();
  }, []);

  const fetchCallReports = async () => {
    try {
      setLoading(true);
      let response = await CallService.getDeliveryReport({
        fromDate,
        toDate
      });

      response = response.response;

      if (response.code == 200) {
        const formattedCalls = response.reports_dlrList.map((call: DLRResponse) => ({
          uuid: Math.random().toString(36).substring(2, 6),
          mobile: call.mobileNo.toString(),
          status: call.status,
          duration: call.answeredDuration ? `${call.answeredDuration}s` : 'N/A',
          date: new Date(call.submitTime).toLocaleDateString(),
          cause: call.cause,
          deliveryTime: new Date(call.deliveryTime).toLocaleString(),
          audioType: call.audioType,
          channel: call.channel,
          msgId: call.msgId,
          pickUp: call.pickUp,
          audioLength: call.audioLength,
          globalErrorCode: call.globalErrorCode,
          submitTime: call.submitTime,
          pulse: call.pulse
        }));
        setCalls(formattedCalls);
      }
    } catch (error) {
      toast.error('Failed to fetch call reports');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewCall = async (phoneNumber: string, libraryId: string) => {
    try {
      const response = await CallService.sendVoiceCall({
        mobile: phoneNumber,
        libraryId
      });

      if (response.status === 'Success') {
        toast.success('Call initiated successfully');
        fetchCallReports(); // Refresh the calls list
      } else {
        toast.error(response.message || 'Failed to initiate call');
      }
    } catch (error) {
      toast.error('Failed to initiate call');
      console.error(error);
    }
  };

  // Filter calls based on search query
  const filteredCalls = calls.filter(call => 
    call.mobile.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 h-screen flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Voice Calls</h2>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={fetchCallReports}
            variant="outline"
            className="border-border"
          >
            <Search className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setShowNewCallDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Call
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4 bg-background">
        <div className="flex items-center space-x-4 min-w-fit">
          <div className="grid grid-cols-2 gap-2 items-center">
            <div className="flex items-center space-x-2">
              <Label className="text-foreground whitespace-nowrap">From:</Label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-40 border-border"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label className="text-foreground whitespace-nowrap">To:</Label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-40 border-border"
              />
            </div>
          </div>
        </div>
        <div className="relative flex-1 flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by phone number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-border"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  fetchCallReports();
                }
              }}
            />
          </div>
          <Button 
            onClick={fetchCallReports}
            variant="secondary"
          >
            Search
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto border rounded-md border-border">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10 after:absolute after:left-0 after:right-0 after:bottom-0 after:border-b after:border-border">
            <TableRow className="border-border hover:bg-muted/50">
              <TableHead className="text-foreground py-2 h-8 bg-background">
                Phone Number
              </TableHead>
              <TableHead className="text-foreground py-2 h-8 bg-background">Status</TableHead>
              <TableHead className="text-foreground py-2 h-8 bg-background">Duration</TableHead>
              <TableHead className="text-foreground py-2 h-8 bg-background">Date & Time</TableHead>
              <TableHead className="text-foreground py-2 h-8 bg-background">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">Loading...</TableCell>
              </TableRow>
            ) : filteredCalls.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">No calls found</TableCell>
              </TableRow>
            ) : (
              filteredCalls.map((call) => (
                <TableRow 
                  key={call.uuid}
                  className="cursor-pointer hover:bg-muted/50 border-border"
                  onClick={() => {
                    setSelectedCall(call);
                    setShowCallDetails(true);
                  }}
                >
                  <TableCell className="text-foreground py-2 h-10">{call.mobile}</TableCell>
                  <TableCell className="py-2 h-10">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      call.status === 'FAILED' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {call.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-foreground py-2 h-10">{call.duration || 'N/A'}</TableCell>
                  <TableCell className="text-foreground py-2 h-10">
                    <div className="flex flex-col">
                      <span>{new Date(call.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDeliveryTime(call.deliveryTime)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2 h-10">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNewCall(call.mobile, 'default-library-id');
                      }}
                      className="hover:bg-muted"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <NewCallDialog
        open={showNewCallDialog}
        onOpenChange={setShowNewCallDialog}
        onSubmit={handleNewCall}
        libraries={libraries}
      />
      
      <CallDetailsDialog
        call={selectedCall}
        open={showCallDetails}
        onOpenChange={setShowCallDetails}
      />
    </div>
  );
}