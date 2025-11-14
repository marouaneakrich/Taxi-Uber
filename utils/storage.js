import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  set: (key, value) => AsyncStorage.setItem(key, value),
  getString: async (key) => await AsyncStorage.getItem(key),
  delete: (key) => AsyncStorage.removeItem(key),
};

export const STORAGE_KEYS = {
  RIDE_HISTORY: 'rideHistory',
};
