import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to the onboarding welcome screen
  return <Redirect href="/splash" />;
}
