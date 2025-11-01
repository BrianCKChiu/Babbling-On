import React from "react";
import { Stack, useNavigation } from "expo-router";
import { Button, HStack, Heading } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { backNavBtnStyle } from "@styles/backNavButtonStyle";

export default function Layout() {
  const navigation = useNavigation();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="achievements"
        options={{
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
          headerLeft: () => (
            <HStack display={"flex"} space={"20px"}>
              <Button
                {...backNavBtnStyle}
                onPress={() => navigation.navigate({ name: "index" } as never)}
              >
                <MaterialIcons name="arrow-back-ios" size={20} color="black" />
              </Button>
              <Heading alignSelf={"center"}>Achievements</Heading>
            </HStack>
          ),
        }}
      />
    </Stack>
  );
}
