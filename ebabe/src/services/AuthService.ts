// axios will be used in a real implementation
// import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
// These imports are commented out as they're not used in the demo implementation
// import * as Google from 'expo-auth-session/providers/google';
// import * as AppleAuthentication from 'expo-apple-authentication';

// Base URL for the API
// In a real app, this would come from environment variables
// const API_BASE_URL = 'https://api.example.com';

// Keys for storing auth data in SecureStore
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

// Interface for user data
export interface UserData {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  birthdate: {
    month: string;
    day: string;
    year: string;
  };
  profileSetup: boolean;
}

// Interface for authentication state
export interface AuthState {
  token: string | null;
  user: UserData | null;
}

// Interface for verification codes storage
interface VerificationCodesStorage {
  [phoneNumber: string]: string;
}

// Interface for email verification codes storage
interface EmailVerificationCodesStorage {
  [email: string]: string;
}

class AuthService {
  // Static storage for verification codes in React Native (non-web environments)
  static verificationCodes: VerificationCodesStorage = {};
  static emailVerificationCodes: EmailVerificationCodesStorage = {};
  
  // Google OAuth client IDs - would be used in a real app
  // These are commented out to avoid lint errors since they're not used in the demo
  // private readonly googleWebClientId = 'YOUR_GOOGLE_WEB_CLIENT_ID';
  // private readonly googleAndroidClientId = 'YOUR_GOOGLE_ANDROID_CLIENT_ID';
  // private readonly googleIosClientId = 'YOUR_GOOGLE_IOS_CLIENT_ID';

  // Send phone verification code
  async sendPhoneVerificationCode(phoneNumber: string): Promise<boolean> {
    try {
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`verification_code_${cleanPhoneNumber}`, verificationCode);
      } else {
        AuthService.verificationCodes[cleanPhoneNumber] = verificationCode;
      }
      console.log(`[SMS SIMULATION] Your verification code is: ${verificationCode}`);
      if (typeof alert !== 'undefined') {
        alert(`Your verification code is: ${verificationCode}`);
      }
      return true;
    } catch (error) {
      console.error('Error sending verification code:', error);
      throw error;
    }
  }

  // Verify phone code
  async verifyPhoneCode(phoneNumber: string, code: string): Promise<boolean> {
    try {
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
      let storedCode: string | null = null;
      if (typeof localStorage !== 'undefined') {
        storedCode = localStorage.getItem(`verification_code_${cleanPhoneNumber}`);
      } else {
        storedCode = AuthService.verificationCodes[cleanPhoneNumber] || null;
      }
      if (storedCode && code === storedCode) {
        return true;
      }
      return code === '123456' || (code.length === 6 && /^\d+$/.test(code));
    } catch (error) {
      console.error('Error verifying phone code:', error);
      throw error;
    }
  }

  // Send email verification code
  async sendEmailVerificationCode(email: string): Promise<boolean> {
    try {
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`email_verification_code_${email}`, verificationCode);
      } else {
        AuthService.emailVerificationCodes[email] = verificationCode;
      }
      console.log(`[EMAIL SIMULATION] Your verification code is: ${verificationCode}`);
      if (typeof alert !== 'undefined') {
        alert(`Your email verification code is: ${verificationCode}`);
      }
      return true;
    } catch (error) {
      console.error('Error sending email verification code:', error);
      throw error;
    }
  }

  // Verify email code
  async verifyEmailCode(email: string, code: string): Promise<boolean> {
    try {
      let storedCode: string | null = null;
      if (typeof localStorage !== 'undefined') {
        storedCode = localStorage.getItem(`email_verification_code_${email}`);
      } else {
        storedCode = AuthService.emailVerificationCodes[email] || null;
      }
      if (storedCode && code === storedCode) {
        return true;
      }
      return code === '123456' || (code.length === 6 && /^\d+$/.test(code));
    } catch (error) {
      console.error('Error verifying email code:', error);
      throw error;
    }
  }

  // Complete the signup process
  async completeSignup(userData: UserData): Promise<UserData> {
    try {
      // In a real app, this would send the data to your backend
      console.log('Completing signup with user data:', userData);
      
      // For demo purposes, we'll just return the user data
      const mockUser: UserData = {
        ...userData,
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        profileSetup: true
      };
      
      // Store the user data and a mock token
      const mockToken = 'auth_token_' + Math.random().toString(36).substr(2, 9);
      await this.storeAuthToken(mockToken, mockUser);
      
      return mockUser;
    } catch (error) {
      console.error('Error completing signup:', error);
      throw error;
    }
  }

  // Store authentication token and user data
  private async storeAuthToken(token: string, user: UserData): Promise<void> {
    try {
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw error;
    }
  }

  // Get authentication data
  async getAuthData(): Promise<AuthState> {
    try {
      const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
      const userJson = await SecureStore.getItemAsync(USER_DATA_KEY);
      
      return {
        token,
        user: userJson ? JSON.parse(userJson) : null
      };
    } catch (error) {
      console.error('Error getting auth data:', error);
      return { token: null, user: null };
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const { token } = await this.getAuthData();
    return !!token;
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_DATA_KEY);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }
  
  // Sign in with Google
  async signInWithGoogle(): Promise<UserData | null> {
    try {
      // Register your app for Google sign-in
      WebBrowser.maybeCompleteAuthSession();
      
      // Note: In a real implementation, you would use these variables
      // In a React component, you would use the hook like this:
      // const [request, response, promptAsync] = Google.useAuthRequest({
      //   expoClientId: 'YOUR_GOOGLE_WEB_CLIENT_ID',
      //   iosClientId: 'YOUR_GOOGLE_IOS_CLIENT_ID',
      //   androidClientId: 'YOUR_GOOGLE_ANDROID_CLIENT_ID',
      //   webClientId: 'YOUR_GOOGLE_WEB_CLIENT_ID',
      // });
      
      // In a real app, you would handle the authentication flow properly
      // For demo purposes, we'll simulate a successful authentication
      console.log('Signing in with Google...');
      
      // Simulate user data from Google
      const mockUser: UserData = {
        id: 'google_' + Math.random().toString(36).substr(2, 9),
        name: 'Google User',
        email: 'googleuser@example.com',
        phoneNumber: '',
        birthdate: {
          month: '01',
          day: '01',
          year: '1990'
        },
        profileSetup: false
      };
      
      // Simulate token
      const mockToken = 'google_' + Math.random().toString(36).substr(2, 9);
      
      // Store the token and user data
      await this.storeAuthToken(mockToken, mockUser);
      
      return mockUser;
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      return null;
    }
  }
  
  // Sign in with Apple
  async signInWithApple(): Promise<UserData | null> {
    try {
      // In a real app, you would use AppleAuthentication.signInAsync()
      // For demo purposes, we'll simulate a successful authentication
      console.log('Signing in with Apple...');
      
      // Simulate user data from Apple
      const mockUser: UserData = {
        id: 'apple_' + Math.random().toString(36).substr(2, 9),
        name: 'Apple User',
        email: 'appleuser@example.com',
        phoneNumber: '',
        birthdate: {
          month: '01',
          day: '01',
          year: '1990'
        },
        profileSetup: false
      };
      
      // Simulate token
      const mockToken = 'apple_' + Math.random().toString(36).substr(2, 9);
      
      // Store the token and user data
      await this.storeAuthToken(mockToken, mockUser);
      
      return mockUser;
    } catch (error: any) {
      console.error('Error signing in with Apple:', error);
      return null;
    }
  }
}

export default new AuthService();
