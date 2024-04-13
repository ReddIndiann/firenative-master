import React, { useEffect, useState } from "react";
import { View, Image, Text, StyleSheet, Animated } from "react-native";
import AppLogo from "../assets/Valley_View_University_logo-removebg-preview.png"; // Adjust the import according to your project structure

const SplashScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Remove or comment out this useEffect block
  useEffect(() => {
    if (!loading) {
      navigation.navigate('Login'); // Adjust as per your navigation setup
    }
  }, [loading, navigation]);

  return (
    <View style={styles.splashScreen}>
      <Animated.View style={styles.logoContainer}>
        <Animated.Image source={AppLogo} style={styles.appLogo} />
        <View style={styles.textContainer}>
          <Text style={styles.firstText}>Purchases,</Text>
          <Text style={styles.secondText}>Simplified</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  splashScreen: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    // Add animation styles if needed
  },
  logoContainer: {
    width: 300, // Adjust as needed
    height: 200, // Adjust as needed
    justifyContent: "center",
    alignItems: "center",
    // Add animation styles if needed
  },
  appLogo: {
    width: 200, // Adjust as needed
    height: 200, // Adjust as needed
    marginBottom: 10,
    // Add animation styles if needed
  },

  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // Add animation styles if needed
  },
  firstText: {
    color: "#008ed8",
    fontSize: 20,
    marginRight: 4,
    // Add fontFamily if needed
  },
  secondText: {
    color: "#424242",
    fontSize: 20,
    marginLeft: 4,
    // Add fontFamily if needed
  },
});

export default SplashScreen;
