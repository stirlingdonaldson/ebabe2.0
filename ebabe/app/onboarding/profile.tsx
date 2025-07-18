import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Text, TextInput, HelperText, Avatar, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../src/context/AuthContext';
import { useOnboarding } from '../../src/context/OnboardingContext';
import { StatusBar } from 'expo-status-bar';

export default function ProfileScreen() {
  const theme = useTheme();
  const { user, setOnboardingComplete } = useAuth();
  const { state: onboardingState } = useOnboarding();
  const params = useLocalSearchParams();
  const selectedTier = params.selectedTier as string;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    location: '',
    bio: '',
    photos: [] as string[],
  });

  const handleInputChange = (field: keyof typeof profile, value: string | string[]) => {
    setError(null);
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      allowsMultipleSelection: true,
      selectionLimit: 6 - profile.photos.length,
    });

    if (!result.canceled && result.assets) {
      const newPhotos = result.assets.map(asset => asset.uri);
      handleInputChange('photos', [...profile.photos, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = [...profile.photos];
    updatedPhotos.splice(index, 1);
    handleInputChange('photos', updatedPhotos);
  };

  const calculateAge = (birthdate: { month: string; day: string; year: string }) => {
    const { month, day, year } = birthdate;
    const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateForm = () => {
    if (!onboardingState.name) {
      setError('Name is missing from your profile.');
      return false;
    }
    if (!profile.location) {
      setError('Please enter your location.');
      return false;
    }
    if (!profile.bio) {
      setError('Please write a short bio.');
      return false;
    }
    if (profile.photos.length === 0) {
      setError('Please add at least one photo.');
      return false;
    }
    return true;
  };

  const handleComplete = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      if (!user) throw new Error('No user logged in');

      const age = calculateAge(onboardingState.birthdate);

      const { error: profileError } = await supabase.from('profiles').upsert({
        user_id: user.id,
        name: onboardingState.name,
        age: age,
        location: profile.location,
        bio: profile.bio,
        photos: profile.photos, // In real app, these would be storage URLs
      }, { onConflict: 'user_id' });

      if (profileError) throw profileError;

      if (selectedTier) {
        const { error: subscriptionError } = await supabase.from('subscriptions').insert({
          user_id: user.id,
          tier: selectedTier,
          status: 'active',
          renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
        if (subscriptionError) throw subscriptionError;
      }

      setOnboardingComplete(true);
      router.replace('/(tabs)');
    } catch (error: any) {
      setError(error.message || 'An error occurred while saving your profile');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: { flexGrow: 1 },
    innerContainer: { flex: 1, justifyContent: 'space-between', padding: 24 },
    header: { position: 'absolute', top: 10, left: 10, zIndex: 1 },
    content: { paddingTop: 60 },
    title: { fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
    subtitle: { textAlign: 'center', marginBottom: 24, color: theme.colors.onSurfaceVariant },
    input: { backgroundColor: 'transparent', marginBottom: 16 },
    photosTitle: { fontWeight: 'bold', marginTop: 16, marginBottom: 4 },
    photosSubtitle: { marginBottom: 16, color: theme.colors.onSurfaceVariant },
    photosContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    photoItem: { width: 100, height: 100, borderRadius: 8, marginRight: 12, marginBottom: 12, position: 'relative' },
    photo: { width: '100%', height: '100%', borderRadius: 8 },
    removeButton: { position: 'absolute', top: -5, right: -5, backgroundColor: theme.colors.surface, borderRadius: 12 },
    addPhotoButton: { width: 100, height: 100, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.primary, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', marginRight: 12, marginBottom: 12 },
    addIcon: { backgroundColor: 'transparent' },
    footer: { paddingBottom: 24 },
    button: { marginTop: 16 },
    buttonContent: { paddingVertical: 8 },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.innerContainer}>
            <View style={styles.header}>
                <Button mode="text" onPress={() => router.back()} textColor={theme.colors.onSurface}>Back</Button>
            </View>
            <View>
              <View style={styles.content}>
                <Text variant="headlineMedium" style={styles.title}>Complete Your Profile</Text>
                <Text variant="bodyLarge" style={styles.subtitle}>This is how you'll appear to others.</Text>
              </View>

              <TextInput
                label="Name"
                value={onboardingState.name}
                disabled
                mode="flat"
                style={styles.input}
                underlineColor={theme.colors.primary}
                activeUnderlineColor={theme.colors.primary}
              />

              <TextInput
                label="Location"
                value={profile.location}
                onChangeText={(value) => handleInputChange('location', value)}
                mode="flat"
                style={styles.input}
                underlineColor={theme.colors.primary}
                activeUnderlineColor={theme.colors.primary}
              />

              <TextInput
                label="Bio"
                value={profile.bio}
                onChangeText={(value) => handleInputChange('bio', value)}
                mode="flat"
                multiline
                numberOfLines={4}
                style={styles.input}
                underlineColor={theme.colors.primary}
                activeUnderlineColor={theme.colors.primary}
              />

              <Text variant="titleMedium" style={styles.photosTitle}>Add Photos</Text>
              <Text variant="bodyMedium" style={styles.photosSubtitle}>Add up to 6 photos.</Text>

              <View style={styles.photosContainer}>
                {profile.photos.map((photo, index) => (
                  <View key={index} style={styles.photoItem}>
                    <Image source={{ uri: photo }} style={styles.photo} />
                    <TouchableOpacity style={styles.removeButton} onPress={() => removePhoto(index)}>
                      <Avatar.Icon size={24} icon="close" color={theme.colors.onSurface} style={{ backgroundColor: 'transparent' }} />
                    </TouchableOpacity>
                  </View>
                ))}
                {profile.photos.length < 6 && (
                  <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage}>
                    <Avatar.Icon size={40} icon="plus" color={theme.colors.primary} style={styles.addIcon} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.footer}>
              <HelperText type="error" visible={!!error}>{error}</HelperText>
              <Button
                mode="contained"
                onPress={handleComplete}
                loading={loading}
                disabled={loading}
                style={styles.button}
                contentStyle={styles.buttonContent}
                labelStyle={{ fontWeight: theme.fonts.titleMedium.fontWeight }}
              >
                Complete Profile
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
