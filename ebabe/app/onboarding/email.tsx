import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Dimensions, Animated } from 'react-native';
import { Button, Text, TextInput, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useOnboarding } from '../../src/context/OnboardingContext';
import AuthService from '../../src/services/AuthService';

export default function EmailScreen() {
  const { state, setEmail } = useOnboarding();
  const [localEmail, setLocalEmail] = useState(state.email);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const slideAnim = useState(new Animated.Value(-Dimensions.get('window').width))[0];
  
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

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
      
      // Call the actual authentication service
      const success = await AuthService.sendEmailVerificationCode(trimmedEmail);
      
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

  const { height } = Dimensions.get('window');
  
  const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      backgroundColor: '#121212' 
    },
    scrollContainer: { 
      flexGrow: 1 
    },
    innerContainer: { 
      flex: 1, 
      justifyContent: 'space-between', 
      padding: 16 
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
      minHeight: height * 0.5,
    },
    title: { 
      fontWeight: '700', 
      marginBottom: 24, 
      textAlign: 'center',
      color: '#000000',
      fontSize: 24
    },
    input: { 
      backgroundColor: 'transparent', 
      width: '100%', 
      textAlign: 'center', 
      fontSize: 22,
      color: '#FFFFFF'
    },
    helperText: { 
      textAlign: 'center', 
      marginTop: 8,
      color: '#CCCCCC' 
    },
    footer: { 
      paddingBottom: 24 
    },
    button: { 
      marginTop: 16,
      backgroundColor: '#FFEB3B'
    },
    buttonContent: { 
      paddingVertical: 8 
    },
    buttonLabel: {
      color: '#000000',
      fontWeight: '700'
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Animated.View style={[{ flex: 1 }, { transform: [{ translateX: slideAnim }] }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.bentoGrid}>
              <View style={styles.header}>
                <Button mode="text" onPress={() => router.back()} textColor="#FFFFFF">Back</Button>
              </View>

              {/* Title Section */}
              <View style={[styles.bentoItem, styles.titleSection]}>
                <Text style={styles.title}>
                  What's your email?
                </Text>
              </View>

              {/* Content Section */}
              <View style={[styles.bentoItem, styles.contentSection]}>
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
                  theme={{ colors: { primary: '#FFEB3B', onSurfaceVariant: '#CCCCCC' } }}
                  error={!!error}
                  disabled={isLoading}
                  textColor="#FFFFFF"
                />
                <HelperText type={error ? 'error' : 'info'} visible={true} style={styles.helperText}>
                  {error || "We'll send a verification code to this email."}
                </HelperText>

                <View style={styles.footer}>
                  <Button
                    mode="contained"
                    onPress={handleContinue}
                    disabled={!validateEmail(localEmail) || isLoading}
                    loading={isLoading}
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                    labelStyle={styles.buttonLabel}
                  >
                    Continue
                  </Button>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>
    </SafeAreaView>
  );
}