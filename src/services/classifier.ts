export const classifyTransaction = (text: string): string => {
  const t = text.toUpperCase();
  if (t.includes('NEFT') || t.includes('RTGS') || t.includes('IMPS')) {
    return 'Bank Transfer';
  }
  if (t.includes('POS') || t.includes('CARD') || t.includes('SWIPE')) {
    return 'Card Payment';
  }
  if (t.includes('ATM') || t.includes('WITHDRAW')) {
    return 'Cash Withdrawal';
  }
  return 'UPI';
};
