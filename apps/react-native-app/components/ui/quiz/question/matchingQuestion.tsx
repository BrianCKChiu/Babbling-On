import {
  VStack,
  Box,
  Heading,
  HStack,
  Select,
  Button,
  Text,
  Image,
} from "native-base";
import { useEffect, useState } from "react";
import { ProgressBar } from "../progressBar";
import React from "react";

export function MatchingQuestionComponent({
  choices,
  submitAnswer,
}: {
  choices: { mediaRef: string; answer: string }[];
  submitAnswer: (answer: string[]) => void;
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<string[]>([""]);

  // set selected answer array to match the number of choices
  useEffect(() => {
    if (selectedAnswer.length !== choices.length) {
      setSelectedAnswer(choices.map(() => ""));
    }
  }, [choices]);
  return (
    <VStack alignContent="space-between" h={"full"} display="flex" mx={"32px"}>
      <Box h={200} pt={"20%"} borderBottomRadius={12}>
        <Heading bold={true} size="lg" mb={6} mt={10}>
          Match the Gestures
        </Heading>
      </Box>
      <VStack mt={"20px"} space={6} flex={1}>
        {choices.map((choice, index) => (
          <HStack alignItems={"center"} space={4} key={index}>
            <Image
              source={{
                uri: choice.mediaRef,
              }}
              key={choice.mediaRef}
              alt="Alternate Text"
              w={"95px"}
              h={"95px"}
              borderRadius={"lg"}
            />
            <DropdownAnswer
              key={`${choice.mediaRef}_select`}
              options={choices.map((choice) => choice.answer)}
              onSelect={(selected) => {
                const newSelectedAnswer = [...selectedAnswer];
                newSelectedAnswer[index] = selected;
                setSelectedAnswer(newSelectedAnswer);
              }}
            />
          </HStack>
        ))}
      </VStack>
      <VStack>
        <ProgressBar />
        <Box w="full" h={110} pt={5}>
          <Button
            isDisabled={selectedAnswer.includes("")}
            backgroundColor={"#FFED4B"}
            h={"50px"}
            onPress={() => submitAnswer(selectedAnswer)}
            _disabled={{ backgroundColor: "#FFED4B" }}
          >
            <Text color="black">Next Question</Text>
          </Button>
        </Box>
      </VStack>
    </VStack>
  );
}

function DropdownAnswer({
  options,
  onSelect,
  key,
}: {
  options: string[];
  key: string;
  onSelect: (option: string) => void;
}) {
  const [value, setValue] = useState("");
  return (
    <Select
      key={key}
      selectedValue={value}
      minWidth="200"
      accessibilityLabel="Select Answer"
      placeholder="Select Answer"
      _selectedItem={{
        bg: "#FFED4B",
      }}
      mt={1}
      onValueChange={(itemValue) => {
        setValue(itemValue);
        onSelect(itemValue);
      }}
    >
      {options.map((option) => (
        <Select.Item key={option} label={option} value={option} />
      ))}
    </Select>
  );
}
