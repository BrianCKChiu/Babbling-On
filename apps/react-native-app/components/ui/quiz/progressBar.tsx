import { VStack, HStack, Box, Text } from "native-base";
import { useQuizStore } from "@/stores/quizStore";
import React from "react";

export function ProgressBar() {
  const { currentQuestionIndex, questions } = useQuizStore();

  function getPercentage(): number {
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  }
  return (
    <VStack alignItems={"flex-end"}>
      <Text fontSize={"xs"}>
        {currentQuestionIndex + 1}/{questions.length}
      </Text>
      <HStack w={"full"} h={"2px"}>
        <Box bgColor={"#F5DC00"} w={`${getPercentage()}%`} />
        <Box bgColor={"gray.200"} w={`${100 - getPercentage()}%`} />
      </HStack>
    </VStack>
  );
}
