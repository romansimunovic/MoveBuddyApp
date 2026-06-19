import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true); // Za ekran učitavanja dok provjeravamo token
  const router = useRouter();

  // PROVJERA: Jeste li već prijavljeni?
  useEffect(() => {
    async function checkExistingToken() {
      try {
        const token = await SecureStore.getItemAsync('jwt_token');
        if (token) {
          // Ako token postoji, preskačemo login i idemo ravno na Home
          router.replace('/home');
        }
      } catch (e) {
        console.log('Greška pri čitanju tokena:', e);
      } finally {
        setCheckingAuth(false);
      }
    }
    checkExistingToken();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Polja su prazna', 'Molimo unesite email i lozinku.');
      return;
    }

    setLoading(true);
    try {
// NOVI KOD
const response = await api.post('/api/auth/login', { email, password });      
      if (response.data && response.data.token) {
        await SecureStore.setItemAsync('jwt_token', response.data.token);
        router.replace('/home');
      } else {
        Alert.alert('Greška', 'Backend nije vratio autorizacijski token.');
      }
    } catch (error: any) {
      console.log('Login Error:', error);
      Alert.alert('Neuspješna prijava', 'Provjeri podatke i radi li Spring Boot backend!');
    } finally {
      setLoading(false);
    }
  };

  // Dok provjeravamo token, prikaži čisti loading screen
  if (checkingAuth) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MoveBuddy</Text>
        <Text style={styles.subtitle}>Tvoj suputnik u kretanju</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email adresa"
          placeholderTextColor="#94A3B8"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Lozinka"
          placeholderTextColor="#94A3B8"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Prijavi se</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/register')} style={styles.linkButton}>
          <Text style={styles.linkText}>
            Nemate račun? <Text style={styles.linkTextBold}>Registrirajte se</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 48 },
  title: { fontSize: 40, fontWeight: 'bold', color: '#0F172A', letterSpacing: -1 },
  subtitle: { fontSize: 16, color: '#64748B', marginTop: 4 },
  form: { width: '100%' },
  input: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 16, color: '#0F172A' },
  button: { backgroundColor: '#3B82F6', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8, shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 },
  buttonDisabled: { backgroundColor: '#93C5FD' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  linkButton: { marginTop: 24, alignItems: 'center', padding: 8 },
  linkText: { color: '#64748B', fontSize: 14 },
  linkTextBold: { color: '#3B82F6', fontWeight: 'bold' },
});