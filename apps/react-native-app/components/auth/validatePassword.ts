// export const isValidPassword = (pass: string) => {
//   const hasNumber = /\d/;
//   const hasLetter = /[a-zA-Z]/;
//   return pass.length >= 8 && hasNumber.test(pass) && hasLetter.test(pass);
// };

// version 2 to add after development:
export const isValidPassword = (pass: string) => {
  const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/;
  return passwordRegex.test(pass);
};


//Conditions of version 2:
// At least one number
// At least one letter (uppercase or lowercase
// At least one special character
// No whitespace characters
// Minimum length of 8 characters
