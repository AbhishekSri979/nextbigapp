import React from "react";

import ForgotPasswordScreen from "../screens/forgotPassword";
import LoginScreen from "../screens/login";
import OtpScreen from "../screens/otpScreen";
import RegisterScreen from "../screens/register";
import { createStackNavigator } from "./createStackNavigator";
import type { AuthStackParamList } from "./types";
import ResetPasswordScreen from "../screens/resetPassword";

const Stack = createStackNavigator<AuthStackParamList>();

function AuthNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
