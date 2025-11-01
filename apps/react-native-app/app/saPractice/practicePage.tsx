import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { Toast } from "native-base";
import { Camera, CameraType } from "expo-camera";
import { v4 as uuidv4 } from "uuid";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import "react-native-get-random-values";
import { DisplayImage } from "@/ui/selfAssessment/displayImage";
import imageAnalyzer from "@/selfAssessment/imageAnalyzer";
import { Spinner } from "native-base";
import ImageModal from "@/ui/selfAssessment/imageModal";

export default function practicePage() {
  const router = useRouter();
  const { letter } = useLocalSearchParams();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(CameraType.back);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const cameraRef = useRef<Camera | null>(null);
  const storage = getStorage();
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMessageVisible, setIsMessageVisible] = React.useState(false);
  const [isPredictionCorrect, setIsPredictionCorrect] = useState(true);
  const [messageContent, setMessageContent] = React.useState<{
    text: string;
    color: string;
    recognizedLetter?: string;
  }>({ text: "", color: "" });
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const showMessage = (wasCorrect: boolean, recognizedLetter: string) => {
    let messageText = "";
    if (wasCorrect) {
      messageText = `Correct! You performed: ${recognizedLetter}`;
      setMessageContent({
        text: messageText,
        color: "#A9F8AC",
        recognizedLetter,
      });
    } else {
      messageText = `Incorrect! You performed: ${recognizedLetter}`;
      setMessageContent({
        text: messageText,
        color: "#F9B3A8",
        recognizedLetter,
      });
      setIsPredictionCorrect(false);
    }
    setIsMessageVisible(true);
  };
  
  const performGesture = () => {
    setIsCameraVisible(true);
    setIsMessageVisible(false); 
    setIsPredictionCorrect(true);
  };

  const handleWrongPrediction = async () => {
    Toast.show({
      title: "Image Saved",
      description: "The image has been saved to retrain the AI.",
      bgColor: "red.500",
      placement: "bottom",
    });
  
    if (capturedImageUri) {
      const uniqueID = uuidv4();
      const fileName = `${letter}_${uniqueID}`;
  
      const storageRef = ref(storage, `reTrain/${fileName}.jpeg`);
      const response = await fetch(capturedImageUri);
      const blob = await response.blob();
      const uploadTask = uploadBytesResumable(storageRef, blob);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Error during upload:", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Image available at:", downloadURL);
        }
      );
    }
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
      setIsLoading(true); // Start loading after picture is taken
      setIsCameraVisible(false); // Close the camera

      try {
        const downloadURL = await uploadImageToFirebase(photo.uri);
        // Analyzing the code using AI:
        const [success, isPredictionCorrect, recognizedLetter] = await imageAnalyzer(downloadURL, letter as string);


        if (success) {
          showMessage(isPredictionCorrect, recognizedLetter); // Show message based on prediction
        } else {
          console.log("Error analyzing image");
        }
      } catch (error) {
        console.error("Error:", error);
      }
      setIsLoading(false);
    }
  };

  const uploadImageToFirebase = async (uri: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const uniqueID = uuidv4();

    const metadata = {
      contentType: "image/jpeg",
    };

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
    <SafeAreaView style={styles.container}>
      {isCameraVisible ? (
        <Camera ref={cameraRef} style={styles.camera} type={type}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={toggleCameraType} style={styles.button}>
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
      ) : (
        <View>
          <DisplayImage path={`aslAlphabets/${letter}_test.jpg`} />
          <Text style={styles.headerText}>
            This is the gesture for {letter}
          </Text>
          {isLoading ? (
            <View style={styles.spinnerContainer}>
              <Spinner size="lg" />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.performGestureButton}
              onPress={performGesture}
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
        {!isPredictionCorrect && (
        <TouchableOpacity onPress={handleWrongPrediction}>
          <Text style={[styles.yourAttemptText,{color: "red"}]}>Wrong Prediction?</Text>
          </TouchableOpacity>
          )}
          </View>
    )}

        <ImageModal
          isVisible={isModalVisible}
          imageUri={capturedImageUri as string}
          onClose={() => setIsModalVisible(false)}
        />

          <TouchableOpacity
            onPress={() => router.back()}
            style={[
              styles.nextButton,
            ]}
          >
            <Text style={styles.buttonText}>End Practice</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
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
    marginLeft: "10%",
    marginTop: "10%",
  },
  buttonText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  nextButton: {
    width: "80%",
    borderRadius: 8,
    padding: 30,
    paddingVertical: "5%",
    margin: "10%",
    alignSelf: "flex-end",
    alignItems: "center",
    marginTop: "auto",
    backgroundColor: "#FFED4B",
  },
  spinnerContainer: {
    width: "78%",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: "4%",
    margin: "10%",
  },
  performGestureButton: {
    width: "80%",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: "5%",
    margin: "10%",
    marginBottom: "5%",
    justifyContent: 'center', 
    flexDirection: 'row',
    backgroundColor: "#FFED4B",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 5,
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
    fontSize: 18,
    color: "white",
  },
  messageBox: {
    width: "80%",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    margin: "10%",
    marginBottom: "3%",
    marginTop: "0%",
  },
  messageText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  capturedImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  yourAttemptText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
    marginLeft: 5,
  },
  smallImage: {
    width: 50, 
    height: 50, 
    marginBottom: "15%",
  },
});
