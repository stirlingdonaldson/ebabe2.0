import React, { useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function WelcomeScreen() {
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleGetStarted = () => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      router.push('/onboarding/signup');
    });
  };

  const handleLogin = () => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      router.push('/onboarding/login');
    });
  };

  const { width, height } = Dimensions.get('window');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#121212',
    },
    bentoGrid: {
      flex: 1,
      padding: 16,
      gap: 12,
    },
    bentoItem: {
      borderRadius: 24,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    headerSection: {
      height: height * 0.25,
      backgroundColor: '#FFEB3B',
      justifyContent: 'center',
      alignItems: 'center',
    },
    welcomeSection: {
      flex: 1,
      backgroundColor: '#1E1E1E',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: height * 0.3,
    },
    actionSection: {
      height: height * 0.2,
      backgroundColor: '#2A2A2A',
      justifyContent: 'center',
    },
    title: {
      color: '#000000',
      fontWeight: '700',
      textAlign: 'center',
    },
    subtitle: {
      marginTop: 8,
      textAlign: 'center',
      color: '#000000',
    },
    placeholderText: {
      color: '#FFEB3B',
      textAlign: 'center',
      fontWeight: '700',
    },
    placeholderSubtext: {
      marginTop: 16,
      textAlign: 'center',
      color: '#CCCCCC',
    },
    button: {
      marginVertical: 8,
    },
    buttonContent: {
      paddingVertical: 8,
    },
    primaryButton: {
      backgroundColor: '#FFEB3B',
    },
    secondaryButton: {
      borderColor: '#FFEB3B',
    },

  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={[
          styles.bentoGrid,
          {
            transform: [{
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -width],
              })
            }]
          }
        ]}
      >
        {/* Header Section */}
        <View style={[styles.bentoItem, styles.headerSection]}>
          <Text variant="displaySmall" style={styles.title}>
            Ebabe
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Find premium dates with verified hosts
          </Text>
        </View>

        {/* Welcome Section */}
        <View style={[styles.bentoItem, styles.welcomeSection]}>
          <Text variant="headlineMedium" style={styles.placeholderText}>
            Welcome to Ebabe
          </Text>
          <Text variant="bodyLarge" style={styles.placeholderSubtext}>
            Your premium dating experience awaits
          </Text>
        </View>

        {/* Action Section */}
        <View style={[styles.bentoItem, styles.actionSection]}>
          <Button
            mode="contained"
            style={[styles.button, styles.primaryButton]}
            contentStyle={styles.buttonContent}
            onPress={handleGetStarted}
            labelStyle={{ fontWeight: '700' }}
          >
            Get Started
          </Button>
          <Button
            mode="outlined"
            style={[styles.button, styles.secondaryButton]}
            contentStyle={styles.buttonContent}
            onPress={handleLogin}
          >
            I already have an account
          </Button>
        </View>


      </Animated.View>
    </SafeAreaView>
  );
}
