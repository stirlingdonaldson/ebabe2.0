export type UserProfile = {
  id?: string;
  user_id?: string;
  age?: number;
  location?: string;
  bio?: string;
  photos?: string[];
  created_at?: string;
  updated_at?: string;
};

export type SubscriptionTier = 'bronze' | 'silver' | 'gold';

export type Subscription = {
  id?: string;
  user_id?: string;
  tier: SubscriptionTier;
  status: 'active' | 'canceled' | 'expired';
  renewal_date?: string;
  created_at?: string;
  updated_at?: string;
};

export type OnboardingState = {
  step: number;
  email: string;
  password: string;
  age: string;
  location: string;
  bio: string;
  budget: string;
  preferences: string[];
  recommendedTier: SubscriptionTier;
  selectedTier: SubscriptionTier | null;
};
