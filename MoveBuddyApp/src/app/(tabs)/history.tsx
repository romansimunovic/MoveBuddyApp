import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import api from '../../services/api';

interface Activity {
  id: number;
  type: string;
  distance: string;
  duration: string;
  date: string;
}

export default function HistoryScreen() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        // Poziv na tvoj Spring Boot endpoint za dohvat aktivnosti
        const response = await api.get('/activities/history').catch(() => ({
          data: [
            { id: 1, type: 'Trčanje', distance: '5.2 km', duration: '28 min', date: 'Jučer' },
            { id: 2, type: 'Jutarnja šetnja', distance: '3.1 km', duration: '45 min', date: '15.06.2026.' },
            { id: 3, type: 'Vožnja bicikla', distance: '12.0 km', duration: '35 min', date: '12.06.2026.' },
          ]
        }));
        setActivities(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchHistory();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Moja Povijest</Text>
        <Text style={styles.subtitle}>Pregled tvojih prethodnih aktivnosti:</Text>

        <FlatList
          data={activities}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View>
                <Text style={styles.activityType}>{item.type}</Text>
                <Text style={styles.activityDate}>{item.date}</Text>
              </View>
              <View style={styles.statsContainer}>
                <Text style={styles.statDist}>{item.distance}</Text>
                <Text style={styles.statDur}>{item.duration}</Text>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  wrapper: { flex: 1, padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0F172A', marginTop: 16 },
  subtitle: { fontSize: 15, color: '#64748B', marginBottom: 24, marginTop: 4 },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  activityType: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
  activityDate: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
  statsContainer: { alignItems: 'flex-end' },
  statDist: { fontSize: 16, fontWeight: 'bold', color: '#3B82F6' },
  statDur: { fontSize: 12, color: '#64748B', marginTop: 2 }
});