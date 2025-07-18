import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Button, Text, Card, Divider, IconButton, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { SubscriptionTier } from '../../src/types';
import { StatusBar } from 'expo-status-bar';

type SubscriptionPlan = {
  tier: SubscriptionTier;
  price: string;
  benefits: string[];
  recommended?: boolean;
};

const subscriptionPlans: SubscriptionPlan[] = [
  { tier: 'bronze', price: '$9.99', benefits: ['Basic listings', 'Standard bid limits', 'Regular notifications'] },
  { tier: 'silver', price: '$19.99', benefits: ['Mid-tier listings', 'Higher bid limits', 'Priority notifications', 'Premium filters'], recommended: true },
  { tier: 'gold', price: '$49.99', benefits: ['Premium listings', 'Unlimited bids', 'Featured placement', 'VIP customer support', 'Exclusive events access'] },
];

export default function SubscriptionScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('silver');

  const handleContinue = () => {
    router.push({ pathname: '/onboarding/profile', params: { ...params, selectedTier } });
  };

  const getTierColor = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'bronze': return '#CD7F32';
      case 'silver': return '#C0C0C0';
      case 'gold': return '#FFD700';
      default: return theme.colors.primary;
    }
  };

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
    headerSection: {
      height: height * 0.12,
      backgroundColor: '#2A2A2A',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    titleSection: {
      height: height * 0.15,
      backgroundColor: '#1E1E1E',
      justifyContent: 'center',
      alignItems: 'center',
    },
    plansSection: {
      flex: 1,
      backgroundColor: '#1A1A1A',
      minHeight: height * 0.5,
    },
    actionSection: {
      height: height * 0.12,
      backgroundColor: '#2A2A2A',
      justifyContent: 'center',
    },
    scrollContent: { 
      flexGrow: 1 
    },
    title: { 
      fontWeight: 'bold', 
      textAlign: 'center', 
      marginBottom: 8,
      color: '#FFFFFF',
    },
    subtitle: { 
      textAlign: 'center', 
      marginBottom: 24, 
      color: '#CCCCCC' 
    },
    card: { 
      borderRadius: 16, 
      marginBottom: 16, 
      backgroundColor: '#2A2A2A',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 2,
    },
    selectedCard: { 
      borderWidth: 2, 
      borderColor: '#FFEB3B',
      backgroundColor: '#333333',
    },
    recommendedBadge: { 
      position: 'absolute', 
      top: 12, 
      right: 12, 
      backgroundColor: '#FFEB3B', 
      paddingHorizontal: 12, 
      paddingVertical: 4, 
      borderRadius: 12, 
      zIndex: 1 
    },
    recommendedText: { 
      color: '#000000', 
      fontSize: 12, 
      fontWeight: 'bold' 
    },
    tierHeader: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      marginBottom: 8 
    },
    tierText: { 
      color: '#FFFFFF', 
      fontWeight: 'bold' 
    },
    price: { 
      fontWeight: 'bold', 
      color: '#FFFFFF' 
    },
    divider: { 
      marginVertical: 16, 
      backgroundColor: '#444444' 
    },
    benefitItem: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      marginBottom: 8 
    },
    checkIcon: { 
      margin: 0, 
      marginRight: 8 
    },
    button: { 
      marginTop: 16,
      backgroundColor: '#FFEB3B',
    },
    buttonContent: { 
      paddingVertical: 8 
    },

  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.bentoGrid}>
        {/* Header Section */}
        <View style={[styles.bentoItem, styles.headerSection]}>
          <Button mode="text" onPress={() => router.back()} textColor="#FFEB3B">Back</Button>
          <View style={{ width: 60, height: 30, backgroundColor: '#FFEB3B', borderRadius: 15 }} />
        </View>

        {/* Title Section */}
        <View style={[styles.bentoItem, styles.titleSection]}>
          <Text variant="headlineMedium" style={styles.title}>Choose Your Plan</Text>
          <Text variant="bodyLarge" style={styles.subtitle}>Unlock exclusive features.</Text>
        </View>

        {/* Plans Section */}
        <View style={[styles.bentoItem, styles.plansSection]}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {subscriptionPlans.map((plan) => (
              <TouchableOpacity key={plan.tier} onPress={() => setSelectedTier(plan.tier)} activeOpacity={0.9}>
                <Card style={[styles.card, selectedTier === plan.tier && styles.selectedCard]}>
                  {plan.recommended && (
                    <View style={styles.recommendedBadge}>
                      <Text style={styles.recommendedText}>Recommended</Text>
                    </View>
                  )}
                  <Card.Content>
                    <View style={styles.tierHeader}>
                      <Text variant="titleLarge" style={{ color: getTierColor(plan.tier), fontWeight: 'bold' }}>
                        {plan.tier.charAt(0).toUpperCase() + plan.tier.slice(1)}
                      </Text>
                      <Text variant="headlineSmall" style={styles.price}>
                        {plan.price}<Text variant="bodySmall"> / month</Text>
                      </Text>
                    </View>
                    <Divider style={styles.divider} />
                    <View>
                      {plan.benefits.map((benefit, index) => (
                        <View key={index} style={styles.benefitItem}>
                          <IconButton icon="check" size={20} iconColor="#FFEB3B" style={styles.checkIcon} />
                          <Text variant="bodyMedium" style={{ color: '#CCCCCC' }}>{benefit}</Text>
                        </View>
                      ))}
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Action Section */}
        <View style={[styles.bentoItem, styles.actionSection]}>
          <Button
            mode="contained"
            onPress={handleContinue}
            disabled={!selectedTier}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={{ fontWeight: '600' }}
          >
            Continue
          </Button>
        </View>


      </View>
    </SafeAreaView>
  );
}
