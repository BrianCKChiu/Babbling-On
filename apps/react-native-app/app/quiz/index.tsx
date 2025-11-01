import React from "react";
import {
  Box,
  Button,
  HStack,
  Heading,
  Text,
  VStack,
  ScrollView,
  Spinner,
  Center,
  View,
  Image,
} from "native-base";
import { useEffect, useState } from "react";

import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuizStore } from "@/stores/quizStore";
import { useAuthState } from "react-firebase-hooks/auth";

// types
import {
  Question,
  QuestionMatching,
  QuestionMcq,
  QuestionProp,
} from "@/types/quiz/question";
import { QuizDataProp } from "@/types/quiz/quizDataProp";

// helpers
import { auth } from "@/firebase";
import { HttpHandler } from "@/api/backend";

import dailyAslImg from "@assets/images/daily-quiz.jpg";

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [quizData, setQuizData] = useState<QuizDataProp | null>(null);
  const router = useRouter();
  const { setQuestions, setQuizId } = useQuizStore();
  const [user] = useAuthState(auth);
  const { quizId } = useLocalSearchParams<{ quizId: string }>();

  useEffect(() => {
    // this will fetch quiz data from server
    setIsLoading(true);
    getQuizDetails()
      .then((data) => {
        if (data == null) {
          router.replace("/home");

          throw new Error("Quiz data is null");
        }
        setQuizData({ id: "", ...data });
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        router.replace("/home");
      });
  }, []);

  async function getQuizDetails() {
    console.log(quizId);
    const token = await user?.getIdToken();
    try {
      const response = await HttpHandler.post({
        endpoint: "quiz/details",
        body: {
          token: token,
          quizId: quizId,
        },
      });

      if (response.status === 200) {
        const json = await response.json();
        return json;
      } else {
        const text = await response.text();
        throw new Error("Error fetching quiz details:" + text);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function startQuiz() {
    // todo: sent request to server to generate quiz
    try {
      const token = await user?.getIdToken();

      const quizData = await HttpHandler.post({
        endpoint: "quiz/create",
        body: {
          token: token,
          topic: "1",
          options: null,
        },
      })
        .then(async (res) => {
          const json = await res.json();
          return json;
        })
        .catch((err) => {
          console.log(err);
        });
      console.log(quizData.questions[0]);
      const questions: Array<Question> = quizData.questions.map(
        (question: QuestionProp) => {
          if (question.type === "mcq") {
            return new QuestionMcq({
              id: question.id,
              mediaRef: question.mediaRef!,
              choices: question.choices!,
              answer: question.answer!,
            });
          } else if (question.type === "matching") {
            return new QuestionMatching({
              id: question.id,
              gestures: question.gestures as [
                { answer: string; mediaRef: string }
              ],
            });
          }
        }
      );
      setQuestions(questions);
      setQuizId(quizData.id);
      // set data to quiz router
      router.replace({
        pathname: "/quiz/q/[id]",
        params: { id: questions[0].getId() }, // replace with question id
      });
    } catch (e) {
      console.log(e);
    }
  }

  function formatDescription() {
    if (quizData == null) return <></>;
    const elements: JSX.Element[] = [];
    for (const key in quizData.description) {
      elements.push(
        <Text key={key}>
          {key.toLowerCase() !== "intro" && (
            <Text fontWeight={"semibold"}>{key}: </Text>
          )}
          <Text>
            {quizData.description[key]} {`\n`}
          </Text>
        </Text>
      );
    }

    return elements;
  }

  return (
    <View>
      {!isLoading ? (
        <VStack h={"100%"}>
          <ScrollView
            w="full"
            h={"100%"}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <Image
              source={dailyAslImg}
              height={300}
              w={"full"}
              borderRadius={"lg"}
              alt=""
            />

            <VStack
              space="md"
              justifyContent="space-between"
              pb={20}
              paddingX={"45px"}
            >
              <Heading size="xl" mt={3}>
                {quizData?.title}
              </Heading>
              <VStack w={"full"} justifyContent="space-between">
                <HStack mb={"12px"}>
                  <QuizDetailTile
                    label={quizData?.options.quizLength.toString() ?? "Short"}
                    heading="Length"
                  />
                  <QuizDetailTile
                    label={quizData?.options.quizType.toString() ?? "Hybrid"}
                    heading="Question"
                  />
                </HStack>
                <HStack>
                  <QuizDetailTile
                    label={quizData?.estTime.toString() ?? "0"}
                    heading="Minutes"
                  />
                  <QuizDetailTile
                    label={quizData?.exp.toString() ?? "0"}
                    heading="EXP"
                  />
                </HStack>
              </VStack>
              <VStack>{formatDescription()}</VStack>
            </VStack>
          </ScrollView>
          <Box
            paddingBottom={30}
            w={"100%"}
            h={90}
            borderTopWidth={1}
            borderTopColor="gray.600"
            paddingX={10}
            pt="4"
          >
            <Button
              variant="solid"
              size={"lg"}
              w={"full"}
              borderRadius={"8px"}
              backgroundColor="#FFED4B"
              onPress={() => {
                startQuiz();
              }}
            >
              <Text color="black" fontWeight={"semibold"}>
                Start Quiz!
              </Text>
            </Button>
          </Box>
        </VStack>
      ) : (
        <Center w={"full"} h={"full"}>
          <Spinner size="large" />
        </Center>
      )}
    </View>
  );
}

function QuizDetailTile({
  label,
  heading,
}: {
  label: string;
  heading: string;
}) {
  return (
    <HStack
      w={"50%"}
      h={"52px"}
      textAlign={"left"}
      p={"8px"}
      borderRadius={"md"}
      borderWidth={"1px"}
      borderColor={"gray.400"}
      alignItems={"center"}
      mx={"4px"}
    >
      <Text fontSize={"16px"} fontWeight={"semibold"} mr={"4px"}>
        {heading}:{" "}
      </Text>
      <Text fontSize={"16px"}>{label}</Text>
    </HStack>
  );
}
