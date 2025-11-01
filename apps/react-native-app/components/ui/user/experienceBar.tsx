import { useUserStore } from "@/stores/userStore";
import { getLevelExp } from "@/user/level";
import { Box } from "native-base";
import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedStyle,
} from "react-native-reanimated";

export function ExperienceBar() {
  const { level, currentExp } = useUserStore();
  const width = useSharedValue((currentExp / getLevelExp(level)) * 100 ?? 0);
  const animatedStyles = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));
  useEffect(() => {
    width.value = withTiming((currentExp / getLevelExp(level)) * 100, {
      duration: 500,
      easing: Easing.inOut(Easing.linear),
    });
  }, [currentExp]);

  return (
    <Box width={"100%"} h={"7px"} bgColor={"white"} borderRadius={"4px"}>
      <Animated.View
        style={[
          {
            height: "100%",
            borderRadius: 2,
            backgroundColor: "#F5DD03",
          },
          animatedStyles,
        ]}
      />
    </Box>
  );
}
