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
import type { KeyboardTypeOptions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import {
  CustomButton,
  showErrorToast,
  showSuccessToast,
} from "../../components/common";
import type { AuthNavigationProp } from "../../navigation";
import { images } from "../../theme/images";
import { styles } from "./styles";
import { colors } from "../../theme/colors";

const EMAIL_RULE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_DIGIT_MIN = 10;
const PHONE_DIGIT_MAX = 15;
const LOGIN_HEADER_COLOR = colors.primary;

type AuthMode = "email" | "phone";

function BrandMark(): React.JSX.Element {
  return (
    <View style={styles.brandMarkOuter}>
      <View style={styles.brandMarkInner} />
    </View>
  );
}

function normalizePhoneDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function getAuthMode(value: string): AuthMode | null {
  const trimmedValue = value.trim();
  const phoneDigits = normalizePhoneDigits(trimmedValue);

  if (EMAIL_RULE.test(trimmedValue)) {
    return "email";
  }

  if (
    phoneDigits.length >= PHONE_DIGIT_MIN &&
    phoneDigits.length <= PHONE_DIGIT_MAX
  ) {
    return "phone";
  }

  return null;
}

function getValidationError(value: string): string | undefined {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "Please enter your email address or phone number.";
  }

  if (getAuthMode(trimmedValue)) {
    return undefined;
  }

  return "Please enter a valid email address or phone number.";
}

function getKeyboardType(value: string): KeyboardTypeOptions {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "email-address";
  }

  if (trimmedValue.includes("@")) {
    return "email-address";
  }

  return "phone-pad";
}

function LoginScreen(): React.JSX.Element {
  const navigation = useNavigation<AuthNavigationProp<"Login">>();
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState<string | undefined>();

  const handleIdentifierChange = (text: string) => {
    setIdentifier(text);

    if (error) {
      setError(undefined);
    }
  };

  const handleSendOtp = () => {
    const validationError = getValidationError(identifier);

    if (validationError) {
      setError(validationError);
      showErrorToast({
        title: "Check your details",
        message: validationError,
      });
      return;
    }

    const authMode = getAuthMode(identifier);

    if (!authMode) {
      return;
    }

    showSuccessToast({
      title: authMode === "email" ? "Email OTP ready" : "Phone OTP ready",
      message:
        authMode === "email"
          ? "The UI is ready for email OTP login. Connect your OTP API to send the code."
          : "The UI is ready for phone OTP login. Connect your OTP API to send the code.",
    });
  };

  const handleGoogleLogin = () => {
    showSuccessToast({
      title: "Google login ready",
      message:
        "The Google sign-in button is added. Connect your Google auth setup to complete the login flow.",
    });
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={LOGIN_HEADER_COLOR}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.hero}>
          <BrandMark />
          <Text style={styles.brandTitle}>Event Gear</Text>
          <Text style={styles.brandSubtitle}>
            Rent everything for your next event
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.fieldLabel}>Email or phone number</Text>

          <View
            style={[styles.inputShell, error ? styles.inputShellError : null]}
          >
            <TextInput
              style={styles.input}
              value={identifier}
              onChangeText={handleIdentifierChange}
              placeholder="XXXXXXXXXX"
              placeholderTextColor="#8B90A4"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType={getKeyboardType(identifier)}
              selectionColor={LOGIN_HEADER_COLOR}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Text style={styles.helperText}>
            {"We'll send a one-time code to verify you"}
          </Text>

          <CustomButton
            title="Send OTP"
            onPress={handleSendOtp}
            style={styles.primaryButton}
            textStyle={styles.primaryButtonText}
          />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.googleButton,
              pressed ? styles.googleButtonPressed : null,
            ]}
            onPress={handleGoogleLogin}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
          >
            <Image
              source={images.google}
              style={styles.googleIcon}
              resizeMode="contain"
            />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>New here? </Text>
            <Pressable onPress={handleRegister}>
              <Text style={styles.footerLink}>Create account</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default LoginScreen;
