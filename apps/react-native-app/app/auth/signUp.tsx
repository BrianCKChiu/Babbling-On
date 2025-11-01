import React, { useState } from "react";
import {
  Heading,
  Input,
  View,
  VStack,
  Text,
  Button,
  Select,
  Toast,
  Box,
} from "native-base";
import { AuthLayout } from "@/layout/authLayout";
import { useRouter } from "expo-router";

// helpers
import { auth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  UserCredential,
  updateProfile,
  sendEmailVerification,
  reload,
} from "firebase/auth";
import { isValidPassword } from "@/auth/validatePassword";
import { authInputStyle } from "@styles/authInputStyle";
import { HttpHandler } from "@/api/backend";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [role, setRole] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);

  const router = useRouter();

  function handleSignUp() {
    setIsSigningUp(true);
  
    // Validation checks
    if (userName === "") {
      Toast.show({
        title: "Username cannot be empty",
        bgColor: "red.500",
        placement: "bottom",
      });
      setIsSigningUp(false);
      return;
    }
  
    if (email === "") {
      Toast.show({
        title: "Email cannot be empty",
        bgColor: "red.500",
        placement: "bottom",
      });
      setIsSigningUp(false);
      return;
    }

    if (email === "") {
      Toast.show({
        title: "Email cannot be empty",
        bgColor: "red.500",
        placement: "bottom",
      });
      setIsSigningUp(false);
      return;
    }
  
    if (password === "") {
      Toast.show({
        title: "Password cannot be empty",
        bgColor: "red.500",
        placement: "bottom",
      });
      setIsSigningUp(false);
      return;
    }
  
    if (verifyPassword === "") {
      Toast.show({
        title: "Please verify password",
        bgColor: "red.500",
        placement: "bottom",
      });
      setIsSigningUp(false);
      return;
    }
  
    if (password !== verifyPassword) {
      Toast.show({
        title: "Passwords do not match",
        bgColor: "red.500",
        placement: "bottom",
      });
      setIsSigningUp(false);
      return;
    }
  
    if (role === "") {
      Toast.show({
        title: "Please select a role",
        bgColor: "red.500",
        placement: "bottom",
      });
      setIsSigningUp(false);
      return;
    }
  
    if (!isValidPassword(password)) {
      Toast.show({
        title: "Password Requirements:",
        description: "Must contain at least 8 characters, including 1 number, 1 letter, and 1 special character. No spaces allowed.",
        bgColor: "red.500",
        placement: "bottom",
      });
      setIsSigningUp(false);
      return;
    }
  
    createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential: UserCredential) => {
        const user = userCredential.user;
  
        await updateProfile(user, {
          displayName: userName,
        }).catch((error) => {
          console.error("Error updating profile", error);
        });
  
        // Send verification email
        sendEmailVerification(user)
          .then(() => {
            Toast.show({
              title: "A verification email has been sent. Please check your inbox.",
              bgColor: "green.500",
              placement: "bottom",
            });
            setVerificationEmailSent(true); 
          })
          .catch((error) => {
            console.error("Error sending email verification", error);
          });

        HttpHandler.post({
          endpoint: "user/signUp",
          body: {
            email: user.email,
            uid: user.uid,
            role: role,
          },
        });
  
        // Does not auto-login. instead it waits for email verification
        setIsSigningUp(false);
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          Toast.show({
            title: "Email already in use",
            bgColor: "red.500",
            placement: "bottom",
          });
        } else {
          Toast.show({
            title: error.message,
            bgColor: "red.500",
            placement: "bottom",
          });
        }
        setIsSigningUp(false);
      });
  }

  function resendVerificationEmail() {
    const user = auth.currentUser; //Get current user
    if (user) {
      sendEmailVerification(user)
        .then(() => {
          Toast.show({
            title: "Verification email resent. Please check your inbox.",
            bgColor: "green.500",
            placement: "bottom",
          });
        })
        .catch((error) => {
          console.error("Error resending email verification", error);
        });
    }
  }

  function finishSignUp() {
    const user = auth.currentUser;
    if (user) {
      // Refreshing the current user session.
      reload(user)
        .then(() => {
          if (user.emailVerified) {
            router.replace("/(drawer)/home");
          } else {
            Toast.show({
              title: "Please verify your email before finishing sign up.",
              bgColor: "red.500",
              placement: "bottom",
            });
          }
        })
        .catch((error) => {
          console.error("Error reloading user", error);
          Toast.show({
            title: "An error occurred. Please try again.",
            bgColor: "red.500",
            placement: "bottom",
          });
        });
    }
  }
  
  
  
  return (
    <AuthLayout>
      <View>
        <VStack
          px={"40px"}
          py={"40px"}
          alignItems={"center"}
          space={5}
          mt={"20%"}
        >
          <Box mb={12}>
            <Heading fontSize={44} mb={1}>
              Babbling On
            </Heading>
            <Text color={"black"}>Start Learning ASL!</Text>
          </Box>
          <Input
            size="lg"
            placeholder="Username"
            value={userName}
            type="text"
            autoCapitalize="none"
            onChangeText={(text) => setUserName(text)}
            {...authInputStyle}
          />
          <Input
            size="lg"
            placeholder="Email"
            value={email}
            type="text"
            autoCapitalize="none"
            onChangeText={(text) => setEmail(text)}
            {...authInputStyle}
          />
          <Input
            size="lg"
            placeholder="Password"
            type="password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            {...authInputStyle}
          />
          <Input
            size="lg"
            placeholder="Verify Password"
            type="password"
            value={verifyPassword}
            onChangeText={(text) => setVerifyPassword(text)}
            {...authInputStyle}
          />
          <Select
            size="lg"
            _selectedItem={{
              bg: "#FFED4B",
            }}
            width={"100%"}
            h={"55px"}
            selectedValue={role}
            placeholder="Select Role"
            onValueChange={(v) => setRole(v)}
          >
            <Select.Item label="Student" value="student" />
            <Select.Item label="Professor / Teacher" value="teacher" />
          </Select>

          {!verificationEmailSent && (
        <Button
          w="full"
          h={"55px"}
          mb={2}
          bgColor={"#FFED4B"}
          isDisabled={isSigningUp}
          onPress={handleSignUp}
        >
          <Text color={"black"} fontWeight={"semibold"}>
            {isSigningUp ? "Signing Up..." : "Sign Up"}
          </Text>
        </Button>
      )}

      {verificationEmailSent && (
        <>
          <Button
            w="full"
            h={"55px"}
            mb={2}
            bgColor={"#FFED4B"}
            onPress={finishSignUp}
          >
            <Text color={"black"} fontWeight={"semibold"}>
              Finish Signing Up
            </Text>
          </Button>
          <Button
            w="full"
            h={"55px"}
            bgColor={"#FFED4B"}
            onPress={resendVerificationEmail}
          >
            <Text color={"black"} fontWeight={"semibold"}>
              Resend Verification Link
            </Text>
          </Button>
        </>
      )}
    </VStack>
      </View>
    </AuthLayout>
  );
}
