import React from "react";

import HomeScreen from "../screens/home";
import { createStackNavigator } from "./createStackNavigator";
import type { AppStackParamList } from "./types";

const Stack = createStackNavigator<AppStackParamList>();

function HomeNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

export default HomeNavigator;
