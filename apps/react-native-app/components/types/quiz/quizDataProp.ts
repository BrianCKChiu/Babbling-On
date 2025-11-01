export type QuizDataProp = {
  id: string;
  topic: string;
  title: string;
  options: {
    quizLength: string;
    quizType: string;
  };
  estTime: number;
  exp: number;
  description: { [key: string]: string };
};
