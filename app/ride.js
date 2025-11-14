import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';
import { useTaxiStore } from '../store/useTaxiStore';
import { GlassCard } from '../components/GlassCard';
import { CASABLANCA_LOCATIONS } from '../data/locations';

const { width } = Dimensions.get('window');

export default function RideScreen() {
  const router = useRouter();
  const { activeRide, setActiveRide, addToHistory } = useTaxiStore();
  const [currentPrice, setCurrentPrice] = useState(7.50);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (!activeRide) {
      router.replace('/');
      return;
    }

    pulseScale.value = withRepeat(
      withTiming(1.05, { duration: 1000 }),
      -1,
      true
    );

    const priceInterval = setInterval(() => {
      setCurrentPrice(prev => {
        const increment = activeRide.isDayMode ? 0.15 : 0.20;
        return Math.min(prev + increment, activeRide.estimatedPrice * 1.1);
      });
      setProgress(prev => Math.min(prev + 2, 100));
    }, 1000);

    const timeInterval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(priceInterval);
      clearInterval(timeInterval);
    };
  }, [activeRide]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const handleComplete = () => {
    const ride = {
      ...activeRide,
      finalPrice: currentPrice,
      duration: elapsedTime,
      endTime: Date.now(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };
    addToHistory(ride);
    setActiveRide(null);
    router.replace('/');
  };

  const handleCancel = () => {
    setActiveRide(null);
    router.replace('/');
  };

  if (!activeRide) return null;

  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;

  const pickupLocation = CASABLANCA_LOCATIONS.find(l => l.name === activeRide.pickup);
  const destinationLocation = CASABLANCA_LOCATIONS.find(l => l.name === activeRide.destination);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FEF2F2', '#FED7AA', '#FEF3C7']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🚗 Active Ride</Text>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Trip Info */}
        <GlassCard style={styles.tripInfo}>
          <View style={styles.locationCard}>
            <Text style={styles.locationLabel}>From</Text>
            <Text style={styles.locationName}>{activeRide.pickup}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.locationCard}>
            <Text style={styles.locationLabel}>To</Text>
            <Text style={styles.locationName}>{activeRide.destination}</Text>
          </View>
        </GlassCard>

        {/* Driver Info */}
        <GlassCard style={styles.driverCard}>
          <View style={styles.driverHeader}>
            <Text style={styles.driverName}>{activeRide.driver?.name}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>⭐ {activeRide.driver?.rating}</Text>
            </View>
          </View>
          <Text style={styles.plateText}>🚗 {activeRide.driver?.plate}</Text>
        </GlassCard>

        {/* Timer and Price */}
        <View style={styles.statsContainer}>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statLabel}>Time</Text>
            <Text style={styles.statValue}>
              {minutes}:{seconds.toString().padStart(2, '0')}
            </Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statLabel}>Price</Text>
            <Text style={styles.priceValue}>{currentPrice.toFixed(2)} DH</Text>
          </GlassCard>
        </View>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}% complete</Text>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}
          >
            <LinearGradient
              colors={['#DC2626', '#EA580C']}
              style={styles.completeButtonGradient}
            >
              <Text style={styles.completeButtonText}>Complete Ride</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelRideButton}
            onPress={handleCancel}
          >
            <Text style={styles.cancelRideButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  cancelButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 20,
    color: '#DC2626',
    fontWeight: 'bold',
  },
  tripInfo: {
    marginBottom: 16,
    padding: 16,
  },
  locationCard: {
    paddingVertical: 12,
  },
  locationLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  driverCard: {
    marginBottom: 16,
    padding: 16,
  },
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  ratingContainer: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  plateText: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBackground: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#DC2626',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  actionsContainer: {
    gap: 12,
  },
  completeButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  completeButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelRideButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#DC2626',
  },
  cancelRideButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
