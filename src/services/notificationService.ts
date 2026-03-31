// Notifications disabled for Expo Go compatibility
// Uncomment when building for production or using a custom dev client
// import * as Notifications from 'expo-notifications';

export const showTransactionNotification = async (amount: number, category: string) => {
  // Push token logic and notification scheduling disabled
  /*
  await Notifications.requestPermissionsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `₹${amount} transaction detected`,
      body: `Categorized as ${category}. Tap to change.`,
      data: { category },
    },
    trigger: null,
  });
  */
  console.log(`[Notification Stub] ₹${amount} transaction: ${category}`);
};
