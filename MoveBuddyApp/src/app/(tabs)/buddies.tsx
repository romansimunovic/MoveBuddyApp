import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, useColorScheme, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { Ionicons } from '@expo/vector-icons';

export default function BuddiesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [activeFilter, setActiveFilter] = useState('Sve');

  const filters = ['Sve', 'Trčanje', 'Šetnja', 'Biciklizam'];

  const initialBuddies = [
    { id: 1, name: 'Ivan Horvat', sport: 'Trčanje', distance: '500m blizu', icon: 'walk' },
    { id: 2, name: 'Marija Pavić', sport: 'Šetnja', distance: '1.2km blizu', icon: 'paw' },
    { id: 3, name: 'Matej Kovač', sport: 'Biciklizam', distance: '3km blizu', icon: 'bicycle' },
  ];

  const filteredBuddies = activeFilter === 'Sve' 
    ? initialBuddies 
    : initialBuddies.filter(b => b.sport === activeFilter);

  const colors = {
    bg: isDark ? '#020617' : '#F8FAFC',
    card: isDark ? '#0F172A' : '#FFFFFF',
    text: isDark ? '#F8FAFC' : '#0F172A',
    subText: isDark ? '#94A3B8' : '#64748B',
    border: isDark ? '#1E293B' : '#E2E8F0'
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.wrapper}>
        <Text style={[styles.title, { color: colors.text }]}>Pronađi Suputnika</Text>
        
        {/* SPORTSKI FILTRI */}
        <View style={{ maxHeight: 50, marginBottom: 16, marginTop: 12 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  { backgroundColor: activeFilter === filter ? '#3B82F6' : colors.card, borderColor: colors.border },
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[styles.filterText, { color: activeFilter === filter ? '#FFFFFF' : colors.text }]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* LISTA KORISNIKA */}
        <FlatList
          data={filteredBuddies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.leftInfo}>
                <View style={styles.sportIconBg}>
                  <Ionicons name={item.icon as any} size={20} color="#3B82F6" />
                </View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={[styles.buddyName, { color: colors.text }]}>{item.name}</Text>
                  <Text style={styles.buddyMeta}>{item.sport} • {item.distance}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionText}>Pozovi</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  wrapper: { flex: 1, padding: 24 },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginTop: 16 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1, height: 38 },
  filterText: { fontSize: 14, fontWeight: '600' },
  card: { padding: 16, borderRadius: 20, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  leftInfo: { flexDirection: 'row', alignItems: 'center' },
  sportIconBg: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center' },
  buddyName: { fontSize: 16, fontWeight: '700', letterSpacing: -0.2 },
  buddyMeta: { fontSize: 13, color: '#64748B', marginTop: 2 },
  actionButton: { backgroundColor: '#10B981', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12 },
  actionText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' }
});