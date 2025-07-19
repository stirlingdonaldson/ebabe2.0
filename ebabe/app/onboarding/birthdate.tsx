import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Text, useTheme, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useOnboarding } from '../../src/context/OnboardingContext';

export default function BirthdateScreen() {
  const theme = useTheme();
  const { setBirthdate } = useOnboarding();
  const [dateString, setDateString] = useState('');
  const [error, setError] = useState('');

  const handleKeypadPress = useCallback((value: string) => {
    setError('');
    if (value === 'backspace') {
      setDateString((prev) => prev.slice(0, -1));
    } else if (dateString.length < 8) {
      setDateString((prev) => prev + value);
    }
  }, [dateString.length]);

  const validateDate = (dateStr: string): { isValid: boolean; message: string; age?: number } => {
    if (dateStr.length !== 8) return { isValid: false, message: '' };

    const month = parseInt(dateStr.substring(0, 2), 10);
    const day = parseInt(dateStr.substring(2, 4), 10);
    const year = parseInt(dateStr.substring(4, 8), 10);

    if (isNaN(month) || isNaN(day) || isNaN(year)) return { isValid: false, message: 'Invalid date format.' };

    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
      return { isValid: false, message: 'Please enter a valid date.' };
    }

    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
      age--;
    }

    if (age < 18) {
      return { isValid: false, message: 'You must be at least 18 years old to join.', age };
    }

    return { isValid: true, message: '', age };
  };

  const handleContinue = () => {
    const validation = validateDate(dateString);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

    const month = dateString.substring(0, 2);
    const day = dateString.substring(2, 4);
    const year = dateString.substring(4, 8);
    setBirthdate(month, day, year);
    router.push('/onboarding/subscription');
  };

  const formatDateDisplay = () => {
    const month = dateString.substring(0, 2).padEnd(2, 'M');
    const day = dateString.substring(2, 4).padEnd(2, 'D');
    const year = dateString.substring(4, 8).padEnd(4, 'Y');
    return `${month} / ${day} / ${year}`;
  };

  const KeypadButton = ({ value }: { value: string }) => (
    <TouchableOpacity style={styles.keypadButton} onPress={() => handleKeypadPress(value)}>
      {value === 'backspace' ? (
        <MaterialCommunityIcons name="backspace-outline" size={24} color={theme.colors.onSurface} />
      ) : (
        <Text variant='headlineSmall' style={{ color: theme.colors.onSurface }}>
          {value}
        </Text>
      )}
    </TouchableOpacity>
  );

  const isButtonDisabled = !validateDate(dateString).isValid;

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContainer: { flexGrow: 1 },
    innerContainer: { flex: 1, justifyContent: 'space-between', padding: 24 },
    header: { position: 'absolute', top: 10, left: 10, zIndex: 1 },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontWeight: '700', marginBottom: 24, textAlign: 'center' },
    dateDisplay: { marginBottom: 24 },
    dateText: { fontSize: 32, fontWeight: 'bold', letterSpacing: 4, color: theme.colors.onSurface },
    keypadContainer: { alignItems: 'center', paddingVertical: 16 },
    keypadRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16, width: '100%' },
    keypadButton: { width: 75, height: 75, justifyContent: 'center', alignItems: 'center' },
    emptyKeypadButton: { width: 75, height: 75 },
    footer: { paddingBottom: 24 },
    button: { marginTop: 16 },
    buttonContent: { paddingVertical: 8 },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <Button mode="text" onPress={() => router.back()} textColor={theme.colors.onSurface}>Back</Button>
          </View>

          <View style={styles.content}>
            <Text variant="headlineMedium" style={styles.title}>What's your birthdate?</Text>
            <View style={styles.dateDisplay}>
              <Text style={styles.dateText}>{formatDateDisplay()}</Text>
            </View>
            <HelperText type="error" visible={!!error}>{error}</HelperText>
          </View>

          <View>
            <View style={styles.keypadContainer}>
              <View style={styles.keypadRow}>
                <KeypadButton value="1" /><KeypadButton value="2" /><KeypadButton value="3" />
              </View>
              <View style={styles.keypadRow}>
                <KeypadButton value="4" /><KeypadButton value="5" /><KeypadButton value="6" />
              </View>
              <View style={styles.keypadRow}>
                <KeypadButton value="7" /><KeypadButton value="8" /><KeypadButton value="9" />
              </View>
              <View style={styles.keypadRow}>
                <View style={styles.emptyKeypadButton} />
                <KeypadButton value="0" />
                <KeypadButton value="backspace" />
              </View>
            </View>

            <View style={styles.footer}>
              <Button
                mode="contained"
                onPress={handleContinue}
                disabled={isButtonDisabled}
                style={styles.button}
                contentStyle={styles.buttonContent}
                labelStyle={{ fontWeight: theme.fonts.titleMedium.fontWeight }}
              >
                Continue
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
