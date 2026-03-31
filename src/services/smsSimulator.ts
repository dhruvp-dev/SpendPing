import { parseTransactionData, processIncomingSMS } from './smsParser';
import { useStore } from '../store/useStore';

/**
 * SMS Simulator for Expo Go (real SMS access not available)
 * Parses a mock SMS string and inserts the transaction.
 */
export const simulateSMS = async (smsText: string): Promise<boolean> => {
  console.log('SMS Simulator: Received →', smsText);

  const parsed = parseTransactionData(smsText);

  if (!parsed) {
    console.log('SMS Simulator: Could not parse transaction data');
    return false;
  }

  console.log('SMS Parsed', parsed);

  try {
    await processIncomingSMS('SIM-BANK', smsText, Date.now());
    // Reload Zustand store
    const store = useStore.getState();
    await store.loadTransactions();
    await store.loadAnalytics();
    return true;
  } catch (e) {
    console.warn('SMS Simulator: Error processing SMS', e);
    return false;
  }
};

/** Predefined sample SMS messages for testing */
export const SAMPLE_SMS = [
  'INR 250.00 debited from A/c XX1234 via UPI. Avl Bal: INR 14,520.00',
  'Rs 1,500 credited to your account. Avl Balance Rs 16,020',
  'INR 89 debited from your HDFC Bank A/c for POS purchase at Swiggy. Balance: INR 15,931',
  'Your A/c XX5678 is credited with INR 25,000.00 by NEFT. Avl Bal INR 40,931.00',
  'Rs. 450 withdrawn from ATM. Available balance: Rs. 15,033',
];
