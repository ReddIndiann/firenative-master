import React, { useEffect, useState } from "react";
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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import AppLogo from "../assets/Valley_View_University_logo-removebg-preview.png";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("TopTab");
      }
    });
    return unsubscribe;
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Signed in");
    } catch (err) {
      console.error(err);

      let errorMessage;
      switch (err.code) {
        case "auth/wrong-password":
          errorMessage = "The password is incorrect. Please try again.";
          break;
        case "auth/user-not-found":
          errorMessage = "No user found with this email. Please sign up.";
          break;
        case "auth/invalid-email":
          errorMessage =
            "The email address is invalid. Please enter a valid email.";
          break;
        case "auth/user-disabled":
          errorMessage = "This user has been disabled. Please contact support.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Please try again later.";
          break;
        default:
          errorMessage = "An unexpected error occurred. Please try again.";
      }

      Alert.alert("Login Error", errorMessage);
    }
  };

  const handleAlreadyHaveAccount = () => {
    navigation.navigate("SignIn");
  };

  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Text style={styles.title}>Valley View Essentials</Text>
      <Text style={styles.header}>Login to Purchase</Text>
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
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSignIn} style={styles.button}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignUp}>
          <Text style={styles.dontHaveAccountText}>
            Don't have an account?{" "}
            <Text style={styles.signUpText}>Sign Up</Text>
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
    marginTop: 0,
  },
  header: {
    fontSize: 18,
    color: "#003366",
    marginBottom: 20,
    fontWeight: 100,
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
    marginBottom: 20,
    marginTop: 0,
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
  signUpText: {
    color: "#00A5ED",
  },
  appLogo: {
    width: 150, // Adjust as needed
    height: 150, // Adjust as needed
    marginBottom: 20,
  },
});

export default LoginScreen;
