import { useState } from "react";
import { DialogContent, DialogFooter, DialogHeader } from "../dialog";
import { Textarea } from "../textarea";
import { RadioGroup, RadioGroupItem } from "../radio";
import { Input } from "../input";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "../button";
import { courseStore } from "@/components/stores/courseStore";
import InfoIcon from "@/assets/icons/info.svg";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../hoverCard";
import { db } from "@/components/firebase";
import { doc, setDoc } from "firebase/firestore";
import uuid62 from "@/components/utils/uuid62";
import { quizDefaults } from "@/components/quiz/quizDefaults";

export function CreateQuizModal() {
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [quizDescription, setQuizDescription] = useState<string>("");
  const [quizLength, setQuizLength] = useState<"short" | "regular" | "long">(
    "short"
  );
  const [quizType, setQuizType] = useState<"mcq" | "hybrid">("hybrid");
  const { lessons, courseId } = courseStore();

  function createQuiz() {
    const id = uuid62();
    console.log(courseId);
    setDoc(doc(db, "customCourses", courseId, "quizData", id), {
      id: id,
      title: quizTitle,
      description: { info: quizDescription },
      options: {
        quizLength: quizLength,
        quizType: quizType,
      },
      ...quizDefaults(quizLength),
      topic: courseId,
    });
  }

  return (
    <DialogContent className="w-1/2">
      <DialogHeader className="font-bold text-lg">Create a Quiz</DialogHeader>
      <div className="flex flex-col space-y-4 ">
        <div className="flex flex-col flex-1 space-y-2">
          <div className="flex flex-col space-y-1">
            <label className="font-semibold">Quiz Title</label>
            <Input
              type="text"
              value={quizTitle}
              onChange={(v) => setQuizTitle(v.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="font-semibold">Quiz Description</label>
            <Textarea
              rows={9}
              value={quizDescription}
              onChange={(v) => setQuizDescription(v.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col flex-1 space-y-2">
          <label className="font-semibold">
            Questions
            <HoverCard>
              <HoverCardTrigger>
                <span className="ml-1 inline-block align-middle text-gray-400 cursor-pointer">
                  <InfoIcon />
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="text-sm">
                <p className="font-normal mb-3">
                  <span className="font-bold">Hybrid: </span> Quiz will contain
                  a mix of MCQ and Matching questions.
                </p>
                <p className="font-normal">
                  <span className="font-bold">MCQ: </span> Quiz will contain a
                  mix of Multiple Choice Questions (MCQ).
                </p>
              </HoverCardContent>
            </HoverCard>
          </label>
          <RadioGroup
            className="flex flex-row"
            value={quizType}
            onValueChange={(v: "mcq" | "hybrid") => {
              setQuizType(v);
            }}
          >
            <label
              className={`flex flex-col w-1/2 py-2 border border-gray-200 rounded-md items-center justify-center cursor-pointer hover:border-2 hover:border-primary select-none ${
                quizType === "hybrid"
                  ? " border-2 border-primary bg-gray-100"
                  : ""
              }`}
            >
              <span>Hybrid</span>
              <RadioGroupItem value={"hybrid"} className="hidden" />
            </label>
            <label
              className={`flex flex-col w-1/2 py-2 border border-gray-200 rounded-md items-center justify-center cursor-pointer hover:border-2 hover:border-primary select-none ${
                quizType === "mcq" ? " border-2 border-primary bg-gray-100" : ""
              }`}
            >
              <span>MCQ Only</span>
              <RadioGroupItem value={"mcq"} className="hidden" />
            </label>
          </RadioGroup>
        </div>
        <div className="flex flex-col flex-1 space-y-2">
          <label className="font-semibold flex items-center">
            Quiz Length
            <HoverCard>
              <HoverCardTrigger>
                <span className="ml-1 inline-block align-middle text-gray-400 cursor-pointer">
                  <InfoIcon />
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="text-sm">
                <p className="font-semibold mb-2">
                  Why are these options disabled?
                </p>
                <p className="font-normal">
                  One or more options are unavailable due to insufficient number
                  of lessons in the course.
                </p>
              </HoverCardContent>
            </HoverCard>
          </label>
          <RadioGroup
            className="flex flex-row"
            value={quizLength}
            onValueChange={(v: "short" | "regular" | "long") => {
              setQuizLength(v);
            }}
          >
            <label
              htmlFor="radio-short"
              className={`flex flex-col w-1/3 h-40 border border-gray-200 rounded-md items-center justify-center cursor-pointer  select-none disabled:bg-gray-100 ${
                lessons.length < 3
                  ? " bg-gray-100 hover:border-gray-200 hover:border cursor-not-allowed"
                  : quizLength === "short"
                  ? " border-2 border-primary bg-gray-50"
                  : "hover:border-2 hover:border-primary"
              }`}
            >
              <span className="font-semibold">Short</span>
              <span className=" text-gray-400">(3 Questions)</span>
              <RadioGroupItem
                value={"short"}
                id="radio-short"
                className="hidden"
                disabled={lessons.length < 3}
              />
            </label>
            <label
              htmlFor="radio-regular"
              className={`flex flex-col w-1/3 h-40 border border-gray-200 rounded-md items-center justify-center cursor-pointer select-none  ${
                lessons.length < 5
                  ? " bg-gray-100 hover:border-gray-200 hover:border cursor-not-allowed"
                  : quizLength === "regular"
                  ? " border-2 border-primary bg-gray-100"
                  : "hover:border-2 hover:border-primary"
              }`}
            >
              <span className="font-semibold">Regular</span>
              <span className=" text-gray-400">(5 Questions)</span>
              <RadioGroupItem
                value={"regular"}
                id="radio-regular"
                className="hidden"
                disabled={lessons.length < 5}
              />
            </label>
            <label
              htmlFor="radio-long"
              className={`flex flex-col w-1/3 h-40 border border-gray-200 rounded-md items-center justify-center cursor-pointer select-none disabled:bg-gray-100 ${
                lessons.length < 10
                  ? " bg-gray-100 hover:border-gray-200 hover:border cursor-not-allowed"
                  : quizLength === "long"
                  ? " border-2 border-primary bg-gray-100"
                  : "hover:border-2 hover:border-primary"
              }`}
            >
              <span className="font-semibold">Long</span>
              <span className=" text-gray-400">(10 Questions)</span>
              <RadioGroupItem
                value={"long"}
                id="radio-long"
                className="hidden"
                disabled={lessons.length < 10}
              />
            </label>
          </RadioGroup>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button
            type="button"
            disabled={
              quizTitle.trim() == "" ||
              quizDescription.trim() == "" ||
              lessons.length < 3
            }
            onClick={createQuiz}
          >
            Create Quiz
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
