import React, { useEffect, useState } from "react";
import { Keyboard } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Ionicons from "@expo/vector-icons/Ionicons";

import { RegistrationScreen } from "./Screens/RegistrationScreen";
import { LoginScreen } from "./Screens/LoginScreen";

import { Main } from "./component/Main";
import PostsScreen from "./Screens/mainScreen/PostsScreen";
import CreatePostsScreen from "./Screens/mainScreen/CreatePostsScreen";
import ProfileScreen from "./Screens/mainScreen/ProfileScreen";

//icon
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import Grid from "./images/grid.svg";
import Plus from "./images/plus.svg";
import User from "./images/user.svg";
import Logout from "./images/log-out.svg";

import { useNavigation } from "@react-navigation/native";
import { HeaderBackButton } from "@react-navigation/elements";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MyBackButton() {
  const navigation = useNavigation();

  return (
    <HeaderBackButton
      title="Logout"
      onPress={() => {
        navigation.goBack();
      }}
    />
  );
}

export const route = (isAuth) => {
  if (!isAuth) {
    return (
      <Stack.Navigator>
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
      </Stack.Navigator>
    );
  }
  return (
    <Tab.Navigator>
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, size, color }) => (
            <Grid name="Grid" size={size} color={color} />
          ),
          // headerRight: () => <MyBackButton />,
        }}
        name="PostsScreen"
        component={PostsScreen}
      />
      <Tab.Screen
        options={{
          // headerShown: false,
          tabBarShowLabel: false,
          headerTitleAlign: "center",
          headerLeft: () => <MyBackButton />,
          tabBarIcon: ({ focused, size, color }) => (
            <Plus name="Plus" size={size} color={color} />
          ),
        }}
        name="Создать публикацию"
        component={CreatePostsScreen}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          headerLeft: () => <MyBackButton />,
          tabBarIcon: ({ focused, size, color }) => (
            <User name="User" size={size} color={color} />
          ),
        }}
        name="ProfileScreen"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};
