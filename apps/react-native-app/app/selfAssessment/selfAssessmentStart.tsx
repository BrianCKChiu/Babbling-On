import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DescriptionSection from "@/ui/selfAssessment/descriptionSection";
import { Center, HStack } from "native-base";
import NextPageButton from "@/ui/selfAssessment/nextPageButton";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";

export default function selfAssessmentStart() {
  const router = useRouter();
  const [user] = useAuthState(auth);

  interface RadioButtonProps {
    label: string;
    value: number;
  }

  const RadioButtonOptions: RadioButtonProps[] = [
    { label: "Short", value: 2 },
    { label: "Normal", value: 5 },
    { label: "Long", value: 10 },
  ];

  const [selectedValue, setSelectedValue] = useState<RadioButtonProps>(
    RadioButtonOptions[0]
  );

  const handlePress = (option: RadioButtonProps) => {
    setSelectedValue(option);
  };

  const startAssessment = () => {
    fetch("http://localhost:8080/selfAssessment/start-assessment", {
      method: "POST",
      body: JSON.stringify({
        userId: user?.uid,
        isPractice: false,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          return Promise.reject("Server Error");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Assessment Started:");
        console.log(data);
        const { assessmentId } = data;

        router.push({
          pathname: "/selfAssessment/selfAssessmentPage",
          params: {
            length: selectedValue.value,
            assessmentId,
          },
        });
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  return (
    <View style={styles.container}>
      <Center width={225} height={225} bg="rgba(255, 230, 0, 0.4)" rounded="full" position="absolute" top="-5%" left="-10%" />
      <Center width={200} height={200} bg="rgba(255, 230, 0, 0.4)" rounded="full" position="absolute" top="20%" left="45%"/>
      <View style={styles.headerSection}>
        <Text style={styles.headerText}>Self Assessment</Text>
        <Text style={styles.headerText}>with AI</Text>
      </View>
      <DescriptionSection
        bodyText="Test your ASL alphabet know-how with our AI-driven Self-Assessment. 
      Engage in dynamic tests, receive immediate feedback, and pinpoint areas for improvement as you navigate
       through your ASL learning journey with confidence and insight."
      />
      <Text style={styles.questionText}>
        How long should the assessment be?
      </Text>
      <HStack style={styles.radiocontainer}>
        {RadioButtonOptions.map((option) => (
          <TouchableOpacity
            key={option.label}
            style={[
              styles.button,
              selectedValue.value === option.value && styles.selectedButton,
            ]}
            onPress={() => handlePress(option)}
          >
            <Text
              style={[
                styles.buttonText,
                selectedValue.value === option.value &&
                  styles.selectedButtonText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </HStack>
      <HStack style={styles.nextButton}>
        <NextPageButton
          text="Start Assessment"
          onPress={() => startAssessment()}
        />
      </HStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: "white",
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    marginLeft: "5%",
    marginTop: "2%",
  },
  headerSection: {
    marginTop: "30%",
  },
  questionText: {
    fontWeight: "bold",
    fontSize: 16,
    paddingLeft: "10%",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  radiocontainer: {
    justifyContent: "space-evenly",
    padding: "10%",
    paddingTop: "3%",
    paddingBottom: "5%",
  },
  button: {
    margin: "2%",
    padding: 20,
    borderWidth: 1,
    width: "auto",
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedButton: {
    backgroundColor: "#FFED4B",
  },
  selectedButtonText: {
    color: "#000",
  },
  nextButton: {
    alignItems: "center",
    marginLeft: "5%",
  },
});
