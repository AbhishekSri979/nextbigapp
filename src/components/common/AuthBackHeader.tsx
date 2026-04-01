import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../theme/colors";
import { BackArrowIcon } from "./AuthIcons";

type AuthBackHeaderProps = {
  title: string;
  onPress: () => void;
};

function AuthBackHeader({
  title,
  onPress,
}: AuthBackHeaderProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel={`Go back from ${title}`}
        accessibilityRole="button"
        hitSlop={10}
        onPress={onPress}
        style={styles.backButton}
      >
        <BackArrowIcon />
      </Pressable>

      <View style={styles.titleWrap}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.trailingSpace} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 20,
  },
  backButton: {
    alignItems: "center",
    backgroundColor: "#EFF7F7",
    borderColor: "#D4EBEB",
    borderRadius: 14,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    shadowColor: "#0C4A4A",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    width: 42,
  },
  titleWrap: {
    flex: 1,
    paddingHorizontal: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  trailingSpace: {
    width: 42,
  },
});

export default AuthBackHeader;
