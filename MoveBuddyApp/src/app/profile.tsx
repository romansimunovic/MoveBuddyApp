import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('jwt_token');
    router.replace('/');
  };

  const colors = {
    bg: isDark ? '#020617' : '#F8FAFC',
    card: isDark ? '#0F172A' : '#FFFFFF',
    text: isDark ? '#F8FAFC' : '#0F172A',
    border: isDark ? '#1E293B' : '#E2E8F0'
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* ZATVORI GUMB */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: colors.text }]}>Moj Profil</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* VELIKI AVATAR */}
        <View style={styles.avatarBig}>
          <Text style={styles.avatarBigText}>R</Text>
        </View>

        <Text style={[styles.name, { color: colors.text }]}>Roman Šimunović</Text>
        <Text style={styles.email}>roman@movebuddy.com</Text>

        {/* POSTAVKE / ACCESSIBILITY */}
        <View style={[styles.menu, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.menuItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="contrast-outline" size={20} color="#3B82F6" />
              <Text style={[styles.menuText, { color: colors.text }]}>Tema sustava</Text>
            </View>
            <Text style={{ color: '#64748B', fontWeight: '600' }}>{isDark ? 'Tamna' : 'Svijetla'}</Text>
          </View>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Odjavi se iz aplikacije</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16 },
  closeButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  navTitle: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  content: { flex: 1, alignItems: 'center', padding: 24, marginTop: 20 },
  avatarBig: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarBigText: { color: '#FFFFFF', fontSize: 40, fontWeight: 'bold' },
  name: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  email: { fontSize: 14, color: '#64748B', marginTop: 4 },
  menu: { width: '100%', borderRadius: 20, borderWidth: 1, padding: 16, marginTop: 32 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  menuText: { fontSize: 16, fontWeight: '600', marginLeft: 12 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', marginTop: 'auto', marginBottom: 24, padding: 16 },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: '700' }
});