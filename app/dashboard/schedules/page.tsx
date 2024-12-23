'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Phone, MessageSquare, MoreVertical, Pencil, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const schedules = [
  {
    id: 1,
    type: 'voice',
    phoneNumber: '+1234567890',
    scheduledFor: '2024-03-25 14:30',
    status: 'pending',
  },
  {
    id: 2,
    type: 'sms',
    phoneNumber: '+0987654321',
    scheduledFor: '2024-03-26 09:15',
    status: 'pending',
  },
  // Add more mock data as needed
];

export default function SchedulesPage() {
  const handleEdit = (id: number) => {
    // Add your edit logic here
  };

  const handleDelete = (id: number) => {
    // Add your delete logic here
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Scheduled Tasks</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Scheduled For</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.map((schedule) => (
            <TableRow key={schedule.id}>
              <TableCell>
                <div className="flex items-center">
                  {schedule.type === 'voice' ? (
                    <Phone className="mr-2 h-4 w-4" />
                  ) : (
                    <MessageSquare className="mr-2 h-4 w-4" />
                  )}
                  {schedule.type.charAt(0).toUpperCase() + schedule.type.slice(1)}
                </div>
              </TableCell>
              <TableCell>{schedule.phoneNumber}</TableCell>
              <TableCell>{schedule.scheduledFor}</TableCell>
              <TableCell>
                <Badge
                  variant={schedule.status === 'pending' ? 'default' : 'secondary'}
                >
                  {schedule.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(schedule.id)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(schedule.id)}
                      className="text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Cancel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}