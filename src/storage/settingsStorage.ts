import AsyncStorage from '@react-native-async-storage/async-storage';

const BANK_KEYWORDS_KEY = 'bank_keywords';
const DEFAULT_KEYWORDS = ['UNIONB', 'HDFCBK', 'SBIINB'];

export const getBankKeywords = async (): Promise<string[]> => {
  try {
    const keywords = await AsyncStorage.getItem(BANK_KEYWORDS_KEY);
    if (keywords !== null) {
      return JSON.parse(keywords);
    }
  } catch (e) {
    // Return default on error
  }
  return DEFAULT_KEYWORDS;
};

export const setBankKeywords = async (keywords: string[]) => {
  try {
    await AsyncStorage.setItem(BANK_KEYWORDS_KEY, JSON.stringify(keywords));
  } catch (e) {
    console.error('Failed to save bank keywords:', e);
  }
};
