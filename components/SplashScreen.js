import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import LottieView from 'lottie-react-native';

export default function Splash({ onAnimationFinish = () => {}, overlayText = null }) {
  const animRef = useRef(null);

  useEffect(() => {
    // play once
    try {
      animRef.current?.play();
    } catch (e) {
      /* ignore */
    }
    // fallback: if onAnimationFinish not called in time, still call after duration
    const fallback = setTimeout(() => {
      onAnimationFinish();
    }, 3500); // adjust if your animation is longer

    return () => clearTimeout(fallback);
  }, [onAnimationFinish]);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animRef}
        source={require('../data/taxi.json')}
        autoPlay={false}
        loop={false}
        onAnimationFinish={() => onAnimationFinish()}
        style={styles.lottie}
      />

      {overlayText ? (
        <Text style={styles.overlayText}>{overlayText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // match animation bg
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlayText: {
    position: 'absolute',
    bottom: 90,            
    alignSelf: 'center',
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: '#00000088',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
