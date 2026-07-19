export const validateEmail = (email) => {
  if (!email.trim()) return "Email is required";
  if (!/\S+@\S+\.\S+/.test(email)) return "Invalid email address";
  return "";
};

export const validatePassword = (password) => {
  if (!password.trim()) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number";
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) return "Password must contain at least one special character";
  return "";
};

export const validateName = (name, fieldName = "Name") => {
  if (!name.trim()) return `${fieldName} is required`;
  if (name.trim().length < 2) return `${fieldName} must be at least 2 characters`;
  return "";
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword.trim()) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return "";
};