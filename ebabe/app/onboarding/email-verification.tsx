import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Button, Text, useTheme, HelperText, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useOnboarding } from '../../src/context/OnboardingContext';
import AuthService from '../../src/services/AuthService';

const CODE_LENGTH = 6;

export default function EmailVerificationScreen() {
  const theme = useTheme();
  const { state, setEmailVerified } = useOnboarding();
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && resendDisabled) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, resendDisabled]);

  const handleKeypadPress = useCallback((digit: string) => {
    if (isVerifying) return;
    setError('');
    let newCode = [...code];
    const currentIndex = newCode.findIndex(c => c === '');

    if (digit === 'backspace') {
      if (currentIndex === -1) { // Full code
        newCode[CODE_LENGTH - 1] = '';
      } else if (currentIndex > 0) {
        newCode[currentIndex - 1] = '';
      }
    } else {
      if (currentIndex !== -1) {
        newCode[currentIndex] = digit;
      }
    }
    setCode(newCode);
  }, [code, isVerifying]);

  const handleResendCode = async () => {
    try {
      setResendDisabled(true);
      setCountdown(30);
      const success = await AuthService.sendEmailVerificationCode(state.email);
      if (success) {
        setSnackbarMessage(`A new code has been sent to ${state.email}`);
        setSnackbarVisible(true);
        setCode(Array(CODE_LENGTH).fill(''));
      } else {
        setError('Failed to send new code. Please try again.');
        setResendDisabled(false);
      }
    } catch (err) {
      console.error('Error resending code:', err);
      setError('Something went wrong. Please try again.');
      setResendDisabled(false);
    }
  };

  const handleContinue = useCallback(async () => {
    const enteredCode = code.join('');
    if (enteredCode.length !== CODE_LENGTH) return;

    setIsVerifying(true);
    setError('');

    try {
      const isVerified = await AuthService.verifyEmailCode(state.email, enteredCode);
      if (isVerified) {
        setEmailVerified(true);
        router.push('/onboarding/birthdate');
      } else {
        setError('Invalid verification code. Please try again.');
        setCode(Array(CODE_LENGTH).fill(''));
      }
    } catch (err) {
      console.error('Error verifying code:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  }, [code, state.email, setEmailVerified]);

  useEffect(() => {
    if (code.every(c => c !== '')) {
      handleContinue();
    }
  }, [code, handleContinue]);

  const KeypadButton = ({ value, onPress }: { value: string; onPress: (val: string) => void }) => (
    <TouchableOpacity style={styles.keypadButton} onPress={() => onPress(value)} disabled={isVerifying}>
      <Text variant='headlineMedium' style={{color: theme.colors.onSurface}}>{value}</Text>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { position: 'absolute', top: 10, left: 10, zIndex: 1 },
    innerContainer: { flex: 1, justifyContent: 'space-between', padding: 24 },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontWeight: '700', marginBottom: 8, textAlign: 'center' },
    subtitle: { textAlign: 'center', marginBottom: 32, color: theme.colors.onSurfaceVariant },
    codeContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
    codeInput: { width: 40, height: 50, borderBottomWidth: 2, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 },
    codeInputText: { fontSize: 28, color: theme.colors.onSurface },
    keypadContainer: { alignItems: 'center', paddingVertical: 16 },
    keypadRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16, width: '100%' },
    keypadButton: { width: 75, height: 75, justifyContent: 'center', alignItems: 'center' },
    emptyKeypadButton: { width: 75, height: 75 },
    footer: { paddingBottom: 24 },
    button: { marginTop: 16 },
    buttonContent: { paddingVertical: 8 },
    snackbar: { backgroundColor: theme.colors.surfaceVariant, bottom: 100 },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <Button mode="text" onPress={() => router.back()} textColor={theme.colors.onSurface}>Back</Button>
          </View>

          <View style={styles.content}>
            <Text variant="headlineMedium" style={styles.title}>Verify your email</Text>
            <Text style={styles.subtitle}>Enter the 6-digit code sent to {state.email}</Text>

            <View style={styles.codeContainer}>
              {code.map((digit, index) => {
                const isFilled = digit !== '';
                const isActive = code.findIndex(c => c === '') === index;
                return (
                  <View
                    key={index}
                    style={[
                      styles.codeInput,
                      { borderBottomColor: error ? theme.colors.error : isActive ? theme.colors.primary : isFilled ? theme.colors.onSurface : theme.colors.surfaceVariant },
                    ]}>
                    <Text style={styles.codeInputText}>{digit}</Text>
                  </View>
                );
              })}
            </View>

            <HelperText type="error" visible={!!error}>{error}</HelperText>

            <Button
              mode="text"
              onPress={handleResendCode}
              disabled={resendDisabled}
              textColor={theme.colors.primary}
            >
              {resendDisabled ? `Resend code in ${countdown}s` : 'Resend code'}
            </Button>
          </View>

          <View style={styles.keypadContainer}>
            <View style={styles.keypadRow}>
              <KeypadButton value="1" onPress={handleKeypadPress} />
              <KeypadButton value="2" onPress={handleKeypadPress} />
              <KeypadButton value="3" onPress={handleKeypadPress} />
            </View>
            <View style={styles.keypadRow}>
              <KeypadButton value="4" onPress={handleKeypadPress} />
              <KeypadButton value="5" onPress={handleKeypadPress} />
              <KeypadButton value="6" onPress={handleKeypadPress} />
            </View>
            <View style={styles.keypadRow}>
              <KeypadButton value="7" onPress={handleKeypadPress} />
              <KeypadButton value="8" onPress={handleKeypadPress} />
              <KeypadButton value="9" onPress={handleKeypadPress} />
            </View>
            <View style={styles.keypadRow}>
              <View style={styles.emptyKeypadButton} />
              <KeypadButton value="0" onPress={handleKeypadPress} />
              <KeypadButton value="backspace" onPress={handleKeypadPress} />
            </View>
          </View>
        </View>
      </ScrollView>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
}
