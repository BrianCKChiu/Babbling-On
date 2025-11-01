import { Button } from "../button";
import { Input } from "../input";
import { ScrollArea } from "../scroll-area";
import { Textarea } from "../textarea";
import { useEffect, useState } from "react";
import { lessonStore } from "@/components/stores/lessonStore";
import { Separator } from "../separator";
import { toast } from "../use-toast";
import { courseStore } from "@/components/stores/courseStore";
import AddIcon from "@/assets/icons/add.svg";
import { Dialog, DialogTrigger } from "../dialog";
import { NewSignModalContent } from "../sign/createSignModal";
import { HttpHandler } from "@/components/api/httpHandler";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/components/firebase";

export function CreateLesson({
  hasLesson = false,
  onClose = () => {
    return;
  },
}: {
  hasLesson?: boolean;
  onClose?: () => void;
}) {
  const [user] = useAuthState(auth);
  const {
    setLessonId,
    setTitle,
    setDescription,
    setTopic,
    lessonId,
    title,
    description,
    topic,
    sign,
    clear,
  } = lessonStore();

  const { addLesson, courseId, lessons } = courseStore();

  useEffect(() => {
    if (hasLesson) {
      setTopic("Lesson 1"); // todo: populate this with course topic
    }
  }, [hasLesson, setTitle, setTopic]);

  // creates a sign for the lesson
  function handleSubmit() {
    if (title === "") {
      return toast({
        variant: "destructive",
        title: "Title cannot be empty",
        duration: 1000,
      });
    }
    if (sign.length === 0) {
      return toast({
        variant: "destructive",
        title: "Lesson must contain one or more sign",
        duration: 1000,
      });
    }

    const newLesson: Lesson = {
      id: lessonId,
      title,
      description,
      topic,
      sign,
    };
    if (hasLesson) {
      if (lessons.map((lesson) => lesson.title).includes(title)) {
        return toast({
          variant: "destructive",
          title: "Lesson title already exists in course",
          duration: 1000,
        });
      }
      updateLesson();
      // update lesson in database via backend
      addLesson(newLesson);

      toast({
        title: "Lesson created successfully",
        duration: 1000,
      });
      onClose();
    }
    // todo: add lesson to database via backend
    clear();
  }

  async function createInitialLesson() {
    if (user == null) return;
    const token = await user.getIdToken();
    HttpHandler.post("/lesson/post", token, {
      courseId: courseId,
      name: "",
      description: "",
    }).then(async (res) => {
      const json = await res.json();
      setLessonId(json.id);
    });
  }

  async function updateLesson() {
    if (user == null) return;
    const token = await user.getIdToken();

    HttpHandler.patch("/lesson/update/", lessonId, token, {
      courseId: courseId,
      name: title,
      description: description,
    }).catch((err) => {
      console.log(err);
    });
  }

  function displaySigns() {
    const signElements: JSX.Element[] = [];
    sign.forEach((sign, i) => {
      signElements.push(
        <div className="flex flex-row justify-between items-center border py-3 px-2 rounded-md my-2">
          <div>{sign.title}</div>
        </div>
      );
    });
    return signElements;
  }
  useEffect(() => {
    createInitialLesson();
  }, []);
  return (
    <div className="w-full h-full flex flex-col justify-between space-y-4">
      <div>
        <h1 className="font-bold text-xl mb-10">New Lesson</h1>
        <div className="flex flex-col md:flex-row md:space-x-5 space-y-8 md:space-y-0">
          <div className="flex flex-col basis-1/2 space-y-2">
            <div className="flex flex-col space-y-2">
              <label>Title:</label>
              <Input
                type="text"
                value={title}
                onChange={(v) => {
                  setTitle(v.target.value);
                }}
              />
            </div>
            {!hasLesson && (
              <div>
                <label>Topic:</label>
                <Input
                  type="text"
                  value={topic}
                  onChange={(v) => {
                    setTopic(v.target.value);
                  }}
                />
              </div>
            )}
            <div className="flex flex-col space-y-2">
              <label>Description:</label>
              <Textarea
                rows={hasLesson ? 10 : 7}
                className="resize-none"
                value={description}
                onChange={(v) => {
                  setDescription(v.target.value);
                }}
              />
            </div>
          </div>
          <Separator className="md:hidden" orientation="horizontal" />

          <div className="flex-1">
            <div className="flex flex-row justify-between items-center">
              <h2 className="font-semibold text-lg">Signs</h2>
              <Dialog>
                <DialogTrigger>
                  <Button
                    size="sm"
                    variant="outline"
                    className="space-x-1"
                    disabled={sign.length >= 3}
                  >
                    <AddIcon />
                  </Button>
                </DialogTrigger>
                <NewSignModalContent />
              </Dialog>
            </div>

            <ScrollArea className="max-h-[280px] overflow-clip flex flex-col space-y-3">
              {displaySigns()}
            </ScrollArea>
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={() => {
            onClose();
          }}
        >
          Cancel
        </Button>
        <Button onClick={() => handleSubmit()}>Create Lesson</Button>
      </div>
    </div>
  );
}
