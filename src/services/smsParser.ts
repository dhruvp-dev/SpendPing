import { classifyTransaction } from './classifier';
import { generateHash } from '../utils/hash';
import { insertTransaction, insertBalance } from '../database/queries';
import { showTransactionNotification } from './notificationService';

export const parseTransactionData = (text: string): { amount: number; type: string; balance?: number } | null => {
  const amountMatch = text.match(/(?:INR|Rs\.?|₹)\s*([\d,]+\.?\d*)/i);
  if (!amountMatch || !amountMatch[1]) return null;

  const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  const isCredit = /(credited|deposited|added|cr)/i.test(text);
  const type = isCredit ? 'Credit' : 'Debit';

  const balanceMatch = text.match(/(?:bal|balance|avl bal|available balance).*?(?:INR|Rs\.?|₹)?\s*([\d,]+\.?\d*)/i);
  let balance = undefined;
  if (balanceMatch && balanceMatch[1]) {
    balance = parseFloat(balanceMatch[1].replace(/,/g, ''));
  }

  return { amount, type, balance };
};

export const processIncomingSMS = async (sender: string, body: string, timestamp: number) => {
  const transactionData = parseTransactionData(body);
  
  if (transactionData) {
    const amountStr = transactionData.amount.toString();
    const sms_hash = generateHash(sender + amountStr + timestamp.toString());
    const category = classifyTransaction(body);

    try {
      await insertTransaction({
        amount: transactionData.amount,
        type: transactionData.type,
        category,
        date: new Date(timestamp).toISOString(),
        sms_hash
      });
      
      await showTransactionNotification(transactionData.amount, category);
      
      if (transactionData.balance) {
        await insertBalance(transactionData.balance, new Date(timestamp).toISOString());
      }
    } catch (e) {
      console.warn('processIncomingSMS Error: ', e);
    }
  }
};
