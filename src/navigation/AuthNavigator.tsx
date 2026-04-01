import React from "react";

import ForgotPasswordScreen from "../screens/forgotPassword";
import LoginScreen from "../screens/login";
import RegisterScreen from "../screens/register";
import { createStackNavigator } from "./createStackNavigator";
import type { AuthStackParamList } from "./types";

const Stack = createStackNavigator<AuthStackParamList>();

function AuthNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
