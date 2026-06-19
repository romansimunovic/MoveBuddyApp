import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ActivityDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Ovdje bi išao Axios poziv prema tvom Render backendu: api.get(`/routes/${id}`)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalji rute</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <View style={styles.mapPlaceholder}>
        <Ionicons name="map-outline" size={48} color="#94A3B8" />
        <Text style={styles.mapText}>Karta se učitava...</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Udaljenost</Text>
          <Text style={styles.statValue}>4.2 km</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Vrijeme</Text>
          <Text style={styles.statValue}>45 min</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Tempo</Text>
          <Text style={styles.statValue}>10:42 /km</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  mapPlaceholder: { height: 250, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', margin: 20, borderRadius: 16 },
  mapText: { marginTop: 12, color: '#64748B', fontWeight: '500' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  statBox: { flex: 1, backgroundColor: '#F8FAFC', padding: 16, borderRadius: 16, marginHorizontal: 4, alignItems: 'center' },
  statLabel: { fontSize: 12, color: '#64748B', marginBottom: 8, textTransform: 'uppercase', fontWeight: '600' },
  statValue: { fontSize: 18, fontWeight: '800', color: '#0F172A' }
});