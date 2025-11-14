// app/_layout.js
import React, { useEffect, useRef, useState } from 'react';
import { Stack } from 'expo-router';
import { View, StyleSheet, StatusBar } from 'react-native';
import Splash from '../components/SplashScreen';
import { useTaxiStore } from '../store/useTaxiStore';

export default function Layout() {
  const loadHistory = useTaxiStore((state) => state.loadHistory);
  const [splashVisible, setSplashVisible] = useState(true);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    let mounted = true;
    const maybePromise = loadHistory();
    if (maybePromise && typeof maybePromise.then === 'function') {
      maybePromise.then(() => { if (mounted) setHistoryLoaded(true); })
                    .catch(() => { if (mounted) setHistoryLoaded(true); }); // still proceed on error
    } else {
      // loadHistory is sync
      setHistoryLoaded(true);
    }
    return () => { mounted = false; };
  }, [loadHistory]);

  // when both tasks done, hide splash
  useEffect(() => {
    if (historyLoaded && animationFinished) {
      // give tiny delay to avoid flash (optional)
      const t = setTimeout(() => setSplashVisible(false), 100);
      return () => clearTimeout(t);
    }
  }, [historyLoaded, animationFinished]);

  // Force hide after max timeout (in case of stuck)
  useEffect(() => {
    const max = setTimeout(() => setSplashVisible(false), 6000); // 6s max
    return () => clearTimeout(max);
  }, []);

  // render splash or the app stack
  if (splashVisible) {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar hidden />
        <Splash
          onAnimationFinish={() => setAnimationFinished(true)}
          // you can pass overlayText prop if you want to force "Taxi Uber"
          overlayText="Taxi Uber"
        />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    />
  );
}
