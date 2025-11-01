import { useRouter } from "expo-router";
import React from "react";
import { Text, StyleSheet } from "react-native";
import { Box, Center, VStack } from "native-base";
import DescriptionSection from "@/ui/selfAssessment/descriptionSection";
import { TouchableOpacity } from "react-native";

export default function performanceTrackingStart() {
  const router = useRouter();

  return (
    <Box safeArea flex={1} bg="white" alignItems="center" justifyContent="center">

      <VStack space={4} alignItems="center">
        <Center width={304.76} height={300} bg="rgba(255, 230, 0, 0.4)" rounded="full" position="absolute" top="20%" right="50%" />
        <Center width={304.76} height={300} bg="rgba(255, 230, 0, 0.4)" rounded="full" position="absolute" top="-10%" right="-40%"/>
        <Text style={styles.headerText}>Historical Performance Tracking</Text>
        
        <DescriptionSection
        bodyText="Track and celebrate your growth in the &apos;Historical Performance Tracking&apos; section. Visualize your evolution in ASL alphabet proficiency, monitor your advancements, and let your progress fuel your motivation to explore further into the enriching world of ASL."
      />
        <TouchableOpacity
          onPress={() => router.push({ pathname: "/historicalPerformanceTracking/performanceTracking" })}
          style={[styles.nextButton]}
        >
          <Text style={styles.buttonText}>See Progress</Text>
        </TouchableOpacity>
      </VStack>
    </Box>
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    marginLeft: "3%",
    marginTop: "30%",
    marginRight: "40%",
    zIndex: 1,
  },
  buttonText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  nextButton: {
    borderRadius: 8,
    padding: "20%",
    paddingVertical: 20,
    marginBottom:"10%",
    alignItems: "center",
    marginTop: "30%",
    backgroundColor: "#FFED4B",
  },
});
