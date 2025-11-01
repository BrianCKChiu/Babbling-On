import { Box, HStack, VStack, Heading } from "native-base";
import React from "react";
import { View } from "react-native";
import IBlock from "@/ui/IBlock";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";

export const ProfileLayout = ({ children, ...props }: IBlock) => {
  const navigation = useNavigation();

  return (
    <View {...props}>
      <VStack h={"full"} w="full" pt={"40px"} px={"16px"}>
        <HStack
          display={"flex"}
          flexDir={"row"}
          justifyContent={"end"}
          py={"8px"}
          mb={"32px"}
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
        </HStack>
        <Box>{children}</Box>
      </VStack>
    </View>
  );
};
