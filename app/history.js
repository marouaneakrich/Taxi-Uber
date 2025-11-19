import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { RideHistoryItem } from '../components/RideHistoryItem';
import { useStore } from '../store/useStore';
import { storage } from '../utils/storage';

export default function HistoryScreen() {
  const router = useRouter();
  const { rideHistory, removeFromHistory, loadHistory } = useStore();

  useEffect(() => {
    const savedHistory = storage.getHistory();
    loadHistory(savedHistory);
  }, []);

  const handleDelete = (rideId) => {
    Alert.alert(
      'Delete Ride',
      'Are you sure you want to delete this ride from history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            removeFromHistory(rideId);
            const updatedHistory = rideHistory.filter(r => r.id !== rideId);
            storage.saveHistory(updatedHistory);
          }
        }
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All History',
      'This will delete all your ride history. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            loadHistory([]);
            storage.clearHistory();
          }
        }
      ]
    );
  };

  const totalSpent = rideHistory.reduce((sum, ride) => sum + ride.finalPrice, 0);
  const totalRides = rideHistory.length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{fontSize:20, color:'white'}}>✖️</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ride History</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Statistics */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Statistics</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalRides}</Text>
              <Text style={styles.statLabel}>Total Rides</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalSpent.toFixed(2)} DH</Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </View>
          </View>
        </View>

        {/* History List */}
        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Recent Rides</Text>
            {rideHistory.length > 0 && (
              <TouchableOpacity onPress={handleClearAll}>
                <Text style={{fontSize:18, color:'#EF4444'}}>🗑️</Text>
              </TouchableOpacity>
            )}
          </View>

          {rideHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🚕</Text>
              <Text style={styles.emptyTitle}>No rides yet</Text>
              <Text style={styles.emptyText}>
                Your ride history will appear here
              </Text>
            </View>
          ) : (
            rideHistory.map((ride) => (
              <RideHistoryItem
                key={ride.id}
                ride={ride}
                onDelete={handleDelete}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  header: {
    backgroundColor: '#DC2626',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  },
  scrollView: {
    flex: 1
  },
  statsCard: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16
  },
  statsRow: {
    flexDirection: 'row'
  },
  statItem: {
    flex: 1,
    alignItems: 'center'
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DC2626'
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB'
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center'
  }
});
