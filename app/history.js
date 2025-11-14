import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTaxiStore } from '../store/useTaxiStore';
import { GlassCard } from '../components/GlassCard';

export default function HistoryScreen() {
  const router = useRouter();
  const { rideHistory, removeFromHistory } = useTaxiStore();
  const [deletingId, setDeletingId] = useState(null);

  const totalSpent = rideHistory.reduce((sum, ride) => sum + (ride.finalPrice || 0), 0);
  const totalRides = rideHistory.length;

  const handleDelete = (id) => {
    setDeletingId(id);
    setTimeout(() => {
      removeFromHistory(id);
      setDeletingId(null);
    }, 300);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FEF2F2', '#FED7AA', '#FEF3C7']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ride History</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <LinearGradient
            colors={['#DC2626', '#EA580C']}
            style={styles.statGradient}
          >
            <Text style={styles.statIcon}>💰</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
            <Text style={styles.statValue}>{totalSpent.toFixed(2)} DH</Text>
          </LinearGradient>
        </View>
        <View style={styles.statCard}>
          <LinearGradient
            colors={['#3B82F6', '#6366F1']}
            style={styles.statGradient}
          >
            <Text style={styles.statIcon}>🚕</Text>
            <Text style={styles.statLabel}>Total Rides</Text>
            <Text style={styles.statValue}>{totalRides}</Text>
          </LinearGradient>
        </View>
      </View>

      {/* Ride list */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {rideHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No rides yet</Text>
            <Text style={styles.emptySubtext}>Your ride history will appear here</Text>
          </View>
        ) : (
          rideHistory.map((ride) => (
            <Animated.View
              key={ride.id}
              style={[
                styles.rideCard,
                deletingId === ride.id && { opacity: 0, transform: [{ scale: 0.9 }] }
              ]}
            >
              <GlassCard style={styles.rideCardContent}>
                <View style={styles.rideHeader}>
                  <View style={styles.rideLocations}>
                    <View style={styles.locationRow}>
                      <Text style={styles.locationIcon}>📍</Text>
                      <Text style={styles.locationText} numberOfLines={1}>
                        {ride.pickup}
                      </Text>
                    </View>
                    <View style={styles.locationRow}>
                      <Text style={styles.locationIcon}>🎯</Text>
                      <Text style={styles.locationText} numberOfLines={1}>
                        {ride.destination}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(ride.id)}
                  >
                    <Text style={styles.deleteIcon}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.rideMeta}>
                  <Text style={styles.metaText}>
                    {ride.date} • {ride.time}
                  </Text>
                  <Text style={styles.metaText}>
                    {ride.isDayMode ? '☀️' : '🌙'}
                  </Text>
                </View>

                <View style={styles.rideFooter}>
                  <Text style={styles.distanceText}>
                    {ride.distance.toFixed(1)} km • {Math.floor(ride.duration / 60)}:
                    {(ride.duration % 60).toString().padStart(2, '0')}
                  </Text>
                  <Text style={styles.priceText}>{ride.finalPrice.toFixed(2)} DH</Text>
                </View>
              </GlassCard>
            </Animated.View>
          ))
        )}
      </ScrollView>
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
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    opacity: 0.3,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  rideCard: {
    marginBottom: 12,
  },
  rideCardContent: {
    padding: 0,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rideLocations: {
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  deleteButton: {
    width: 32,
    height: 32,
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: 'bold',
  },
  rideMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    paddingTop: 12,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC2626',
  },
});
