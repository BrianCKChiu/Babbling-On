/* eslint-disable @typescript-eslint/no-unused-vars */
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
}

interface Lesson {
  id?: string;
  name: string;
  description: string;
  gestures: Gesture[];
}

interface Gesture {
  id?: string;
  phrase: string;
}

export default function Page() {
  const [lessonData, setLessonData] = useState<Lesson>();
  const router = useRouter();

  // Get courseId param
  const { lessonId } = useLocalSearchParams();
  console.log(lessonId);

  useEffect(() => {
    fetch("http://localhost:8080/lesson/getLesson", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lessonId }),
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
        console.log("Log before setLessonData:", data);
        setLessonData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // useEffect
  return (
    <View>
      <SAHeaderSection text={lessonData!.name} />
      <DescriptionSection bodyText={lessonData!.description} />

      <CustomButton
        text="Start"
        buttonColor="white"
        onPress={() =>
          router.push({
            pathname: "/gesture/customgesture",
            params: {
              gestureId: lessonData?.gestures[0].id || "", // renders one first gesture
            },
          })
        }
      />
    </View>
  );
}
