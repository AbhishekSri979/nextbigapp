import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { TextInputProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton } from "./components/common";
import { colors } from "./theme/colors";
import { images } from "./theme/images";

type AuthFieldProps = {
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

type LoginScreenProps = {
  onRegister?: () => void;
};

function MailIcon(): React.JSX.Element {
  return (
    <View style={styles.mailIcon}>
      <View style={styles.mailIconFlapLeft} />
      <View style={styles.mailIconFlapRight} />
    </View>
  );
}

function LockIcon(): React.JSX.Element {
  return (
    <View style={styles.lockIcon}>
      <View style={styles.lockShackle} />
      <View style={styles.lockBody}>
        <View style={styles.lockKeyhole} />
      </View>
    </View>
  );
}

function EyeIcon(): React.JSX.Element {
  return (
    <View style={styles.eyeIcon}>
      <View style={styles.eyePupil} />
    </View>
  );
}

function FieldIcon({ icon }: Pick<AuthFieldProps, "icon">): React.JSX.Element {
  if (icon === "lock") {
    return <LockIcon />;
  }

  return <MailIcon />;
}

function AuthField({
  icon,
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  rightAccessory,
}: AuthFieldProps): React.JSX.Element {
  return (
    <View style={styles.fieldShell}>
      <View style={styles.fieldIconWrap}>
        <FieldIcon icon={icon} />
      </View>
      <View style={styles.fieldTextWrap}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <TextInput
          style={styles.fieldInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          selectionColor={colors.primary}
        />
      </View>
      {rightAccessory ? (
        <View style={styles.fieldRightAccessory}>{rightAccessory}</View>
      ) : null}
    </View>
  );
}

function LoginScreen({ onRegister }: LoginScreenProps): React.JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }
    // TODO: Implement login logic
    Alert.alert("Login", "Login functionality to be implemented");
  };

  const handleForgotPassword = () => {
    // TODO: Navigate to forgot password screen
    Alert.alert(
      "Forgot Password",
      "Forgot password functionality to be implemented"
    );
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google login
    Alert.alert("Google Login", "Google login functionality to be implemented");
  };

  const handleRegister = () => {
    if (onRegister) {
      onRegister();
      return;
    }

    Alert.alert("Register", "Register functionality to be implemented");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.shell}>
          <View style={styles.hero}>
            <Text style={styles.title}>Welcome!</Text>
            <Text style={styles.subtitle}>Please sign in to your account.</Text>
            <Image
              source={images.loginIcon}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>

          <View style={styles.form}>
            <AuthField
              icon="mail"
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <AuthField
              icon="lock"
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Enter your password"
              rightAccessory={
                <Pressable
                  onPress={() => setShowPassword((current) => !current)}
                  hitSlop={10}
                >
                  <EyeIcon />
                </Pressable>
              }
            />

            <View style={styles.optionsRow}>
              <Pressable
                style={styles.rememberRow}
                onPress={() => setRememberMe((current) => !current)}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe && styles.checkboxSelected,
                  ]}
                >
                  {rememberMe ? <View style={styles.checkboxDot} /> : null}
                </View>
                <Text style={styles.rememberText}>Remember Me</Text>
              </Pressable>

              <Pressable onPress={handleForgotPassword}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </Pressable>
            </View>

            <CustomButton
              title="Login"
              onPress={handleLogin}
              style={styles.loginButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable style={styles.googleButton} onPress={handleGoogleLogin}>
              <Text style={styles.googleIconText}>G</Text>
              <Text style={styles.googleButtonText}>Login with Google</Text>
            </Pressable>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <Pressable onPress={handleRegister}>
                <Text style={styles.registerLink}>Sign Up</Text>
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
    backgroundColor: colors.authBackground,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 26,
    paddingVertical: 24,
  },
  shell: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.white,
    borderColor: colors.panelBorder,
    borderRadius: 34,
    borderWidth: 6,
    elevation: 12,
    maxWidth: 350,
    paddingBottom: 30,
    paddingHorizontal: 22,
    paddingTop: 28,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.26,
    shadowRadius: 24,
    width: "100%",
  },
  hero: {
    alignItems: "center",
    marginBottom: 18,
    width: "100%",
  },
  title: {
    color: colors.textPrimary,
    fontSize: 25,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  illustration: {
    height: 150,
    marginBottom: 6,
    width: "100%",
  },
  form: {
    width: "100%",
  },
  fieldShell: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.inputBorder,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 14,
    minHeight: 58,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#C8D4EC",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  fieldIconWrap: {
    alignItems: "center",
    height: 28,
    justifyContent: "center",
    width: 24,
  },
  fieldTextWrap: {
    flex: 1,
    marginLeft: 10,
  },
  fieldLabel: {
    color: "#6E7B95",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 2,
  },
  fieldInput: {
    color: colors.textPrimary,
    fontSize: 14,
    minHeight: 18,
    paddingVertical: 0,
  },
  fieldRightAccessory: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  mailIcon: {
    borderColor: "#8C98B3",
    borderRadius: 3,
    borderWidth: 1.5,
    height: 14,
    position: "relative",
    width: 18,
  },
  mailIconFlapLeft: {
    backgroundColor: "#8C98B3",
    height: 1.5,
    left: 1,
    position: "absolute",
    top: 5,
    transform: [{ rotate: "28deg" }],
    width: 9,
  },
  mailIconFlapRight: {
    backgroundColor: "#8C98B3",
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
    borderColor: "#8C98B3",
    borderRadius: 6,
    borderWidth: 1.5,
    height: 8,
    width: 10,
  },
  lockBody: {
    alignItems: "center",
    backgroundColor: "#8C98B3",
    borderRadius: 3,
    height: 10,
    justifyContent: "center",
    marginTop: -2,
    width: 14,
  },
  lockKeyhole: {
    backgroundColor: colors.surface,
    borderRadius: 2,
    height: 4,
    width: 3,
  },
  eyeIcon: {
    alignItems: "center",
    borderColor: "#97A3BD",
    borderRadius: 12,
    borderWidth: 1.4,
    height: 12,
    justifyContent: "center",
    transform: [{ scaleY: 0.8 }],
    width: 18,
  },
  eyePupil: {
    backgroundColor: "#97A3BD",
    borderRadius: 2,
    height: 4,
    width: 4,
  },
  optionsRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 2,
  },
  rememberRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  checkbox: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.inputBorder,
    borderRadius: 5,
    borderWidth: 1.4,
    height: 18,
    justifyContent: "center",
    marginRight: 8,
    width: 18,
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxDot: {
    backgroundColor: colors.white,
    borderRadius: 3,
    height: 7,
    width: 7,
  },
  rememberText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  forgotText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  loginButton: {
    marginBottom: 18,
  },
  divider: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "600",
    marginHorizontal: 12,
  },
  googleButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.inputBorder,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 18,
    paddingVertical: 14,
    shadowColor: "#CAD4EA",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.24,
    shadowRadius: 10,
  },
  googleIconText: {
    color: colors.googleBlue,
    fontSize: 26,
    fontWeight: "700",
    marginRight: 10,
  },
  googleButtonText: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "600",
  },
  registerContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 4,
  },
  registerText: {
    color: colors.textSecondary,
    fontSize: 15,
  },
  registerLink: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
