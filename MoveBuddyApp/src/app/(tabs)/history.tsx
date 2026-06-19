import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Privremeni podaci za produkcijski izgled
const MOCK_HISTORY = [
  { id: '1', date: '19. Lipnja 2026.', time: '18:30', distance: '4.2 km', duration: '45 min', buddy: 'Matej', type: 'Trčanje' },
  { id: '2', date: '17. Lipnja 2026.', time: '07:15', distance: '2.1 km', duration: '25 min', buddy: 'Solo', type: 'Hodanje' },
];

export default function HistoryScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.7}
      onPress={() => router.push(`./activity-details/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name={item.type === 'Trčanje' ? 'barbell' : 'walk'} size={24} color="#3B82F6" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardDate}>{item.date} • {item.time}</Text>
          <Text style={styles.cardTitle}>{item.type} s {item.buddy}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.headerTitle}>Povijest aktivnosti</Text>
      <FlatList
        data={MOCK_HISTORY}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#0F172A', paddingHorizontal: 24, paddingVertical: 16 },
  listContent: { paddingHorizontal: 24, paddingBottom: 24 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  cardInfo: { flex: 1 },
  cardDate: { fontSize: 13, color: '#64748B', marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
});