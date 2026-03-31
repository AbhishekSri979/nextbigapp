import React from "react";
import { StyleSheet, View } from "react-native";

import { colors } from "../../theme/colors";

type IconProps = {
  color?: string;
};

type LockIconProps = IconProps & {
  surfaceColor?: string;
};

export function MailIcon({
  color = "#8C98B3",
}: IconProps): React.JSX.Element {
  return (
    <View style={[styles.mailIcon, { borderColor: color }]}>
      <View style={[styles.mailIconFlapLeft, { backgroundColor: color }]} />
      <View style={[styles.mailIconFlapRight, { backgroundColor: color }]} />
    </View>
  );
}

export function LockIcon({
  color = "#8C98B3",
  surfaceColor = colors.surface,
}: LockIconProps): React.JSX.Element {
  return (
    <View style={styles.lockIcon}>
      <View style={[styles.lockShackle, { borderColor: color }]} />
      <View style={[styles.lockBody, { backgroundColor: color }]}>
        <View style={[styles.lockKeyhole, { backgroundColor: surfaceColor }]} />
      </View>
    </View>
  );
}

export function EyeIcon({
  color = "#97A3BD",
}: IconProps): React.JSX.Element {
  return (
    <View style={[styles.eyeIcon, { borderColor: color }]}>
      <View style={[styles.eyePupil, { backgroundColor: color }]} />
    </View>
  );
}

export function InfoIcon({
  color = "#97A3BD",
}: IconProps): React.JSX.Element {
  return (
    <View style={[styles.infoIcon, { borderColor: color }]}>
      <View style={[styles.infoIconDot, { backgroundColor: color }]} />
      <View style={[styles.infoIconStem, { backgroundColor: color }]} />
    </View>
  );
}

export function ChevronDownIcon({
  color = "#97A3BD",
}: IconProps): React.JSX.Element {
  return (
    <View style={styles.chevronDown}>
      <View style={[styles.chevronDownLeft, { backgroundColor: color }]} />
      <View style={[styles.chevronDownRight, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  mailIcon: {
    borderRadius: 3,
    borderWidth: 1.5,
    height: 14,
    position: "relative",
    width: 18,
  },
  mailIconFlapLeft: {
    height: 1.5,
    left: 1,
    position: "absolute",
    top: 5,
    transform: [{ rotate: "28deg" }],
    width: 9,
  },
  mailIconFlapRight: {
    height: 1.5,
    position: "absolute",
    right: 1,
    top: 5,
    transform: [{ rotate: "-28deg" }],
    width: 9,
  },
  lockIcon: {
    alignItems: "center",
    height: 18,
    justifyContent: "flex-end",
    width: 16,
  },
  lockShackle: {
    borderRadius: 6,
    borderWidth: 1.5,
    height: 8,
    width: 10,
  },
  lockBody: {
    alignItems: "center",
    borderRadius: 3,
    height: 10,
    justifyContent: "center",
    marginTop: -2,
    width: 14,
  },
  lockKeyhole: {
    borderRadius: 2,
    height: 4,
    width: 3,
  },
  eyeIcon: {
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1.4,
    height: 12,
    justifyContent: "center",
    transform: [{ scaleY: 0.8 }],
    width: 18,
  },
  eyePupil: {
    borderRadius: 2,
    height: 4,
    width: 4,
  },
  infoIcon: {
    alignItems: "center",
    borderRadius: 7,
    borderWidth: 1.4,
    height: 14,
    justifyContent: "center",
    width: 14,
  },
  infoIconDot: {
    borderRadius: 1.1,
    height: 2.2,
    marginBottom: 1.2,
    width: 2.2,
  },
  infoIconStem: {
    borderRadius: 1,
    height: 4.5,
    width: 2,
  },
  chevronDown: {
    height: 12,
    position: "relative",
    width: 16,
  },
  chevronDownLeft: {
    height: 1.6,
    left: 1,
    position: "absolute",
    top: 6,
    transform: [{ rotate: "38deg" }],
    width: 8,
  },
  chevronDownRight: {
    height: 1.6,
    position: "absolute",
    right: 1,
    top: 6,
    transform: [{ rotate: "-38deg" }],
    width: 8,
  },
});
