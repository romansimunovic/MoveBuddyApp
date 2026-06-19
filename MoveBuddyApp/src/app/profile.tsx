import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      "Odjava",
      "Jeste li sigurni da se želite odjaviti?",
      [
        { text: "Odustani", style: "cancel" },
        { 
          text: "Odjavi me", 
          style: "destructive",
          onPress: async () => {
            await SecureStore.deleteItemAsync('jwt_token');
            router.replace('/');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>R</Text>
        </View>
        <Text style={styles.userName}>Roman</Text>
        <Text style={styles.userEmail}>Osijek / Zagreb</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings-outline" size={24} color="#475569" />
          <Text style={styles.menuText}>Postavke računa</Text>
          <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          <Text style={[styles.menuText, { color: '#EF4444' }]}>Odjavi se</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { padding: 20, alignItems: 'flex-end' },
  userInfo: { alignItems: 'center', marginBottom: 40 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { fontSize: 32, color: '#FFFFFF', fontWeight: 'bold' },
  userName: { fontSize: 24, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  userEmail: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  menuContainer: { paddingHorizontal: 24 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  menuText: { flex: 1, fontSize: 16, fontWeight: '500', color: '#1E293B', marginLeft: 16 }
});