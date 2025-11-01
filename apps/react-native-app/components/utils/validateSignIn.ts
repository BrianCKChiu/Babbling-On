import { validateEmail } from "@/auth";
import { isValidPassword } from "@/auth/validatePassword";

export function validateSignIn(
  email: string,
  password: string
): { message: string; valid: boolean } {
  if (email === "") {
    return { message: "Email cannot be empty", valid: false };
  } else if (!validateEmail(email)) {
    return { message: "Invalid email", valid: false };
  } else if (password === "") {
    return { message: "Password cannot be empty", valid: false };
  } else if (!isValidPassword(password)) {
    return {
      message:
        "Password must be at least 8 characters long and contain both letters and numbers",
      valid: false,
    };
  } else {
    return { message: "", valid: true };
  }
}
