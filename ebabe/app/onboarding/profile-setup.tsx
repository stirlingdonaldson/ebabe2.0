import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import theme from '../../src/theme/theme';
import { StatusBar } from 'expo-status-bar';
import { useOnboarding } from '../../src/context/OnboardingContext';

export default function ProfileSetupScreen() {
  const { state, setProfileOption } = useOnboarding();
  const [selectedOption, setSelectedOption] = useState<string | null>(state.profileOption);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    if (!selectedOption) return;
    
    try {
      setIsLoading(true);
      
      // Save the selected option to context
      setProfileOption(selectedOption);
      
      // Navigate to the final screen
      router.push('/onboarding/final');
    } catch (error) {
      console.error('Error saving profile option:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = !selectedOption || isLoading;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text variant="headlineSmall" style={styles.title}>
            You're one of a kind.
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Your profile should be too.
          </Text>
          
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionCard,
                selectedOption === 'option1' && styles.selectedCard
              ]}
              onPress={() => setSelectedOption('option1')}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionIconContainer}>
                  <Text style={styles.optionIcon}>📸</Text>
                </View>
                <Text style={styles.optionTitle}>Upload photos</Text>
                <Text style={styles.optionDescription}>
                  Add your best photos to create your profile
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.optionCard,
                selectedOption === 'option2' && styles.selectedCard
              ]}
              onPress={() => setSelectedOption('option2')}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionIconContainer}>
                  <Text style={styles.optionIcon}>👤</Text>
                </View>
                <Text style={styles.optionTitle}>Create profile</Text>
                <Text style={styles.optionDescription}>
                  Tell us about yourself and what you're looking for
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.optionCard,
                selectedOption === 'option3' && styles.selectedCard
              ]}
              onPress={() => setSelectedOption('option3')}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionIconContainer}>
                  <Text style={styles.optionIcon}>🔍</Text>
                </View>
                <Text style={styles.optionTitle}>Set preferences</Text>
                <Text style={styles.optionDescription}>
                  Tell us who you want to meet and we'll find them for you
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          style={[styles.button, isButtonDisabled && styles.disabledButton]}
          contentStyle={styles.buttonContent}
          onPress={handleContinue}
          disabled={isButtonDisabled}
          loading={isLoading}
        >
          Continue
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
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 16,
  },
  backButton: {
    fontSize: 16,
    color: theme.colors.primary,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#555555',
  },
  optionsContainer: {
    marginTop: 16,
  },
  optionCard: {
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    padding: 16,
  },
  selectedCard: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(103, 80, 164, 0.05)',
  },
  optionContent: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 8,
  },
  optionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionIcon: {
    fontSize: 24,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  optionDescription: {
    textAlign: 'center',
    color: '#777777',
  },
  footer: {
    padding: 24,
  },
  button: {
    borderRadius: 30,
    paddingVertical: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
