import React, { useState, useEffect } from "react";
import { DefaultLayout } from "@/layout/defaultLayout";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View, Pressable } from "native-base";

import { useRouter } from "expo-router";
import { useAuthState } from "react-firebase-hooks/auth";

// helper
import { auth } from "@/firebase";

// types
import { Course } from "@/types/course/course";

export default function LessonScreen() {
  const [otherCourses, setOtherCourses] = useState<Course[]>([]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [user] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (user == null) return;
    const getCoursesURL = "http://localhost:8080/customCourses/getMyCourses";

    const fetchCourses = async () => {
      const token = await user.getIdToken();
      if (!token || token === "") {
        console.log("Token is empty or undefined");
        return;
      }
      try {
        const response = await fetch(getCoursesURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          console.log("SERVER ERROR");
          return Promise.reject("Server Error");
        }

        const { otherCourses } = await response.json();

        setOtherCourses(otherCourses);
        setMyCourses(otherCourses);
      } catch (error) {
        console.error(error);
      }
      // const fetchCustomCourses = fetch(getCustomCoursesURL, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });

      // const fetchMyCourses = fetch(getMyCoursesURL, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   // body: JSON.stringify({ token }),
      // });

      // Promise.all([fetchCustomCourses, fetchMyCourses])
      // .then((responses) => { // CAN ONLY RUN IF THE FETCH RETURNS SOMETHING

      //   console.log("responses",responses); // not getting here

      //   const [customCoursesResponse, myCoursesResponse] = responses;

      //   if (!customCoursesResponse.ok || !myCoursesResponse.ok) {
      //     console.log("SERVER ERROR")
      //     return Promise.reject('Server Error');
      //   }

      //   return Promise.all([
      //     customCoursesResponse.json(),
      //     myCoursesResponse.json()
      //   ]);
      // })
      // // WILL BE SKIPPED IF THE FETCH REQUEST RETURNS NULL
      // .then(([customCourses, myCourses]) => {
      //   // SET COURSES
      //   setCustomCourses(customCourses);
      //   setMyCourses(myCourses);

      //   console.log("data is set");
      // })
      // .catch((err) => {
      //   console.log(err);
      // });
      // }, [token]); // use Effect needs []. inside it can be a dependency or variable that if it changes useEffect runs again (a condition for useEffect to run)
    };
    fetchCourses();
  }, [user]);

  const onPressHandler = () => {
    router.push("/course/allCourses/");
  };
  return (
    <DefaultLayout>
      <View style={styles.horizontalFlexMenu}>
        {/* Horizontal flexbox for the menu */}
        <View style={styles.leftItem}>
          <Text style={styles.title}>My Courses</Text>
        </View>
        <View style={styles.circleStyle}>
          <View style={styles.circle} />
        </View>
      </View>

      {/* Horizontal flex box for View All */}
      <View style={styles.viewAllFlexBox}>
        <Pressable style={styles.rightItem} onPress={() => onPressHandler()}>
          <Text>View All</Text>
        </Pressable>
      </View>

      {/* Horizontal flex box for the courses taken */}
      <View style={styles.horizontalFlexCourses}>
        {myCourses.map((myCourse) => (
          <View style={styles.courseItemHorizontal} key={myCourse.id}>
            <Text>{myCourse.name || "No name"}</Text>
          </View>
        ))}
      </View>

      <View>
        {/* Vertical Flex Box */}
        <View style={styles.verticalFlex}>
          {otherCourses.map((otherCourse) => (
            <View style={styles.verticalItem} key={otherCourse.id}>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/course/customcourse",
                    params: {
                      courseId: otherCourse.id,
                    },
                  })
                }
              >
                <Text>{otherCourse.name || "No name"}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </DefaultLayout>
  );
}

const styles = StyleSheet.create({
  viewAllFlexBox: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 10,
  },
  horizontalFlexMenu: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 10,
  },
  horizontalFlexCourses: {
    flexDirection: "row",
    // flex: 1, vb
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  leftItem: {
    flex: 1,
    paddingLeft: 10,
    paddingTop: 10,
  },
  rightItem: {
    flex: 1,
    alignItems: "flex-end",
    paddingRight: 25,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "normal",
    fontFamily: "Arial",
  },
  menu: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
  },
  menuImage: {
    width: 50,
    height: 50,
  },
  fishImage: {
    width: 50,
    height: 50,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "black",
  },
  circleStyle: {
    flex: 1,
    alignItems: "flex-end",
    paddingRight: 10,
    paddingTop: 10,
  },
  courseList: {
    flex: 1,
    // ...
    // Add other course list styles here
  },
  courseItemHorizontal: {
    padding: 10,
    borderBottomWidth: 1,
    backgroundColor: "#FFDC5F",
    height: 110,
    borderRadius: 5,
  },
  courseTitle: {
    fontSize: 16,
  },

  verticalFlex: {
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 15,
    gap: 20,
  },
  verticalItem: {
    padding: 20,
    height: 80,
    width: 360,
    backgroundColor: "#FFDC5F",
    borderRadius: 5,
    borderColor: "black",
  },
});
