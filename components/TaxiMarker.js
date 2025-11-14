import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSpring,
} from 'react-native-reanimated';

export const TaxiMarker = ({ size = 32 }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSpring(1.1, { damping: 2, stiffness: 100 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.taxiMarker,
        { width: size, height: size },
        animatedStyle,
      ]}
    >
      <Text style={styles.taxiEmoji}>🚕</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  taxiMarker: {
    backgroundColor: '#DC2626',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-45deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  taxiEmoji: {
    fontSize: 16,
  },
});