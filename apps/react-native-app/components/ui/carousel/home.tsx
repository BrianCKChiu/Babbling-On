import { useRouter } from "expo-router";
import { Box, Pressable, View, Text, ZStack, Image } from "native-base";
import React, { useState } from "react";
import Carousel, { Pagination } from "react-native-snap-carousel";
import dailyAslImg from "@assets/images/daily-quiz.jpg";
import weeklyAslImg from "@assets/images/weekly-quiz.jpg";
import { ImageSourcePropType, Dimensions } from "react-native";

export function HomeCarousel() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const { width: screenWidth } = Dimensions.get('window');
  const [cardItems] = useState([
    {
      path: "/quiz?quizId=eJE9f2tfYe7PJjO3YPrK",
      title: "Daily Quiz",
      image: dailyAslImg,
    },
    {
      path: "/quiz?quizId=kQBr1URkzfcqIxitWWE5",
      title: "Weekly Quiz",
      image: weeklyAslImg,
    },
  ]);

  function cardItem({
    item,
    index,
  }: {
    item: { path: string; title: string; image: ImageSourcePropType };
    index: number;
  }) {
    return (
      <View>
        <Pressable
          key={index}
          w={"full"}
          h={"200px"}
          borderRadius={"xl"}
          bgColor={"blue.200"}
          display={"flex"}
          onPress={() => {
            router.push({
              pathname: item.path,
            } as never);
          }}
        >
          <ZStack>
            <Image
              source={item.image}
              w={"full"}
              h={"200px"}
              borderRadius={"xl"}
              alt="image_placeholder"
            />
            <Box
              m={"16px"}
              bgColor={"white"}
              px={"8px"}
              borderRadius={"8px"}
              shadow={"xl"}
            >
              <Text fontSize="2xl" fontWeight="bold">
                {item.title}
              </Text>
            </Box>
          </ZStack>
        </Pressable>
      </View>
    );
  }
  return (
    <View>
      <Carousel
        layout={"default"}
        data={cardItems}
        renderItem={cardItem}
        sliderWidth={screenWidth* 0.925}
        itemWidth={screenWidth * 0.9}
        windowSize={1}
        onSnapToItem={(index) => setActiveIndex(index)}
      />
      <Pagination
        dotsLength={cardItems.length}
        activeDotIndex={activeIndex}
        containerStyle={{
          backgroundColor: "transparent",
          paddingVertical: 10,
          marginBottom: 12,
        }}
        dotStyle={{
          width: 7,
          height: 7,
          borderRadius: 5,
          marginHorizontal: -10,

          backgroundColor: "rgba(0, 0, 0, 0.92)",
        }}
        inactiveDotStyle={
          {
            // Define styles for inactive dots here
          }
        }
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    </View>
  );
}
