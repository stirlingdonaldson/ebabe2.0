import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Text, TextInput, useTheme, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useOnboarding } from '../../src/context/OnboardingContext';
import AuthService from '../../src/services/AuthService';

export default function PhoneNumberScreen() {
  const theme = useTheme();
  const { state, setPhoneNumber } = useOnboarding();
  const [localPhoneNumber, setLocalPhoneNumber] = useState(state.phoneNumber);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return '';
    const [ , area, first, last] = match;
    if (area.length > 0) {
      let formatted = `(${area}`;
      if (first.length > 0) {
        formatted += `) ${first}`;
        if (last.length > 0) {
          formatted += `-${last}`;
        }
      }
      return formatted;
    }
    return cleaned;
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setLocalPhoneNumber(formatted);
    if (error) setError('');
  };

  const validatePhoneNumber = (phone: string) => {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === 10;
  };

  const handleContinue = async () => {
    if (!validatePhoneNumber(localPhoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      setPhoneNumber(localPhoneNumber);
      const success = await AuthService.sendPhoneVerificationCode(localPhoneNumber);
      if (success) {
        router.push('/onboarding/verification-code');
      } else {
        setError('Failed to send verification code. Please try again.');
      }
    } catch (err) {
      console.error('Error sending verification code:', err);
      setError('Something went wrong. Please try again.');
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
    input: { backgroundColor: 'transparent', width: '100%', textAlign: 'center', fontSize: 24 },
    helperTextContainer: { height: 40, justifyContent: 'center' },
    helperText: { textAlign: 'center' },
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
                What's your phone number?
              </Text>
              <TextInput
                value={localPhoneNumber}
                onChangeText={handlePhoneChange}
                placeholder="(555) 555-5555"
                keyboardType="phone-pad"
                autoFocus
                mode="flat"
                style={styles.input}
                underlineColor={theme.colors.primary}
                activeUnderlineColor={theme.colors.primary}
                error={!!error}
              />
              <View style={styles.helperTextContainer}>
                <HelperText type={error ? 'error' : 'info'} visible={true} style={styles.helperText}>
                  {error || "We'll send you a verification code."}
                </HelperText>
              </View>
            </View>

            <View style={styles.footer}>
              <Button
                mode="contained"
                onPress={handleContinue}
                disabled={isLoading || !validatePhoneNumber(localPhoneNumber)}
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
