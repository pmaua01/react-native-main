import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DefaultPostsScreen from "../nestedScreens/DefaultPostScreen";
import CommentsScreen from "../nestedScreens/CommentsScreen";
import MapScreen from "../nestedScreens/MapScreen";
import { useDispatch } from "react-redux";
// icon
import Logout from "../../images/log-out.svg";

import { authSignOut } from "../../redux/auth/authOperations";

const NestedScreen = createStackNavigator();

function MyBackButton() {
  const dispatch = useDispatch();

  return (
    <Logout
      style={{ marginRight: 15 }}
      title="Logout"
      onPress={() => {
        dispatch(authSignOut());
      }}
    />
  );
}

const PostsScreen = () => {
  return (
    <NestedScreen.Navigator>
      <NestedScreen.Screen
        name="Публикации"
        component={DefaultPostsScreen}
        options={{
          headerLeft: null,
          headerRight: () => <MyBackButton />,
          headerTitleAlign: "center",
        }}
      />
      <NestedScreen.Screen
        name="Комментарии"
        component={CommentsScreen}
        options={{ headerTitleAlign: "center" }}
      />
      <NestedScreen.Screen
        name="MapScreen"
        component={MapScreen}
        options={{ headerTitleAlign: "center" }}
      />
    </NestedScreen.Navigator>
  );
};

export default PostsScreen;
