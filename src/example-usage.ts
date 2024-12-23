import callService from './services/callService';
import smsService from './services/smsService';

// Using call service
async function makeCall() {
  try {
    const call = await callService.sendVoiceCall({
      mobile: '+1234567890',
      libraryId: '+0987654321'
    });
    console.log('Call initiated:', call.callId);
  } catch (error) {
    console.error('Error making call:', error);
  }
}

// Using SMS service
async function sendMessage() {
  try {
    const sms = await smsService.sendSMS(
      '+1234567890',
      '+0987654321',
      'Hello from the app!',
      { priority: 'high' }
    );
    console.log('Message sent:', sms.messageId);
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
} 