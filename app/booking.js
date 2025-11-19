import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Modal,
  Dimensions 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../store/useStore';
import { 
  NEIGHBORHOODS, 
  LOCATIONS, 
  PRICING, 
  DRIVERS 
} from '../utils/constants';
import { 
  calculateDistance, 
  calculatePrice, 
  calculateTime 
} from '../utils/calculations';

const { height } = Dimensions.get('window');

export default function BookingScreen() {
  const router = useRouter();
  const { isNightMode, currentLocation, setActiveRide } = useStore();
  
  const [departure, setDeparture] = useState(NEIGHBORHOODS[0]);
  const [destination, setDestination] = useState(LOCATIONS[0].name);
  const [showDepartureMenu, setShowDepartureMenu] = useState(false);
  const [showDestinationMenu, setShowDestinationMenu] = useState(false);

  const selectedDestLocation = LOCATIONS.find(l => l.name === destination);
  const distance = selectedDestLocation ? calculateDistance(
    currentLocation.lat,
    currentLocation.lng,
    selectedDestLocation.lat,
    selectedDestLocation.lng
  ) : 0;
  
  const price = calculatePrice(distance, isNightMode, PRICING);
  const time = calculateTime(distance);

  const handleConfirm = () => {
    const driver = DRIVERS[Math.floor(Math.random() * DRIVERS.length)];
    setActiveRide({
      id: Date.now(),
      departure,
      destination,
      distance,
      price,
      estimatedTime: time,
      driver,
      startTime: Date.now(),
      isNightMode,
      destinationLocation: selectedDestLocation,
      currentPrice: PRICING[isNightMode ? 'night' : 'day'].pickup
    });
    router.push('/ride');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={[styles.header, isNightMode && styles.headerNight]}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{fontSize:20, color:'white'}}>✖️</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New Booking</Text>
          </View>
          <View style={[styles.rateInfo, isNightMode && styles.rateInfoNight]}>
            <Text style={[styles.rateText, isNightMode && styles.rateTextNight]}>
              {isNightMode ? '🌙 Night Rate' : '☀️ Day Rate'} • {isNightMode ? PRICING.night.perKm : PRICING.day.perKm} DH/km
            </Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Departure */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>From</Text>
            <TouchableOpacity
              onPress={() => setShowDepartureMenu(true)}
              style={styles.input}
            >
              <Text style={{fontSize:18, color:'#DC2626'}}>📍</Text>
              <Text style={styles.inputText}>{departure}</Text>
              <Text style={{fontSize:16, color:'#9CA3AF'}}>➡️</Text>
            </TouchableOpacity>
          </View>

          {/* Destination */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>To</Text>
            <TouchableOpacity
              onPress={() => setShowDestinationMenu(true)}
              style={styles.input}
            >
              <Text style={{fontSize:18, color:'#10B981'}}>📍</Text>
              <Text style={styles.inputText}>{destination}</Text>
              <Text style={{fontSize:16, color:'#9CA3AF'}}>➡️</Text>
            </TouchableOpacity>
          </View>

          {/* Trip Details Card */}
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Trip Details</Text>
            
            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Text style={{fontSize:14, color:'#6B7280'}}>🧭</Text>
                <Text style={styles.detailLabelText}>Distance</Text>
              </View>
              <Text style={styles.detailValue}>{distance.toFixed(1)} km</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Text style={{fontSize:14, color:'#6B7280'}}>⏱️</Text>
                <Text style={styles.detailLabelText}>Est. Time</Text>
              </View>
              <Text style={styles.detailValue}>{time} min</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.priceRow}>
              <View style={styles.detailLabel}>
                <Text style={{fontSize:14, color:'#DC2626'}}>💲</Text>
                <Text style={styles.detailLabelText}>Est. Price</Text>
              </View>
              <Text style={styles.priceValue}>{price.toFixed(2)} DH</Text>
            </View>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            onPress={handleConfirm}
            style={styles.confirmBtn}
          >
            <Text style={styles.confirmBtnText}>Confirm Booking</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Departure Dropdown */}
      <Modal visible={showDepartureMenu} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Departure</Text>
            </View>
            <ScrollView>
              {NEIGHBORHOODS.map((n, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    setDeparture(n);
                    setShowDepartureMenu(false);
                  }}
                  style={styles.menuItem}
                >
                  <Text style={[
                    styles.menuItemText,
                    departure === n && styles.menuItemTextActive
                  ]}>
                    {n}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Destination Dropdown */}
      <Modal visible={showDestinationMenu} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Destination</Text>
            </View>
            <ScrollView>
              {LOCATIONS.map((loc) => (
                <TouchableOpacity
                  key={loc.id}
                  onPress={() => {
                    setDestination(loc.name);
                    setShowDestinationMenu(false);
                  }}
                  style={styles.menuItem}
                >
                  <Text style={[
                    styles.menuItemText,
                    destination === loc.name && styles.menuItemTextActive
                  ]}>
                    {loc.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  scrollView: {
    flex: 1
  },
  header: {
    backgroundColor: '#DC2626',
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20
  },
  headerNight: {
    backgroundColor: '#1F2937'
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerTitle: {
    marginLeft: 16,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  },
  rateInfo: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8
  },
  rateInfoNight: {
    backgroundColor: 'rgba(255,255,255,0.1)'
  },
  rateText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600'
  },
  rateTextNight: {
    color: '#FCD34D'
  },
  form: {
    padding: 20
  },
  inputGroup: {
    marginBottom: 20
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB'
  },
  inputText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
    flex: 1
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  detailLabel: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  detailLabelText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280'
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937'
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  priceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DC2626'
  },
  confirmBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  confirmBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.6
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  menuItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  menuItemText: {
    fontSize: 16,
    color: '#1F2937'
  },
  menuItemTextActive: {
    color: '#DC2626',
    fontWeight: '600'
  }
});
