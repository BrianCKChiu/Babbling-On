import { HttpHandler } from "@/components/api/httpHandler";
import { Course } from "@/components/course/course";
import { auth } from "@/components/firebase";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function DashboardPage() {
  const [courses, setCourses] = useState([]);
  const router = useRouter();
  const [user] = useAuthState(auth);

  const loadCourses = useCallback(async () => {
    if (user == null) return;

    const token = await user?.getIdToken();
    HttpHandler.post("/customCourses/myCourses", token)
      .then(async (res) => {
        const json = await res.json();
        const { courses } = json;
        console.log(courses);
        setCourses(courses);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user]);

  useEffect(() => {
    if (user === null) return;
    loadCourses();
  }, [loadCourses, user]);

  function renderCourses() {
    const courseElements: JSX.Element[] = [];
    courses
      .filter((c: Course) => c.name !== "")
      .forEach((course: Course, i: number) => {
        courseElements.push(
          <div
            className="w-full py-4 px-3 border border-gray-400 rounded-lg"
            key={i}
          >
            <h1 className="text-xl font-semibold">{course.name}</h1>
          </div>
        );
      });
    return courseElements;
  }

  return (
    <div className="flex flex-col space-y-10 h-full">
      <div className="flex justify-between mt-5 align-middle">
        <h1 className="font-bold text-2xl mb-7">My Custom Courses</h1>
        <Button
          onClick={() => {
            router.push("/course/create");
          }}
        >
          Create Course
        </Button>
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <ScrollArea className="flex-1" type="scroll">
          <div className="flex flex-col space-y-3 ">{renderCourses()}</div>
        </ScrollArea>
      </div>
    </div>
  );
}
