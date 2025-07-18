import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Text, TextInput, HelperText, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useOnboarding } from '../../src/context/OnboardingContext';
import AuthService from '../../src/services/AuthService';

export default function EmailScreen() {
  const theme = useTheme();
  const { state, setEmail } = useOnboarding();
  const [localEmail, setLocalEmail] = useState(state.email);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setLocalEmail(text);
    if (error && validateEmail(text)) {
      setError('');
    }
  };

  const handleContinue = async () => {
    if (!validateEmail(localEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const trimmedEmail = localEmail.trim();
      setEmail(trimmedEmail);
      
      // NOTE: Assuming this service exists and works as intended.
      // const success = await AuthService.sendEmailVerificationCode(trimmedEmail);
      const success = true; // Using a mock success for UI development
      
      if (success) {
        router.push('/onboarding/email-verification');
      } else {
        setError('Failed to send verification code. Please try again.');
      }
    } catch (err) {
      console.error('Error sending email verification code:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContainer: { flexGrow: 1 },
    innerContainer: { flex: 1, justifyContent: 'space-between', padding: 24 },
    header: { position: 'absolute', top: 10, left: 10, zIndex: 1 },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontWeight: '700', marginBottom: 24, textAlign: 'center' },
    input: { backgroundColor: 'transparent', width: '100%', textAlign: 'center', fontSize: 22 },
    helperText: { textAlign: 'center', marginTop: 8 },
    footer: { paddingBottom: 24 },
    button: { marginTop: 16 },
    buttonContent: { paddingVertical: 8 },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.innerContainer}>
            <View style={styles.header}>
              <Button mode="text" onPress={() => router.back()} textColor={theme.colors.onSurface}>Back</Button>
            </View>

            <View style={styles.content}>
              <Text variant="headlineMedium" style={styles.title}>
                What's your email?
              </Text>
              <TextInput
                label="Email"
                value={localEmail}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus
                mode="flat"
                style={styles.input}
                underlineColor={theme.colors.primary}
                activeUnderlineColor={theme.colors.primary}
                error={!!error}
                disabled={isLoading}
              />
              <HelperText type={error ? 'error' : 'info'} visible={true} style={styles.helperText}>
                {error || "We'll send a verification code to this email."}
              </HelperText>
            </View>

            <View style={styles.footer}>
              <Button
                mode="contained"
                onPress={handleContinue}
                disabled={!validateEmail(localEmail) || isLoading}
                loading={isLoading}
                style={styles.button}
                contentStyle={styles.buttonContent}
                labelStyle={{ fontWeight: '700' }}
              >
                Continue
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}