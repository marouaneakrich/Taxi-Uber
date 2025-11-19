import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const DriverCard = ({ driver, isNightMode }) => {
  return (
    <View style={styles.container}>
      <View style={styles.photoContainer}>
        <Text style={styles.photo}>{driver.photo}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{driver.name}</Text>
        <View style={styles.ratingRow}>
          <Text style={{fontSize:14, marginRight:4}}>⭐</Text>
          <Text style={styles.rating}>{driver.rating}</Text>
          <View style={[styles.modeBadge, isNightMode && styles.modeBadgeNight]}>
            <Text style={[styles.modeText, isNightMode && styles.modeTextNight]}>
              {isNightMode ? '🌙 Night' : '☀️ Day'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center'
  },
  photo: {
    fontSize: 24
  },
  info: {
    marginLeft: 12,
    flex: 1
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: '#6B7280'
  },
  modeBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#FEF3C7',
    borderRadius: 4
  },
  modeBadgeNight: {
    backgroundColor: '#1F2937'
  },
  modeText: {
    fontSize: 12,
    color: '#92400E'
  },
  modeTextNight: {
    color: '#FCD34D'
  }
});