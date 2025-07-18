import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useOnboarding } from '../../src/context/OnboardingContext';

export default function NameScreen() {
  const theme = useTheme();
  const { state, setName } = useOnboarding();
  const [localName, setLocalName] = useState(state.name);

  const handleContinue = () => {
    if (localName.trim()) {
      setName(localName.trim());
      router.push('/onboarding/email');
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
                What's your name?
              </Text>
              <TextInput
                label="Name"
                value={localName}
                onChangeText={setLocalName}
                autoFocus
                autoCapitalize="words"
                mode="flat"
                style={styles.input}
                underlineColor={theme.colors.primary}
                activeUnderlineColor={theme.colors.primary}
              />
            </View>

            <View style={styles.footer}>
              <Button
                mode="contained"
                onPress={handleContinue}
                disabled={!localName.trim()}
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
