import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, TextInput, Chip, ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import theme from '../../src/theme/theme';
import { SubscriptionTier } from '../../src/types';

type QuizStep = {
  id: number;
  question: string;
  type: 'text' | 'number' | 'select' | 'multiselect';
  options?: string[];
  field: keyof QuizState;
};

type QuizState = {
  age: string;
  location: string;
  budget: string;
  preferences: string[];
};

const quizSteps: QuizStep[] = [
  {
    id: 1,
    question: 'How old are you?',
    type: 'number',
    field: 'age',
  },
  {
    id: 2,
    question: 'Where are you located?',
    type: 'text',
    field: 'location',
  },
  {
    id: 3,
    question: 'What is your monthly budget for dating?',
    type: 'select',
    options: ['Under $50', '$50-$100', '$100-$200', 'Over $200'],
    field: 'budget',
  },
  {
    id: 4,
    question: 'What are you looking for?',
    type: 'multiselect',
    options: ['Casual dates', 'Long-term relationship', 'Networking', 'Friends', 'Premium experiences'],
    field: 'preferences',
  },
];

export default function QuizScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [quizState, setQuizState] = useState<QuizState>({
    age: '',
    location: '',
    budget: '',
    preferences: [],
  });

  const currentQuizStep = quizSteps[currentStep];
  const progress = (currentStep + 1) / quizSteps.length;

  const handleTextInput = (value: string) => {
    setQuizState({
      ...quizState,
      [currentQuizStep.field]: value,
    });
  };

  const handleSelectOption = (value: string) => {
    setQuizState({
      ...quizState,
      [currentQuizStep.field]: value,
    });
  };

  const handleMultiSelectOption = (value: string) => {
    const field = currentQuizStep.field as 'preferences';
    const currentValues = quizState[field];
    
    if (currentValues.includes(value)) {
      setQuizState({
        ...quizState,
        [field]: currentValues.filter(item => item !== value),
      });
    } else {
      setQuizState({
        ...quizState,
        [field]: [...currentValues, value],
      });
    }
  };

  const isNextButtonDisabled = () => {
    const field = currentQuizStep.field;
    
    if (field === 'preferences') {
      return quizState[field].length === 0;
    }
    
    return !quizState[field];
  };

  const handleNext = () => {
    if (currentStep < quizSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Quiz completed, determine recommended tier
      const recommendedTier = determineRecommendedTier(quizState);
      router.push({
        pathname: '/onboarding/subscription',
        params: { 
          recommendedTier,
          age: quizState.age,
          location: quizState.location,
          budget: quizState.budget,
          preferences: JSON.stringify(quizState.preferences)
        }
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const determineRecommendedTier = (state: QuizState): SubscriptionTier => {
    // Simple logic to determine recommended tier based on budget and preferences
    if (state.budget === 'Over $200' || state.preferences.includes('Premium experiences')) {
      return 'gold';
    } else if (state.budget === '$100-$200') {
      return 'silver';
    } else {
      return 'bronze';
    }
  };

  const renderQuizContent = () => {
    const { type, question, options, field } = currentQuizStep;

    return (
      <View style={styles.questionContainer}>
        <Text variant="headlineSmall" style={styles.question}>
          {question}
        </Text>

        {type === 'text' && (
          <TextInput
            mode="outlined"
            value={quizState[field] as string}
            onChangeText={handleTextInput}
            style={styles.input}
          />
        )}

        {type === 'number' && (
          <TextInput
            mode="outlined"
            value={quizState[field] as string}
            onChangeText={handleTextInput}
            keyboardType="numeric"
            style={styles.input}
          />
        )}

        {type === 'select' && options && (
          <View style={styles.optionsContainer}>
            {options.map((option) => (
              <Chip
                key={option}
                selected={quizState[field] === option}
                onPress={() => handleSelectOption(option)}
                style={[
                  styles.chip,
                  quizState[field] === option && styles.selectedChip,
                ]}
                textStyle={quizState[field] === option ? styles.selectedChipText : undefined}
              >
                {option}
              </Chip>
            ))}
          </View>
        )}

        {type === 'multiselect' && options && (
          <View style={styles.optionsContainer}>
            {options.map((option) => (
              <Chip
                key={option}
                selected={(quizState[field] as string[]).includes(option)}
                onPress={() => handleMultiSelectOption(option)}
                style={[
                  styles.chip,
                  (quizState[field] as string[]).includes(option) && styles.selectedChip,
                ]}
                textStyle={(quizState[field] as string[]).includes(option) ? styles.selectedChipText : undefined}
              >
                {option}
              </Chip>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} color={theme.colors.primary} style={styles.progressBar} />
        <Text variant="bodySmall" style={styles.progressText}>
          {currentStep + 1} of {quizSteps.length}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {renderQuizContent()}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={handleBack}
          style={[styles.button, styles.backButton]}
        >
          Back
        </Button>
        <Button
          mode="contained"
          onPress={handleNext}
          style={[styles.button, styles.nextButton]}
          disabled={isNextButtonDisabled()}
        >
          {currentStep < quizSteps.length - 1 ? 'Next' : 'Finish'}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  progressContainer: {
    padding: 16,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  progressText: {
    textAlign: 'right',
    marginTop: 4,
    color: theme.colors.onSurface,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  questionContainer: {
    flex: 1,
  },
  question: {
    marginBottom: 24,
    fontWeight: '600',
  },
  input: {
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    margin: 4,
    backgroundColor: theme.colors.surface,
  },
  selectedChip: {
    backgroundColor: theme.colors.primary,
  },
  selectedChipText: {
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.backdrop,
  },
  button: {
    flex: 1,
    margin: 4,
  },
  backButton: {
    borderColor: theme.colors.primary,
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
  },
});
