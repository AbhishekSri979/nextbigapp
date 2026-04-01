import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import LottieView from "lottie-react-native";
import { colors } from "../../theme/colors";
import JsonLoader from "../../lottifiles/loader.json";

type AppLoaderProps = {
  visible: boolean;
  title?: string;
  subtitle?: string;
};

function AppLoader({
  visible,
  title = "Creating your account...",
  subtitle = "Please wait while we complete registration.",
}: AppLoaderProps): React.JSX.Element {
  return (
    <Modal
      transparent
      animationType="fade"
      statusBarTranslucent
      visible={visible}
      onRequestClose={() => undefined}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <LottieView
            autoPlay
            loop
            source={JsonLoader}
            style={styles.animation}
          />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.38)",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 24,
    elevation: 10,
    maxWidth: 280,
    paddingHorizontal: 24,
    paddingVertical: 22,
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 18,
    },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    width: "100%",
  },
  animation: {
    height: 200,
    width: 200,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "700",
    marginTop: 6,
    textAlign: "center",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    textAlign: "center",
  },
});

export default AppLoader;
