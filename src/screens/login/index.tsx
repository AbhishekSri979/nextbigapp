import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
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
  showErrorToast,
  showSuccessToast,
} from "../../components/common";
import { colors } from "../../theme/colors";
import { images } from "../../theme/images";
import { styles } from "./styles";
import { useNavigation } from "@react-navigation/native";
import type {
  AuthNavigationProp,
  RootNavigationProp,
} from "../../navigation";

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
  error?: string;
};

type LoginValues = {
  email: string;
  password: string;
};

type LoginErrors = Partial<Record<keyof LoginValues, string>>;

type SocialProvider = {
  key: string;
  label: string;
  icon: number;
};

const EMAIL_RULE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  error,
}: LoginFieldProps): React.JSX.Element {
  return (
    <View style={styles.fieldBlock}>
      <View style={[styles.fieldCard, error ? styles.fieldCardError : null]}>
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
              selectionColor={colors.primary}
            />
          </View>
          {rightAccessory ? (
            <View style={styles.fieldAccessory}>{rightAccessory}</View>
          ) : null}
        </View>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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

function getValidationErrors(values: LoginValues): LoginErrors {
  const nextErrors: LoginErrors = {};

  if (!values.email.trim()) {
    nextErrors.email = "Please enter your email address.";
  } else if (!EMAIL_RULE.test(values.email.trim())) {
    nextErrors.email = "Please enter a valid email address.";
  }

  if (!values.password) {
    nextErrors.password = "Please enter your password.";
  }

  return nextErrors;
}

function LoginScreen(): React.JSX.Element {
  const navigation = useNavigation<AuthNavigationProp<"Login">>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<LoginErrors>({});

  const updateField = (field: keyof LoginValues, value: string) => {
    if (field === "email") {
      setEmail(value);
    } else {
      setPassword(value);
    }

    setFormErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };

      delete nextErrors[field];

      return nextErrors;
    });
  };

  const handleLogin = () => {
    const nextErrors = getValidationErrors({ email, password });
    const rootNavigation = navigation.getParent<RootNavigationProp>();

    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      showErrorToast({
        title: "Check your details",
        message: "Please correct the highlighted fields and try again.",
      });
      return;
    }

    showSuccessToast({
      title: "Login successful",
      message: "Welcome back to EventGear.",
    });

    if (rootNavigation) {
      rootNavigation.reset({
        index: 0,
        routes: [{ name: "AppStack" }],
      });
      return;
    }

    showErrorToast({
      title: "Navigation unavailable",
      message: "App stack navigation is not connected yet.",
    });
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  const handleSocialLogin = (provider: string) => {
    showErrorToast({
      title: `${provider} login unavailable`,
      message: `${provider} login functionality is not available yet.`,
    });
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
        keyboardShouldPersistTaps="handled"
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
                onChangeText={(text) => updateField("email", text)}
                placeholder="Enter your email address"
                keyboardType="email-address"
                autoCapitalize="none"
                error={formErrors.email}
              />

              <LoginField
                icon="lock"
                label="Password"
                value={password}
                onChangeText={(text) => updateField("password", text)}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                rightAccessory={
                  <Pressable
                    onPress={() => setShowPassword((current) => !current)}
                    hitSlop={10}
                    style={[
                      styles.passwordToggleButton,
                      showPassword ? styles.passwordToggleButtonActive : null,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <EyeIcon
                      color={showPassword ? colors.primary : "#7C88A1"}
                      isVisible={showPassword}
                    />
                  </Pressable>
                }
                error={formErrors.password}
              />
            </View>

            <View style={styles.optionsRow}>
              <Pressable
                style={styles.rememberRow}
                onPress={() => setRememberMe((current) => !current)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: rememberMe }}
                accessibilityLabel="Remember me"
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe ? styles.checkboxChecked : null,
                  ]}
                >
                  {rememberMe ? <View style={styles.checkboxCheck} /> : null}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </Pressable>

              <Pressable
                onPress={handleForgotPassword}
                accessibilityRole="button"
                accessibilityLabel="Forgot password"
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </Pressable>
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
