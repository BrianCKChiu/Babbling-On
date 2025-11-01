import React from "react";
import {
  View,
  Text,
  Heading,
  VStack,
  Button,
  ZStack,
  Circle,
} from "native-base";

import { useRouter } from "expo-router";
import { useQuizStore } from "@/stores/quizStore";
import { useAuthState } from "react-firebase-hooks/auth";

// helpers
import { auth } from "@/firebase";
import { HttpHandler } from "@/api/backend";

export default function Page() {
  const { answers, clearQuiz, quizId } = useQuizStore();
  const router = useRouter();
  const [user] = useAuthState(auth);

  async function handleExit() {
    const token = await user?.getIdToken();
    HttpHandler.post({
      endpoint: "quiz/submitAnswer",
      body: {
        token: token,
        results: answers,
        quizId: quizId,
      },
    }).catch((err) => {
      console.log(err);
    });
    clearQuiz();
    router.push("/(drawer)/home");
  }

  return (
    <View>
      <ZStack>
        <Circle
          position={"relative"}
          w={"360"}
          h={"360"}
          bgColor={"#FFE500"}
          opacity={"0.4"}
          left={"178px"}
          top={"-83px"}
        />
      </ZStack>
      <VStack
        mx={"40px"}
        pt={"130px"}
        pb={"40px"}
        h={"full"}
        justifyContent={"space-between"}
        display={"flex"}
      >
        <VStack>
          <Heading fontSize={"28px"} ml={"20px"}>
            Results
          </Heading>

          <VStack
            alignItems={"center"}
            mt={"40px"}
            display={"flex"}
            space={"8px"}
          >
            <Text fontWeight={"bold"} fontSize={"16px"}>
              Summary
            </Text>
            <Text fontSize={"28px"} fontWeight={"bold"}>
              {answers.filter((a) => a.isCorrect).length} / {answers.length}
            </Text>
            <Text fontWeight={"semibold"} pt={"8px"}>
              +200 Exp
            </Text>
          </VStack>
        </VStack>

        <Button
          w={"full"}
          h={"50px"}
          bgColor={"#FFED4B"}
          borderRadius={"8px"}
          onPress={async () => await handleExit()}
        >
          <Text color={"black"} fontWeight={"bold"}>
            Exit Quiz
          </Text>
        </Button>
      </VStack>
    </View>
  );
}
