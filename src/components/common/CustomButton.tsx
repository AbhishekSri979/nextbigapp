import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { colors, gradients } from "../../theme/colors";

const AUTH_BUTTON_STOPS = [
  { position: 0, color: gradients.authButton[0] },
  { position: 0.55, color: gradients.authButton[1] },
  { position: 1, color: gradients.authButton[2] },
] as const;

const BUTTON_GRADIENT = Array.from({ length: 48 }, (_, index) =>
  getGradientColor(index / 47, AUTH_BUTTON_STOPS)
);

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

function getGradientColor(
  progress: number,
  stops: ReadonlyArray<{ position: number; color: string }>
): string {
  const nextStopIndex = stops.findIndex((stop) => progress <= stop.position);

  if (nextStopIndex === -1) {
    return stops[stops.length - 1].color;
  }

  if (nextStopIndex === 0) {
    return stops[0].color;
  }

  const startStop = stops[nextStopIndex - 1];
  const endStop = stops[nextStopIndex];
  const rangeProgress =
    (progress - startStop.position) / (endStop.position - startStop.position);

  return mixHexColors(startStop.color, endStop.color, rangeProgress);
}

function mixHexColors(
  startColor: string,
  endColor: string,
  progress: number
): string {
  const [startRed, startGreen, startBlue] = hexToRgb(startColor);
  const [endRed, endGreen, endBlue] = hexToRgb(endColor);

  const red = Math.round(startRed + (endRed - startRed) * progress);
  const green = Math.round(startGreen + (endGreen - startGreen) * progress);
  const blue = Math.round(startBlue + (endBlue - startBlue) * progress);

  return rgbToHex(red, green, blue);
}

function hexToRgb(color: string): [number, number, number] {
  const normalizedColor = color.replace("#", "");

  return [
    Number.parseInt(normalizedColor.slice(0, 2), 16),
    Number.parseInt(normalizedColor.slice(2, 4), 16),
    Number.parseInt(normalizedColor.slice(4, 6), 16),
  ];
}

function rgbToHex(red: number, green: number, blue: number): string {
  return `#${[red, green, blue]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

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
    >
      <View pointerEvents="none" style={styles.gradient}>
        {BUTTON_GRADIENT.map((backgroundColor, index) => (
          <View
            key={`${backgroundColor}-${index}`}
            style={[styles.gradientStripe, { backgroundColor }]}
          />
        ))}
      </View>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: gradients.authButton[1],
    borderRadius: 28,
    justifyContent: "center",
    overflow: "hidden",
    paddingVertical: 16,
    position: "relative",
    shadowColor: "#275FC8",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  buttonPressed: {
    opacity: 0.96,
    transform: [{ scale: 0.995 }],
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    height: "220%",
    left: "-24%",
    top: "-42%",
    transform: [{ rotate: "-10deg" }],
    width: "150%",
  },
  gradientStripe: {
    flex: 1,
  },
  text: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: "700",
  },
});

export default CustomButton;
