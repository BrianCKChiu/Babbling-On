// import { auth } from "@/firebase";

import { useLocalSearchParams, useRouter } from "expo-router";
import { View } from "native-base";
import React, { useState, useEffect } from "react";
import SAHeaderSection from "@/ui/selfAssessment/headerSection";
import DescriptionSection from "@/ui/selfAssessment/descriptionSection";
import CustomButton from "@/ui/selfAssessment/customButton";

interface Course {
  id?: string;
  name: string;
  description: string;
  lessons: Lesson[];
}

interface Lesson {
  id?: string;
  name: string;
  description: string;
  courseId: string;
}

export default function Page() {
  const [courseData, setCourseData] = useState<Course>();
  const router = useRouter();

  // Get courseId param
  const { courseId } = useLocalSearchParams();
  console.log(courseId);

  useEffect(() => {
    fetch("http://localhost:8080/customCourses/getCourse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ courseId }),
    })
      .then((response) => {
        // check for the response
        if (!response.ok) {
          return Promise.reject("Server Error");
        }
        return response.json();
      })
      .then((data) => {
        // .then accepts a callBack which returns a
        // set the courseData state variable to the fetched datafkdnjkdng
        console.log("Log before setCourseData:", data);
        setCourseData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // useEffect
  console.log("Course Data log before Return:", courseData);
  return (
    <View>
      <SAHeaderSection text={courseData?.name || ""} />
      <DescriptionSection bodyText={courseData?.description || ""} />

      <CustomButton
        text="Start"
        buttonColor="white"
        onPress={() =>
          router.push({
            pathname: "/course/customlesson",
            params: {
              lessonId: courseData?.lessons[0]?.id || "",
            },
          })
        }
      />
    </View>
  );
}

// create a table that joins the two entities

// create a table that joins the two entities
