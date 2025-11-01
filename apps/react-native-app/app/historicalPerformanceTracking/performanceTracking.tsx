import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { useRouter } from "expo-router";
import { Center, ScrollView } from "native-base";

interface SelfAssessment {
  dateTaken: string | number | Date;
  isPractice: boolean;
  assessmentId: number;
  name: string;
  score: number;
}


export default function PerformanceTracking() {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [averageScore, setAverageScore] = useState<string | null>(null);
  const [highestScore, setHighestScore] = useState<string | null>(null);
  const [selfAssessments, setSelfAssessments] = useState<SelfAssessment[]>([]);

  const fetchData = async () => {
    try {
      const responseAvgSc = await fetch(
        `http://localhost:8080/selfAssessment/average-score/${user?.uid}`
      );
      if (!responseAvgSc.ok) {
        throw new Error("Server Error");
      }
      const dataAvgSc = await responseAvgSc.json();
      setAverageScore((dataAvgSc.averageScore).toFixed(2));

      const responseHighSc = await fetch(
        `http://localhost:8080/selfAssessment/highest-score/${user?.uid}`
      );
      if (!responseHighSc.ok) {
        throw new Error("Server Error");
      }
      const dataHighSc = await responseHighSc.json();
      setHighestScore((dataHighSc.highestScore).toFixed(2));

      const responseAssessments = await fetch(
        `http://localhost:8080/selfAssessment/assessments/all/${user?.uid}`
      );
      if (!responseAssessments.ok) {
        throw new Error("Server Error");
      }
      const dataAssessments = await responseAssessments.json();
      setSelfAssessments(dataAssessments);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchData();
    }
  }, [user?.uid]);

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Center width={304.76} height={300} bg="rgba(255, 230, 0, 0.4)" rounded="full" position="absolute" top="-5%" left="20%" />
        <Center width={304.76} height={300} bg="rgba(255, 230, 0, 0.4)" rounded="full" position="absolute" top="3%" left="-30%"/>
        <Text style={styles.headerText}>Your Progress</Text>
        <Text style={styles.bodyText}>Highest Score: {highestScore}</Text>
        <Text style={styles.bodyText}>Average Score: {averageScore}</Text>
        <Text style={styles.bodyText}>List of Assessments:</Text>
        {selfAssessments.length === 0 ? (
        <Text style={[styles.bodyText, {color:"red"}]}>
          You have no self assessments performed. Perform a self assessment and come back again!
        </Text>
    ) : (
        <ScrollView style={styles.scrollView}>
          {selfAssessments.map((assessment, index) => (
            <TouchableOpacity
            key={index}
            disabled={assessment.isPractice}
            onPress={() => router.push({
              pathname: "/historicalPerformanceTracking/assessmentDetails",
              params: {
                  assessmentId: String(assessment.assessmentId),
                  dateTaken: assessment.dateTaken.toString(),
                  score: String(assessment.score),
              },
          })}          
            style={[
              styles.assessmentContainer,
              index % 2 === 1 && styles.coloredAssessmentContainer,
            ]}
          >
              <Text style={styles.assessmentText}>
                Date Taken:{" "}
                {new Date(assessment.dateTaken).toLocaleDateString()}
              </Text>
              <Text style={styles.assessmentText}>
                Score: {assessment.score.toFixed(2)}
              </Text>
              <Text style={styles.assessmentText}>
                Practice: {assessment.isPractice ? "Yes" : "No"}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>)}
        <TouchableOpacity
          onPress={() => router.push("/(drawer)/home")}
          style={[styles.nextButton]}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    marginLeft: "5%",
    marginTop: "40%",
    marginRight: "40%",
    zIndex: 1,
    marginBottom: "20%",
  },
  bodyText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: "10%",
    marginTop: "5%",
  },
  buttonText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollView: {
    width: "80%",
    margin: "10%",
    marginVertical: "5%",
  },
  assessmentContainer: {
    width: "100%",
    padding: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
  },
  coloredAssessmentContainer: {
    backgroundColor: "#F7F9A9",
  },
  assessmentText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  nextButton: {
    width: "80%",
    borderRadius: 8,
    padding: 30,
    paddingVertical: 15,
    margin: "10%",
    alignSelf: "flex-end",
    alignItems: "center",
    marginTop: "5%",
    backgroundColor: "#FFED4B",
  },
});
