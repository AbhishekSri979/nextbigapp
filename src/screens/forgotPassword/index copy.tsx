import React, { useEffect, useState } from "react";
import { ScrollView, StatusBar, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import {
  AppLoader,
  AuthBackHeader,
  CustomButton,
  MailIcon,
  showErrorToast,
  showSuccessToast,
} from "../../components/common";
import type { AuthNavigationProp } from "../../navigation";
import { colors } from "../../theme/colors";
import { styles } from "./styles";
import { useDispatch } from "react-redux";
import {
  forgotAccountRequestAction,
  resetStateAction,
} from "../../store/modules/users/actions";
import { useAppSelector } from "../../store/hooks";

type ForgotPasswordFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
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

function PatternHeader(): React.JSX.Element {
  return (
    <View style={styles.header}>
      <View
        style={{
          ...styles.headerOrbLarge,
          backgroundColor: HEADER_GLOW,
        }}
      />
      <View
        style={{
          ...styles.headerOrbSmall,
          backgroundColor: HEADER_DARK_ACCENT,
        }}
      />
      <View
        style={{
          ...styles.headerRibbon,
          backgroundColor: HEADER_SOFT_LIGHT,
        }}
      />
      <View
        style={{
          ...styles.headerArc,
          borderColor: HEADER_SOFT_LIGHT,
        }}
      />
      <View
        style={{
          ...styles.headerDotRow,
          backgroundColor: HEADER_GLOW,
        }}
      >
        <View
          style={{
            ...styles.headerDot,
            backgroundColor: hexToRgba(colors.white, 0.5),
          }}
        />
        <View
          style={{
            ...styles.headerDot,
            backgroundColor: hexToRgba(colors.white, 0.5),
          }}
        />
        <View
          style={{
            ...styles.headerDot,
            backgroundColor: hexToRgba(colors.white, 0.5),
          }}
        />
      </View>
      <View
        style={{
          ...styles.logoAura,
          backgroundColor: HEADER_SOFT_LIGHT,
        }}
      />

      <View
        style={{
          ...styles.logoBadge,
          borderColor: hexToRgba(colors.white, 0.35),
        }}
      >
        <View style={styles.logoMark}>
          <View style={styles.logoCircle} />
          <View style={styles.logoCut} />
        </View>
      </View>
    </View>
  );
}

function ForgotPasswordField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
}: ForgotPasswordFieldProps): React.JSX.Element {
  return (
    <View style={styles.fieldBlock}>
      <View style={[styles.fieldCard, error ? styles.fieldCardError : null]}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <View style={styles.fieldRow}>
          <View style={styles.fieldIconWrap}>
            <MailIcon />
          </View>
          <View style={styles.fieldControl}>
            <TextInput
              style={styles.fieldInput}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor="#C1C4CC"
              keyboardType="email-address"
              autoCapitalize="none"
              selectionColor={colors.primary}
            />
          </View>
        </View>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

function ForgotPasswordScreen(): React.JSX.Element {
  const dispatch = useDispatch();
  const navigation = useNavigation<AuthNavigationProp<"ForgotPassword">>();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const {
    loading: isForgotPasswordLoading,
    status: forgotPasswordStatus,
    error: forgotPasswordError,
    message: forgotPasswordMessage,
  } = useAppSelector((state) => state.users);

  useEffect(() => {
    if (forgotPasswordStatus === "success") {
      showSuccessToast({
        title: "Successfully sent.",
        message: forgotPasswordMessage ?? "OTP sent successfully.",
      });
      navigation.navigate("ResetPassword", {
        identifier: email,
        authMode: "email",
      });
      dispatch(resetStateAction());
    }
  }, [forgotPasswordStatus, forgotPasswordMessage, navigation, dispatch]);

  const handleBackToLogin = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const handleResetPassword = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      showErrorToast({
        title: "Missing email",
        message: "Enter your email address to continue.",
      });
      return;
    }

    if (!EMAIL_RULE.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      showErrorToast({
        title: "Invalid email",
        message: "Please check the email address and try again.",
      });
      return;
    }

    setError(undefined);
    dispatch(forgotAccountRequestAction({ email: trimmedEmail }));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <PatternHeader />

          <View style={styles.content}>
            <AuthBackHeader
              title="Forgot Password"
              onPress={handleBackToLogin}
            />

            <Text style={styles.subtitle}>
              Enter the email address linked to your account and we&apos;ll help
              you reset your password.
            </Text>

            <ForgotPasswordField
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) {
                  setError(undefined);
                }
              }}
              placeholder="Enter your email address"
              error={error}
            />

            <CustomButton
              title="Send OTP"
              onPress={handleResetPassword}
              style={styles.submitButton}
            />
          </View>
        </View>
      </ScrollView>
      <AppLoader
        visible={isForgotPasswordLoading}
        title="Sending OTP..."
        subtitle="Please wait while we send the verification code."
      />
    </SafeAreaView>
  );
}

export default ForgotPasswordScreen;
