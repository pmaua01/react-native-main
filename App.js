import "react-native-gesture-handler";
import React, { useCallback, useState } from "react";
import { StyleSheet, View, TextInput, Text } from "react-native";

import { RegistrationScreen } from "./Screens/RegistrationScreen";
import { LoginScreen } from "./Screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { route } from "./router";

import { Main } from "./component/Main";
// import { createStackNavigator } from "@react-navigation/stack";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import Home from "./Screens/mainScreen/Home";
// import PostsScreen from "./Screens/mainScreen/PostsScreen";
// import CreatePostsScreen from "./Screens/mainScreen/CreatePostsScreen";
// import ProfileScreen from "./Screens/mainScreen/ProfileScreen";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import { Provider } from "react-redux";

import { store } from "./redux/store";

import { getAuth, onAuthStateChanged } from "firebase/auth";

// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

SplashScreen.preventAutoHideAsync();

export default function App() {
  // const [user, setUser] = useState(null);
  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("./fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("./fonts/Roboto-Medium.ttf"),
  });

  // const routing = route(user);

  // const auth = getAuth();
  // onAuthStateChanged(auth, (user) => {
  //   setUser(user);
  // });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  return (
    // <View
    //   style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    //   onLayout={onLayoutRootView}
    // >
    //   <Text>TEST</Text>
    // </View>
    <Provider store={store} onLayout={onLayoutRootView}>
      <Main />
    </Provider>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
// });

/* <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Register"
          component={RegistrationScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
      </Stack.Navigator> */
