import RNFS from 'react-native-fs'; // Assuming react-native-fs will be used
import { getTransactions } from '../database/queries';
import { getDBConnection } from '../database/db';

export const backupToJSON = async (): Promise<string> => {
  try {
    const transactions = await getTransactions(10000, 0);

    const db = await getDBConnection();

    const [balanceResults] = await db.executeSql(
      `SELECT * FROM balance_history ORDER BY date DESC`
    );

    const balanceHistory: any[] = [];

    for (let i = 0; i < balanceResults.rows.length; i++) {
      balanceHistory.push(balanceResults.rows.item(i));
    }

    const backupData = {
      transactions,
      balance_history: balanceHistory
    };

    const path = `${RNFS.DocumentDirectoryPath}/spendping_backup.json`;

    await RNFS.writeFile(
      path,
      JSON.stringify(backupData, null, 2),
      "utf8"
    );

    return path;

  } catch (error) {
    console.warn("Backup Error:", error);
    throw error;
  }
};