import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SimpleMap } from '../components/SimpleMap';
import { DriverCard } from '../components/DriverCard';
import { useStore } from '../store/useStore';
import { calculateDistance, formatTime } from '../utils/calculations';
import { storage } from '../utils/storage';

export default function RideScreen() {
  const router = useRouter();
  const { activeRide, currentLocation, setActiveRide, addToHistory } = useStore();
  
  const [elapsedTime, setElapsedTime] = useState(0);
  const [taxiPosition, setTaxiPosition] = useState({ 
    lat: currentLocation.lat - 0.01, 
    lng: currentLocation.lng - 0.01 
  });
  const [currentPrice, setCurrentPrice] = useState(
    activeRide?.currentPrice || 7.50
  );

  useEffect(() => {
    if (!activeRide) {
      router.replace('/');
      return;
    }

    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    const moveInterval = setInterval(() => {
      setTaxiPosition(prev => {
        const targetLat = currentLocation.lat;
        const targetLng = currentLocation.lng;
        const speed = 0.0002;
        
        const deltaLat = targetLat - prev.lat;
        const deltaLng = targetLng - prev.lng;
        const distance = Math.sqrt(deltaLat * deltaLat + deltaLng * deltaLng);
        
        if (distance < speed) {
          clearInterval(moveInterval);
          setTimeout(() => handleComplete(), 1000);
          return { lat: targetLat, lng: targetLng };
        }
        
        return {
          lat: prev.lat + (deltaLat / distance) * speed,
          lng: prev.lng + (deltaLng / distance) * speed
        };
      });
    }, 100);

    const priceInterval = setInterval(() => {
      setCurrentPrice(prev => {
        const rate = activeRide.isNightMode ? 2.00 : 1.50;
        const increment = rate * 0.05;
        const newPrice = prev + increment;
        return Math.min(newPrice, activeRide.price);
      });
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(moveInterval);
      clearInterval(priceInterval);
    };
  }, [activeRide]);

  const handleComplete = () => {
    const completedRide = {
      ...activeRide,
      completedAt: Date.now(),
      duration: elapsedTime,
      finalPrice: currentPrice
    };
    
    addToHistory(completedRide);
    
    const history = storage.getHistory();
    storage.saveHistory([completedRide, ...history]);
    
    setActiveRide(null);
    
    Alert.alert(
      'Ride Completed!',
      `Total: ${currentPrice.toFixed(2)} DH\nDuration: ${formatTime(elapsedTime)}`,
      [{ text: 'OK', onPress: () => router.replace('/') }]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Ride?',
      'Are you sure you want to cancel this ride?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes', 
          onPress: () => {
            setActiveRide(null);
            router.replace('/');
          },
          style: 'destructive'
        }
      ]
    );
  };

  if (!activeRide) return null;

  const distanceToUser = calculateDistance(
    taxiPosition.lat,
    taxiPosition.lng,
    currentLocation.lat,
    currentLocation.lng
  );

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <SimpleMap 
          center={currentLocation}
          userLocation={currentLocation}
          taxiLocation={taxiPosition}
          route={{
            from: taxiPosition,
            to: currentLocation
          }}
        />
      </View>

      <View style={styles.header}>
        <View style={styles.headerCard}>
          <DriverCard driver={activeRide.driver} isNightMode={activeRide.isNightMode} />
          
          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Distance</Text>
              <Text style={styles.statValue}>
                {distanceToUser > 0.1 ? `${distanceToUser.toFixed(1)} km` : 'Arriving...'}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Time</Text>
              <Text style={styles.statValue}>{formatTime(elapsedTime)}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Price</Text>
              <Text style={styles.priceValue}>{currentPrice.toFixed(2)} DH</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.bottom}>
        <View style={styles.routeCard}>
          <Text style={styles.routeLabel}>Route</Text>
          <Text style={styles.routeText}>
            {activeRide.departure} → {activeRide.destination}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleCancel}
          style={styles.cancelBtn}
        >
          <Text style={styles.cancelBtnText}>Cancel Ride</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  mapContainer: {
    flex: 1
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20
  },
  headerCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  stat: {
    alignItems: 'center',
    flex: 1
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280'
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 4
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC2626',
    marginTop: 4
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB'
  },
  bottom: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20
  },
  routeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12
  },
  routeLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4
  },
  routeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937'
  },
  cancelBtn: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EF4444'
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF4444'
  }
});
