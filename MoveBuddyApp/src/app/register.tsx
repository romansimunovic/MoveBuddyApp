import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../services/api';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    try {
      // Šaljemo podatke na tvoj Spring Boot /auth/register
      await api.post('/auth/register', { name, email, password });
      Alert.alert('Uspjeh', 'Račun je uspješno kreiran! Prijavite se.', [
        { text: 'OK', onPress: () => router.replace('/') }
      ]);
    } catch (error) {
      Alert.alert('Greška', 'Registracija nije uspjela. Provjeri backend.');
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kreiraj Račun</Text>
      <TextInput style={styles.input} placeholder="Ime i prezime" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email adresa" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Lozinka" value={password} onChangeText={setPassword} secureTextEntry />
      
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registriraj se</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/')} style={styles.linkButton}>
        <Text style={styles.linkText}>Već imate račun? Prijavite se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', justifyContent: 'center', padding: 24 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#0F172A', marginBottom: 32, textAlign: 'center' },
  input: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 16 },
  button: { backgroundColor: '#10B981', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  linkButton: { marginTop: 24, alignItems: 'center' },
  linkText: { color: '#3B82F6', fontSize: 14, fontWeight: '500' }
});