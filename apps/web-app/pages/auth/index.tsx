import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserCredential, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/components/firebase";
import { isValidPassword, validateEmail } from "@/auth";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { checkUserIsInDB } from "@/components/api/httpHandler";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [user] = useAuthState(auth);

  // redirect user to dashboard if already logged in
  useEffect(() => {
    if (user === null) return;
    router.push("/dashboard");
  }, [router, user]);

  // handle user login with email and password
  // and also validates email and password
  function handleSignIn() {
    setIsDisabled(true);

    if (email === "") {
      toast({
        title: "Email cannot be empty",
        duration: 2000,
      });
      setIsDisabled(false);
      return;
    }

    if (!validateEmail(email)) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        duration: 2000,
      });
      setIsDisabled(false);
      return;
    }

    if (password === "") {
      toast({
        title: "Password cannot be empty",

        duration: 2000,
      });
      setIsDisabled(false);
      return;
    }

    if (!isValidPassword(password)) {
      toast({
        variant: "destructive",
        title: "Invalid Password",
        duration: 2000,
      });
      setIsDisabled(false);
      return;
    }

    signInWithEmailAndPassword(auth, email.toLowerCase(), password)
      .then(async (userCredential: UserCredential) => {
        const token = await userCredential.user.getIdToken();

        await checkUserIsInDB(token);

        toast({
          variant: "default",
          title: "Welcome back!",
          duration: 2000,
        });
        router.push("/dashboard");
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: error.message,
          duration: 2000,
        });
        setIsDisabled(false);
      });
  }
  return (
    <div className="flex flex-col items-center h-screen w-screen">
      <div className="mb-10">
        <span className=" text-[40px]"> Welcome to Babbling On</span>
      </div>
      <div className="flex flex-col items-start space-y-7">
        <div className="w-full">
          <label>Email:</label>
          <Input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-16  w-full lg:w-[400px] p-4 mt-2 text-center bg-gray-100 rounded-lg border border-gray-300 focus:outline-pink-150"
          />
        </div>
        <div className="w-full">
          <span>Password:</span>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-16  w-full  lg:w-[400px] p-4 mt-2 text-center bg-gray-100 rounded-lg border border-gray-300 focus:outline-pink-150"
          />
        </div>
        <Button
          disabled={isDisabled}
          onClick={handleSignIn}
          className="text-center items-center w-full  lg:w-[400px] bg-red-150 py-6 rounded-lg"
        >
          Sign In
        </Button>
        <div className="text-center">
          Don&apos;t have an account?{" "}
          <Link className="text-yellow-150" href={""}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
