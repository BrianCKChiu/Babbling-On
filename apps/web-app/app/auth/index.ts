import { auth } from "@/components/firebase";

export function validateEmail(email: string) {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
}
export const isValidPassword = (pass: string) => {
  const hasNumber = /\d/;
  const hasLetter = /[a-zA-Z]/;
  return pass.length >= 8 && hasNumber.test(pass) && hasLetter.test(pass);
};

export function logout() {
  auth.signOut();
}
