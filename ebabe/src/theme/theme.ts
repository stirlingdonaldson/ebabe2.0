import { MD3DarkTheme, configureFonts, MD3TypescaleKey, MD3Theme } from 'react-native-paper';

const fontConfig: { [key in MD3TypescaleKey]: any } = {
  displayLarge: {
    fontFamily: 'Inter_400Regular',
    fontSize: 57,
    lineHeight: 64,
    letterSpacing: 0,
    fontWeight: '400',
  },
  displayMedium: {
    fontFamily: 'Inter_400Regular',
    fontSize: 45,
    lineHeight: 52,
    letterSpacing: 0,
    fontWeight: '400',
  },
  displaySmall: {
    fontFamily: 'Inter_400Regular',
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: 0,
    fontWeight: '400',
  },
  headlineLarge: {
    fontFamily: 'Inter_400Regular',
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 0,
    fontWeight: '400',
  },
  headlineMedium: {
    fontFamily: 'Inter_400Regular',
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0,
    fontWeight: '400',
  },
  headlineSmall: {
    fontFamily: 'Inter_400Regular',
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
    fontWeight: '400',
  },
  titleLarge: {
    fontFamily: 'Inter_500Medium',
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0,
    fontWeight: '500',
  },
  titleMedium: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
    fontWeight: '500',
  },
  titleSmall: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    fontWeight: '500',
  },
  bodyLarge: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
    fontWeight: '400',
  },
  bodyMedium: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
    fontWeight: '400',
  },
  bodySmall: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
    fontWeight: '400',
  },
  labelLarge: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    fontWeight: '500',
  },
  labelMedium: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  labelSmall: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.5,
    fontWeight: '500',
  },
};

const theme: MD3Theme = {
  ...MD3DarkTheme,
  dark: true,
  mode: 'adaptive',
  roundness: 8,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#FFD700',         // Yellow feature color
    background: '#121212',      // Deep matte black
    surface: '#1E1E1E',         // Slightly elevated dark grey
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
    onSurfaceVariant: '#888888', // Muted grey for placeholders
    onSurfaceDisabled: '#555555',
  },
  fonts: configureFonts({ config: fontConfig }),
};

export default theme;
