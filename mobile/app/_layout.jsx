import { Stack, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useStore } from "../store/useStore";
import { useEffect } from "react";

export default function RootLayout() {
  const { router, isAuth, user, token } = useStore();
  const segment = useSegments();

  useEffect(() => {
    isAuth();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const isAuthScreen = segment[0] === "(auth)";
      const isLoggedIn = user && token;

      if (!isAuthScreen && !isLoggedIn) {
        router.replace("/(auth)");
      } else if (isAuthScreen && isLoggedIn) {
        router.replace("/(tabs)");
      }
    });
  }, [user, token, segment]);
  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
