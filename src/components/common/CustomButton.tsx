import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";

import { colors } from "../../theme/colors";

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

function CustomButton({
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
}: CustomButtonProps): React.JSX.Element {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled ? styles.buttonPressed : null,
        disabled ? styles.buttonDisabled : null,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 10,
    elevation: 4,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: "#111111",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
  buttonPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  text: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: "600",
  },
});

export default CustomButton;
