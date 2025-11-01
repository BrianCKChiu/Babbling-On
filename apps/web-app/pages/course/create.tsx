import { courseStore } from "@/components/stores/courseStore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { CreateLesson } from "@/components/ui/lesson/createLesson";
import { LessonListItem } from "@/components/ui/lesson/lessonListItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { use, useCallback, useEffect, useState } from "react";
import AddIcon from "@/assets/icons/add.svg";
import { HttpHandler } from "@/components/api/httpHandler";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/components/firebase";
import { useRouter } from "next/router";
import { CreateQuizModal } from "@/components/ui/quiz/createQuizModal";
import { DocumentData, collection, onSnapshot } from "firebase/firestore";
import { QuizListItem } from "@/components/ui/quiz/quizListItem";
import { Quiz } from "@/components/quiz/quiz";

export default function CreateCoursePage() {
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const {
    setTitle,
    setDescription,
    setTopic,
    title,
    description,
    topic,
    lessons,
    setCourseId,
    courseId,
    clear,
  } = courseStore();
  const [addLessonState, setAddLessonState] = useState<"new" | "existing">(
    "new"
  );
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [user] = useAuthState(auth);
  const router = useRouter();

  const createInitialCourse = useCallback(async () => {
    if (user == null) return;
    if (courseId !== "") return;
    const token = await user.getIdToken();
    await HttpHandler.post("/customCourses/post", token, {
      name: "",
      topic: "",
      description: "",
      ownerId: user.uid,
    }).then(async (res) => {
      const json = await res.json();
      const { course } = json;
      console.log("course", course.id);
      setCourseId(course.id);
    });
  }, [user]);

  useEffect(() => {
    if (courseId == "") return;
    const quizzesRef = collection(db, `customCourses/${courseId}/quizData`);

    onSnapshot(quizzesRef, (querySnapshot) => {
      const quizzes: Quiz[] = [];
      querySnapshot.forEach((quiz: DocumentData) => {
        quizzes.push(quiz.data());
      });
      setQuizzes(quizzes);
    });
  }, [courseId]);

  function renderLessons(): JSX.Element[] {
    const lessonElements: JSX.Element[] = [];
    lessons.forEach((lesson, i) => {
      lessonElements.push(<LessonListItem lesson={lesson} key={i} />);
    });
    console.log(lessonElements);
    return lessonElements;
  }
  function renderQuizzes(): JSX.Element[] {
    const quizElements: JSX.Element[] = [];
    quizzes.forEach((quiz, i) => {
      quizElements.push(<QuizListItem quiz={quiz} key={i} />);
    });
    return quizElements;
  }

  // sends a request to the backend to create a new course when page is loaded
  useEffect(() => {
    createInitialCourse();
  }, [createInitialCourse]);

  // listens when the user changes the route, if the user changes the route, the course is deleted
  useEffect(() => {
    function exitFunction() {
      console.log("aaaa");
      const deleteAll = () => {
        user?.getIdToken().then(async (token: string) => {
          // deletes everything relating to the unsaved course from the backend
          HttpHandler.post("/customCourses/deleteAll", token, {
            courseId: courseId,
          })
            .then(() => {
              clear();
            })
            .catch((err) => {
              console.log(err);
            });
        });
      };
      if (isSaving === true) return;
      if (
        title != "" ||
        description != "" ||
        topic != "" ||
        lessons.length != 0
      ) {
        if (confirm("Are you sure you want to leave this page?")) {
          deleteAll();
        }
      } else {
        deleteAll();
      }
    }
    router.events.on("routeChangeStart", exitFunction);

    return () => {
      router.events.off("routeChangeStart", exitFunction);
    };
  }, [
    clear,
    courseId,
    description,
    isSaving,
    lessons.length,
    router.events,
    title,
    topic,
    user,
  ]);

  async function saveCourse() {
    if (user == null) return;
    console.log("idd", courseId);
    if (courseId === "") return;
    console.log("update");
    const token = await user.getIdToken();
    setIsSaving(true);
    await HttpHandler.patch("/customCourses/update/", courseId, token, {
      name: title,
      description: description,
    }).catch((err) => {
      console.log(err);
    });
    setIsSaving(false);
    clear();
    router.push("/dashboard");
  }
  return (
    <div className="flex flex-col w-full space-y-10">
      <h1 className="text-xl font-bold">Create a Course</h1>
      <div className="flex lg:flex-row flex-col lg:space-x-20 space-y-10 lg:space-y-0">
        <div className="flex flex-col space-y-5 basis-1/3 mt-8">
          <div>
            <label className="font-semibold text-lg">Title:</label>
            <Input
              type="text"
              title="title"
              value={title}
              onChange={(v) => {
                setTitle(v.target.value);
              }}
            />
          </div>
          <div>
            <label className="font-semibold text-lg">Topic:</label>
            <Input
              type="text"
              title="topic"
              value={topic}
              onChange={(v) => {
                setTopic(v.target.value);
              }}
            />
          </div>
          <div>
            <label className="font-semibold text-lg">Description:</label>
            <Textarea
              title="description"
              value={description}
              rows={10}
              onChange={(v) => {
                setDescription(v.target.value);
              }}
            />
          </div>
        </div>
        <Separator className="w-full lg:hidden" />
        <div className="flex flex-col space-y-5 basis-1/3">
          <div className="flex flex-row justify-between items-center">
            <h2 className="font-semibold text-lg">Lessons</h2>
            <Dialog open={showModal}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="space-x-1">
                    <AddIcon />
                    <span> Add Lesson</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setShowModal(true);
                      setAddLessonState("new");
                    }}
                  >
                    <DialogTrigger>New Lesson</DialogTrigger>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent className="w-full  lg:w-2/3 xl:1/2 md:max-h-[700px]">
                <div>
                  {addLessonState === "new" ? (
                    <>
                      <CreateLesson
                        hasLesson={true}
                        onClose={() => {
                          setShowModal(false);
                        }}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <ScrollArea className="flex-1 max-h-[400px]">
            {renderLessons()}
          </ScrollArea>
        </div>
        <div className="flex flex-col space-y-5 basis-1/3">
          <div className="flex flex-row justify-between items-center">
            <h2 className="font-semibold text-lg">Quizzes</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="space-x-1">
                  <AddIcon />
                  <span> Add Quiz</span>
                </Button>
              </DialogTrigger>
              <CreateQuizModal />
            </Dialog>
          </div>
          <ScrollArea className="flex-1 max-h-[400px]">
            {renderQuizzes()}
          </ScrollArea>
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={saveCourse}> Create Course</Button>
      </div>
    </div>
  );
}
