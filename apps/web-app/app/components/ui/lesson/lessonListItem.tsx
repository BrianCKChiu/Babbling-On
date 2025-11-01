import MoreIcon from "@/assets/icons/more.svg";
import { Button } from "../button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { courseStore } from "@/components/stores/courseStore";
import { toast } from "../use-toast";
export function LessonListItem({ lesson }: { lesson: Lesson }) {
  const { removeLesson } = courseStore();
  function onDelete() {
    removeLesson(lesson.id);
    toast({
      title: "Lesson Deleted",
      duration: 1000,
    });
  }
  return (
    <div className="flex flex-row items-center justify-between w-full border py-4 pl-5 pr-2 my-2 rounded-md">
      <div>
        <div className="font-semibold text-lg">{lesson.title}</div>
        <div className="text-gray-500 text-sm">{lesson.sign.length} Signs</div>
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
