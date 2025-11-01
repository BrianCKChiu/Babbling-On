type QuestionType = "mcq" | "matching";

export type QuestionProp = {
  id: string;
  type: QuestionType;
  mediaRef?: string;
  answer?: string;
  choices?: Array<string>;
  gestures?: [{ answer: string; mediaRef: string }];
};

export abstract class Question {
  private id: string;
  private type: QuestionType | undefined;

  constructor(id: string, type: QuestionType) {
    this.id = id;
    this.type = type;
  }
  getId() {
    return this.id;
  }
  getType() {
    return this.type;
  }
}
export class QuestionMcq extends Question {
  private mediaRef: string;
  private answer: string;
  private choices: Array<string>;

  constructor({
    id,
    mediaRef,
    answer,
    choices,
  }: {
    id: string;
    mediaRef: string;
    answer: string;
    choices: Array<string>;
  }) {
    super(id, "mcq");

    this.answer = answer;
    this.mediaRef = mediaRef;
    this.choices = choices;
  }

  getChoices() {
    return this.choices;
  }
  getAnswer() {
    return this.answer;
  }
  getMediaRef() {
    return this.mediaRef;
  }
}

export class QuestionMatching extends Question {
  private gestures: [{ answer: string; mediaRef: string }];

  constructor({
    id,
    gestures,
  }: {
    id: string;
    gestures: [{ answer: string; mediaRef: string }];
  }) {
    super(id, "matching");
    this.gestures = gestures;
  }
  getGestures() {
    return this.gestures;
  }
  getAnswer() {
    return this.gestures.map((g) => g.answer);
  }
}
