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
import { MessageSquare, Search, Plus } from 'lucide-react';
import { NewSMSDialog } from '@/components/sms/new-sms-dialog';

const messages = [
  {
    id: 1,
    phoneNumber: '+1234567890',
    status: 'Delivered',
    message: 'Hello, this is a test message',
    date: '2024-03-20',
  },
  // Add more mock data as needed
];

export default function SMSPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewSMSDialog, setShowNewSMSDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">SMS Messages</h2>
        <Button onClick={() => setShowNewSMSDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> New SMS
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
            <TableHead>Message</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => (
            <TableRow key={message.id}>
              <TableCell>{message.phoneNumber}</TableCell>
              <TableCell className="max-w-xs truncate">
                {message.message}
              </TableCell>
              <TableCell>{message.status}</TableCell>
              <TableCell>{message.date}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <NewSMSDialog
        open={showNewSMSDialog}
        onOpenChange={setShowNewSMSDialog}
      />
    </div>
  );
}