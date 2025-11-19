import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SimpleMap } from '../components/SimpleMap';
import { useStore } from '../store/useStore';
import { CASA_CENTER, PRICING } from '../utils/constants';

export default function MapScreen() {
  
  const router = useRouter();
  const { 
    isNightMode, 
    taxis, 
    currentLocation,
    toggleNightMode,
    setTaxis 
  } = useStore();

  useEffect(() => {
    const generateTaxis = () => {
      const newTaxis = Array.from({ length: 7 }, (_, i) => ({
        id: i + 1,
        lat: CASA_CENTER.lat + (Math.random() - 0.5) * 0.05,
        lng: CASA_CENTER.lng + (Math.random() - 0.5) * 0.05
      }));
      setTaxis(newTaxis);
    };
    generateTaxis();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <SimpleMap 
          center={currentLocation}
          markers={taxis}
          userLocation={currentLocation}
        />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>Petit Taxi Casa</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                onPress={() => router.push('/history')}
                style={styles.iconBtn}
              >
                <Text style={{fontSize:18, color:'#6B7280'}}>📜</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={toggleNightMode}
                style={[styles.iconBtn, isNightMode && styles.iconBtnNight]}
              >
                <Text style={{fontSize:18}}>{isNightMode ? '🌙' : '☀️'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.rateBadge, isNightMode && styles.rateBadgeNight]}>
            <Text style={[styles.rateText, isNightMode && styles.rateTextNight]}>
              {isNightMode ? PRICING.night.hours : PRICING.day.hours} • {isNightMode ? PRICING.night.perKm : PRICING.day.perKm} DH/km
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom section */}
      <View style={styles.bottom}>
        <TouchableOpacity
          onPress={() => router.push('/booking')}
          style={styles.bookBtn}
        >
          <Text style={{fontSize:22, color:'white'}}>🚕</Text>
          <Text style={styles.bookBtnText}>Book a Taxi</Text>
        </TouchableOpacity>
        
        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Available</Text>
            <Text style={styles.infoValue}>{taxis.length}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Pickup Fee</Text>
            <Text style={styles.infoValue}>{PRICING.day.pickup} DH</Text>
          </View>
        </View>
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
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8
  },
  iconBtn: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8
  },
  iconBtnNight: {
    backgroundColor: '#1F2937'
  },
  rateBadge: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#FEF3C7',
    borderRadius: 8
  },
  rateBadgeNight: {
    backgroundColor: '#1F2937'
  },
  rateText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600'
  },
  rateTextNight: {
    color: '#FCD34D'
  },
  bottom: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20
  },
  bookBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  bookBtnText: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white'
  },
  infoCard: {
    marginTop: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  infoItem: {
    alignItems: 'center'
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280'
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DC2626'
  },
  divider: {
    width: 1,
    backgroundColor: '#E5E7EB'
  }
});