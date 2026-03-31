import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { TextInputProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton } from "../../components/common";
import { colors } from "../../theme/colors";
import { images } from "../../theme/images";

type LoginScreenProps = {
  onRegister?: () => void;
};

type LoginFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
};

type SocialProvider = {
  key: string;
  label: string;
  icon: number;
};

function hexToRgba(hexColor: string, opacity: number): string {
  const normalizedHex = hexColor.replace("#", "");
  const sixDigitHex =
    normalizedHex.length === 3
      ? normalizedHex
          .split("")
          .map((character) => `${character}${character}`)
          .join("")
      : normalizedHex;

  const red = Number.parseInt(sixDigitHex.slice(0, 2), 16);
  const green = Number.parseInt(sixDigitHex.slice(2, 4), 16);
  const blue = Number.parseInt(sixDigitHex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

const SCREEN_BACKGROUND = colors.background;
const HEADER_GLOW = hexToRgba(colors.white, 0.15);
const HEADER_SOFT_LIGHT = hexToRgba(colors.white, 0.1);
const HEADER_DARK_ACCENT = "rgba(0, 0, 0, 0.08)";
const SOCIAL_PROVIDERS: SocialProvider[] = [
  {
    key: "google",
    label: "Google",
    icon: images.google,
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: images.facebook,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: images.linkedin,
  },
];

function PatternHeader(): React.JSX.Element {
  return (
    <View style={styles.header}>
      <View style={styles.headerOrbLarge} />
      <View style={styles.headerOrbSmall} />
      <View style={styles.headerRibbon} />
      <View style={styles.headerArc} />
      <View style={styles.headerDotRow}>
        <View style={styles.headerDot} />
        <View style={styles.headerDot} />
        <View style={styles.headerDot} />
      </View>
      <View style={styles.logoAura} />

      <View style={styles.logoBadge}>
        <View style={styles.logoMark}>
          <View style={styles.logoCircle} />
          <View style={styles.logoCut} />
        </View>
      </View>
    </View>
  );
}

function LoginField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
}: LoginFieldProps): React.JSX.Element {
  return (
    <View style={styles.fieldCard}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#C1C4CC"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        selectionColor="#111111"
      />
    </View>
  );
}

function SocialLoginButton({
  provider,
  onPress,
}: {
  provider: SocialProvider;
  onPress: () => void;
}): React.JSX.Element {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.socialButton,
        pressed ? styles.socialButtonPressed : null,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Continue with ${provider.label}`}
    >
      <Image
        source={provider.icon}
        style={styles.socialIconImage}
        resizeMode="contain"
      />
    </Pressable>
  );
}

function LoginScreen({ onRegister }: LoginScreenProps): React.JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    Alert.alert("Login", "Login functionality to be implemented");
  };

  const handleRegister = () => {
    if (onRegister) {
      onRegister();
      return;
    }

    Alert.alert("Register", "Register functionality to be implemented");
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert(
      `${provider} Login`,
      `${provider} login functionality to be implemented`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primary}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.card}>
          <PatternHeader />

          <View style={styles.content}>
            <Text style={styles.title}>Login</Text>

            <View style={styles.formGroup}>
              <LoginField
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="hello@reallygreatsite.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <LoginField
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="........"
                secureTextEntry
              />
            </View>

            <CustomButton
              title="Login"
              onPress={handleLogin}
              style={styles.loginButton}
            />

            <View style={styles.socialSection}>
              <View style={styles.socialDivider}>
                <View style={styles.socialDividerLine} />
                <Text style={styles.socialDividerText}>Or continue with</Text>
                <View style={styles.socialDividerLine} />
              </View>

              <View style={styles.socialButtons}>
                {SOCIAL_PROVIDERS.map((provider) => (
                  <SocialLoginButton
                    key={provider.key}
                    provider={provider}
                    onPress={() => handleSocialLogin(provider.label)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have any account? </Text>
              <Pressable onPress={handleRegister}>
                <Text style={styles.footerLink}>Sign Up</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.primary,
    flex: 1,
    width: "100%",
  },
  header: {
    alignItems: "center",
    backgroundColor: colors.primary,
    height: 190,
    overflow: "hidden",
    paddingTop: 87,
    position: "relative",
  },
  headerOrbLarge: {
    backgroundColor: HEADER_GLOW,
    borderRadius: 110,
    height: 220,
    left: -56,
    position: "absolute",
    top: -76,
    width: 220,
  },
  headerOrbSmall: {
    backgroundColor: HEADER_DARK_ACCENT,
    borderRadius: 76,
    height: 152,
    position: "absolute",
    right: -24,
    top: 26,
    width: 152,
  },
  headerRibbon: {
    backgroundColor: HEADER_SOFT_LIGHT,
    borderRadius: 40,
    height: 88,
    position: "absolute",
    right: -40,
    top: 44,
    transform: [{ rotate: "-18deg" }],
    width: 220,
  },
  headerArc: {
    borderColor: HEADER_SOFT_LIGHT,
    borderRadius: 82,
    borderWidth: 18,
    height: 164,
    left: -34,
    position: "absolute",
    top: 58,
    width: 164,
  },
  headerDotRow: {
    flexDirection: "row",
    gap: 8,
    position: "absolute",
    right: 26,
    top: 28,
  },
  headerDot: {
    backgroundColor: hexToRgba(colors.white, 0.5),
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  logoAura: {
    backgroundColor: HEADER_SOFT_LIGHT,
    borderRadius: 46,
    height: 92,
    left: "50%",
    marginLeft: -46,
    position: "absolute",
    top: 70,
    width: 92,
  },
  logoBadge: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: hexToRgba(colors.white, 0.35),
    borderRadius: 14,
    borderWidth: 1,
    height: 58,
    justifyContent: "center",
    shadowColor: "#0C4A4A",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    width: 58,
  },
  logoMark: {
    height: 28,
    position: "relative",
    width: 28,
  },
  logoCircle: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    height: 28,
    position: "absolute",
    right: 0,
    top: 0,
    width: 28,
  },
  logoCut: {
    backgroundColor: colors.surface,
    height: 28,
    left: 0,
    position: "absolute",
    top: 0,
    width: 10,
  },
  content: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 60,
    flex: 1,
    paddingBottom: 28,
    paddingHorizontal: 24,
    paddingTop: 38,
  },
  title: {
    color: "#1F1F1F",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 34,
    textAlign: "center",
  },
  formGroup: {
    gap: 14,
  },
  fieldCard: {
    backgroundColor: colors.surface,
    borderColor: "#F4F4F5",
    borderRadius: 16,
    borderWidth: 1,
    elevation: 3,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: "#D4D9E2",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
  fieldLabel: {
    color: "#1F1F1F",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  fieldInput: {
    color: "#1F1F1F",
    fontSize: 14,
    paddingVertical: 0,
  },
  loginButton: {
    marginTop: 22,
  },
  socialSection: {
    marginTop: 26,
  },
  socialDivider: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 18,
  },
  socialDividerLine: {
    backgroundColor: "#E7EAF0",
    flex: 1,
    height: 1,
  },
  socialDividerText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    marginHorizontal: 12,
  },
  socialButtons: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
  },
  socialButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: "#E9EDF4",
    borderRadius: 18,
    borderWidth: 1,
    elevation: 3,
    height: 58,
    justifyContent: "center",
    shadowColor: "#CBD4E3",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    width: 58,
  },
  socialButtonPressed: {
    opacity: 0.96,
    transform: [{ scale: 0.995 }],
  },
  socialIconImage: {
    height: 24,
    width: 24,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
  },
  footerText: {
    color: "#4B5563",
    fontSize: 13,
  },
  footerLink: {
    color: "#111111",
    fontSize: 13,
    fontWeight: "700",
  },
});

export default LoginScreen;
