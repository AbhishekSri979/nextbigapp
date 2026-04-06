import type {
  NavigationProp,
  NavigatorScreenParams,
} from "@react-navigation/native";

export type OtpDeliveryMode = "email" | "phone";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: {
    identifier: string;
    authMode: OtpDeliveryMode;
  };
  OtpScreen: {
    identifier: string;
    authMode: OtpDeliveryMode;
  };
};

export type AppStackParamList = {
  Home: undefined;
};

export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList> | undefined;
  AppStack: NavigatorScreenParams<AppStackParamList> | undefined;
};

export type AuthNavigationProp<
  RouteName extends keyof AuthStackParamList = keyof AuthStackParamList
> = NavigationProp<AuthStackParamList, RouteName>;

export type AppNavigationProp<
  RouteName extends keyof AppStackParamList = keyof AppStackParamList
> = NavigationProp<AppStackParamList, RouteName>;

export type RootNavigationProp<
  RouteName extends keyof RootStackParamList = keyof RootStackParamList
> = NavigationProp<RootStackParamList, RouteName>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
