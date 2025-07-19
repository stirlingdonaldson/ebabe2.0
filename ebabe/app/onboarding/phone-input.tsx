import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Text, TextInput, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useOnboarding } from '../../src/context/OnboardingContext';
import BackButton from '../../src/components/BackButton';
import AuthService from '../../src/services/AuthService';

const { width } = Dimensions.get('window');

export default function PhoneInputScreen() {
  const { state, setPhoneNumber } = useOnboarding();
  const [localPhoneNumber, setLocalPhoneNumber] = useState(state.phoneNumber || '');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const slideAnim = useState(new Animated.Value(-width))[0];

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePhoneNumberChange = (text: string) => {
    // Remove any non-numeric characters
    const formattedNumber = text.replace(/\D/g, '');
    setLocalPhoneNumber(formattedNumber);
    if (error) setError('');
  };

  const formatPhoneNumber = (number: string) => {
    if (number.length <= 3) {
      return number;
    } else if (number.length <= 6) {
      return `(${number.slice(0, 3)}) ${number.slice(3)}`;
    } else {
      return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6, 10)}`;
    }
  };

  const handleContinue = async () => {
    if (!localPhoneNumber) {
      setError('Please enter your phone number');
      return;
    }

    if (localPhoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    setError('');

    // Store the phone number in context
    setPhoneNumber(localPhoneNumber);

    // Call the authentication service
    const success = await AuthService.sendPhoneVerificationCode(localPhoneNumber);

    setIsLoading(false);

    if (success) {
      router.push('/onboarding/verification-code');
    } else {
      setError('Unable to send verification code. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <Animated.View 
        style={[styles.animatedContainer, { transform: [{ translateX: slideAnim }] }]}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.innerContainer}>
            <View style={styles.bentoGrid}>
              {/* Header Card */}
              <View style={[styles.bentoItem, styles.headerCard]}>
                <Text style={styles.title}>Enter your phone number</Text>
                <Text style={styles.subtitle}>We'll send you a verification code</Text>
              </View>
              
              {/* Phone Input Card */}
              <View style={[styles.bentoItem, styles.inputCard]}>
                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons name="phone" size={24} color="#FFEB3B" style={styles.inputIcon} />
                  <TextInput
                    label="Phone Number"
                    value={formatPhoneNumber(localPhoneNumber)}
                    onChangeText={handlePhoneNumberChange}
                    keyboardType="phone-pad"
                    autoFocus
                    mode="flat"
                    style={styles.input}
                    theme={{
                      colors: {
                        primary: '#FFEB3B',
                        onSurfaceVariant: '#AAAAAA',
                        background: 'transparent',
                        placeholder: '#AAAAAA',
                        text: '#FFFFFF',
                        error: '#FF6B6B'
                      }
                    }}
                    error={!!error}
                    disabled={isLoading}
                    textColor="#FFFFFF"
                    selectionColor="#FFEB3B"
                    underlineColor="rgba(255,255,255,0.3)"
                    activeUnderlineColor="#FFEB3B"
                  />
                </View>
                {error ? (
                  <HelperText type="error" style={styles.helperText}>
                    {error}
                  </HelperText>
                ) : (
                  <HelperText type="info" style={styles.helperText}>
                    Enter your 10-digit phone number
                  </HelperText>
                )}
              </View>
              
              {/* Continue Button */}
              <TouchableOpacity
                style={[
                  styles.bentoItem, 
                  styles.buttonCard, 
                  (!localPhoneNumber || localPhoneNumber.length < 10 || isLoading) && styles.disabledButton
                ]}
                onPress={handleContinue}
                disabled={!localPhoneNumber || localPhoneNumber.length < 10 || isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Sending...' : 'Continue'}
                </Text>
                {!isLoading && <MaterialCommunityIcons name="arrow-right" size={24} color="#000000" />}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        
        {/* Back button */}
        <View style={styles.backButtonContainer}>
          <BackButton color="#FFFFFF" />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  animatedContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  bentoGrid: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  bentoItem: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  headerCard: {
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    paddingVertical: 24,
  },
  inputCard: {
    backgroundColor: '#1A1A1A',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  buttonCard: {
    backgroundColor: '#FFEB3B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#666666',
    opacity: 0.7,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    backgroundColor: 'transparent',
    flex: 1,
    fontSize: 18,
    color: '#FFFFFF',
    paddingHorizontal: 0,
    height: 60,
  },
  helperText: {
    textAlign: 'center',
    color: '#CCCCCC',
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
  },
});
