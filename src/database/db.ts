import * as SQLite from 'expo-sqlite';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export const getDBConnection = async () => {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('spendping.db');
  }
  return dbInstance;
};

export const createTables = async (db: SQLite.SQLiteDatabase) => {
  const transactionsQuery = `
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      note TEXT,
      type TEXT NOT NULL,
      date TEXT NOT NULL,
      sms_hash TEXT UNIQUE NOT NULL
    );
  `;

  const balanceHistoryQuery = `
    CREATE TABLE IF NOT EXISTS balance_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      balance REAL NOT NULL,
      date TEXT NOT NULL
    );
  `;
  
  // Create indexes to optimize analytics queries
  const indexDateQuery = `CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions (date);`;
  const indexCategoryQuery = `CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions (category);`;

  await db.execAsync(transactionsQuery);
  await db.execAsync(balanceHistoryQuery);
  await db.execAsync(indexDateQuery);
  await db.execAsync(indexCategoryQuery);
};
