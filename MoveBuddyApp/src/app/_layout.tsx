import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="active-route" />
      <Stack.Screen name="profile" options={{ presentation: 'modal' }} />
      {/* NOVO: Ekran za detalje pojedinačne rute */}
      <Stack.Screen name="activity-details/[id]" options={{ presentation: 'card' }} />
    </Stack>
  );
}