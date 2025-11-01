import React from "react";
import { Box, HStack, VStack, Text, Heading, Pressable } from "native-base";
import { View, StyleSheet } from "react-native";
import IBlock from "@/ui/IBlock";

import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";

export const DefaultLayout = ({ children, ...props }: IBlock) => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const navigation = useNavigation();

  return (
    <View style={styles.container} {...props}>
      <VStack h={"full"} w="full" pt={"40px"} px={"16px"}>
        <HStack
          display={"flex"}
          flexDir={"row"}
          justifyContent={"end"}
          py={"8px"}
          mb={"4px"}
        >
          <Box flex={1} justifyContent={"center"}>
            <Heading color={"black"} size={"lg"}>
              <MaterialIcons
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                name="menu"
                size={24}
                color="black"
              />
            </Heading>
          </Box>
          <Pressable
            {...props}
            onPress={() => {
              router.push({
                pathname: "(drawer)/profile",
              } as never);
            }}
          >
            <HStack display={"flex"} alignItems={"center"}>
              <Box
                maxW={"150px"}
                w={"container"}
                h={"30px"}
                pr={"40px"}
                pl={"8px"}
                mr={"-30px"}
                bgColor={"white"}
                borderLeftRadius={"lg"}
                display={"flex"}
                justifyContent={"center"}
                overflow={"hidden"}
                borderWidth={1}
                borderColor={"gray.300"}
              >
                <Text>{user?.displayName ?? ""}</Text>
              </Box>
              <Box
                bgColor={"white"}
                borderRadius={"full"}
                w={"48px"}
                h={"48px"}
                borderWidth={1}
                borderColor={"gray.300"}
                alignItems={"center"}
              >
                <Ionicons
                  name="ios-person-circle-outline"
                  size={44}
                  color="black"
                />
              </Box>
            </HStack>
          </Pressable>
        </HStack>
        <Box>{children}</Box>
      </VStack>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white", 
    flex: 1,
  },
});
