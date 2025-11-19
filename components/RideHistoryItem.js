import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const RideHistoryItem = ({ ride, onDelete }) => {
  const date = new Date(ride.completedAt);
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.date}>{dateStr} • {timeStr}</Text>
          <View style={[styles.badge, ride.isNightMode && styles.badgeNight]}>
            <Text style={[styles.badgeText, ride.isNightMode && styles.badgeTextNight]}>
              {ride.isNightMode ? '🌙' : '☀️'}
            </Text>
          </View>
        </View>

        <View style={styles.route}>
          <Text style={{fontSize:14, color:'#DC2626'}}>📍</Text>
          <Text style={styles.location}>{ride.departure}</Text>
        </View>
        
        <View style={styles.route}>
          <Text style={{fontSize:14, color:'#10B981'}}>📍</Text>
          <Text style={styles.location}>{ride.destination}</Text>
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={{fontSize:12, color:'#6B7280'}}>⏱️</Text>
            <Text style={styles.detailText}>{ride.duration}s</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailText}>{ride.distance.toFixed(1)} km</Text>
          </View>
          <Text style={styles.price}>{ride.finalPrice.toFixed(2)} DH</Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => onDelete(ride.id)} style={styles.deleteBtn}>
        <Text style={{fontSize:18, color:'#EF4444'}}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  content: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  date: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600'
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FEF3C7',
    borderRadius: 6
  },
  badgeNight: {
    backgroundColor: '#1F2937'
  },
  badgeText: {
    fontSize: 12
  },
  badgeTextNight: {
    color: '#FCD34D'
  },
  route: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  location: {
    marginLeft: 8,
    fontSize: 14,
    color: '#1F2937'
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  detailText: {
    fontSize: 13,
    color: '#6B7280'
  },
  price: {
    marginLeft: 'auto',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC2626'
  },
  deleteBtn: {
    padding: 8,
    justifyContent: 'center'
  }
});

