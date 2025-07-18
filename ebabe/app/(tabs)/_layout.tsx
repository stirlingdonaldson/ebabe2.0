import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import theme from '../../src/theme/theme';

export default function TabLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <Stack />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
