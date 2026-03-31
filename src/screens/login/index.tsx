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

import {
  CustomButton,
  EyeIcon,
  LockIcon,
  MailIcon,
} from "../../components/common";
import { colors } from "../../theme/colors";
import { images } from "../../theme/images";
import { styles } from "./styles";

type LoginScreenProps = {
  onRegister?: () => void;
};

type LoginFieldProps = {
  icon: "mail" | "lock";
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  rightAccessory?: React.ReactNode;
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
      <View style={{ ...styles.headerOrbLarge, backgroundColor: HEADER_GLOW, }} />
      <View style={{ ...styles.headerOrbSmall, backgroundColor: HEADER_DARK_ACCENT, }} />
      <View style={{ ...styles.headerRibbon, backgroundColor: HEADER_SOFT_LIGHT, }} />
      <View style={{ ...styles.headerArc, borderColor: HEADER_SOFT_LIGHT, }} />
      <View style={{ ...styles.headerDotRow, backgroundColor: HEADER_GLOW, }}>
        <View style={{ ...styles.headerDot, backgroundColor: hexToRgba(colors.white, 0.5), }} />
        <View style={{ ...styles.headerDot, backgroundColor: hexToRgba(colors.white, 0.5), }} />
        <View style={{ ...styles.headerDot, backgroundColor: hexToRgba(colors.white, 0.5), }} />
      </View>
      <View style={{ ...styles.logoAura, backgroundColor: HEADER_SOFT_LIGHT, }} />

      <View style={{ ...styles.logoBadge, borderColor: hexToRgba(colors.white, 0.35), }}>
        <View style={{ ...styles.logoMark }}>
          <View style={{ ...styles.logoCircle }} />
          <View style={{ ...styles.logoCut }} />
        </View>
      </View>
    </View>
  );
}

function FieldIcon({
  icon,
}: Pick<LoginFieldProps, "icon">): React.JSX.Element {
  if (icon === "lock") {
    return <LockIcon />;
  }

  return <MailIcon />;
}

function LoginField({
  icon,
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  rightAccessory,
}: LoginFieldProps): React.JSX.Element {
  return (
    <View style={styles.fieldCard}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldRow}>
        <View style={styles.fieldIconWrap}>
          <FieldIcon icon={icon} />
        </View>
        <View style={styles.fieldControl}>
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
        {rightAccessory ? (
          <View style={styles.fieldAccessory}>{rightAccessory}</View>
        ) : null}
      </View>
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
  const [showPassword, setShowPassword] = useState(false);

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
                icon="mail"
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="hello@reallygreatsite.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <LoginField
                icon="lock"
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="........"
                secureTextEntry={!showPassword}
                rightAccessory={
                  <Pressable
                    onPress={() => setShowPassword((current) => !current)}
                    hitSlop={10}
                  >
                    <EyeIcon />
                  </Pressable>
                }
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

export default LoginScreen;
