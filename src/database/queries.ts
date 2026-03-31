import { getDBConnection } from './db';

export interface Transaction {
  id?: number;
  amount: number;
  category: string;
  note?: string;
  type: string;
  date: string;
  sms_hash: string;
}

export const insertTransaction = async (t: Transaction): Promise<void> => {
  const db = await getDBConnection();
  if (!db) return;
  const query = `
    INSERT INTO transactions (amount, category, note, type, date, sms_hash) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  try {
    await db.runAsync(query, [
      Number(t.amount),
      t.category,
      t.note || '',
      t.type,
      t.date,
      t.sms_hash
    ]);
  } catch (error: any) {
    if (error && error.message && error.message.includes('UNIQUE constraint failed')) {
      console.log('Transaction already exists, skipping.');
    } else {
      throw error;
    }
  }
};

export const getTransactions = async (limit: number = 50, offset: number = 0): Promise<Transaction[]> => {
  const db = await getDBConnection();
  if (!db) return [];
  const query = `SELECT * FROM transactions ORDER BY date DESC LIMIT ? OFFSET ?`;
  const results = await db.getAllAsync<Transaction>(query, [limit, offset]);
  return results;
};

export const getMonthlySpending = async (yearMonth: string): Promise<number> => {
  const db = await getDBConnection();
  if (!db) return 0;
  const query = `
    SELECT SUM(amount) as total 
    FROM transactions 
    WHERE type = 'Debit' AND date LIKE ?
  `;
  const result = await db.getFirstAsync<{total: number}>(query, [`${yearMonth}%`]);
  return result?.total || 0;
};

export const getCategoryTotals = async (yearMonth: string): Promise<{category: string, total: number}[]> => {
  const db = await getDBConnection();
  if (!db) return [];
  const query = `
    SELECT category, SUM(amount) as total 
    FROM transactions 
    WHERE type = 'Debit' AND date LIKE ? 
    GROUP BY category
    ORDER BY total DESC
  `;
  const results = await db.getAllAsync<{category: string, total: number}>(query, [`${yearMonth}%`]);
  return results;
};

export const insertBalance = async (balance: number, date: string): Promise<void> => {
  const db = await getDBConnection();
  if (!db) return;
  const query = `INSERT INTO balance_history (balance, date) VALUES (?, ?)`;
  await db.runAsync(query, [Number(balance), date]);
};
