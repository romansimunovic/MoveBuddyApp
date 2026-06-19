import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Početni zasloni izvan tabova */}
      <Stack.Screen name="index" />
      
      {/* Grupa s donjom navigacijom */}
      <Stack.Screen name="(tabs)" />
      
      {/* Zasloni koji se otvaraju preko tabova */}
      <Stack.Screen name="active-route" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ presentation: 'modal' }} />
    </Stack>
  );
}