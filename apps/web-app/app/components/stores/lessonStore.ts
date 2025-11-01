import { create } from "zustand";

interface LessonState {
  lessonId: string;

  title: string;
  description: string;
  topic: string;
  sign: Sign[];
}

interface LessonAction {
  setLessonId: (lessonId: string) => void;
  setTitle: (title: string) => void;
  setTopic: (topic: string) => void;
  setDescription: (description: string) => void;
  addSign: (sign: Sign) => void;
  removeSign: (sign: Sign) => void;
  clear: () => void;
}

const init = (): LessonState => {
  return {
    lessonId: "",
    title: "",
    topic: "",
    description: "",
    sign: [],
  };
};

export const lessonStore = create<LessonState & LessonAction>((set) => ({
  lessonId: "",
  title: "",
  topic: "",
  description: "",
  sign: [],
  setLessonId: (lessonId: string) => set({ lessonId }),
  setTitle: (title: string) => set({ title }),
  setTopic: (topic: string) => set({ topic }),
  setDescription: (description: string) => set({ description }),
  addSign: (sign: Sign) => set((state) => ({ sign: [...state.sign, sign] })),
  removeSign: (sign: Sign) =>
    set((state) => ({
      sign: state.sign.filter((l) => l.title !== sign.title),
    })),
  clear: () => set(init()),
}));
