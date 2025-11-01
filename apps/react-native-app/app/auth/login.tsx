import React, { useState } from "react";
import {
  View,
  Heading,
  Text,
  Input,
  VStack,
  Button,
  useToast,
  Box,
} from "native-base";
import { authInputStyle } from "@styles/authInputStyle";

import { AuthLayout } from "@/layout/authLayout";
import { Link } from "expo-router";

import { useRouter } from "expo-router";

// helpers
import { auth } from "@/firebase";
import { validateSignIn } from "@/utils/validateSignIn";
import { UserCredential, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toasts = useToast();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  function handleSignIn() {
    setIsLoggingIn(true);
    const results = validateSignIn(email, password);
    if (!results.valid) {
      toasts.show({
        title: results.message,
        bgColor: "red.500",
        duration: 2000,
      });
      setIsLoggingIn(false);
      return;
    }
  
    signInWithEmailAndPassword(auth, email.toLowerCase(), password)
      .then(async (userCredential: UserCredential) => {
        const user = userCredential.user;
        if (user.emailVerified) {
          // Email is alredy verified, user can proceed to home page
          toasts.show({
            title: user.displayName
              ? `Welcome back ${user.displayName}`
              : "Login Successful",
            bgColor: "green.500",
            duration: 2000,
          });
          router.replace("/(drawer)/home");
        } else {
          // Email is not verified, so we send a verification email
          sendEmailVerification(user).then(() => {
            toasts.show({
              title: "Your email is not verified. Check your inbox for a verification link.",
              bgColor: "blue.500",
              duration: 2000,
            });
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toasts.show({
          title: "Invalid Credentials, please try again!",
          bgColor: "red.500",
          duration: 2000,
        });
      })
      .finally(() => {
        setIsLoggingIn(false);
      });
  }

  return (
    <AuthLayout>
      <View>
        <VStack px={"40px"} py={"40px"} alignItems={"center"} mt={"30%"}>
          <Box mb={40}>
            <Heading fontSize={44} mb={1}>
              Babbling On
            </Heading>
            <Text color={"black"}>Start Learning ASL!</Text>
          </Box>

          <VStack space={5} w={"full"}>
            <Text w={"100%"} fontWeight={"bold"} fontSize={16}>
              Login
            </Text>
            <Input
              testID="email"
              size="lg"
              placeholder="Email"
              value={email}
              autoCapitalize="none"
              onChangeText={(text) => setEmail(text)}
              {...authInputStyle}
            />
            <Input
              testID="password"
              size="lg"
              placeholder="Password"
              type="password"
              value={password}
              onChangeText={(text) => setPassword(text)}
              {...authInputStyle}
            />
            <Box alignItems={"center"}>
              <Button
                w="full"
                h={"55px"}
                mb={2}
                onPress={handleSignIn}
                isDisabled={isLoggingIn}
                bgColor={"#FFED4B"}
              >
                <Text fontWeight={"semibold"} color={"black"}>
                  Sign in
                </Text>
              </Button>
              <Text>
                Need an account?{" "}
                <Link href="/auth/signUp">
                  <Text color={"blue.400"}>Sign up</Text>
                </Link>
              </Text>
            </Box>
          </VStack>
        </VStack>
      </View>
    </AuthLayout>
  );
}
