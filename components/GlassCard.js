import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

export const GlassCard = ({ children, style, intensity = 20 }) => {
  return (
    <View style={[styles.container, style]}>
      <BlurView
        style={styles.blur}
        blurType="light"
        blurAmount={intensity}
        reducedTransparencyFallbackColor="white"
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    padding: 16,
  },
});
