import React, { useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Wallet, TrendDown, MagnifyingGlass, Receipt, GraduationCap, ForkKnife, ShoppingBag, Plus } from 'phosphor-react-native';
import { useStore } from '../store/useStore';
import { useNavigation } from '@react-navigation/native';

export const DashboardScreen = () => {
  const transactions = useStore((s) => s.transactions);
  const monthlySpending = useStore((s) => s.monthlySpending);
  const balance = useStore((s) => s.balance);
  const loadTransactions = useStore((s) => s.loadTransactions);
  const loadAnalytics = useStore((s) => s.loadAnalytics);
  const navigation = useNavigation();

  // Reload data when screen focuses
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadTransactions();
      loadAnalytics();
    });
    return unsubscribe;
  }, [navigation]);

  const recentTransactions = transactions.slice(0, 5);

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      {/* Header section */}
      <View className="h-[34%] w-full bg-teal-800 px-6 pt-14 pb-8 overflow-hidden">
        <View className="flex-row justify-between items-center mb-6 z-10">
          <View className="flex-row items-center gap-3">
             <View className="w-10 h-10 rounded-full border-2 border-teal-400 p-1">
                <Image source={{ uri: 'https://via.placeholder.com/40' }} className="w-full h-full rounded-full" />
             </View>
             <View>
               <Text className="text-teal-100 text-[10px] font-bold uppercase tracking-wider">Welcome back,</Text>
               <Text className="text-lg font-bold text-white leading-none">Alex Johnson</Text>
             </View>
          </View>
        </View>

        <View className="flex-row gap-4 z-10 w-full">
          <View className="bg-white/10 p-4 rounded-3xl flex-col justify-between flex-1 aspect-[1.4/1]">
            <View className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
               <Wallet color="white" weight="fill" />
            </View>
            <View>
              <Text className="text-[10px] text-teal-50 uppercase font-bold tracking-wider opacity-70 mb-1">Main Balance</Text>
              <Text className="text-xl font-bold text-white tracking-tight">₹ {balance.toLocaleString('en-IN')}</Text>
            </View>
          </View>
          <View className="bg-white/10 p-4 rounded-3xl flex-col justify-between flex-1 aspect-[1.4/1]">
            <View className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
               <TrendDown color="white" weight="fill" />
            </View>
            <View>
              <Text className="text-[10px] text-teal-50 uppercase font-bold tracking-wider opacity-70 mb-1">Expenses</Text>
              <Text className="text-xl font-bold text-white tracking-tight">₹ {monthlySpending.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 bg-white dark:bg-slate-900 rounded-t-[2.5rem] -mt-6 z-20 px-6 pt-8 space-y-8">
        <View className="flex-row items-center justify-between mb-4">
          <View className="bg-teal-50 dark:bg-teal-900/20 px-4 py-2.5 rounded-2xl border border-teal-100">
             <Text className="text-xs font-bold text-teal-800">Monthly Spending</Text>
          </View>
          <TouchableOpacity className="p-2">
             <MagnifyingGlass color="gray" weight="bold" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View className="space-y-4 mb-8">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-5 -mx-2 px-2 pb-2">
             <View className="items-center mr-4">
               <View className="w-16 h-16 rounded-3xl bg-teal-50 justify-center items-center mb-2">
                 <Receipt color="#0D9488" size={24} weight="fill" />
               </View>
               <Text className="text-[11px] font-bold text-slate-600">Bills</Text>
             </View>
             <View className="items-center mr-4">
               <View className="w-16 h-16 rounded-3xl bg-teal-50 justify-center items-center mb-2">
                 <GraduationCap color="#0D9488" size={24} weight="fill" />
               </View>
               <Text className="text-[11px] font-bold text-slate-600">College</Text>
             </View>
             <View className="items-center mr-4">
               <View className="w-16 h-16 rounded-3xl bg-teal-50 justify-center items-center mb-2">
                 <ForkKnife color="#0D9488" size={24} weight="fill" />
               </View>
               <Text className="text-[11px] font-bold text-slate-600">Food</Text>
             </View>
             <View className="items-center mr-4">
               <View className="w-16 h-16 rounded-3xl bg-teal-50 justify-center items-center mb-2">
                 <ShoppingBag color="#0D9488" size={24} weight="fill" />
               </View>
               <Text className="text-[11px] font-bold text-slate-600">Shop</Text>
             </View>
          </ScrollView>
        </View>

        <View className="space-y-4 pb-32">
          <View className="flex-row justify-between items-center mb-4">
             <Text className="font-extrabold text-lg text-slate-800">Recent Activity</Text>
             <Text className="text-teal-600 text-xs font-bold uppercase tracking-tight">View All</Text>
          </View>
          
          {recentTransactions.length === 0 && (
            <Text className="text-center text-slate-400 py-8">No transactions yet. Tap + to add one!</Text>
          )}

          {recentTransactions.map((tx, idx) => (
            <View key={tx.id ?? idx} className="bg-white p-4 rounded-[2rem] border border-slate-50 flex-row justify-between items-center mb-4 shadow-sm">
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-2xl bg-orange-50 justify-center items-center">
                  <ShoppingBag color="#EA580C" />
                </View>
                <View>
                  <Text className="font-bold text-sm text-slate-800">{tx.category}</Text>
                  <Text className="text-[11px] font-medium text-slate-400">{new Date(tx.date).toLocaleString()}</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className={`font-bold text-sm ${tx.type === 'Debit' ? 'text-slate-900' : 'text-teal-600'}`}>
                  {tx.type === 'Debit' ? '-' : '+'} ₹ {tx.amount.toFixed(2)}
                </Text>
                <Text className={`text-[10px] font-bold uppercase tracking-widest ${tx.type === 'Debit' ? 'text-rose-500' : 'text-teal-500'}`}>
                  {tx.type}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
