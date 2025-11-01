import {
  VStack,
  Box,
  Heading,
  HStack,
  Center,
  Text,
  Pressable,
  Button,
  View,
  Image,
} from "native-base";
import React, { useState } from "react";
import { ProgressBar } from "../progressBar";

export function McqQuestionComponent({
  choices,
  mediaRef,
  submitAnswer,
}: {
  choices: string[];
  mediaRef: string;
  submitAnswer: (answer: string) => void;
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  return (
    <View mx={"32px"} pt={60} h={"full"} display="flex">
      <VStack flex={1}>
        {/* Image */}

        <Center>
          <Image
            source={{
              uri: mediaRef,
            }}
            key={mediaRef}
            alt="Alternate Text"
            h={265}
            w={"full"}
            borderRadius={"8px"}
          />
        </Center>

        {/* Question */}
        <Heading bold={true} mb={6} mt={"36px"}>
          What is this Gesture?
        </Heading>
        {/* Choices */}
        {choices.map((choice, index) => (
          <Pressable
            key={choice}
            w={"full"}
            h={65}
            borderColor={"#858585"}
            borderWidth={1}
            borderRadius={8}
            my={2}
            px={"12px"}
            justifyContent="center"
            onPress={() => setSelectedAnswer(choice)}
            backgroundColor={
              selectedAnswer === choice ? "#FFED4B" : "transparent"
            }
          >
            <HStack
              display="flex"
              flexDirection="row"
              alignItems="center"
              space="md"
            >
              <Box
                h={"24px"}
                w={"24px"}
                borderRadius={"8px"}
                borderWidth={"1px"}
              >
                <Center>
                  <Text fontWeight="semibold" color={"black"}>
                    {index + 1}
                  </Text>
                </Center>
              </Box>

              <Text color={"black"}>{choice}</Text>
            </HStack>
          </Pressable>
        ))}
      </VStack>
      <ProgressBar />
      <Box w="full" h={110} pt={5}>
        <Button
          isDisabled={selectedAnswer === ""}
          backgroundColor="#FFED4B"
          h={"50px"}
          borderRadius={"16px"}
          onPress={() => {
            submitAnswer(selectedAnswer);
            setSelectedAnswer("");
          }}
          _disabled={{ backgroundColor: "#FFED4B" }}
        >
          <Text color="black">Next Question</Text>
        </Button>
      </Box>
    </View>
  );
}
