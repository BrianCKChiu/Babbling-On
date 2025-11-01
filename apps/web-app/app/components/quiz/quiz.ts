export type Quiz = {
  description: {
    info: string;
  };
  options: {
    quizLength: string;
    quizType: string;
  };
  estTime: number;
  numOfQuestions: number;
  exp: number;
  topic: string;
  title: string;
  id: string;
};
