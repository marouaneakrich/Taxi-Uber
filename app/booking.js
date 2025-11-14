import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTaxiStore } from '../store/useTaxiStore';
import { GlassCard } from '../components/GlassCard';
import { CASABLANCA_LOCATIONS, DRIVER_PROFILES, RATE_CONFIG } from '../data/locations';
import { calculateDistance, calculatePrice, calculateEstimatedTime } from '../utils/distance';

export default function BookingScreen() {
  const router = useRouter();
  const { isDayMode, setActiveRide } = useTaxiStore();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState(0);
  const [price, setPrice] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (pickup && destination) {
      const p = CASABLANCA_LOCATIONS.find((l) => l.name === pickup);
      const d = CASABLANCA_LOCATIONS.find((l) => l.name === destination);
      if (p && d) {
        const dist = calculateDistance(p.lat, p.lng, d.lat, d.lng);
        setDistance(dist);
        setPrice(calculatePrice(dist, isDayMode, RATE_CONFIG.BASE_FARE));
        setTime(calculateEstimatedTime(dist));
      }
    }
  }, [pickup, destination, isDayMode]);

  const handleConfirm = () => {
    const driver = DRIVER_PROFILES[Math.floor(Math.random() * DRIVER_PROFILES.length)];
    setActiveRide({
      id: Date.now(),
      pickup,
      destination,
      distance,
      estimatedPrice: price,
      startTime: Date.now(),
      driver,
      isDayMode,
    });
    router.push('/ride');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FEF2F2', '#FED7AA', '#FEF3C7']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView style={styles.scrollView}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        {/* Rate indicator */}
        <GlassCard style={styles.rateCard}>
          <View style={styles.rateHeader}>
            <Text style={styles.rateLabel}>Current Rate</Text>
            <Text style={styles.rateValue}>
              {isDayMode ? '☀️ Day' : '🌙 Night'}
            </Text>
          </View>
          <Text style={styles.rateDetails}>
            {RATE_CONFIG.BASE_FARE.toFixed(2)} DH + {isDayMode ? RATE_CONFIG.DAY_RATE_PER_KM : RATE_CONFIG.NIGHT_RATE_PER_KM} DH/km
          </Text>
        </GlassCard>

        {/* Pickup */}
        <GlassCard style={styles.pickerCard}>
          <Text style={styles.label}>📍 Pickup Location</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={pickup}
              onValueChange={setPickup}
              style={styles.picker}
            >
              <Picker.Item label="Select pickup" value="" />
              {CASABLANCA_LOCATIONS.map((loc) => (
                <Picker.Item key={loc.id} label={loc.name} value={loc.name} />
              ))}
            </Picker>
          </View>
        </GlassCard>

        {/* Destination */}
        <GlassCard style={styles.pickerCard}>
          <Text style={styles.label}>🎯 Destination</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={destination}
              onValueChange={setDestination}
              style={styles.picker}
            >
              <Picker.Item label="Select destination" value="" />
              {CASABLANCA_LOCATIONS.map((loc) => (
                <Picker.Item key={loc.id} label={loc.name} value={loc.name} />
              ))}
            </Picker>
          </View>
        </GlassCard>

        {/* Trip details */}
        {pickup && destination && (
          <View style={styles.detailsCard}>
            <LinearGradient
              colors={['#DC2626', '#EA580C']}
              style={styles.detailsGradient}
            >
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Distance</Text>
                <Text style={styles.detailValue}>{distance.toFixed(1)} km</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Estimated Time</Text>
                <Text style={styles.detailValue}>{time} min</Text>
              </View>
              <View style={[styles.detailRow, styles.priceRow]}>
                <Text style={styles.detailLabel}>Estimated Price</Text>
                <Text style={styles.priceValue}>{price.toFixed(2)} DH</Text>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Confirm button */}
        <TouchableOpacity
          style={[styles.confirmButton, (!pickup || !destination) && styles.confirmButtonDisabled]}
          onPress={handleConfirm}
          disabled={!pickup || !destination}
        >
          <LinearGradient
            colors={(!pickup || !destination) ? ['#9CA3AF', '#6B7280'] : ['#DC2626', '#EA580C']}
            style={styles.confirmButtonGradient}
          >
            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
  rateCard: {
    marginBottom: 16,
  },
  rateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rateLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  rateValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  rateDetails: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  pickerCard: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  pickerWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  detailsCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  detailsGradient: {
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    paddingTop: 12,
    marginTop: 4,
  },
  detailLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  detailValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceValue: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  confirmButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 32,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonGradient: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
