import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DescriptionSection from "@/ui/selfAssessment/descriptionSection";
import { Center, HStack, ScrollView } from "native-base";
import NextPageButton from "@/ui/selfAssessment/nextPageButton";

export default function practiceStart() {
  const router = useRouter();
  const options = ["Alphabets", "Business", "Greetings", "Airport"];
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handlePress = (option: React.SetStateAction<string>) => {
    if (option === "Alphabets") {
      setSelectedOption(option);
      console.log(`Selected: ${option}`);
    }
  };

  return (
    <View style={styles.container}>
      <Center width={200} height={200} bg="rgba(255, 230, 0, 0.4)" rounded="full" position="absolute" top="20%" right="60%" />
      <Center width={304.76} height={300} bg="rgba(255, 230, 0, 0.4)" rounded="full" position="absolute" top="20%" right="-40%"/>
      <Text style={styles.headerText}>Practice ASL </Text>
      <DescriptionSection
        bodyText="Step into Practice ASL, your personalized playground for exploring and 
      refining your ASL skills. Engage in hands-on exercises across a spectrum of ASL components, from alphabets to phrases, 
      ensuring your practice sessions are both dynamic and constructive."
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.button,
              selectedOption === option && styles.selectedButton,
              option !== "Alphabets" && styles.disabledButton,
            ]}
            onPress={() => handlePress(option)}
            disabled={option !== "Alphabets"}
          >
            <Text
              style={[
                styles.buttonText,
                selectedOption === option && styles.selectedButtonText,
                option !== "Alphabets" && styles.disabledButtonText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <HStack style={styles.nextButton}>
        <NextPageButton 
          text="Start Practice"
          onPress={() =>
            router.push({
              pathname: "/saPractice/practiceAlphabetStart",
              params: { option: selectedOption },
            })
          }
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
    marginTop: "30%",
  },
  scrollView: {
    maxHeight: 120,
    width: "80%",
    marginHorizontal: "10%",
  },
  scrollContent: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    width: "90%",
    marginVertical: 5,
    padding: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedButton: {
    backgroundColor: "#FFED4B",
  },
  disabledButton: {
    backgroundColor: "#E0E0E0",
  },
  nextButton: {
    alignItems: "center",
    marginLeft: "5%",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  selectedButtonText: {
    color: "#000",
  },
  disabledButtonText: {
    color: "#A0A0A0",
  },
});
