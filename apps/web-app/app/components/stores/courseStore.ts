import { create } from "zustand";

interface CourseState {
  courseId: string;
  title: string;
  topic: string;
  description: string;
  lessons: Lesson[];
}

interface CourseAction {
  setCourseId: (courseId: string) => void;
  setTitle: (title: string) => void;
  setTopic: (topic: string) => void;
  setDescription: (description: string) => void;
  addLesson: (lesson: Lesson) => void;
  removeLesson: (lessonId: string) => void;
  clear: () => void;
}

const init = (): CourseState => {
  return {
    courseId: "",
    title: "",
    topic: "",
    description: "",
    lessons: [],
  };
};

export const courseStore = create<CourseState & CourseAction>((set) => ({
  courseId: "",
  title: "",
  topic: "",
  description: "",
  lessons: [],
  setCourseId: (courseId: string) => set({ courseId }),
  setTitle: (title: string) => set({ title }),
  setTopic: (topic: string) => set({ topic }),
  setDescription: (description: string) => set({ description }),
  addLesson: (lesson: Lesson) =>
    set((state) => ({ lessons: [...state.lessons, lesson] })),
  removeLesson: (lessonId: string) =>
    set((state) => ({
      lessons: state.lessons.filter((l) => l.id !== lessonId),
    })),
  clear: () => set(init()),
}));
