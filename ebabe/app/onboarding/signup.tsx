import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useOnboarding } from '../../src/context/OnboardingContext';

export default function SignupScreen() {
  const { resetOnboarding } = useOnboarding();
  const slideAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    resetOnboarding();
  }, []);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  const handleCreateWallet = () => {
    router.push('/onboarding/phone-number');
  };

  const handleExistingAccount = () => {
    router.push('/onboarding/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={[
          styles.bentoGrid,
          {
            transform: [{
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, width],
              })
            }]
          }
        ]}
      >
        {/* Header Section */}
        <View style={[styles.bentoItem, styles.headerSection]}>
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>EB</Text>
            </View>
          </View>
        </View>

        {/* Main Content Section */}
        <View style={[styles.bentoItem, styles.mainSection]}>
          <View style={styles.textContainer}>
            <Text variant="headlineLarge" style={styles.headline}>YOUR PROFILE.</Text>
            <Text variant="headlineLarge" style={styles.headline}>YOUR DATING.</Text>
          </View>
        </View>

        {/* Action Section */}
        <View style={[styles.bentoItem, styles.actionSection]}>
          <Button
            mode="contained"
            onPress={handleCreateWallet}
            style={styles.createButton}
            labelStyle={styles.createButtonLabel}
          >
            Create profile
          </Button>
          
          <Button
            mode="text"
            onPress={handleExistingAccount}
            style={styles.existingButton}
            labelStyle={styles.existingButtonLabel}
          >
            I already have a profile
          </Button>
        </View>


      </Animated.View>
    </SafeAreaView>
  );
}

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
    height: height * 0.15,
    backgroundColor: '#FFEB3B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#FFEB3B',
    fontSize: 24,
    fontWeight: '900',
  },
  mainSection: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    minHeight: height * 0.3,
  },
  textContainer: {
    alignItems: 'center',
  },
  headline: {
    fontWeight: '900',
    fontSize: 32,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  actionSection: {
    height: height * 0.25,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
  },
  createButton: {
    borderRadius: 30,
    marginBottom: 16,
    paddingVertical: 8,
    backgroundColor: '#FFEB3B',
  },
  createButtonLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  existingButton: {
    borderRadius: 30,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 235, 59, 0.1)',
    borderWidth: 1,
    borderColor: '#FFEB3B',
  },
  existingButtonLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFEB3B',
  },

});
