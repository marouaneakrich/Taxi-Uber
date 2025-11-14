import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTaxiStore } from '../store/useTaxiStore';
import { GlassCard } from '../components/GlassCard';
import { TaxiMarker } from '../components/TaxiMarker';
import { USER_LOCATION } from '../data/locations';

export default function MapScreen() {
  const router = useRouter();
  const { isDayMode, setDayMode } = useTaxiStore();
  const [taxis, setTaxis] = useState([]);

  useEffect(() => {
    const initialTaxis = Array.from({ length: 7 }, (_, i) => ({
      id: i,
      lat: USER_LOCATION.lat + (Math.random() - 0.5) * 0.05,
      lng: USER_LOCATION.lng + (Math.random() - 0.5) * 0.05,
    }));
    setTaxis(initialTaxis);

    // Animate taxis
    const interval = setInterval(() => {
      setTaxis((prev) =>
        prev.map((taxi) => ({
          ...taxi,
          lat: taxi.lat + (Math.random() - 0.5) * 0.002,
          lng: taxi.lng + (Math.random() - 0.5) * 0.002,
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FEF2F2', '#FED7AA', '#FEF3C7']}
        style={StyleSheet.absoluteFill}
      />

      <GlassCard style={styles.header}>
        <Text style={styles.headerTitle}>🚕 Petit Taxi</Text>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => router.push('/history')}
        >
          <Text style={styles.historyIcon}>📋</Text>
        </TouchableOpacity>
      </GlassCard>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          initialRegion={{
            latitude: USER_LOCATION.lat,
            longitude: USER_LOCATION.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {/* User marker */}
          <Marker
            coordinate={{
              latitude: USER_LOCATION.lat,
              longitude: USER_LOCATION.lng,
            }}
            title="You"
            pinColor="blue"
          />

          {/* Taxi markers */}
          {taxis.map((taxi) => (
            <Marker
              key={taxi.id}
              coordinate={{ latitude: taxi.lat, longitude: taxi.lng }}
            >
              <TaxiMarker />
            </Marker>
          ))}
        </MapView>

        {/* Day/Night Toggle */}
        <GlassCard style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, isDayMode && styles.toggleActive]}
            onPress={() => setDayMode(true)}
          >
            <Text style={isDayMode ? styles.toggleTextActive : styles.toggleText}>
              ☀️ Day
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, !isDayMode && styles.toggleActive]}
            onPress={() => setDayMode(false)}
          >
            <Text style={!isDayMode ? styles.toggleTextActive : styles.toggleText}>
              🌙 Night
            </Text>
          </TouchableOpacity>
        </GlassCard>

        {/* Available taxis badge */}
        <GlassCard style={styles.taxisBadge}>
          <Text style={styles.taxisBadgeText}>🚕 {taxis.length} taxis available</Text>
        </GlassCard>
      </View>

      {/* Book button */}
      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => router.push('/booking')}
      >
        <LinearGradient
          colors={['#DC2626', '#EA580C']}
          style={styles.bookButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.bookButtonText}>Book a Taxi</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 16,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  historyButton: {
    padding: 8,
  },
  historyIcon: {
    fontSize: 24,
  },
  mapContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  toggleContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    padding: 4,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  toggleActive: {
    backgroundColor: 'rgba(220, 38, 38, 0.9)',
  },
  toggleText: {
    color: '#6B7280',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: 'white',
    fontWeight: '700',
  },
  taxisBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
  taxisBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  bookButton: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  bookButtonGradient: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

