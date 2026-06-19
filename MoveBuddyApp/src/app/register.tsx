import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../services/api';
import { AxiosError } from 'axios';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // NOVO
  const router = useRouter();

  const handleRegister = async () => {
    // 1. Osnovna validacija
    if (!name || !email || !password) {
      Alert.alert('Greška', 'Molimo popunite sva polja.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Greška', 'Lozinka mora imati barem 6 znakova.');
      return;
    }

    setLoading(true);
    try {
      // NOVI KOD
await api.post('/api/auth/register', { name, email, password });
      Alert.alert('Uspjeh', 'Račun je kreiran! Prijavite se.');
      router.replace('/'); 
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      
      console.log("DETALJI GREŠKE:", error.response?.data); 
      
      const message = error.response?.data?.message || 'Registracija nije uspjela. Provjerite vezu.';
      Alert.alert('Greška pri registraciji', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>Kreiraj Račun</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Ime i prezime" 
        value={name} 
        onChangeText={setName} 
        placeholderTextColor="#64748B" 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Email adresa" 
        value={email} 
        onChangeText={setEmail} 
        autoCapitalize="none" 
        keyboardType="email-address" 
        placeholderTextColor="#64748B" 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Lozinka" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        placeholderTextColor="#64748B" 
      />
      
      <TouchableOpacity 
        style={[styles.button, loading && { opacity: 0.7 }]} 
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Registriraj se</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/')} style={styles.linkButton}>
        <Text style={styles.linkText}>Već imate račun? Prijavite se</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', justifyContent: 'center', padding: 24 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#0F172A', marginBottom: 32, textAlign: 'center' },
  input: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#94A3B8', fontSize: 16 },
  button: { backgroundColor: '#10B981', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  linkButton: { marginTop: 24, alignItems: 'center' },
  linkText: { color: '#3B82F6', fontSize: 14, fontWeight: '500' }
});