import React, { JSX, useEffect, useState } from "react";
import {
  Center,
  Spinner,
  VStack,
  useToast,
  Text,
  Box,
  Heading,
} from "native-base";

import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuizStore } from "@/stores/quizStore";

// types
import { Question, QuestionMatching, QuestionMcq } from "@/types/quiz/question";
import { Answer } from "@/types/quiz/answer";

// components
import { MatchingQuestionComponent } from "@/ui/quiz/question/matchingQuestion";
import { McqQuestionComponent } from "@/ui/quiz/question/mcqQuestion";

// helpers
import { auth, getFile } from "@/firebase";
import { ExperienceBar } from "@/ui/user/experienceBar";
import { useUserStore } from "@/stores/userStore";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Page() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const toast = useToast();
  const { addExp } = useUserStore();
  const [user] = useAuthState(auth);
  const {
    setCurrentQuestionIndex,
    currentQuestionIndex,
    questions,
    addAnswer,
  } = useQuizStore();

  const [question, setQuestion] = useState<Question | null>(null);
  const [questionComponent, setQuestionComponent] = useState<JSX.Element>(
    <></>
  );
  const [isLoading, setIsLoading] = useState(false);

  function handleAnswer(userAnswer: string | string[]) {
    if (user == null) return;
    const question = questions[currentQuestionIndex];

    let result: Answer | null = null;
    if (question.getType() === "mcq") {
      const mcqQuestion = question as QuestionMcq;

      result = {
        questionId: question.getId(),
        isCorrect: mcqQuestion.getAnswer() === userAnswer,
        answer: [userAnswer as string],
      };
    } else if (question.getType() === "matching") {
      const matchingQuestion = question as QuestionMatching;

      result = {
        questionId: question.getId(),
        isCorrect: matchingQuestion
          .getAnswer()
          .every((v, i) => v === userAnswer[i]),
        answer: userAnswer as string[],
      };
    }

    if (result == null) return;
    addAnswer(result);
    addExp(result.isCorrect ? 500 : 100, user.uid);

    toast.show({
      render: () => {
        return (
          <Box
            w={"400px"}
            h={"100px"}
            pt={"16px"}
            m={"0px"}
            borderRadius={"8px"}
            alignItems={"center"}
            justifyItems={"end"}
            bgColor={result!.isCorrect ? "green.500" : "red.500"}
          >
            <Box my={"8px"}>
              {result?.isCorrect ? (
                <Heading fontSize={"20px"}>Correct!</Heading>
              ) : (
                <Heading fontSize={"20px"}>Incorrect!</Heading>
              )}
            </Box>
            <Text fontSize={"14px"} my={"8px"}>
              + {result!.isCorrect ? 500 : 100} EXP
            </Text>
            <ExperienceBar />
          </Box>
        );
      },
      paddingBottom: "0",
      placement: "top",
      duration: 2000,
    });
    setTimeout(() => {
      if (currentQuestionIndex === questions.length - 1) {
        router.replace("/quiz/results");
      } else {
        // get next question id
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        toast.closeAll();
        router.replace({
          pathname: "/quiz/q/[id]",
          params: { id: questions[currentQuestionIndex + 1].getId() }, // replace with question id
        });
      }
    }, 3000);
  }

  async function getMediaLink(ref: string): Promise<string> {
    const url = await getFile(ref);
    return url;
  }

  // generates an array of objects with mediaRef and answer for each gesture in matching question
  async function generateMatchingMediaObj() {
    const gestures = (question as QuestionMatching).getGestures();
    const gestureArr: { mediaRef: string; answer: string }[] = [];
    for (const gesture of gestures) {
      await getMediaLink(gesture.mediaRef).then((url) => {
        gestureArr.push({
          mediaRef: url,
          answer: gesture.answer,
        });
      });
    }
    return gestureArr;
  }

  // set question to current question when id param changes
  useEffect(() => {
    const currentQuestion = questions.filter((q) => q.getId() === id)[0];
    setQuestion(currentQuestion);
  }, [id]);

  // render question component when question changes
  useEffect(() => {
    if (question == null) return;
    setIsLoading(true);
    if (question.getType() === "mcq") {
      renderMcqQuestion().then(() => {
        setIsLoading(false);
      });
    } else if (question.getType() === "matching") {
      renderMatchingQuestion().then(() => {
        setIsLoading(false);
      });
    }
  }, [question]);

  async function renderMcqQuestion() {
    const url = await getMediaLink((question as QuestionMcq).getMediaRef());
    setQuestionComponent(
      <McqQuestionComponent
        mediaRef={url}
        choices={(question as QuestionMcq).getChoices()}
        submitAnswer={(answer: string) => {
          handleAnswer(answer);
        }}
      />
    );
  }

  async function renderMatchingQuestion() {
    await generateMatchingMediaObj().then((choices) => {
      setQuestionComponent(
        <MatchingQuestionComponent
          choices={choices}
          submitAnswer={(answer: string[]) => {
            handleAnswer(answer);
          }}
        />
      );
    });
  }

  return isLoading || questionComponent == null ? (
    <Center w={"full"} h={"full"}>
      <Spinner size="large" mb={3} />
      <Text>Loading Question</Text>
    </Center>
  ) : (
    <VStack>{questionComponent}</VStack>
  );
}
