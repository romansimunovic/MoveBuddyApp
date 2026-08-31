import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api, { readableError, session } from '../services/api';

type Point = { latitude: number; longitude: number };
const kilometresBetween = (a: Point, b: Point) => {
  const radius = 6371;
  const dLat = (b.latitude - a.latitude) * Math.PI / 180;
  const dLon = (b.longitude - a.longitude) * Math.PI / 180;
  const value = Math.sin(dLat / 2) ** 2 + Math.cos(a.latitude * Math.PI / 180) * Math.cos(b.latitude * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
};

export default function ActiveRouteScreen() {
  const router = useRouter();
  const subscription = useRef<Location.LocationSubscription | null>(null);
  const startedAt = useRef(Date.now());
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [distance, setDistance] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    const start = async () => {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Lokacija nije dopuštena', 'Za praćenje rute dopustite lokaciju u postavkama uređaja.');
        router.back(); return;
      }
      const initial = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      if (!active) return;
      setLocation(initial);
      setPoints([{ latitude: initial.coords.latitude, longitude: initial.coords.longitude }]);
      subscription.current = await Location.watchPositionAsync({ accuracy: Location.Accuracy.High, distanceInterval: 5, timeInterval: 3000 }, (next) => {
        const point = { latitude: next.coords.latitude, longitude: next.coords.longitude };
        setLocation(next);
        setPoints((previous) => {
          const last = previous[previous.length - 1];
          if (last) {
            const addition = kilometresBetween(last, point);
            if (addition < 0.15) setDistance((current) => current + addition);
          }
          return [...previous, point];
        });
      });
    };
    start().catch(() => Alert.alert('GPS nije dostupan', 'Pokušajte ponovno na uređaju s uključenom lokacijom.'));
    return () => { active = false; subscription.current?.remove(); };
  }, [router]);

  const finish = async () => {
    subscription.current?.remove();
    const user = await session.user();
    if (!user) { router.replace('/'); return; }
    const duration = Math.max(1, Math.round((Date.now() - startedAt.current) / 60000));
    setSaving(true);
    try {
      await api.post('/api/activities', { userId: user.id, activityType: 'Šetnja', duration, distance: Math.max(0.01, Number(distance.toFixed(3))) });
      Alert.alert('Odlično odrađeno!', `Spremljeno: ${distance.toFixed(2)} km za ${duration} min.`, [{ text:'Pogledaj povijest', onPress: () => router.replace('/history') }]);
    } catch (error) {
      Alert.alert('Ruta je završena, ali nije spremljena', readableError(error, 'Provjerite vezu pa pokušajte novu rutu.'));
    } finally { setSaving(false); }
  };

  return <View style={styles.container}>
    {location ? <MapView style={StyleSheet.absoluteFill} initialRegion={{latitude:location.coords.latitude,longitude:location.coords.longitude,latitudeDelta:.008,longitudeDelta:.008}} showsUserLocation followsUserLocation>
      {points.length > 1 && <Polyline coordinates={points} strokeColor="#1E7A5A" strokeWidth={5} />}
    </MapView> : <View style={styles.loader}><ActivityIndicator size="large" color="#1E7A5A"/><Text style={styles.loaderText}>Tražimo GPS signal…</Text></View>}
    <View style={styles.panel}><View style={styles.stats}><View><Text style={styles.label}>UDALJENOST</Text><Text style={styles.value}>{distance.toFixed(2)} <Text style={styles.unit}>km</Text></Text></View><View style={styles.live}><Ionicons name="radio" size={15} color="#1E7A5A"/><Text style={styles.liveText}>Ruta aktivna</Text></View></View>
      <TouchableOpacity style={[styles.stop, saving && styles.dim]} onPress={finish} disabled={saving}>{saving ? <ActivityIndicator color="#FFF"/> : <><Ionicons name="checkmark-circle" size={21} color="#FFF"/><Text style={styles.stopText}>Završi i spremi</Text></>}</TouchableOpacity>
    </View>
  </View>;
}
const styles=StyleSheet.create({container:{flex:1,backgroundColor:'#E7F1EC'},loader:{flex:1,alignItems:'center',justifyContent:'center'},loaderText:{marginTop:13,color:'#557066',fontWeight:'600'},panel:{backgroundColor:'#FFF',padding:22,paddingBottom:30,borderTopLeftRadius:28,borderTopRightRadius:28,shadowColor:'#000',shadowOpacity:.15,shadowRadius:18,elevation:8},stats:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:18},label:{fontSize:11,fontWeight:'800',letterSpacing:1,color:'#78908A'},value:{fontSize:30,fontWeight:'900',color:'#12372A',marginTop:3},unit:{fontSize:16},live:{flexDirection:'row',gap:6,alignItems:'center',backgroundColor:'#EAF7F0',paddingHorizontal:10,paddingVertical:7,borderRadius:99},liveText:{color:'#1E7A5A',fontWeight:'700',fontSize:12},stop:{backgroundColor:'#1E7A5A',borderRadius:15,padding:16,alignItems:'center',justifyContent:'center',flexDirection:'row',gap:8},stopText:{color:'#FFF',fontSize:16,fontWeight:'800'},dim:{opacity:.65}});
