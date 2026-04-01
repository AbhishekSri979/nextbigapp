import React from "react";

import AuthNavigator from "./AuthNavigator";
import HomeNavigator from "./HomeNavigator";
import { createStackNavigator } from "./createStackNavigator";
import type { RootStackParamList } from "./types";

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator initialRouteName="AuthStack">
      <Stack.Screen name="AuthStack" component={AuthNavigator} />
      <Stack.Screen name="AppStack" component={HomeNavigator} />
    </Stack.Navigator>
  );
}

export default RootNavigator;
