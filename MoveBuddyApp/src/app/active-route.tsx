import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ActiveRouteScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);
  const [distance, setDistance] = useState(0); // U kilometrima
  const [isTracking, setIsTracking] = useState(true);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    async function startTracking() {
      // 1. Zatraži dopuštenje za lokaciju
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Pristup odbijen', 'MoveBuddy treba pristup lokaciji kako bi pratio rutu.');
        router.back();
        return;
      }

      // 2. Uzmi trenutnu početnu lokaciju
      let currentLoc = await Location.getCurrentPositionAsync({});
      setLocation(currentLoc);

      // 3. Prati promjene lokacije u stvarnom vremenu (svaka 3 metra ili svake 2 sekunde)
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 3, 
          timeInterval: 2000,
        },
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;
          setLocation(newLocation);
          
          if (isTracking) {
            setRouteCoordinates((prev) => {
              const updated = [...prev, { latitude, longitude }];
              if (prev.length > 0) {
                // Izračunaj udaljenost između zadnje dvije točke
                const lastPoint = prev[prev.length - 1];
                const newDist = calculateDistance(lastPoint.latitude, lastPoint.longitude, latitude, longitude);
                setDistance((d) => d + newDist);
              }
              return updated;
            });
          }
        }
      );
    }

    startTracking();

    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, [isTracking]);

  // Haversine formula za izračun udaljenosti između koordinata
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radijus Zemlje u km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleFinishRoute = async () => {
    setIsTracking(false);
    if (locationSubscription.current) locationSubscription.current.remove();
    
    Alert.alert('Ruta završena!', `Uspješno ste pretrčali/prošetali ${distance.toFixed(2)} km. Spremamo podatke na backend...`, [
      { text: 'U redu', onPress: () => router.replace('/home') }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* MAPA */}
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          showsUserLocation={true}
          followsUserLocation={true}
        >
          {/* Crtanje linije kretanja na mapi */}
          <Polyline coordinates={routeCoordinates} strokeWidth={5} strokeColor="#3B82F6" />
        </MapView>
      ) : (
        <View style={styles.loadingBox}>
          <Text style={styles.loadingText}>Lociram GPS signal... 🛰️</Text>
        </View>
      )}

      {/* PANEL SA STATISTIKOM NA DNUU */}
      <View style={styles.statsPanel}>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Udaljenost</Text>
            <Text style={styles.statValue}>{distance.toFixed(2)} km</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Status</Text>
            <Text style={[styles.statValue, { color: '#10B981' }]}>Aktivno</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.stopButton} onPress={handleFinishRoute}>
          <Ionicons name="stop" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.stopButtonText}>Završi i Spremi</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  map: { flex: 1 },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  loadingText: { fontSize: 16, fontWeight: '600', color: '#64748B' },
  statsPanel: { backgroundColor: '#FFFFFF', padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  stat: { alignItems: 'center', flex: 1 },
  statLabel: { fontSize: 12, color: '#64748B', fontWeight: '600', textTransform: 'uppercase' },
  statValue: { fontSize: 24, fontWeight: '800', color: '#0F172A', marginTop: 4 },
  stopButton: { backgroundColor: '#EF4444', padding: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  stopButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' }
});