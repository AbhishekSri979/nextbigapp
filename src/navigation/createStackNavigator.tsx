import React from "react";
import {
  createNavigatorFactory,
  StackRouter,
  useNavigationBuilder,
} from "@react-navigation/native";
import type {
  DefaultNavigatorOptions,
  NavigationListBase,
  ParamListBase,
  StackNavigationState,
  TypedNavigator,
} from "@react-navigation/native";

const StackNavigator = (
  props: DefaultNavigatorOptions<
    ParamListBase,
    string | undefined,
    StackNavigationState<ParamListBase>,
    {},
    {},
    unknown
  >
): React.JSX.Element => {
  const {
    state,
    descriptors,
    NavigationContent,
  } = useNavigationBuilder(StackRouter, props);

  return (
    <NavigationContent>
      {descriptors[state.routes[state.index].key].render()}
    </NavigationContent>
  );
};

export function createStackNavigator<
  ParamList extends ParamListBase,
>(): TypedNavigator<{
  ParamList: ParamList;
  NavigatorID: string | undefined;
  State: StackNavigationState<ParamList>;
  ScreenOptions: {};
  EventMap: {};
  NavigationList: NavigationListBase<ParamList>;
  Navigator: typeof StackNavigator;
}> {
  return createNavigatorFactory(StackNavigator)();
}
