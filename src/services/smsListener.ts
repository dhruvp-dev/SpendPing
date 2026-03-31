// SMS Listener - Disabled for Expo Go compatibility
// Real SMS reading requires native modules not available in Expo Go.
// Use smsSimulator.ts instead for testing.

// import { PermissionsAndroid } from 'react-native';
import { processIncomingSMS } from './smsParser';
import { getBankKeywords } from '../storage/settingsStorage';

export const requestSmsPermissions = async (): Promise<boolean> => {
  // SMS permissions are not available in Expo Go
  // Return true to allow app initialization to proceed
  console.log('[SMS Listener] Permissions stubbed for Expo Go');
  return true;
};

export const startSmsListener = () => {
  // SMS Listener is not available in Expo Go
  // Use simulateSMS() from smsSimulator.ts instead
  console.log('[SMS Listener] Listener stubbed for Expo Go. Use SMS Simulator in Settings.');
};

// Kept for production builds - will work when using a custom dev client
export const handleIncomingSms = async (sender: string, body: string, timestamp: number) => {
  const bankKeywords = await getBankKeywords();
  
  const isBankMessage = bankKeywords.some(keyword => sender.toUpperCase().includes(keyword.toUpperCase()));
  
  if (isBankMessage) {
    await processIncomingSMS(sender, body, timestamp);
  } else {
    console.log(`Ignored message from ${sender}`);
  }
};
