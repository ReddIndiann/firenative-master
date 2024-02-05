import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AdminScreen from './screens/AdminScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SettingsScreen from './screens/Settings';
import WaterScreen from './screens/WaterScreen';
import EstateScreen from './screens/EstateScreen';
import History from './screens/History';
import SignUpScreen from './screens/SignUpScreen';
import SplashScreen from './screens/SplashScreen';
import { Pressable,Image
 } from 'react-native';
//working 





const TopTabs = createMaterialTopTabNavigator();

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
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen options={{headerShown: false}} name="SPLASH" component={SplashScreen} />
        <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
        <Stack.Screen options={{headerShown: false}} name="signup" component={SignUpScreen} />
        <Stack.Screen name="TopTab" component={TopTabsGroup}
          options={{
            headerLeft: () => {
              const navigation = useNavigation(); // get the navigation object
              return (
                <Pressable onPress={() => navigation.navigate('settings')}>
                  <Image
                    source={require("./assets/beto.jpeg")}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 100,
                      marginLeft: 15,
                    }}
                  />
                </Pressable>
              );
            },
          }}
        />
        <Stack.Screen name="Admin" component={AdminScreen} />
        <Stack.Screen name="settings" component={SettingsScreen} />
        <Stack.Screen name="history" component={History} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '  black',
    alignItems: 'center',
    justifyContent: 'center',
  },
});