import React, { useCallback } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../src/context/AuthContext';
import { OnboardingProvider } from '../src/context/OnboardingContext';
import theme from '../src/theme/theme';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <AuthProvider>
            <OnboardingProvider>
              <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
                <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: theme.colors.background },
                }}
              >
                                <Stack.Screen name="splash" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding/welcome" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding/signup" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding/login" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding/quiz" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding/subscription" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding/profile" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding/phone-number" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding/verification-code" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding/name" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding/email" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding/email-verification" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding/birthdate" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding/profile-setup" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding/final" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
              </View>
            </OnboardingProvider>
          </AuthProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
