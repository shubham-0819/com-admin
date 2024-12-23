import axios from 'axios';

class CallService {
  private baseURL: string;
  private userId: string;
  private password: string;

  constructor() {
    this.baseURL = 'https://unify.smsgateway.center/VoiceApi';
    this.userId = localStorage.getItem('UNIFY_VOICE_USER_ID') || '';
    this.password = localStorage.getItem('UNIFY_VOICE_PASSWORD') || '';
  }

  // Send immediate voice call
  async sendVoiceCall(params: {
    mobile: string | string[];
    libraryId: string;
    reDial?: string;
    redialInterval?: string;
  }): Promise<any> {
    const formData = new FormData();
    
    formData.append('userid', this.userId);
    formData.append('password', this.password);
    formData.append('mobile', Array.isArray(params.mobile) ? params.mobile.join(',') : params.mobile);
    formData.append('libraryId', params.libraryId);
    formData.append('audioType', 'library');
    formData.append('sendMethod', 'quick');
    formData.append('duplicateCheck', 'true');
    formData.append('reDial', params.reDial || '0');
    formData.append('redialInterval', params.redialInterval || '5');
    formData.append('output', 'json');

    try {
      const response = await axios.post(
        `${this.baseURL}/send`,
        formData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to send voice call');
    }
  }

  // Schedule a voice call
  async scheduleVoiceCall(params: {
    mobile: string | string[];
    libraryId: string;
    scheduleTime: string;
    identifier: string;
    reDial?: string;
    redialInterval?: string;
  }): Promise<any> {
    const formData = new FormData();
    
    formData.append('userid', this.userId);
    formData.append('password', this.password);
    formData.append('mobile', Array.isArray(params.mobile) ? params.mobile.join(',') : params.mobile);
    formData.append('libraryId', params.libraryId);
    formData.append('scheduleTime', params.scheduleTime);
    formData.append('identifier', params.identifier);

    try {
      const response = await axios.post(
        `${this.baseURL}/send`,
        formData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to schedule voice call');
    }
  }

  // Send voice OTP
  async sendVoiceOTP(params: {
    mobile: string | string[];
    pin: string;
    pinClipId: string;
  }): Promise<any> {
    const formData = new FormData();
    
    formData.append('userid', this.userId);
    formData.append('password', this.password);
    formData.append('mobile', Array.isArray(params.mobile) ? params.mobile.join(',') : params.mobile);
    formData.append('pin', params.pin);
    formData.append('pinClipId', params.pinClipId);
    formData.append('sendMethod', 'pin');
    formData.append('output', 'json');

    try {
      const response = await axios.post(
        `${this.baseURL}/send`,
        formData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to send voice OTP');
    }
  }

  // Get delivery report
  async getDeliveryReport(params: {
    fromDate?: string;
    toDate?: string;
    mobile?: string | string[];
    uuid?: string;
  }): Promise<any> {
    const formData = new FormData();
    
    formData.append('userid', this.userId);
    formData.append('password', this.password);
    formData.append('output', 'json');

    if (params.fromDate && params.toDate) {
      formData.append('fromdate', params.fromDate);
      formData.append('todate', params.toDate);
    } else if (params.mobile) {
      formData.append('mobile', Array.isArray(params.mobile) ? params.mobile.join(',') : params.mobile);
    } else if (params.uuid) {
      formData.append('uuid', params.uuid);
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/report/dlr`,
        formData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to get delivery report');
    }
  }

  // Get summary report
  async getSummaryReport(params: {
    fromDate: string;
    toDate: string;
  }): Promise<any> {
    const formData = new FormData();
    
    formData.append('userid', this.userId);
    formData.append('password', this.password);
    formData.append('fromdate', params.fromDate);
    formData.append('todate', params.toDate);
    formData.append('output', 'json');

    try {
      const response = await axios.post(
        `${this.baseURL}/report/summary`,
        formData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to get summary report');
    }
  }

  private handleError(error: any, message: string): Error {
    const errorMessage = error?.response?.data?.message || error.message;
    return new Error(`${message}: ${errorMessage}`);
  }
}

export default new CallService(); 