import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';

export const SimpleMap = ({ center, markers = [], userLocation, taxiLocation, route }) => {
  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_DEFAULT}
      initialRegion={{
        latitude: center.lat,
        longitude: center.lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
      showsUserLocation={false}
      showsMyLocationButton={false}
      showsCompass={true}
      showsScale={true}
    >
      {/* User location marker */}
      {userLocation && (
        <Marker
          coordinate={{
            latitude: userLocation.lat,
            longitude: userLocation.lng
          }}
          title="Your Location"
        >
          <View style={styles.userMarker} />
        </Marker>
      )}

      {/* Active taxi marker (during ride) */}
      {taxiLocation && (
        <Marker
          coordinate={{
            latitude: taxiLocation.lat,
            longitude: taxiLocation.lng
          }}
          title="Your Taxi"
          description="En route"
        >
          <View style={styles.activeTaxiMarker}>
            <Text style={styles.carEmoji}>🚕</Text>
          </View>
        </Marker>
      )}

      {/* Available taxis markers */}
      {markers.map(taxi => (
        <Marker
          key={taxi.id}
          coordinate={{
            latitude: taxi.lat,
            longitude: taxi.lng
          }}
          title={`Taxi ${taxi.id}`}
        >
          <View style={styles.taxiMarker}>
            <Text style={styles.miniCarEmoji}>🚗</Text>
          </View>
        </Marker>
      ))}

      {/* Route polyline */}
      {route && (
       <Polyline
  coordinates={[
    { latitude: route.from.lat, longitude: route.from.lng },
    { latitude: route.to.lat, longitude: route.to.lng }
  ]}
  strokeColor="#EF4444"
  strokeWidth={4}
  lineDashPattern={[1]}
/>

      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  userMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  activeTaxiMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  taxiMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  carEmoji: {
    fontSize: 24,
  },
  miniCarEmoji: {
    fontSize: 18,
  }
});