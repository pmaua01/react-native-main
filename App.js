import "react-native-gesture-handler";
import React, { useCallback, useState } from "react";
import { StyleSheet, View, TextInput, Text } from "react-native";

import { RegistrationScreen } from "./Screens/RegistrationScreen";
import { LoginScreen } from "./Screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { route } from "./router";

import { Main } from "./component/Main";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import { Provider } from "react-redux";

import { store } from "./redux/store";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("./fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("./fonts/Roboto-Medium.ttf"),
  });

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
