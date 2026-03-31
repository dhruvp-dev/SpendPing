import { create } from 'zustand';
import { getTransactions, insertTransaction as dbInsert, getMonthlySpending, getCategoryTotals, Transaction } from '../database/queries';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBankKeywords, setBankKeywords } from '../storage/settingsStorage';

interface AppState {
  transactions: Transaction[];
  balance: number;
  monthlySpending: number;
  categoryTotals: { category: string; total: number }[];
  bankKeywords: string[];
  isDarkMode: boolean;
  initStore: () => Promise<void>;
  loadTransactions: () => Promise<void>;
  loadAnalytics: () => Promise<void>;
  addTransaction: (t: Omit<Transaction, 'id'>) => Promise<void>;
  addBankKeyword: (keyword: string) => Promise<void>;
  removeBankKeyword: (keyword: string) => Promise<void>;
  setDarkMode: (val: boolean) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  transactions: [],
  balance: 15483, // Mock balance for now
  monthlySpending: 0,
  categoryTotals: [],
  bankKeywords: [],
  isDarkMode: true,

  initStore: async () => {
    const keywords = await getBankKeywords();
    const dm = await AsyncStorage.getItem('darkMode');
    set({ bankKeywords: keywords, isDarkMode: dm !== 'false' });
    await get().loadTransactions();
    await get().loadAnalytics();
  },

  loadTransactions: async () => {
    try {
      const txns = await getTransactions(50, 0);
      set({ transactions: txns });
    } catch (e) {
      console.warn('Store: loadTransactions failed', e);
    }
  },

  loadAnalytics: async () => {
    try {
      const yearMonth = new Date().toISOString().substring(0, 7);
      const spending = await getMonthlySpending(yearMonth);
      const cats = await getCategoryTotals(yearMonth);
      set({ monthlySpending: spending, categoryTotals: cats });
    } catch (e) {
      console.warn('Store: loadAnalytics failed', e);
    }
  },

  addTransaction: async (t) => {
    try {
      await dbInsert({ ...t, amount: Number(t.amount) });
      await get().loadTransactions();
      await get().loadAnalytics();
    } catch (e) {
      console.warn('Store: addTransaction failed', e);
    }
  },

  addBankKeyword: async (keyword) => {
    const current = get().bankKeywords;
    if (!current.includes(keyword)) {
      const updated = [...current, keyword];
      set({ bankKeywords: updated });
      await setBankKeywords(updated);
    }
  },

  removeBankKeyword: async (keyword) => {
    const updated = get().bankKeywords.filter((k) => k !== keyword);
    set({ bankKeywords: updated });
    await setBankKeywords(updated);
  },

  setDarkMode: async (val) => {
    set({ isDarkMode: val });
    await AsyncStorage.setItem('darkMode', val.toString());
  },
}));
