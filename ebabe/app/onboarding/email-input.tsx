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

export default function EmailInputScreen() {
  const { state, setEmail } = useOnboarding();
  const [localEmail, setLocalEmail] = useState(state.email || '');
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

  const handleEmailChange = (text: string) => {
    setLocalEmail(text);
    if (error) setError('');
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleContinue = async () => {
    if (!localEmail) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(localEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    // Store the email in context
    setEmail(localEmail);

    // Call the authentication service
    const success = await AuthService.sendEmailVerificationCode(localEmail);

    setIsLoading(false);

    if (success) {
      router.push('/onboarding/email-verification');
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
                <Text style={styles.title}>Enter your email</Text>
                <Text style={styles.subtitle}>We'll send you a verification code</Text>
              </View>
              
              {/* Email Input Card */}
              <View style={[styles.bentoItem, styles.inputCard]}>
                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons name="email" size={24} color="#FFEB3B" style={styles.inputIcon} />
                  <TextInput
                    label="Email Address"
                    value={localEmail}
                    onChangeText={handleEmailChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
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
                    Enter your email address
                  </HelperText>
                )}
              </View>
              
              {/* Continue Button */}
              <TouchableOpacity
                style={[
                  styles.bentoItem, 
                  styles.buttonCard, 
                  (!localEmail || !validateEmail(localEmail) || isLoading) && styles.disabledButton
                ]}
                onPress={handleContinue}
                disabled={!localEmail || !validateEmail(localEmail) || isLoading}
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
