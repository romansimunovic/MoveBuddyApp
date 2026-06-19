import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, useColorScheme, Animated, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [user, setUser] = useState({ name: 'Roman', streak: 5 });
  
  // Animacija za gumb "Započni aktivnost"
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animatePress = () => {
  Animated.sequence([
    Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
    Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true })
  ]).start(() => {
    router.push('./active-route'); // Vodi na novo kreirani ekran s mapom!
  });
};

  const colors = {
    bg: isDark ? '#020617' : '#F8FAFC',
    card: isDark ? '#0F172A' : '#FFFFFF',
    text: isDark ? '#F8FAFC' : '#0F172A',
    subText: isDark ? '#94A3B8' : '#64748B',
    border: isDark ? '#1E293B' : '#E2E8F0'
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.subText }]}>Dobrodošao natrag,</Text>
            <Text style={[styles.username, { color: colors.text }]}>{user.name} 🔥</Text>
          </View>
          {/* Klik na avatar vodi na profil */}
          <TouchableOpacity style={styles.avatar} onPress={() => router.push('/profile')}>
            <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
          </TouchableOpacity>
        </View>

        {/* GAMIFICATION WIDGET (STREAK) - Potiče svakodnevno korištenje */}
        <View style={[styles.streakCard, { backgroundColor: '#FF7A00' }]}>
          <Ionicons name="flame" size={32} color="#FFFFFF" />
          <View style={{ marginLeft: 16 }}>
            <Text style={styles.streakTitle}>{user.streak} Dana u nizu!</Text>
            <Text style={styles.streakSubtitle}>Zadrži ritam, tvoji suputnici te čekaju.</Text>
          </View>
        </View>

        {/* GLAVNI KARTON STATISTIKE */}
        <View style={[styles.mainCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.subText }]}>Ovaj tjedan</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>24.5</Text>
              <Text style={[styles.statLabel, { color: colors.subText }]}>Kilometara</Text>
            </View>
            <View style={[styles.statBox, { borderLeftWidth: 1, borderLeftColor: colors.border, borderRightWidth: 1, borderRightColor: colors.border }]}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={[styles.statLabel, { color: colors.subText }]}>Treninga</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>180</Text>
              <Text style={[styles.statLabel, { color: colors.subText }]}>Minuta</Text>
            </View>
          </View>
        </View>

        {/* ANIMIRANI SPORTSKI GUMB */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }], marginTop: 24 }}>
          <TouchableOpacity style={styles.actionButton} onPress={animatePress} activeOpacity={0.9}>
            <Ionicons name="play" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.actionButtonText}>Započni Novu Rutu</Text>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting: { fontSize: 14, fontWeight: '500', letterSpacing: -0.2 },
  username: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
  avatarText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  streakCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20, marginBottom: 24, shadowOpacity: 0.1 },
  streakTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  streakSubtitle: { color: '#FFD6B3', fontSize: 13, fontWeight: '500', marginTop: 2 },
  mainCard: { padding: 24, borderRadius: 24, borderWidth: 1 },
  cardTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  statBox: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: '800', color: '#3B82F6', letterSpacing: -0.5 },
  statLabel: { fontSize: 12, fontWeight: '500', marginTop: 4 },
  actionButton: { backgroundColor: '#3B82F6', padding: 18, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  actionButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: -0.2 }
});