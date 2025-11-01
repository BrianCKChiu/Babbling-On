import { Stack } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="selfAssessmentStart"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="selfAssessmentPage"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="results"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
