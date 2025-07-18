import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import theme from '../../src/theme/theme';

export default function Home() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Welcome to Date Auction</Text>
          <Text style={{ marginTop: 10 }}>Your premium dating experience awaits</Text>
        </View>
      </PaperProvider>
    </SafeAreaView>
  );
}
