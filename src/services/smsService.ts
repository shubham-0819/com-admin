import axios from 'axios';

class SMSService {
  private baseURL: string;
  
  constructor() {
    this.baseURL = 'https://api.example.com';
  }

  // Send an SMS
  async sendSMS(from: string, to: string, message: string, options?: SMSOptions): Promise<SMSResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/sms`, {
        from,
        to,
        message,
        ...options
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get SMS status
  async getSMSStatus(messageId: string): Promise<SMSStatus> {
    try {
      const response = await axios.get(`${this.baseURL}/sms/${messageId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get SMS history for a number
  async getSMSHistory(phoneNumber: string, options?: SMSHistoryOptions): Promise<SMSHistoryResponse> {
    try {
      const response = await axios.get(`${this.baseURL}/sms/history`, {
        params: {
          phoneNumber,
          ...options
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    // Custom error handling logic
    return error?.response?.data || new Error('SMS service error');
  }
}

interface SMSOptions {
  scheduledTime?: Date;
  callbackUrl?: string;
  priority?: 'high' | 'normal' | 'low';
}

interface SMSResponse {
  messageId: string;
  status: string;
  sentTime: string;
}

interface SMSStatus {
  messageId: string;
  status: 'sent' | 'delivered' | 'failed';
  sentTime: string;
  deliveredTime?: string;
  error?: string;
}

interface SMSHistoryOptions {
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

interface SMSHistoryResponse {
  messages: SMSStatus[];
  total: number;
  hasMore: boolean;
}

export default new SMSService(); 