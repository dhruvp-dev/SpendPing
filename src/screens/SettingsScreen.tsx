import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Switch, Alert, TextInput } from 'react-native';
import { CaretRight, Money, Bank, Moon, Bell, CloudArrowUp, Warning, Trash, DeviceMobile, Plus, X } from 'phosphor-react-native';
import { simulateSMS, SAMPLE_SMS } from '../services/smsSimulator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore } from '../store/useStore';

export const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [newKeyword, setNewKeyword] = useState('');
  
  const bankKeywords = useStore((s) => s.bankKeywords);
  const isDarkMode = useStore((s) => s.isDarkMode);
  const setDarkMode = useStore((s) => s.setDarkMode);
  const addBankKeyword = useStore((s) => s.addBankKeyword);
  const removeBankKeyword = useStore((s) => s.removeBankKeyword);

  useEffect(() => {
    (async () => {
      const notif = await AsyncStorage.getItem('notifications');
      if (notif !== null) setNotifications(notif === 'true');
    })();
  }, []);

  const handleNotificationsToggle = async (val: boolean) => {
    setNotifications(val);
    await AsyncStorage.setItem('notifications', val.toString());
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      addBankKeyword(newKeyword.trim().toUpperCase());
      setNewKeyword('');
    }
  };

  const handleSimulateSMS = () => {
    const randomSMS = SAMPLE_SMS[Math.floor(Math.random() * SAMPLE_SMS.length)];
    Alert.alert(
      '📱 Simulate SMS',
      `Send this mock SMS?\n\n"${randomSMS}"`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Simulate',
          onPress: async () => {
            const success = await simulateSMS(randomSMS);
            Alert.alert(
              success ? '✅ Success' : '❌ Failed',
              success ? 'Transaction parsed and saved!' : 'Could not parse SMS.'
            );
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="bg-teal-900 pt-12 pb-32 px-6 rounded-b-[3rem] shadow-2xl">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-teal-200/70 text-xs font-bold uppercase tracking-widest">Configuration</Text>
            <Text className="text-white font-bold text-3xl mt-1">Settings</Text>
          </View>
          <View className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-teal-400/30">
            <Image 
              source={{ uri: 'https://via.placeholder.com/48' }} 
              className="w-full h-full"
            />
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 -mt-20 pb-40" showsVerticalScrollIndicator={false}>
        {/* SMS Simulator Card */}
        <View className="bg-gradient-to-r from-teal-500 to-teal-600 bg-teal-600 rounded-[2.5rem] p-6 shadow-xl mb-6 border border-teal-500">
          <View className="flex-row items-center gap-3 mb-3">
            <View className="w-10 h-10 rounded-xl bg-white/20 items-center justify-center">
              <DeviceMobile color="white" size={22} weight="fill" />
            </View>
            <View>
              <Text className="font-bold text-white text-base">SMS Simulator</Text>
              <Text className="text-teal-100 text-[11px]">Test without real SMS access</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleSimulateSMS}
            className="bg-white rounded-2xl py-3 items-center mt-2"
          >
            <Text className="text-teal-700 font-extrabold text-sm uppercase tracking-wider">Simulate SMS</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-xl shadow-teal-900/5 mb-8 border border-slate-100 dark:border-slate-800">
          <Text className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Preferences</Text>
          
          <View className="flex-row items-center justify-between p-4 bg-teal-50 dark:bg-teal-900/20 rounded-2xl mb-3 border border-teal-100/50 dark:border-teal-800/30">
            <View className="flex-row items-center gap-4">
              <View className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 items-center justify-center shadow-sm">
                <Money color="#0d9488" size={20} />
              </View>
              <View>
                <Text className="font-bold text-slate-800 dark:text-white">Primary Currency</Text>
                <Text className="text-xs text-slate-500">Indian Rupee (INR)</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-1">
              <Text className="text-teal-600 font-bold mr-1">₹</Text>
            </View>
          </View>

          <View className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-2xl border border-teal-100/50 dark:border-teal-800/30">
            <View className="flex-row items-center gap-4 mb-4">
              <View className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 items-center justify-center shadow-sm">
                <Bank color="#0d9488" size={20} />
              </View>
              <View>
                <Text className="font-bold text-slate-800 dark:text-white">SMS Bank Filters</Text>
                <Text className="text-xs text-slate-500">{bankKeywords.length} Banks Tracked</Text>
              </View>
            </View>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {bankKeywords.map((kw) => (
                <View key={kw} className="flex-row items-center bg-teal-600 px-3 py-1.5 rounded-full">
                  <Text className="text-white text-xs font-bold mr-2">{kw}</Text>
                  <TouchableOpacity onPress={() => removeBankKeyword(kw)}>
                    <X color="white" size={12} weight="bold" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View className="flex-row item-center gap-2">
              <TextInput
                value={newKeyword}
                onChangeText={setNewKeyword}
                placeholder="Add keyword (e.g. HDFC)"
                placeholderTextColor="#94a3b8"
                className="flex-1 bg-white dark:bg-slate-800 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-white"
                onSubmitEditing={handleAddKeyword}
              />
              <TouchableOpacity onPress={handleAddKeyword} className="bg-teal-600 w-10 h-10 rounded-xl items-center justify-center">
                <Plus color="white" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="space-y-8">
          <View>
            <Text className="text-lg font-bold text-slate-800 dark:text-white px-1 mb-4">Appearance</Text>
            <View className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 items-center justify-center">
                    <Moon color="#0d9488" size={20} weight="fill" />
                  </View>
                  <View>
                    <Text className="font-semibold text-slate-700 dark:text-slate-200">Dark Mode</Text>
                    <Text className="text-[10px] text-slate-400 font-medium">Toggle global UI theme</Text>
                  </View>
                </View>
                <Switch
                  value={isDarkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: '#cbd5e1', true: '#0d9488' }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>
          </View>

          <View>
            <Text className="text-lg font-bold text-slate-800 dark:text-white px-1 mb-4">App Configuration</Text>
            <View className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
              <View className="flex-row items-center justify-between p-5 border-b border-slate-50 dark:border-slate-800">
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 items-center justify-center">
                    <Bell color="#3b82f6" size={20} weight="fill" />
                  </View>
                  <Text className="font-semibold text-slate-700 dark:text-slate-200">Notifications</Text>
                </View>
                <Switch
                  value={notifications}
                  onValueChange={handleNotificationsToggle}
                  trackColor={{ false: '#cbd5e1', true: '#0d9488' }}
                  thumbColor="#ffffff"
                />
              </View>

              <TouchableOpacity className="flex-row items-center justify-between p-5">
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 items-center justify-center">
                    <CloudArrowUp color="#a855f7" size={20} weight="fill" />
                  </View>
                  <Text className="font-semibold text-slate-700 dark:text-slate-200">Data & Backup</Text>
                </View>
                <CaretRight color="#cbd5e1" size={20} />
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-8">
            <View className="flex-row items-center gap-2 mb-4 px-1">
              <Warning color="#dc2626" size={20} weight="fill" />
              <Text className="text-lg font-bold text-red-600 uppercase text-xs tracking-widest">Danger Zone</Text>
            </View>
            <View className="bg-red-50/50 dark:bg-red-900/10 rounded-3xl overflow-hidden border border-red-100 dark:border-red-900/30 shadow-sm">
              <TouchableOpacity className="w-full flex-row items-center justify-between p-5">
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 items-center justify-center shadow-sm">
                    <Trash color="#dc2626" size={20} weight="fill" />
                  </View>
                  <View>
                    <Text className="font-bold text-red-600">Self Destruct</Text>
                    <Text className="text-[10px] text-red-400 font-medium uppercase tracking-tight">Delete All Data & Account</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <Text className="text-center text-slate-400 text-xs pb-12">Version 2.4.0 (Stable)</Text>
        </View>
      </ScrollView>
    </View>
  );
};
