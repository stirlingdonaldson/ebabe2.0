import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of our onboarding state
interface OnboardingState {
  phoneNumber: string;
  phoneVerified: boolean;
  name: string;
  email: string;
  emailVerified: boolean;
  birthdate: {
    month: string;
    day: string;
    year: string;
  };
  profileOption: string | null;
}

// Define the shape of our context
interface OnboardingContextType {
  state: OnboardingState;
  setPhoneNumber: (phoneNumber: string) => void;
  setPhoneVerified: (verified: boolean) => void;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setEmailVerified: (verified: boolean) => void;
  setBirthdate: (month: string, day: string, year: string) => void;
  setProfileOption: (option: string) => void;
  resetOnboarding: () => void;
}

// Create the context with a default value
const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Initial state for the onboarding process
const initialState: OnboardingState = {
  phoneNumber: '',
  phoneVerified: false,
  name: '',
  email: '',
  emailVerified: false,
  birthdate: {
    month: '',
    day: '',
    year: '',
  },
  profileOption: null,
};

// Provider component
export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<OnboardingState>(initialState);

  const setPhoneNumber = (phoneNumber: string) => {
    setState((prevState) => ({
      ...prevState,
      phoneNumber,
    }));
  };

  const setPhoneVerified = (verified: boolean) => {
    setState((prevState) => ({
      ...prevState,
      phoneVerified: verified,
    }));
  };

  const setName = (name: string) => {
    setState((prevState) => ({
      ...prevState,
      name,
    }));
  };

  const setEmail = (email: string) => {
    setState((prevState) => ({
      ...prevState,
      email,
    }));
  };

  const setEmailVerified = (verified: boolean) => {
    setState((prevState) => ({
      ...prevState,
      emailVerified: verified,
    }));
  };

  const setBirthdate = (month: string, day: string, year: string) => {
    setState((prevState) => ({
      ...prevState,
      birthdate: {
        month,
        day,
        year,
      },
    }));
  };

  const setProfileOption = (option: string) => {
    setState((prevState) => ({
      ...prevState,
      profileOption: option,
    }));
  };

  const resetOnboarding = () => {
    setState(initialState);
  };

  const value = {
    state,
    setPhoneNumber,
    setPhoneVerified,
    setName,
    setEmail,
    setEmailVerified,
    setBirthdate,
    setProfileOption,
    resetOnboarding,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

// Custom hook to use the onboarding context
export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
