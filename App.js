import React, { useState, useEffect } from "react";
import { Text, View, Pressable } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import SettingsScreen from "./screens/Settings";
import HomeScreen from "./screens/HomeScreen";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import EstateBuy from "./screens/EstateBuy";
import History from "./screens/History";
import AdminScreen from "./screens/AdminScreen";
import WaterScreen from "./screens/WaterScreen";
import EstateScreen from "./screens/EstateScreen";
import Receipt from "./screens/Reciept";

const Stack = createNativeStackNavigator();
const TopTabs = createMaterialTopTabNavigator();

export default function App() {
  const [name, setName] = useState(null);

  useEffect(() => {
    const fetchUserName = async () => {
      if (auth.currentUser) {
        try {
          const userRef = doc(db, "userrs", auth.currentUser.uid);
          const docSnapshot = await getDoc(userRef);
          if (docSnapshot.exists()) {
            setName(docSnapshot.data().displayName);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user document:", error);
        }
      }
    };

    fetchUserName();
  }, [auth.currentUser]); // Add auth.currentUser as a dependency to the useEffect hook

  function getInitials(fullName) {
    if (!fullName) return "";
    const nameParts = fullName.split(" ");
    const initials = nameParts.map((part) => part.charAt(0)).join("");
    return initials.toUpperCase();
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          name="SignUp"
          options={{ headerShown: false }}
          component={SignUpScreen}
        />
        <Stack.Screen
          name="SPLASH"
          options={{ headerShown: false }}
          component={SplashScreen}
        />
        <Stack.Screen
          name="TopTab"
          component={TopTabsGroup}
          options={{
            headerLeft: () => {
              const navigation = useNavigation();
              return (
                <Pressable onPress={() => navigation.navigate("settings")}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: "#00A5ED",
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: 15,
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 16 }}>
                      {name ? getInitials(name) : ""}
                    </Text>
                  </View>
                </Pressable>
              );
            },
          }}
        />
        <Stack.Screen name="Admin" component={AdminScreen} />
        <Stack.Screen name="settings" component={SettingsScreen} />
        <Stack.Screen name="estatebuy" component={EstateBuy} />
        <Stack.Screen name="history" component={History} />
        <Stack.Screen name="receipt" component={Receipt} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function TopTabsGroup() {
  return (
    <TopTabs.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          textTransform: "capitalize",
          fontWeight: "bold",
        },
        tabBarIndicatorStyle: {
          height: 5,
          borderRadius: 5,
          backgroundColor: "#1DA1F2",
        },
      }}
    >
      <TopTabs.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "HomeScreen",
        }}
      />
      <TopTabs.Screen name="Purchase Water" component={WaterScreen} />
      <TopTabs.Screen name="Estate" component={EstateScreen} />
    </TopTabs.Navigator>
  );
}
