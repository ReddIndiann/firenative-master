import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signUpWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import AppLogo from "../assets/Valley_View_University_logo-removebg-preview.png";

const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const navigation = useNavigation();

  const handleSignUp = async () => {
    try {
      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match.");
        return;
      }

      await signUpWithEmailAndPassword(auth, email, password);
      console.log("Signed up");
    } catch (err) {
      console.error(err);

      let errorMessage;
      switch (err.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email address is already in use.";
          break;
        case "auth/invalid-email":
          errorMessage =
            "The email address is invalid. Please enter a valid email.";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters long.";
          break;
        default:
          errorMessage = "An unexpected error occurred. Please try again.";
      }

      Alert.alert("Sign Up Error", errorMessage);
    }
  };

  const handleAlreadyHaveAccount = () => {
    navigation.navigate("Login");
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Text style={styles.title}>Valley View Essentials</Text>
      <Text style={styles.header}>Create an account</Text>
      <Image source={AppLogo} style={styles.appLogo} />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          style={[
            styles.input,
            { borderColor: emailFocused ? "#00A5ED" : "#e8e8e8" },
          ]}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          secureTextEntry
          style={[
            styles.input,
            { borderColor: passwordFocused ? "#00A5ED" : "#e8e8e8" },
          ]}
        />
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          onFocus={() => setConfirmPasswordFocused(true)}
          onBlur={() => setConfirmPasswordFocused(false)}
          secureTextEntry
          style={[
            styles.input,
            { borderColor: confirmPasswordFocused ? "#00A5ED" : "#e8e8e8" },
          ]}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSignUp} style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAlreadyHaveAccount}>
          <Text style={styles.alreadyAccountText}>
            Already have an account?{" "}
            <Text style={styles.logInText}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#003366", // Deep blue
    marginBottom: 20,
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 1,
    height: 50,
    marginBottom: 20,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#00A5ED", // Blue
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  alreadyAccountText: {
    marginTop: 20,
    color: "grey",
  },
  logInText: {
    color: "#00A5ED",
  },
  appLogo: {
    width: 150, // Adjust as needed
    height: 150, // Adjust as needed
    marginBottom: 20,
  },
});

export default SignUpScreen;
