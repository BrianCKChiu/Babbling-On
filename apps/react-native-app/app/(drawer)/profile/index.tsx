import React, { useEffect } from "react";
import { ProfileLayout } from "@/layout/profileLayout";
import {
  View,
  HStack,
  VStack,
  Box,
  ZStack,
  Heading,
  Text,
  Circle,
  ScrollView,
  Pressable,
} from "native-base";

import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigation } from "expo-router";
import { useUserStore } from "@/stores/userStore";

// helpers
import { getLevelExp } from "@/user/level";
import { auth } from "@/firebase";
import { ExperienceBar } from "@/ui/user/experienceBar";

export default function Page() {
  const navigation = useNavigation();
  const [user, isLoading] = useAuthState(auth);
  const { level, currentExp } = useUserStore();
  useEffect(() => {
    console.log(currentExp / getLevelExp(level));
  }, [currentExp, level]);

  function renderCourseHistory() {
    const courses: JSX.Element[] = [];
    [1, 2, 3, 4].map((index) => {
      courses.push(
        <HStack
          key={index}
          display={"flex"}
          justifyContent={"space-between"}
          bgColor={"white"}
          p={"8px"}
          borderRadius={"16px"}
          borderWidth={"1px"}
          borderColor={"gray.200"}
        >
          <HStack display={"flex"} space={"12px"}>
            <Box
              bgColor={"gray.400"}
              h={"72px"}
              w={"72px"}
              borderRadius={"8px"}
            />
            <VStack>
              <Text fontSize={"16px"} fontWeight={"semibold"}>
                Shopping
              </Text>
              <Text fontSize={"14px"}>3 Lessons</Text>
              <Text color={"gray.500"} fontSize={"14px"}>
                By: Joe Bow
              </Text>
            </VStack>
          </HStack>
        </HStack>
      );
    });
    return courses;
  }

  return (
    <View>
      {!isLoading && (
        <ProfileLayout>
          <VStack display={"flex"} space={"16px"}>
            <VStack>
              <HStack
                borderTopRadius={"16px"}
                display={"flex"}
                space={"12px"}
                p={"16px"}
                borderColor={"gray.200"}
                borderWidth={"1px"}
                w={"full"}
                bgColor={"white"}
              >
                <ZStack
                  position={"relative"}
                  w={"100px"}
                  h={"110px"}
                  mb={"8px"}
                >
                  <Box
                    bgColor={"blue.100"}
                    h={"100px"}
                    w={"100px"}
                    borderRadius={"8px"}
                  />
                  <Box
                    bgColor={"white"}
                    borderColor={"gray.500"}
                    borderWidth={"1px"}
                    borderRadius={"8px"}
                    h={"25px"}
                    w={"70px"}
                    position={"absolute"}
                    top={"85px"}
                    left={"15px"}
                    alignItems={"center"}
                  >
                    <Text fontWeight={"semibold"}>{level}</Text>
                  </Box>
                </ZStack>
                <VStack pt={"12px"}>
                  <Heading maxW={"full"} overflow={"hidden"} noOfLines={1}>
                    {user?.displayName ?? user?.uid ?? "Unknown User"}
                  </Heading>
                  <Text>Professor</Text>
                  <Text>{user?.email}</Text>
                </VStack>
              </HStack>

              <ExperienceBar />
            </VStack>
            {/* Achievements */}
            <VStack mb={"12px"}>
              <HStack
                display={"flex"}
                justifyContent={"space-between"}
                pb={"12px"}
              >
                <Heading>Achievements</Heading>
                <Box alignSelf={"flex-end"}>
                  <Pressable
                    onPress={() => {
                      navigation.navigate({
                        name: "achievements",
                      } as never);
                    }}
                  >
                    <Text>See More</Text>
                  </Pressable>
                </Box>
              </HStack>
              <HStack display={"flex"} justifyContent={"space-between"}>
                <Circle h={"48px"} w={"48px"} bgColor={"amber.200"} />
                <Circle h={"48px"} w={"48px"} bgColor={"amber.200"} />
                <Circle h={"48px"} w={"48px"} bgColor={"amber.200"} />
                <Circle h={"48px"} w={"48px"} bgColor={"amber.200"} />
                <Circle h={"48px"} w={"48px"} bgColor={"amber.200"} />
                <Circle h={"48px"} w={"48px"} bgColor={"amber.200"} />
                <Circle h={"48px"} w={"48px"} bgColor={"amber.200"} />
              </HStack>
            </VStack>
            {/* My Courses */}
            <Pressable onPress={() => {}}>
              <HStack
                display={"flex"}
                justifyContent={"space-between"}
                py={"16px"}
                px={"24px"}
                mb={"12px"}
                borderRadius={"8px"}
                bgColor={"white"}
              >
                <Text fontSize={"20px"} fontWeight={"semibold"}>
                  My Courses
                </Text>
              </HStack>
            </Pressable>
            {/* Course History */}
            <VStack>
              <HStack
                display={"flex"}
                justifyContent={"space-between"}
                pb={"12px"}
              >
                <Heading>Course History</Heading>
                <Box alignSelf={"flex-end"}>
                  <Link href={"/(drawer)/profile/achievements"}>See All</Link>
                </Box>
              </HStack>
              <ScrollView maxH={"80%"}>
                <VStack display={"flex"} space={"12px"}>
                  {renderCourseHistory()}
                </VStack>
              </ScrollView>
            </VStack>
          </VStack>
        </ProfileLayout>
      )}
    </View>
  );
}
