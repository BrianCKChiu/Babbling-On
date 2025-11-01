import { View, VStack, Heading, Text, Box, ScrollView } from "native-base";
import React, { useEffect, useState } from "react";
import { HttpHandler } from "@/api/backend";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";

export function FeaturedCourses() {
  const [courses, setCourses] = useState<{ name: string }[]>([]);

  const [user, isLoading] = useAuthState(auth);

  useEffect(() => {
    loadFeaturedCourses();
  }, []);

  async function loadFeaturedCourses() {
    if (user == null || isLoading) return;

    const token = await user.getIdToken();
    await HttpHandler.post({
      endpoint: "customCourses/featured",
      body: {
        token: token,
      },
    })
      .then(async () => {
        // const json = await res.json();
        const testCourses = [
          { name: "Introduction To Business" },
          { name: "Food" },
        ];
        setCourses(testCourses);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function renderCourses() {
    const elements: JSX.Element[] = [];
    courses.map((course, index) => {
      elements.push(<CourseItem item={course} index={index} key={index} />);
    });
    return elements;
  }

  return (
    <View>
      <VStack>
        <Heading>Featured Courses</Heading>
        <ScrollView mx={"-10px"} horizontal={true} mt={2} pb={3}>
          {renderCourses()}
        </ScrollView>
      </VStack>
    </View>
  );
}
function CourseItem({
  item,
  index,
}: {
  item: { name: string };
  index: number;
}) {
  return (
    <VStack w={"230px"} mx={2}>
      <Box
        key={index}
        bgColor={"violet.300"}
        h={"90px"}
        roundedTop={"xl"}
        display={"flex"}
        justifyItems={"end"}
      />
      <Box w={"full"} bgColor={"white"} roundedBottom={"xl"} p={"3"}>
        <Text fontWeight={"semibold"} textTransform={"capitalize"}>
          {item.name}
        </Text>
      </Box>
    </VStack>
  );
}
