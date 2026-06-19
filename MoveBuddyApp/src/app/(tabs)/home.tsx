import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const [user] = useState({ name: 'Roman', streak: 5 });
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start(() => {
      // Navigacija na aktivnu rutu (Mora imati kosu crtu na početku)
      router.push('/active-route');
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Dobrodošao natrag,</Text>
            <Text style={styles.username}>{user.name} 🔥</Text>
          </View>
          {/* Otvaranje profila */}
          <TouchableOpacity style={styles.avatar} onPress={() => router.push('/profile')}>
            <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
          </TouchableOpacity>
        </View>

        {/* STREAK CARD */}
        <View style={styles.streakCard}>
          <Ionicons name="flame" size={32} color="#FFFFFF" />
          <View style={{ marginLeft: 16 }}>
            <Text style={styles.streakTitle}>{user.streak} Dana u nizu!</Text>
            <Text style={styles.streakSubtitle}>Zadrži ritam, tvoji suputnici te čekaju.</Text>
          </View>
        </View>

        {/* GUMB ZA RUTU */}
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
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContainer: { padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  username: { fontSize: 28, color: '#0F172A', fontWeight: '800', letterSpacing: -0.5 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  streakCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20, backgroundColor: '#FF7A00' },
  streakTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  streakSubtitle: { color: '#FFD6B3', fontSize: 13, fontWeight: '500' },
  actionButton: { backgroundColor: '#3B82F6', padding: 18, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  actionButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' }
});