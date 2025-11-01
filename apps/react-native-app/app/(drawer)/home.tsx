import React from "react";
import { Box, HStack, Heading, VStack, View, ZStack, Text } from "native-base";

// layouts & components
import { DefaultLayout } from "@/layout/defaultLayout";
import { HomeCarousel } from "@/ui/carousel/home";
import { FeaturedCourses } from "@/ui/course/featured";

export default function HomeScreen() {
  return (
    <DefaultLayout>
      <View>
        <HomeCarousel />
        <VStack display={"flex"} space={"12px"} mb={"16px"}>
          <Heading>Continue your Learning</Heading>
          <VStack display={"flex"} space={"8px"}>
            {[1, 2, 3].map((_, index) => {
              return (
                <ZStack
                  key={index}
                  w={"full"}
                  h={"60px"}
                  bgColor={"white"}
                  borderRadius={"8px"}
                >
                  <Box
                    h={"full"}
                    w={`${(index + 1) * 10}%`}
                    bgColor={"amber.200"}
                    borderRadius={"8px"}
                    opacity={"0.7"}
                  />
                  <HStack p={"8px"}>
                    <VStack>
                      <Heading fontSize={"18px"}>Class 1</Heading>
                      <Text fontSize={"12px"} color={"warmGray.500"}>
                        3 Lessons Remaining
                      </Text>
                    </VStack>
                  </HStack>
                </ZStack>
              );
            })}
          </VStack>
        </VStack>
        <FeaturedCourses />
      </View>
    </DefaultLayout>
  );
}
