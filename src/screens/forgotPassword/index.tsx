import React, { useEffect, useState } from "react";
import { ScrollView, StatusBar, Text, TextInput, View } from "react-native";
import type { KeyboardTypeOptions } from "react-native";
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
import type { AuthNavigationProp, OtpDeliveryMode } from "../../navigation";
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
  keyboardType: KeyboardTypeOptions;
  error?: string;
};

const EMAIL_RULE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_DIGIT_MIN = 10;
const PHONE_DIGIT_MAX = 15;

function normalizePhoneDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function getRecoveryMode(value: string): OtpDeliveryMode | null {
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

  if (getRecoveryMode(trimmedValue)) {
    return undefined;
  }

  return "Please enter a valid email address or phone number.";
}

function getKeyboardType(value: string): KeyboardTypeOptions {
  const trimmedValue = value.trim();

  if (!trimmedValue || trimmedValue.includes("@")) {
    return "email-address";
  }

  return "phone-pad";
}

function getNormalizedIdentifier(
  value: string,
  recoveryMode: OtpDeliveryMode
): string {
  return recoveryMode === "email"
    ? value.trim().toLowerCase()
    : normalizePhoneDigits(value);
}

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
          {/* <View style={styles.logoCut} /> */}
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
  keyboardType,
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
              keyboardType={keyboardType}
              autoCapitalize="none"
              autoCorrect={false}
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
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [submittedRecovery, setSubmittedRecovery] = useState<{
    authMode: OtpDeliveryMode;
    identifier: string;
  } | null>(null);
  const {
    loading: isForgotPasswordLoading,
    status: forgotPasswordStatus,
    message: forgotPasswordMessage,
  } = useAppSelector((state) => state.users);

  useEffect(() => {
    if (forgotPasswordStatus === "success" && submittedRecovery) {
      showSuccessToast({
        title: "Successfully sent.",
        message: forgotPasswordMessage ?? "OTP sent successfully.",
      });
      navigation.navigate("ResetPassword", submittedRecovery);
      setSubmittedRecovery(null);
      dispatch(resetStateAction());
    }
  }, [
    forgotPasswordStatus,
    forgotPasswordMessage,
    navigation,
    submittedRecovery,
    dispatch,
  ]);

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
    // const validationError = getValidationError(identifier);

    // if (validationError) {
    //   setError(validationError);
    //   showErrorToast({
    //     title: "Check your details",
    //     message: validationError,
    //   });
    //   return;
    // }

    // const authMode = getRecoveryMode(identifier);

    // if (!authMode) {
    //   return;
    // }

    // const normalizedIdentifier = getNormalizedIdentifier(identifier, authMode);

    // setError(undefined);
    // setSubmittedRecovery({
    //   authMode,
    //   identifier: normalizedIdentifier,
    // });
    // dispatch(
    //   forgotAccountRequestAction(
    //     authMode === "email"
    //       ? { email: normalizedIdentifier }
    //       : { mobile: normalizedIdentifier }
    //   )
    // );

    const recoveryMode = {
      authMode: "Email",
      identifier: "",
    };

    navigation.navigate("ResetPassword", recoveryMode);
  };


  function BrandMark(): React.JSX.Element {
    return (
      <View style={styles.brandMarkOuter}>
        <View style={styles.brandMarkInner} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* <View style={styles.hero}>
          <BrandMark />
        </View> */}
        <View style={styles.card}>
          <PatternHeader />
          <View style={styles.content}>
            <AuthBackHeader
              title="Forgot Password"
              onPress={handleBackToLogin}
            />

            <Text style={styles.subtitle}>
              Enter the email address or phone number linked to your account and
              we&apos;ll help you reset your password.
            </Text>

            <ForgotPasswordField
              label="Email or phone number"
              value={identifier}
              onChangeText={(text) => {
                setIdentifier(text);
                if (error) {
                  setError(undefined);
                }
              }}
              placeholder="Enter your email or phone number"
              keyboardType={getKeyboardType(identifier)}
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
