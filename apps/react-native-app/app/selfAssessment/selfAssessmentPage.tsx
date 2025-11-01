import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import { v4 as uuidv4 } from "uuid";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import "react-native-get-random-values";
import imageAnalyzer from "@/selfAssessment/imageAnalyzer";
import { Center, Spinner } from "native-base";
import { DisplayImage } from "@/ui/selfAssessment/displayImage";
import ImageModal from "@/ui/selfAssessment/imageModal";

export default function selfAssessmentPage() {
  const router = useRouter();
  const { length, assessmentId } = useLocalSearchParams();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(CameraType.back);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const cameraRef = useRef<Camera | null>(null);
  const storage = getStorage();
  const [isMessageVisible, setIsMessageVisible] = React.useState(false);
  const [messageContent, setMessageContent] = React.useState<{
    text: string;
    color: string;
    recognizedLetter?: string;
  }>({ text: "", color: "" });
  const [isButtonClickable, setIsButtonClickable] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const lengthInt = parseInt(length as string, 10);
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questionImageUrl, setquestionImageUrl] = useState<string | null>(null);



  const questionString = `Question ${currentQuestion}/${length}`;

  const getRandomLetter = () => {
    const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXY";
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    return alphabet[randomIndex];
  };
  const [currentLetter, setCurrentLetter] = useState(() => getRandomLetter());

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  
  const updateScore = () => {
    const ex = (score * lengthInt + 1) / lengthInt;
    setScore(parseFloat(ex.toFixed(2)));
  };

  const handleNextClick = async () => {
    await createQuestionRecord(isCorrect, questionImageUrl as string);
    if (currentQuestion < lengthInt) {
      setCurrentQuestion(currentQuestion + 1);
      enableButton();
      setIsMessageVisible(false);
      setCurrentLetter(getRandomLetter());
      setCapturedImageUri(null);
    } else {
      console.log(assessmentId);
      fetch(
        `http://localhost:8080/selfAssessment/end-assessment/${assessmentId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            score: Math.round(score*100),
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            return Promise.reject("Server Error");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Assessment Updated:", data);
        })
        .catch((err) => {
          console.error("Error:", err);
        });

      router.push({
        pathname: "/selfAssessment/results",
        params: { length: length, score: Math.round(score*100), assessmentId: assessmentId, },
      });
    }
  };

  const createQuestionRecord = async (result: boolean, imageUrl: string) => {
    try {
      const response = await fetch(`http://localhost:8080/saQuestion/add`, {
        method: "POST",
        body: JSON.stringify({
          assessmentId: assessmentId,
          text: currentLetter,
          isCorrect: isCorrect,
          imageUrl: imageUrl.split('/').pop(), 
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to create question record");
      }
  
      const data = await response.json();
      console.log("Question Created:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  const enableButton = () => {
    setIsButtonClickable((prevIsButtonClickable) => !prevIsButtonClickable);
  };

  const showMessage = (wasCorrect: boolean, recognizedLetter: string) => {
    let messageText = "";
    if (wasCorrect) {
      setIsCorrect(true);
      messageText = `Correct! You performed: ${recognizedLetter}`;
      setMessageContent({
        text: messageText,
        color: "#A9F8AC",
        recognizedLetter,
      });
    } else {
      setIsCorrect(false);
      messageText = `Incorrect! :( You performed: ${recognizedLetter}`;
      setMessageContent({
        text: messageText,
        color: "#F9B3A8",
        recognizedLetter,
      });
    }
    setIsMessageVisible(true);
  };
  

  const toggleCameraType = () => {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

 const takeAndUploadPicture = async () => {
  if (cameraRef.current) {
    const options = { quality: 0.5, base64: true };
    const photo = await cameraRef.current.takePictureAsync(options);

    setCapturedImageUri(photo.uri);
    setIsLoading(true);  // Start loading after picture is taken
    setIsCameraVisible(false);  // Close the camera

    try {
      const downloadURL = await uploadImageToFirebase(photo.uri);
      // Analyzing the code using AI:
      const [success, isPredictionCorrect, recognizedLetter] = await imageAnalyzer(downloadURL, currentLetter);

      if (success) {
        showMessage(isPredictionCorrect, recognizedLetter);// Show message based on prediction
        if (isPredictionCorrect) {
          updateScore(); // Updating score if gesture is correct
        }
      } else {
        console.log("Error analyzing image");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    
    setIsLoading(false);  // Stop loading after processing is done
    enableButton();
  }
};


  const uploadImageToFirebase = async (uri: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const uniqueID = uuidv4();


    const metadata = {
      contentType: "image/jpeg",
    };

    setquestionImageUrl(`${uniqueID}.jpeg`)
    const storageRef = ref(storage, `saImages/${uniqueID}.jpeg`);
    const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error(error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Image available at:", downloadURL);
          resolve(downloadURL);
        }
      );
    });
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {isCameraVisible ? (
        <SafeAreaView style={styles.container}>
          <Camera ref={cameraRef} style={styles.camera} type={type}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={toggleCameraType}
                style={styles.button}
              >
                <Text style={styles.text}>Flip Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={takeAndUploadPicture}
                style={styles.button}
              >
                <Text style={styles.text}>Take Picture</Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </SafeAreaView>
      ) : (
        <View style={styles.container}>
          <Center width={304.76} height={300} bg="rgba(255, 230, 0, 0.4)" rounded="full" position="absolute" top="8%" left="-5%" />
          <Center width={250} height={250} bg="rgba(255, 230, 0, 0.4)" rounded="full" position="absolute" top="25%" left="55%"/>
          <Text style={[styles.headerText, { marginTop: !isMessageVisible ? "60%" : "22%", }]}>
          {questionString + "\n\nPerform the gesture for: " + currentLetter}
          </Text>
          {isMessageVisible && (
            <Text style={styles.bodyText}>Correct gesture:</Text>
          )}
          {isMessageVisible && (
          <DisplayImage path={`aslAlphabets/${currentLetter}_test.jpg`} />
          )}
          {isLoading ? (
            <View style={styles.spinnerContainer}>
              <Spinner size="lg" />
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.performGestureButton,
                {
                  backgroundColor: !isButtonClickable ? "#FFED4B" : "#B0B0B0",
                  marginTop: !isMessageVisible ? "35%" : "10%",
                },
              ]}
              onPress={() => setIsCameraVisible(true)}
              disabled={isButtonClickable}
            >
              <Text style={styles.buttonText}>Perform Gesture</Text>
            </TouchableOpacity>
          )}
          {isMessageVisible && (
            <View
              style={[
                styles.messageBox,
                { backgroundColor: messageContent.color },
              ]}
            >
              <Text style={styles.messageText}>{messageContent.text}</Text>
            </View>
          )}
          {capturedImageUri && (
        <View style={styles.capturedImageContainer}>
        <Text style={styles.yourAttemptText}>Your attempt:</Text>
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Image source={{ uri: capturedImageUri }} style={styles.smallImage} />
        </TouchableOpacity>
      </View>
    )}

        <ImageModal
          isVisible={isModalVisible}
          imageUri={capturedImageUri as string}
          onClose={() => setIsModalVisible(false)}
        />
  
          <TouchableOpacity
            onPress={handleNextClick}
            disabled={!isButtonClickable}
            style={[
              styles.nextButton,
              {
                backgroundColor: isButtonClickable ? "#FFED4B" : "#B0B0B0",
              },
            ]}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
  
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  headerText: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    marginHorizontal: "10%",
    marginBottom: height * 0.02,
    lineHeight: width * 0.065,
  },
  bodyText: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    marginHorizontal: "10%",
    marginBottom: height * 0.01,
  },
  performGestureButton: {
    width: "80%",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: height * 0.02,
    marginHorizontal: "10%",
    marginBottom: height * 0.02,
    justifyContent: "center", 
    flexDirection: "row",
  },
  buttonText: {
    color: "black",
    fontSize: width * 0.05,
    fontWeight: "bold",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: width * 0.01,
    justifyContent: "space-between",
  },
  button: {
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  text: {
    fontSize: width * 0.045,
    color: "white",
  },
  messageBox: {
    width: "80%",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginHorizontal: "10%",
    marginBottom: height * 0.02,
  },
  messageText: {
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  nextButton: {
    width: "80%",
    borderRadius: 8,
    paddingVertical: height * 0.02,
    marginHorizontal: "10%",
    alignSelf: "center",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: "10%"
  },
  spinnerContainer: {
    width: "78%",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: height * 0.02,
    marginHorizontal: "10%",
  },
  capturedImageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.01,
  },
  yourAttemptText: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    marginRight: 10,
  },
  smallImage: {
    width: 50, 
    height: 50, 
  },
});

