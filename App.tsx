import React, { useEffect } from 'react';
import './global.css';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomTabs } from './src/navigation/BottomTabs';
import { getDBConnection, createTables } from './src/database/db';
import { useStore } from './src/store/useStore';
import { useColorScheme } from 'nativewind';

export default function App() {
  const { setColorScheme } = useColorScheme();
  const isDarkMode = useStore((s) => s.isDarkMode);

  useEffect(() => {
    initApp();
  }, []);

  useEffect(() => {
    setColorScheme(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const initApp = async () => {
    try {
      const db = await getDBConnection();
      await createTables(db);
      console.log('DB initialized');

      await useStore.getState().initStore();
    } catch (e) {
      console.warn('Failed to initialize app: ', e);
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? "#0f766e" : "#f8fafc"} />
      <NavigationContainer>
        <BottomTabs />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
