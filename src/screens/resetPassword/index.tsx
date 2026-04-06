import React, { useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import type { TextInputProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import {
  AppLoader,
  AuthBackHeader,
  CustomButton,
  EyeIcon,
  LockIcon,
  showErrorToast,
  showSuccessToast,
} from "../../components/common";
import type { AuthNavigationProp } from "../../navigation";
import { colors } from "../../theme/colors";
import { styles } from "./styles";
import { useDispatch } from "react-redux";
import { resetAccountRequestAction, resetStateAction } from "../../store/modules/users/actions";
import { useAppSelector } from "../../store/hooks";

type ResetPasswordFieldProps = {
  icon: "lock";
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  rightAccessory?: React.ReactNode;
  error?: string;
};

type ResetPasswordValues = {
  otp: string;
  password: string;
};

type ResetPasswordErrors = Partial<Record<keyof ResetPasswordValues, string>>;

const PASSWORD_RULE = /^(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const OTP_LENGTH = 6;

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

function FieldIcon({
  icon,
}: Pick<ResetPasswordFieldProps, "icon">): React.JSX.Element {
  if (icon === "lock") {
    return <LockIcon />;
  }

  return <LockIcon />;
}

function ResetPasswordField({
  icon,
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  autoCapitalize,
  rightAccessory,
  error,
}: ResetPasswordFieldProps): React.JSX.Element {
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
              const isActive = value.length === index && value.length < OTP_LENGTH;

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

function getValidationErrors(
  values: ResetPasswordValues,
): ResetPasswordErrors {
  const nextErrors: ResetPasswordErrors = {};

  if (values.otp.length !== OTP_LENGTH) {
    nextErrors.otp = "Please enter the 6-digit OTP.";
  }

  if (!values.password) {
    nextErrors.password = "Please enter your new password.";
  } else if (!PASSWORD_RULE.test(values.password)) {
    nextErrors.password =
      "Password must be 8+ characters with 1 number and 1 special character.";
  }

  return nextErrors;
}

function ResetPasswordScreen(props:any): React.JSX.Element {
  const dispatch = useDispatch();
  const navigation = useNavigation<AuthNavigationProp<"ResetPassword">>();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<ResetPasswordErrors>({});
  const { email } = props.route.params || {};
  console.log("email",email);
  
  const {
    loading: isresetPasswordLoading,
    status: resetPasswordStatus,
    error: resetPasswordError,
    message: resetPasswordMessage,
  } = useAppSelector((state) => state.users);

  useEffect(() => {
    if (resetPasswordStatus === "success") {
      showSuccessToast({
        title: "Password reset successful.",
        message: resetPasswordMessage ?? "Your password has been reset successfully.",
      });

      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
      dispatch(resetStateAction());
    }
  }, [resetPasswordStatus, resetPasswordMessage, navigation, dispatch]);

  const handleBackToLogin = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
  };

  const handleResetPassword = () => {
    const nextErrors = getValidationErrors({
      otp,
      password: newPassword,
    });

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      showErrorToast({
        title: "Check your details",
        message:
          nextErrors.otp ??
          nextErrors.password ??
          "Please review the entered details and try again.",
      });
      return;
    }

    setFormErrors({});
    dispatch(resetAccountRequestAction({email, otp, new_password: newPassword }));
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
              title="Reset Password"
              onPress={handleBackToLogin}
            />

            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to your email address and create a
              new password for your account.
            </Text>

            <View style={styles.formGroup}>
              <OtpField
                value={otp}
                onChangeText={(text) => {
                  setOtp(text);
                  if (formErrors.otp) {
                    setFormErrors((current) => ({
                      ...current,
                      otp: undefined,
                    }));
                  }
                }}
                error={formErrors.otp}
              />

              <ResetPasswordField
                icon="lock"
                label="New Password"
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  if (formErrors.password) {
                    setFormErrors((current) => ({
                      ...current,
                      password: undefined,
                    }));
                  }
                }}
                placeholder="Enter your new password"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
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

            <CustomButton
              title="Reset Password"
              onPress={handleResetPassword}
              style={styles.submitButton}
            />
          </View>
        </View>
      </ScrollView>
       <AppLoader
        visible={isresetPasswordLoading}
        title="Resetting Password..."
        subtitle="Please wait while we reset your password."
      />
    </SafeAreaView>
  );
}

export default ResetPasswordScreen;
