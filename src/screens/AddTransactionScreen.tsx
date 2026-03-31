import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { X, CurrencyInr, Checks, CalendarBlank, Tag } from 'phosphor-react-native';
import { useStore } from '../store/useStore';
import { useNavigation } from '@react-navigation/native';

const CATEGORIES = ['Food', 'Shopping', 'Transport', 'Bills', 'College', 'Entertainment', 'Health', 'Bank Transfer', 'UPI', 'Other'];

export const AddTransactionScreen = () => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [type, setType] = useState<'Debit' | 'Credit'>('Debit');
  const addTransaction = useStore((s) => s.addTransaction);
  const navigation = useNavigation();

  const handleSave = async () => {
    if (!amount || isNaN(Number(amount))) return;
    try {
      await addTransaction({
        amount: Number(amount),
        category: category || 'Other',
        type,
        date: new Date(date).toISOString(),
        note,
        sms_hash: `manual_${Date.now()}`,
      });
      console.log('DB Insert', { amount, category, type });
      // Reset form
      setAmount('');
      setCategory('');
      setNote('');
      // Navigate back to Home
      navigation.goBack();
    } catch (e) {
      console.warn('Failed to save transaction', e);
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-slate-900">
      <View className="px-6 pt-12 pb-4 flex-row justify-between items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2 rounded-full">
          <X color="#64748b" size={24} />
        </TouchableOpacity>
        <Text className="text-base font-bold tracking-tight text-slate-900 dark:text-white">Add Transaction</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-6 pb-48" showsVerticalScrollIndicator={false}>
        {/* Amount Input */}
        <View className="py-8 flex-col items-center justify-center">
          <Text className="text-[10px] font-bold text-teal-600 uppercase tracking-[0.2em] mb-2 text-center">Enter Amount</Text>
          <View className="flex-row items-center justify-center w-full">
            <CurrencyInr color="#0d9488" size={36} weight="light" />
            <TextInput
              autoFocus
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
              placeholderTextColor="#ccfbf1"
              className="text-6xl font-extrabold text-teal-600 p-0 text-left min-w-[50px]"
            />
          </View>
        </View>

        {/* Type Toggle */}
        <View className="mb-6">
          <Text className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider ml-1 mb-2">Type</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => setType('Debit')}
              className={`flex-1 py-3 rounded-2xl items-center ${type === 'Debit' ? 'bg-rose-500' : 'bg-slate-100'}`}
            >
              <Text className={`font-bold text-sm ${type === 'Debit' ? 'text-white' : 'text-slate-500'}`}>Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setType('Credit')}
              className={`flex-1 py-3 rounded-2xl items-center ${type === 'Credit' ? 'bg-teal-500' : 'bg-slate-100'}`}
            >
              <Text className={`font-bold text-sm ${type === 'Credit' ? 'text-white' : 'text-slate-500'}`}>Income</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Picker */}
        <View className="space-y-2 mb-6">
          <Text className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider ml-1">Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2">
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat)}
                className={`px-4 py-2.5 rounded-full mr-2 ${category === cat ? 'bg-teal-600' : 'bg-slate-100'}`}
              >
                <Text className={`text-sm font-bold ${category === cat ? 'text-white' : 'text-slate-600'}`}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Date */}
        <View className="space-y-2 mb-6">
          <Text className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider ml-1">Date</Text>
          <View className="flex-row items-center bg-slate-50 rounded-2xl p-4">
            <View className="w-8 h-8 rounded-full bg-teal-50 items-center justify-center mr-3">
              <CalendarBlank color="#0d9488" size={18} />
            </View>
            <Text className="flex-1 text-base font-medium text-slate-800">{date}</Text>
          </View>
        </View>

        {/* Note */}
        <View className="space-y-2 pb-6">
          <Text className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider ml-1">Add Note</Text>
          <TextInput
            multiline
            numberOfLines={4}
            value={note}
            onChangeText={setNote}
            placeholder="What was this for? (Optional)"
            placeholderTextColor="#94a3b8"
            className="bg-slate-50 rounded-2xl p-4 text-base min-h-[100px] text-slate-800"
            style={{ textAlignVertical: 'top' }}
          />
        </View>
      </ScrollView>

      {/* Save Button */}
      <View className="absolute bottom-24 left-0 right-0 px-6 z-20">
        <TouchableOpacity 
          onPress={handleSave}
          className="w-full bg-teal-600 rounded-2xl flex-row items-center justify-center py-4 shadow-lg"
        >
          <Checks color="white" weight="bold" />
          <Text className="text-white text-sm tracking-[0.1em] uppercase font-extrabold ml-3">Save Transaction</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
