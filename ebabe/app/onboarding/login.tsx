import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Button, Text, TextInput, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signIn(email, password);
      router.push('/onboarding/quiz');
    } catch (error: any) {
      setError(error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const { height } = Dimensions.get('window');

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
      height: height * 0.2,
      backgroundColor: '#1E1E1E',
      justifyContent: 'center',
      alignItems: 'center',
    },
    formSection: {
      flex: 1,
      backgroundColor: '#2A2A2A',
      justifyContent: 'center',
      minHeight: height * 0.5,
    },
    actionSection: {
      height: height * 0.15,
      backgroundColor: '#1A1A1A',
      justifyContent: 'center',
    },
    title: {
      color: '#FFEB3B',
      fontWeight: '700',
      textAlign: 'center',
    },
    subtitle: {
      marginTop: 8,
      color: '#CCCCCC',
      textAlign: 'center',
    },
    form: {
      width: '100%',
    },
    input: {
      marginBottom: 16,
      backgroundColor: 'transparent',
    },
    button: {
      marginTop: 24,
      backgroundColor: '#FFEB3B',
    },
    buttonContent: {
      paddingVertical: 8,
    },
    secondaryButtonContainer: {
      marginTop: 16,
      alignItems: 'center',
    },
    decorativeLeft: {
      position: 'absolute',
      top: height * 0.35,
      left: 16,
      width: 70,
      height: 70,
      backgroundColor: '#333333',
      borderRadius: 20,
    },
    decorativeRight: {
      position: 'absolute',
      top: height * 0.55,
      right: 16,
      width: 90,
      height: 60,
      backgroundColor: '#444444',
      borderRadius: 20,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bentoGrid}>
        {/* Header Section */}
        <View style={[styles.bentoItem, styles.headerSection]}>
          <Text variant="displaySmall" style={styles.title}>
            Welcome Back
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Sign in to continue your journey
          </Text>
        </View>

        {/* Form Section */}
        <View style={[styles.bentoItem, styles.formSection]}>
          <View style={styles.form}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="flat"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              underlineColor="#FFEB3B"
              activeUnderlineColor="#FFEB3B"
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="flat"
              secureTextEntry={!passwordVisible}
              right={
                <TextInput.Icon
                  icon={passwordVisible ? 'eye-off' : 'eye'}
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  color="#CCCCCC"
                />
              }
              style={styles.input}
              underlineColor="#FFEB3B"
              activeUnderlineColor="#FFEB3B"
            />

            {error && (
              <HelperText type="error" visible={!!error}>
                {error}
              </HelperText>
            )}
          </View>
        </View>

        {/* Action Section */}
        <View style={[styles.bentoItem, styles.actionSection]}>
          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            contentStyle={styles.buttonContent}
            loading={loading}
            disabled={loading}
            labelStyle={{ fontWeight: '700' }}
          >
            Sign In
          </Button>

          <View style={styles.secondaryButtonContainer}>
            <Button
              mode="text"
              onPress={() => router.push('/onboarding/signup')}
              textColor="#FFEB3B"
            >
              Don't have an account? Sign Up
            </Button>
          </View>
        </View>

        {/* Decorative Elements */}
        <View style={[styles.bentoItem, styles.decorativeLeft]}></View>
        <View style={[styles.bentoItem, styles.decorativeRight]}></View>
      </View>
    </SafeAreaView>
  );
}
