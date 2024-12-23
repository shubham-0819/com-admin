'use client';

import { useState } from 'react';
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

const calls = [
  {
    id: 1,
    phoneNumber: '+1234567890',
    status: 'Completed',
    duration: '2:30',
    date: '2024-03-20',
  },
  // Add more mock data as needed
];

export default function VoiceCallsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewCallDialog, setShowNewCallDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Voice Calls</h2>
        <Button onClick={() => setShowNewCallDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Call
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Phone Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calls.map((call) => (
            <TableRow key={call.id}>
              <TableCell>{call.phoneNumber}</TableCell>
              <TableCell>{call.status}</TableCell>
              <TableCell>{call.duration}</TableCell>
              <TableCell>{call.date}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <NewCallDialog
        open={showNewCallDialog}
        onOpenChange={setShowNewCallDialog}
      />
    </div>
  );
}