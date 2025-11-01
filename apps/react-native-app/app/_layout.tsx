import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { NativeBaseProvider } from "native-base";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import React from "react";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const pathname = usePathname();

  const router = useRouter();
  const [user, isLoading] = useAuthState(auth);

  // check if user is logged in and redirects user to login page if user is not signed in
  useEffect(() => {
    if (isLoading) return;
    if (
      !(
        pathname.endsWith("/auth/login") || pathname.endsWith("/auth/signUp")
      ) &&
      user == null
    ) {
      router.replace("/auth");
    }
  }, [isLoading, pathname]);

  return (
    <NativeBaseProvider>
      <Stack initialRouteName="auth">
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen
          name="quiz"
          options={{
            title: "",
            headerTransparent: true,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="selfAssessment"
          options={{
            headerShown: true,
            title: "",
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="historicalPerformanceTracking"
          options={{
            headerShown: true,
            title: "",
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="saPractice"
          options={{
            headerShown: pathname.match(/^\/saPractice\/practiceStart$/)
              ? true
              : false,
            title: "",
            headerTransparent: true,
          }}
        />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </NativeBaseProvider>
  );
}
