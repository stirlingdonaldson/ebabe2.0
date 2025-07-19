import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

import BackButton from '../../src/components/BackButton';

const { width } = Dimensions.get('window');

export default function CreateAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  const slideAnim = useState(new Animated.Value(-width))[0];

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSignupMethod = async (method: string) => {
    setSelectedMethod(method);
    setIsLoading(true);
    
    // Log the selected signup method
    console.log(`Selected signup method: ${method}`);
    
    // Navigate to the appropriate screen based on the selected method
    setTimeout(() => {
      setIsLoading(false);
      switch (method) {
        case 'apple':
          // Handle Apple sign-in
          // For now, just navigate to the next screen
          router.push('/onboarding/name');
          break;
        case 'google':
          // Handle Google sign-in
          router.push('/onboarding/name');
          break;
        case 'facebook':
          // Handle Facebook sign-in
          router.push('/onboarding/name');
          break;
        case 'phone':
          // Navigate to phone number input screen
          router.push('/onboarding/phone-input');
          break;
        case 'email':
          // Navigate to email input screen
          router.push('/onboarding/email-input');
          break;
        default:
          break;
      }
    }, 1000); // Simulate API call delay
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
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Choose how you'd like to sign up</Text>
              </View>
              
              {/* Sign-up Options */}
              <View style={[styles.bentoItem, styles.optionsCard]}>
                {/* Apple */}
                <TouchableOpacity 
                  style={[styles.optionButton, selectedMethod === 'apple' && styles.selectedOption]}
                  onPress={() => handleSignupMethod('apple')}
                  disabled={isLoading}
                >
                  <FontAwesome name="apple" size={24} color="#FFFFFF" />
                  <Text style={styles.optionText}>Continue with Apple</Text>
                </TouchableOpacity>
                
                {/* Google */}
                <TouchableOpacity 
                  style={[styles.optionButton, selectedMethod === 'google' && styles.selectedOption]}
                  onPress={() => handleSignupMethod('google')}
                  disabled={isLoading}
                >
                  <FontAwesome name="google" size={24} color="#FFFFFF" />
                  <Text style={styles.optionText}>Continue with Google</Text>
                </TouchableOpacity>
                
                {/* Facebook */}
                <TouchableOpacity 
                  style={[styles.optionButton, selectedMethod === 'facebook' && styles.selectedOption]}
                  onPress={() => handleSignupMethod('facebook')}
                  disabled={isLoading}
                >
                  <FontAwesome name="facebook" size={24} color="#FFFFFF" />
                  <Text style={styles.optionText}>Continue with Facebook</Text>
                </TouchableOpacity>
                
                {/* Phone */}
                <TouchableOpacity 
                  style={[styles.optionButton, selectedMethod === 'phone' && styles.selectedOption]}
                  onPress={() => handleSignupMethod('phone')}
                  disabled={isLoading}
                >
                  <MaterialCommunityIcons name="phone" size={24} color="#FFFFFF" />
                  <Text style={styles.optionText}>Continue with Phone</Text>
                </TouchableOpacity>
                
                {/* Email */}
                <TouchableOpacity 
                  style={[styles.optionButton, selectedMethod === 'email' && styles.selectedOption]}
                  onPress={() => handleSignupMethod('email')}
                  disabled={isLoading}
                >
                  <MaterialCommunityIcons name="email" size={24} color="#FFFFFF" />
                  <Text style={styles.optionText}>Continue with Email</Text>
                </TouchableOpacity>
              </View>
              
              {/* Terms and Privacy */}
              <View style={[styles.bentoItem, styles.termsCard]}>
                <Text style={styles.termsText}>
                  By continuing, you agree to our{' '}
                  <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </View>
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
    backgroundColor: '#FFEB3B',
    alignItems: 'center',
    paddingVertical: 24,
  },
  optionsCard: {
    backgroundColor: '#2A2A2A',
    gap: 12,
  },
  termsCard: {
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
  selectedOption: {
    backgroundColor: '#333333',
    borderWidth: 1,
    borderColor: '#FFEB3B',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  termsText: {
    color: '#CCCCCC',
    textAlign: 'center',
    fontSize: 12,
  },
  termsLink: {
    color: '#FFEB3B',
    textDecorationLine: 'underline',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
  },
});
