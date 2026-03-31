import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { CalendarBlank, CaretDown, ShoppingBag, ForkKnife, Receipt, Car, Funnel } from 'phosphor-react-native';
import { useStore } from '../store/useStore';
import { useNavigation } from '@react-navigation/native';

export const AnalyticsScreen = () => {
  const totalSpent = useStore((s) => s.monthlySpending);
  const categoryData = useStore((s) => s.categoryTotals);
  const loadAnalytics = useStore((s) => s.loadAnalytics);
  const navigation = useNavigation();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadAnalytics();
    });
    return unsubscribe;
  }, [navigation]);

  const getCategoryColor = (category: string) => {
    if (category.includes('Shop')) return '#FB7185';
    if (category.includes('Food')) return '#F59E0B';
    if (category.includes('Bill')) return '#A78BFA';
    if (category.includes('Transport')) return '#10B981';
    return '#64748b';
  };

  const getCategoryIcon = (category: string, color: string) => {
    if (category.includes('Shop')) return <ShoppingBag color={color} size={24} weight="fill" />;
    if (category.includes('Food')) return <ForkKnife color={color} size={24} weight="fill" />;
    if (category.includes('Bill')) return <Receipt color={color} size={24} weight="fill" />;
    if (category.includes('Transport')) return <Car color={color} size={24} weight="fill" />;
    return <ShoppingBag color={color} size={24} weight="fill" />;
  };

  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="bg-teal-900 pt-12 pb-36 px-6 rounded-b-[3rem] shadow-2xl z-10">
        <View className="flex-row justify-between items-start mb-8">
          <View>
            <Text className="text-teal-200/60 text-[10px] font-bold uppercase tracking-widest">Spending Insights</Text>
            <TouchableOpacity className="flex-row items-center mt-1">
              <Text className="text-white font-bold text-3xl mr-1">{currentMonthName}</Text>
              <CaretDown color="#2dd4bf" weight="bold" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity className="w-10 h-10 flex items-center justify-center bg-teal-800/50 rounded-full border border-teal-700/50">
            <CalendarBlank color="white" size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row space-x-3 pb-2 -mx-2 px-2">
            <TouchableOpacity className="px-6 py-2.5 rounded-full bg-teal-400 mr-3">
               <Text className="text-teal-900 text-sm font-bold">Primary</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-6 py-2.5 rounded-full bg-teal-800/40 border border-teal-700/30 mr-3">
               <Text className="text-teal-100 text-sm font-semibold">Savings</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-6 py-2.5 rounded-full bg-teal-800/40 border border-teal-700/30 mr-3">
               <Text className="text-teal-100 text-sm font-semibold">Wallet</Text>
            </TouchableOpacity>
        </ScrollView>

        <View className="mt-8 bg-teal-900/40 p-1.5 rounded-2xl flex-row border border-teal-800/50">
           <TouchableOpacity className="flex-1 py-2 items-center justify-center rounded-xl">
               <Text className="text-teal-300 text-sm font-semibold">Income</Text>
           </TouchableOpacity>
           <TouchableOpacity className="flex-1 py-2 items-center justify-center rounded-xl bg-white shadow-sm">
               <Text className="text-teal-900 text-sm font-semibold">Expense</Text>
           </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 -mt-24 pb-32 z-20" showsVerticalScrollIndicator={false}>
         <View className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl shadow-teal-900/5 flex-col items-center mb-8 border border-slate-100 dark:border-slate-800">
           <View className="w-[200px] h-[200px] rounded-full bg-teal-100/50 dark:bg-teal-900/20 items-center justify-center border-8 border-teal-400">
              <View className="items-center justify-center">
                 <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Spent</Text>
                 <Text className="text-3xl font-black text-teal-900 dark:text-white">₹{totalSpent.toFixed(0)}</Text>
              </View>
           </View>

           <View className="flex-row flex-wrap mt-8 w-full px-4 justify-between">
              {['Shopping', 'Food', 'Bills', 'Transport'].map((cat, i) => (
                 <View key={i} className="flex-row items-center gap-2 mb-3 w-[45%]">
                   <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getCategoryColor(cat) }} />
                   <Text className="text-xs font-semibold text-slate-600 dark:text-slate-300">{cat}</Text>
                 </View>
              ))}
           </View>
         </View>

         <View className="space-y-6 pb-8">
            <View className="flex-row justify-between items-center px-1">
               <Text className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Category Breakdown</Text>
               <TouchableOpacity className="flex-row items-center">
                  <Funnel color="#0d9488" size={20} weight="bold" />
               </TouchableOpacity>
            </View>

            <View className="space-y-5">
               {categoryData.length === 0 && (
                   <Text className="text-center text-slate-400 py-4">No spending data for this month.</Text>
               )}
               {categoryData.map((item, index) => {
                  const percentage = totalSpent > 0 ? ((item.total / totalSpent) * 100).toFixed(0) : 0;
                  const catColor = getCategoryColor(item.category);
                  
                  return (
                     <View key={index} className="space-y-2 mb-4">
                        <View className="flex-row justify-between items-end">
                           <View className="flex-row items-center gap-3">
                              <View className="w-11 h-11 rounded-2xl items-center justify-center" style={{ backgroundColor: `${catColor}20` }}>
                                 {getCategoryIcon(item.category, catColor)}
                              </View>
                              <View>
                                 <Text className="font-bold text-slate-800 dark:text-white text-sm">{item.category}</Text>
                                 <Text className="text-[11px] font-medium text-slate-400">Transactions</Text>
                              </View>
                           </View>
                           <View className="items-end">
                              <Text className="font-bold text-slate-800 dark:text-white">₹{item.total.toFixed(0)}</Text>
                              <Text className="text-[10px] font-bold" style={{ color: catColor }}>{percentage}%</Text>
                           </View>
                        </View>
                        <View className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                           <View className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: catColor }} />
                        </View>
                     </View>
                  );
               })}
            </View>
         </View>
      </ScrollView>
    </View>
  );
};
