import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          <span className="block">Communications Platform</span>
          <span className="block text-primary mt-2">Voice Calls & SMS Made Simple</span>
        </h1>
        
        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
          Streamline your communications with our powerful platform. Send voice calls and SMS messages with ease, schedule communications, and manage everything from one dashboard.
        </p>

        <div className="mt-12">
          <Link href="/login">
            <Button size="lg" className="px-8">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Voice Calls</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Make voice calls to single or multiple recipients. Schedule calls for later or send them immediately.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">SMS Messaging</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Send SMS messages to your contacts. Perfect for notifications, reminders, and bulk messaging campaigns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}