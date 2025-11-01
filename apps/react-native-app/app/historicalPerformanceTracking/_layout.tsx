import { Stack } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="performanceTrackingStart"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="performanceTracking"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="assessmentDetails"
        options={{
          headerShown: false,
        }}
      />
    </Stack>

  );
}
