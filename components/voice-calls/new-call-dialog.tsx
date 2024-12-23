'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface NewCallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (phoneNumber: string, libraryId: string, schedule?: Date) => Promise<void>;
  libraries: { id: string; name: string }[];
}

export function NewCallDialog({ 
  open, 
  onOpenChange, 
  onSubmit,
  libraries 
}: NewCallDialogProps) {
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [selectedLibrary, setSelectedLibrary] = useState('');
  const [enableRedial, setEnableRedial] = useState(false);
  const [redialInterval, setRedialInterval] = useState('5');
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enableSchedule, setEnableSchedule] = useState(false);
  const [scheduleDateTime, setScheduleDateTime] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const numbers = phoneNumbers.split(',').map(num => num.trim());
      await onSubmit(
        numbers.join(','), 
        selectedLibrary,
        enableSchedule ? new Date(scheduleDateTime) : undefined
      );
    } finally {
      setIsSubmitting(false);
      clearInterval(interval);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Voice Call</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phoneNumbers">Phone Numbers</Label>
            <Input
              id="phoneNumbers"
              placeholder="Enter comma-separated phone numbers"
              value={phoneNumbers}
              onChange={(e) => setPhoneNumbers(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="library">Select Library</Label>
            <Select
              value={selectedLibrary}
              onValueChange={setSelectedLibrary}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a library" />
              </SelectTrigger>
              <SelectContent>
                {libraries.map((library) => (
                  <SelectItem key={library.id} value={library.id}>
                    {library.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="redial">Enable Redial</Label>
            <Switch
              id="redial"
              checked={enableRedial}
              onCheckedChange={setEnableRedial}
            />
          </div>

          {enableRedial && (
            <div className="space-y-2">
              <Label htmlFor="redialInterval">Redial Interval</Label>
              <Select
                value={redialInterval}
                onValueChange={setRedialInterval}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="schedule">Schedule Call</Label>
            <Switch
              id="schedule"
              checked={enableSchedule}
              onCheckedChange={setEnableSchedule}
            />
          </div>

          {enableSchedule && (
            <div className="space-y-2">
              <Label htmlFor="scheduleDateTime">Schedule Date & Time</Label>
              <Input
                id="scheduleDateTime"
                type="datetime-local"
                value={scheduleDateTime}
                onChange={(e) => setScheduleDateTime(e.target.value)}
                required={enableSchedule}
              />
            </div>
          )}

          {isSubmitting && (
            <div className="space-y-2">
              <Label>Processing</Label>
              <Progress value={progress} />
            </div>
          )}

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Start Call'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}