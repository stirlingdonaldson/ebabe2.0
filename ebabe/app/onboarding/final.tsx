import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import theme from '../../src/theme/theme';
import { StatusBar } from 'expo-status-bar';
import { useOnboarding } from 'context/OnboardingContext';
import AuthService, { UserData } from '../../src/services/AuthService';

export default function FinalOnboardingScreen() {
  const { state } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStartExploring = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Complete the signup process with all collected user data
      const userData: UserData = {
        id: '', // This will be generated by AuthService
        name: state.name,
        email: state.email,
        phoneNumber: state.phoneNumber,
        birthdate: state.birthdate,
        profileSetup: state.profileOption ? true : false
      };
      
      await AuthService.completeSignup(userData);
      
      // Navigate to the main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error completing signup:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        <Text style={styles.successIcon}>✅</Text>
        
        <Text variant="headlineMedium" style={styles.title}>
          You're all set!
        </Text>
        
        <Text style={styles.subtitle}>
          Your profile has been created successfully. Start exploring and connecting with others!
        </Text>
        
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}
      </View>

      <View style={styles.footer}>
        <Button
          mode="contained"
          style={styles.button}
          contentStyle={styles.buttonContent}
          onPress={handleStartExploring}
          disabled={isLoading}
          loading={isLoading}
        >
          {isLoading ? 'Setting up your account...' : 'Start Exploring'}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 80,
    marginBottom: 32,
  },
  title: {
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555555',
    marginBottom: 24,
  },
  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: 16,
  },
  footer: {
    padding: 24,
  },
  button: {
    borderRadius: 30,
    paddingVertical: 4,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
