import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Center, Spinner } from "native-base";
import { DisplayImage } from "@/ui/selfAssessment/displayImage";

interface Question {
  text: string;
  isCorrect: boolean;
  imageUrl: string;
}

export default function AssessmentDetails() {
  const router = useRouter();
  const { assessmentId, dateTaken, score } = useLocalSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
 

  useEffect(() => {
    console.log(`http://localhost:8080/saQuestion/assessment/${assessmentId}`);
    fetch(`http://localhost:8080/saQuestion/assessment/${assessmentId}`)
    .then(async response => {

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server responded with status ${response.status}: ${errorText}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new TypeError('Received non-JSON response from server');
        }
    
        return response.json();
      })
      .then(data => {
        setQuestions(data);
        console.log('Fetched data:', data);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }, [assessmentId]);

  if (questions.length === 0) {
    return <Spinner color="cyan.500" />;
  }

  return (
    <View style={styles.container}>
      <Center width={304.76} height={300} bg="rgba(255, 230, 0, 0.4)" rounded="full" position="absolute" top="-5%" right="-20%" />
      <Center width={200} height={200} bg="rgba(255, 230, 0, 0.4)" rounded="full" position="absolute" top="30%" left="-25%"/>
      <Text style={styles.headerText}>Assessment Details:</Text>
      <Text style={styles.questionText}>Date Taken {dateTaken}</Text>
      <Text style={styles.questionText}>Final Score: {score}</Text>
      <ScrollView style={styles.scrollView}>
        {questions.map((question, index) => (
          <View key={index} style={styles.questionContainer}>
            <Text style={styles.questionText}>
              {question.text} - {question.isCorrect ? "Correct" : "Incorrect"}
            </Text>
            <DisplayImage path={`saImages/${question.imageUrl}`} />
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(drawer)/home")}
      >
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
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
      paddingLeft: "7%",
      marginTop: "30%",
    },
    questionText: {
      fontWeight: "bold",
      fontSize: 24,
      paddingLeft: "7%",
      marginTop: "5%",
    },
    button: {
      width: "90%",
      height: "7%",
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center", 
      margin:"5%",
      marginBottom:"12%",
      marginTop: "5%",
      borderWidth:1,
      borderColor:"#D8D8D8",
      backgroundColor: "#FFED4B",
      alignSelf: "flex-end",
    },
    buttonText: {
      color: "black",
      fontSize: 18,
      fontWeight: "bold"
    },
    scrollView: {
      width: "100%",
      marginTop: 20,
    },
    questionContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
  });
  
