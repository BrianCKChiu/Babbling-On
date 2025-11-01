export function quizDefaults(length: string) {
  if (length === "short") {
    return {
      estTime: 3,
      numOfQuestions: 3,
      exp: 200,
    };
  } else if (length === "normal") {
    return {
      estTime: 5,
      numOfQuestions: 5,
      exp: 400,
    };
  } else if (length === "long") {
    return {
      estTime: 10,
      numOfQuestions: 10,
      exp: 700,
    };
  } else {
    return {
      estTime: 5,
      numOfQuestions: 5,
      exp: 400,
    };
  }
}
