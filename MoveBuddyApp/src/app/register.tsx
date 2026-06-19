import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../services/api';
import { AxiosError } from 'axios'; // Importaj AxiosError za tipizaciju

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await api.post('/auth/register', { name, email, password });
      Alert.alert('Uspjeh', 'Račun je kreiran!');
      router.replace('/'); 
    } catch (err) {
      // TypeScript sada zna što je 'err'
      const error = err as AxiosError<{ message?: string }>;
      
      if (error.response) {
        console.log("SERVER ODGOVORIO:", error.response.status);
        console.log("DETALJI GREŠKE:", error.response.data); 
        
        // Ispisujemo poruku koju backend šalje ako postoji
        const message = error.response.data?.message || 'Registracija nije uspjela.';
        Alert.alert('Greška', message);
      } else {
        Alert.alert('Greška', 'Server nije dostupan. Provjeri vezu.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kreiraj Račun</Text>
      
      {/* Dodan placeholderTextColor za bolju vidljivost */}
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
  input: { 
    backgroundColor: '#FFFFFF', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: '#94A3B8', // Malo tamniji okvir za bolji kontrast
    fontSize: 16,
    color: '#000000' // Eksplicitno crna slova za bolju čitljivost
  },
  button: { backgroundColor: '#10B981', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  linkButton: { marginTop: 24, alignItems: 'center' },
  linkText: { color: '#3B82F6', fontSize: 14, fontWeight: '500' }
});