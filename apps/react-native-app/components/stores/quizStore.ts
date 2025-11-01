import { Question } from "@/types/quiz/question";
import { Answer } from "@/types/quiz/answer";
import { create } from "zustand";

interface QuizState {
  questions: Array<Question>;
  currentQuestionIndex: number;
  quizId: string;
  quizName: string;
  quizTopic: string;
  answers: Array<Answer>;
}
interface QuizAction {
  setQuizId: (quizId: string) => void;
  setQuizName: (quizName: string) => void;
  setQuestions: (questions: Array<Question>) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setQuizTopic: (topic: string) => void;
  addAnswer: (answer: Answer) => void;
  clearQuiz: () => void;
}

const init = {
  questions: [],
  answers: [],
  currentQuestionIndex: 0,
  quizId: "",
  quizName: "",
  quizTopic: "",
};

export const useQuizStore = create<QuizState & QuizAction>((set) => ({
  questions: [],
  currentQuestionIndex: 0,
  quizId: "",
  quizName: "",
  quizTopic: "",
  answers: [],
  setQuizId: (quizId: string) => set({ quizId }),
  setQuizName: (quizName: string) => set({ quizName }),
  setQuestions: (questions: Question[]) => set({ questions }),
  setCurrentQuestionIndex: (index: number) =>
    set({ currentQuestionIndex: index }),
  setQuizTopic: (topic: string) => set({ quizTopic: topic }),
  addAnswer: (answer: Answer) =>
    set((state) => ({ answers: [...state.answers, answer] })),
  clearQuiz: () => set(init),
}));
