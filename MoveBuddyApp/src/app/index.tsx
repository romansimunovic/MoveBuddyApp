import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import api, { readableError, session } from '../services/api';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync('jwt_token')
      .then((token) => { if (token) router.replace('/home'); })
      .finally(() => setChecking(false));
  }, [router]);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Nedostaju podaci', 'Unesite e-mail adresu i lozinku.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', { email: email.trim().toLowerCase(), password });
      if (!data?.token || !data?.userId) throw new Error('Invalid login response');
      await session.save(data.token, { id: data.userId, name: data.name || 'Suputnik', email: email.trim() });
      router.replace('/home');
    } catch (error) {
      Alert.alert('Prijava nije uspjela', readableError(error, 'Provjerite podatke i pokušajte ponovno.'));
    } finally {
      setLoading(false);
    }
  };

  if (checking) return <View style={styles.loading}><ActivityIndicator size="large" color="#1E7A5A" /></View>;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.mark}><Text style={styles.markText}>M</Text></View>
        <Text style={styles.title}>MoveBuddy</Text>
        <Text style={styles.subtitle}>Kreni lakše. Kreni zajedno.</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.heading}>Dobro došli natrag</Text>
        <Text style={styles.copy}>Prijavite se i pronađite motivaciju u pokretu.</Text>
        <TextInput style={styles.input} placeholder="E-mail adresa" placeholderTextColor="#78908A" value={email} onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Lozinka" placeholderTextColor="#78908A" value={password} onChangeText={setPassword} secureTextEntry onSubmitEditing={handleLogin} />
        <TouchableOpacity style={[styles.button, loading && styles.disabled]} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Prijavi se</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/register')} style={styles.link}>
          <Text style={styles.linkText}>Nemaš račun? <Text style={styles.linkStrong}>Registriraj se</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,justifyContent:'center',backgroundColor:'#F1F7F4',padding:24},
  loading:{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#F1F7F4'},
  hero:{alignItems:'center',marginBottom:28},mark:{width:58,height:58,borderRadius:18,backgroundColor:'#1E7A5A',alignItems:'center',justifyContent:'center',marginBottom:12},
  markText:{color:'#FFF',fontSize:27,fontWeight:'900'},title:{fontSize:34,fontWeight:'900',color:'#12372A',letterSpacing:-1},subtitle:{marginTop:5,fontSize:16,color:'#557066'},
  card:{backgroundColor:'#FFF',borderRadius:24,padding:22,shadowColor:'#12372A',shadowOpacity:.08,shadowRadius:18,elevation:3},heading:{fontSize:21,fontWeight:'800',color:'#12372A'},copy:{color:'#557066',marginTop:5,marginBottom:20,lineHeight:20},
  input:{borderWidth:1,borderColor:'#D8E7DF',borderRadius:14,paddingHorizontal:15,paddingVertical:14,color:'#12372A',fontSize:16,marginBottom:12,backgroundColor:'#FBFDFC'},
  button:{marginTop:4,backgroundColor:'#1E7A5A',borderRadius:14,padding:16,alignItems:'center'},disabled:{opacity:.65},buttonText:{color:'#FFF',fontWeight:'800',fontSize:16},
  link:{alignItems:'center',paddingTop:19},linkText:{color:'#557066'},linkStrong:{color:'#1E7A5A',fontWeight:'800'}
});