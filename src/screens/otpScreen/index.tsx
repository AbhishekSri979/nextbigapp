import React, { useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import type { RouteProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  AuthBackHeader,
  CustomButton,
  showErrorToast,
  showSuccessToast,
} from "../../components/common";
import type {
  AuthNavigationProp,
  AuthStackParamList,
  OtpDeliveryMode,
} from "../../navigation";
import { colors } from "../../theme/colors";
import { styles } from "./styles";

const OTP_LENGTH = 6;

type OtpScreenRouteProp = RouteProp<AuthStackParamList, "OtpScreen">;

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

function getDeliveryLabel(authMode: OtpDeliveryMode): string {
  return authMode === "email" ? "email address" : "phone number";
}

function maskIdentifier(identifier: string, authMode: OtpDeliveryMode): string {
  if (authMode === "email") {
    const [localPart = "", domainPart = ""] = identifier.split("@");
    const visibleLocalPart = localPart.slice(0, 2);
    const hiddenLocalPart = "*".repeat(Math.max(localPart.length - 2, 1));

    return `${visibleLocalPart}${hiddenLocalPart}@${domainPart}`;
  }

  const digits = identifier.replace(/\D/g, "");

  if (digits.length <= 4) {
    return digits;
  }

  return `${digits.slice(0, 2)}${"*".repeat(
    Math.max(digits.length - 4, 1)
  )}${digits.slice(-2)}`;
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

function OtpField({
  value,
  onChangeText,
  error,
}: {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}): React.JSX.Element {
  const otpInputRef = useRef<TextInput>(null);

  return (
    <View style={styles.fieldBlock}>
      <View style={[styles.fieldCard, error ? styles.fieldCardError : null]}>
        <Text style={styles.fieldLabel}>6-Digit OTP</Text>

        <Pressable
          onPress={() => otpInputRef.current?.focus()}
          style={styles.otpPressable}
          accessibilityRole="button"
          accessibilityLabel="Enter six digit OTP"
        >
          <View style={styles.otpBoxesRow} pointerEvents="none">
            {Array.from({ length: OTP_LENGTH }, (_, index) => {
              const digit = value[index] ?? "";
              const isActive =
                value.length === index && value.length < OTP_LENGTH;

              return (
                <View
                  key={index}
                  style={[
                    styles.otpBox,
                    digit ? styles.otpBoxFilled : null,
                    isActive ? styles.otpBoxActive : null,
                    error ? styles.otpBoxError : null,
                  ]}
                >
                  <Text style={styles.otpDigit}>{digit}</Text>
                </View>
              );
            })}
          </View>

          <TextInput
            ref={otpInputRef}
            style={styles.otpHiddenInput}
            value={value}
            onChangeText={(text) =>
              onChangeText(text.replace(/\D/g, "").slice(0, OTP_LENGTH))
            }
            keyboardType="number-pad"
            maxLength={OTP_LENGTH}
            selectionColor={colors.primary}
            textContentType="oneTimeCode"
          />
        </Pressable>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

type OtpScreenProps = {
  route: OtpScreenRouteProp;
};

function OtpScreen({ route }: OtpScreenProps): React.JSX.Element {
  const navigation = useNavigation<AuthNavigationProp<"OtpScreen">>();
  const { authMode, identifier } = route.params;
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | undefined>();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const handleVerifyOtp = () => {
    if (otp.length !== OTP_LENGTH) {
      const message = "Please enter the 6-digit OTP.";

      setError(message);
      showErrorToast({
        title: "Incomplete OTP",
        message,
      });
      return;
    }

    setError(undefined);
    showSuccessToast({
      title: "OTP verified",
      message:
        "The OTP verification screen is ready. Connect your verification API to complete sign in.",
    });
  };

  const handleResendCode = () => {
    showSuccessToast({
      title: "OTP resend ready",
      message: `You can trigger a fresh OTP to the selected ${getDeliveryLabel(
        authMode
      )} once the resend API is connected.`,
    });
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
            <AuthBackHeader title="Verify OTP" onPress={handleBack} />

            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to your {getDeliveryLabel(authMode)}.
            </Text>

            <View style={styles.destinationCard}>
              <Text style={styles.destinationLabel}>
                Code sent via {authMode === "email" ? "Email" : "Phone"}
              </Text>
              <Text style={styles.destinationValue}>
                {maskIdentifier(identifier, authMode)}
              </Text>
            </View>

            <OtpField
              value={otp}
              onChangeText={(text) => {
                setOtp(text);
                if (error) {
                  setError(undefined);
                }
              }}
              error={error}
            />

            <Pressable
              onPress={handleResendCode}
              accessibilityRole="button"
              accessibilityLabel="Resend OTP"
              style={styles.resendButton}
            >
              <Text style={styles.resendButtonText}>Resend OTP</Text>
            </Pressable>

            <CustomButton
              title="Verify OTP"
              onPress={handleVerifyOtp}
              style={styles.submitButton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default OtpScreen;
