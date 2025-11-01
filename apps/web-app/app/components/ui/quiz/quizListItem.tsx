import { db } from "@/components/firebase";
import { Button } from "../button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import MoreIcon from "@/assets/icons/more.svg";
import { doc, deleteDoc } from "firebase/firestore";
import { courseStore } from "@/components/stores/courseStore";
import { toast } from "../use-toast";
import { Quiz } from "@/components/quiz/quiz";

export function QuizListItem({ quiz }: { quiz: Quiz }) {
  const { courseId } = courseStore();

  function onDelete() {
    deleteDoc(doc(db, "customCourses", courseId, "quizData", quiz.id));
    toast({
      title: "Quiz Deleted",
      duration: 1000,
    });
  }

  return (
    <div className="border pl-5 pr-2 py-3 rounded-md my-2 mr-3 flex flex-row justify-between">
      <div className="max-w-[300px] ">
        <h1 className="font-semibold text-lg truncate">{quiz.title}</h1>
        <p className="text-sm capitalize text-gray-400">
          {quiz.options.quizLength} | {quiz.options.quizType}
        </p>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <MoreIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onDelete}>
              <div>Delete</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
