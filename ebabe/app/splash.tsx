import React, { useEffect } from 'react';
import { Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

const { height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      translateY.value = withTiming(-height, { 
        duration: 400,
        easing: Easing.inOut(Easing.ease),
      }, (finished?: boolean) => {
        if (finished) {
          router.replace('/onboarding/welcome');
        }
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [router, translateY]);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.text}>ebabe</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  text: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
  },
});
