// import { auth } from "@/firebase";

import { useRouter } from "expo-router";
import { View } from "native-base";
import React, { useState } from "react";
import SAHeaderSection from "@/ui/selfAssessment/headerSection";
import DescriptionSection from "@/ui/selfAssessment/descriptionSection";
import CustomButton from "@/ui/selfAssessment/customButton";

interface Course {
  id: string;
  name: string;
}

export default function Page() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [courseData, setCourseData] = useState<Course[]>([]);
  const router = useRouter();

  // useEffect
  return (
    <View>
      <SAHeaderSection text="Individual Course" />
      <DescriptionSection bodyText="Insert Course description here" />
      <CustomButton
        text="Self Assessment with AI"
        buttonColor="white"
        onPress={() => router.push("/selfAssessment")}
      />
    </View>
  );
}
