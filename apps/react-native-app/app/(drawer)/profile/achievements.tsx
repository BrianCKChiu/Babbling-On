import { HStack, VStack, Text, Circle, ScrollView } from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import { Achievement } from "@/types/user/achievement";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Page() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [user, isLoading] = useAuthState(auth);

  // load and set user achievements in Firebase
  const loadUserAchievements = useCallback(async () => {
    if (user == null || isLoading) return;

    // load Firebase document
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) return;
    const userAchievements = userDoc.data().achievements;

    // data validation from Firebase
    if (userAchievements != null && Array.isArray(userAchievements)) {
      setAchievements(userAchievements);
    }
  }, [user]);

  // load user achievements from Firebase
  useEffect(() => {
    if (user == null || isLoading) return;
    loadUserAchievements();
  }, [loadUserAchievements]);

  // display user's acquired achievements
  function renderAchievements() {
    const achievementsList: JSX.Element[] = [];
    achievements
      .filter((a) => a.dateAcquired == null)
      .map((achievement) => {
        achievementsList.push(
          <HStack
            key={achievement.id}
            display={"flex"}
            justifyContent={"space-between"}
            bgColor={"white"}
            px={"8px"}
            py={"8px"}
            mb={"8px"}
            borderRadius={"8px"}
            borderWidth={"1px"}
            borderColor={"gray.200"}
          >
            <HStack display={"flex"} space={"12px"}>
              <Circle bgColor={"amber.200"} h={"48px"} w={"48px"} />
              <VStack>
                <Text fontSize={"16px"} fontWeight={"semibold"}>
                  {achievement.title}
                </Text>
                <Text fontSize={"12px"}>{achievement.description}</Text>
                <Text fontSize={"12px"}>
                  {achievement.dateAcquired?.getDate() ?? ""}
                </Text>
              </VStack>
            </HStack>
          </HStack>
        );
      });
    return achievementsList;
  }
  return (
    <VStack h={"97%"} w="full" pt={"100px"}>
      <ScrollView px={"24px"}>{renderAchievements()}</ScrollView>
    </VStack>
  );
}
