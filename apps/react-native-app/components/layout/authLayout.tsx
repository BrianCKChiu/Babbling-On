import { Box, VStack, ZStack, Circle } from "native-base";
import React from "react";
import { View } from "react-native";
import IBlock from "@/ui/IBlock";

export const AuthLayout = ({ children, ...props }: IBlock) => {
  return (
    <View {...props}>
      <ZStack h={"full"} w="full">
        <Circle
          w={"360px"}
          h={"360px"}
          position={"absolute"}
          top={"-10%"}
          left={"40%"}
          bgColor={"#FFE500"}
          opacity={0.4}
        />
        <Circle
          w={"360px"}
          h={"360px"}
          position={"absolute"}
          top={"6%"}
          left={"-14%"}
          bgColor={"#FFE500"}
          opacity={0.4}
        />
        <VStack h={"full"} w="full" pt={"40px"} px={"16px"}>
          <Box>{children}</Box>
        </VStack>
      </ZStack>
    </View>
  );
};
