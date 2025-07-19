import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Text, HelperText, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useOnboarding } from '../../src/context/OnboardingContext';
import AuthService from '../../src/services/AuthService';

const CODE_LENGTH = 6;

export default function EmailVerificationScreen() {
  const { state, setEmailVerified } = useOnboarding();
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const slideAnim = useState(new Animated.Value(-Dimensions.get('window').width))[0];
  
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0 && resendDisabled) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, resendDisabled]);



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
        
        // Check if this was the last digit and trigger verification after a short delay
        if (currentIndex === CODE_LENGTH - 1) {
          setTimeout(() => {
            handleContinue();
          }, 300);
        }
      }
    }
    setCode(newCode);
  }, [code, isVerifying, handleContinue]);

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

  // We now handle verification after the last digit is entered in handleKeypadPress
  // This prevents the issue of not being able to enter the last digit

  const KeypadButton = ({ value, onPress }: { value: string; onPress: (val: string) => void }) => (
    <TouchableOpacity style={styles.keypadButton} onPress={() => onPress(value)} disabled={isVerifying}>
      {value === 'backspace' ? (
        <MaterialCommunityIcons name="backspace-outline" size={28} color="#FFFFFF" />
      ) : (
        <Text variant='headlineMedium' style={{color: '#FFFFFF'}}>{value}</Text>
      )}
    </TouchableOpacity>
  );

  const { height } = Dimensions.get('window');
  
  const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      backgroundColor: '#121212' 
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
    header: { 
      position: 'absolute', 
      top: 10, 
      left: 10, 
      zIndex: 1 
    },
    innerContainer: { 
      flex: 1, 
      justifyContent: 'space-between', 
      padding: 16 
    },
    titleSection: {
      height: height * 0.15,
      backgroundColor: '#FFEB3B',
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentSection: {
      flex: 1,
      backgroundColor: '#2A2A2A',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    keypadSection: {
      backgroundColor: '#1A1A1A',
      borderRadius: 24,
      padding: 16,
    },
    title: { 
      fontWeight: '700', 
      marginBottom: 8, 
      textAlign: 'center',
      color: '#000000',
      fontSize: 24
    },
    subtitle: { 
      textAlign: 'center', 
      marginBottom: 32, 
      color: '#CCCCCC' 
    },
    codeContainer: { 
      flexDirection: 'row', 
      justifyContent: 'center', 
      marginBottom: 16 
    },
    codeInput: { 
      width: 40, 
      height: 50, 
      borderBottomWidth: 2, 
      justifyContent: 'center', 
      alignItems: 'center', 
      marginHorizontal: 5 
    },
    codeInputText: { 
      fontSize: 28, 
      color: '#FFFFFF' 
    },
    keypadContainer: { 
      alignItems: 'center', 
      paddingVertical: 16 
    },
    keypadRow: { 
      flexDirection: 'row', 
      justifyContent: 'space-around', 
      marginBottom: 16, 
      width: '100%' 
    },
    keypadButton: { 
      width: 75, 
      height: 75, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: '#333333',
      borderRadius: 16,
    },
    emptyKeypadButton: { 
      width: 75, 
      height: 75 
    },
    footer: { 
      paddingBottom: 24 
    },
    button: { 
      marginTop: 16 
    },
    buttonContent: { 
      paddingVertical: 8 
    },
    snackbar: { 
      backgroundColor: '#333333', 
      bottom: 100 
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Animated.View style={[{ flex: 1 }, { transform: [{ translateX: slideAnim }] }]}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.bentoGrid}>
            <View style={styles.header}>
              <Button mode="text" onPress={() => router.back()} textColor="#FFFFFF">Back</Button>
            </View>

            {/* Title Section */}
            <View style={[styles.bentoItem, styles.titleSection]}>
              <Text style={styles.title}>Verify your email</Text>
            </View>

            {/* Content Section */}
            <View style={[styles.bentoItem, styles.contentSection]}>
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
                        { borderBottomColor: error ? '#FF5252' : isActive ? '#FFEB3B' : isFilled ? '#FFFFFF' : '#555555' },
                      ]}>
                      <Text style={styles.codeInputText}>{digit}</Text>
                    </View>
                  );
                })}
              </View>

              <HelperText type="error" visible={!!error} style={{ color: '#FF5252' }}>{error}</HelperText>

              <Button
                mode="text"
                onPress={handleResendCode}
                disabled={resendDisabled}
                textColor="#FFEB3B"
              >
                {resendDisabled ? `Resend code in ${countdown}s` : 'Resend code'}
              </Button>
            </View>

            {/* Keypad Section */}
            <View style={[styles.bentoItem, styles.keypadSection]}>
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
      </Animated.View>
    </SafeAreaView>
  );
}
