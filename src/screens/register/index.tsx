import React, { useEffect, useState } from "react";
import {
  Modal,
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
  AppLoader,
  ChevronDownIcon,
  CustomButton,
  EyeIcon,
  InfoIcon,
  showErrorToast,
  showSuccessToast,
} from "../../components/common";
import { colors } from "../../theme/colors";
import { styles } from "./styles";
import {
  createUserAccountRequestAction,
  resetCreateUserAccountStateAction,
} from "../../store/modules/users/actions";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

type RegisterScreenProps = {
  onLogin?: () => void;
};

type FormValues = {
  fullName: string;
  dob: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

type RegisterFieldProps = {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  onPress?: () => void;
  rightAccessory?: React.ReactNode;
  error?: string;
  helperText?: string;
  maxLength?: number;
};

type CalendarDay = {
  key: string;
  date: Date;
  isCurrentMonth: boolean;
  isDisabled: boolean;
};

const PASSWORD_RULE = /^(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const EMAIL_RULE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEEK_DAYS = ["S", "M", "T", "W", "T", "F", "S"] as const;
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const INITIAL_FORM_VALUES: FormValues = {
  fullName: "",
  dob: "",
  mobile: "",
  email: "",
  password: "",
  confirmPassword: "",
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

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function isSameDay(firstDate: Date | null, secondDate: Date): boolean {
  if (!firstDate) {
    return false;
  }

  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

function formatDate(date: Date): string {
  return `${date.getDate().toString().padStart(2, "0")} ${MONTH_NAMES[date.getMonth()]
    } ${date.getFullYear()}`;
}

function formatDateForRequest(date: Date): string {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

function buildCalendarDays(month: Date, today: Date): CalendarDay[] {
  const firstDayOfMonth = startOfMonth(month);
  const calendarStartDate = new Date(firstDayOfMonth);

  calendarStartDate.setDate(
    firstDayOfMonth.getDate() - firstDayOfMonth.getDay()
  );

  return Array.from({ length: 42 }, (_, index) => {
    const nextDate = new Date(calendarStartDate);

    nextDate.setDate(calendarStartDate.getDate() + index);

    const normalizedDate = startOfDay(nextDate);

    return {
      key: `${normalizedDate.getFullYear()}-${normalizedDate.getMonth()}-${normalizedDate.getDate()}`,
      date: normalizedDate,
      isCurrentMonth: normalizedDate.getMonth() === month.getMonth(),
      isDisabled: normalizedDate.getTime() > today.getTime(),
    };
  });
}

function getValidationErrors(values: FormValues): FormErrors {
  const nextErrors: FormErrors = {};
  const mobileDigits = values.mobile.replace(/\D/g, "");

  if (!values.fullName.trim()) {
    nextErrors.fullName = "Please enter your full name.";
  }

  if (!values.dob) {
    nextErrors.dob = "Please select your date of birth.";
  }

  if (mobileDigits.length < 10) {
    nextErrors.mobile = "Please enter a valid mobile number.";
  }

  if (!EMAIL_RULE.test(values.email.trim())) {
    nextErrors.email = "Please enter a valid email address.";
  }

  if (!PASSWORD_RULE.test(values.password)) {
    nextErrors.password =
      "Password must be 8+ characters with 1 number and 1 special character.";
  }

  if (!values.confirmPassword) {
    nextErrors.confirmPassword = "Please confirm your password.";
  } else if (values.confirmPassword !== values.password) {
    nextErrors.confirmPassword = "Passwords do not match.";
  }

  return nextErrors;
}

const HEADER_GLOW = hexToRgba(colors.white, 0.15);
const HEADER_SOFT_LIGHT = hexToRgba(colors.white, 0.1);
const HEADER_DARK_ACCENT = "rgba(0, 0, 0, 0.08)";

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
function RegisterField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  onPress,
  rightAccessory,
  error,
  helperText,
  maxLength,
}: RegisterFieldProps): React.JSX.Element {
  const fieldContent = onPress ? (
    <Pressable style={styles.fieldValueWrap} onPress={onPress}>
      <Text
        style={[styles.fieldInput, !value ? styles.fieldPlaceholderText : null]}
      >
        {value || placeholder}
      </Text>
    </Pressable>
  ) : (
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
      maxLength={maxLength}
    />
  );

  return (
    <View style={styles.fieldBlock}>
      <View style={[styles.fieldCard, error ? styles.fieldCardError : null]}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <View style={styles.fieldRow}>
          <View style={styles.fieldControl}>{fieldContent}</View>
          {rightAccessory ? (
            <View style={styles.fieldAccessory}>{rightAccessory}</View>
          ) : null}
        </View>
      </View>
      {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

function RegisterScreen({
  onLogin,
}: RegisterScreenProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const {
    loading: isRegistrationLoading,
    status: registrationStatus,
    error: registrationError,
    message: registrationMessage,
  } = useAppSelector((state) => state.users);
  const today = startOfDay(new Date());
  const [formValues, setFormValues] = useState<FormValues>(INITIAL_FORM_VALUES);
  const [selectedDob, setSelectedDob] = useState<Date | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<Date>(startOfMonth(today));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);
  const calendarDays = buildCalendarDays(calendarMonth, today);
  const canGoToNextMonth =
    addMonths(calendarMonth, 1).getTime() <= startOfMonth(today).getTime();    

  useEffect(() => {
    if (registrationStatus === "success") {
      showSuccessToast({
        title: "Registration successful",
        message:
          registrationMessage ?? "Your account has been created successfully.",
      });
      setFormValues(INITIAL_FORM_VALUES);
      setSelectedDob(null);
      setFormErrors({});
      dispatch(resetCreateUserAccountStateAction());
      handleLogin();
      return;
    }

    if (registrationStatus === "error") {
      showErrorToast({
        title: "Registration failed",
        message: registrationError ?? "Please try again.",
      });
      dispatch(resetCreateUserAccountStateAction());
    }
  }, [dispatch, registrationError, registrationMessage, registrationStatus]);

  const updateField = <Key extends keyof FormValues,>(
    field: Key,
    value: FormValues[Key]
  ) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));

    setFormErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };

      delete nextErrors[field];

      return nextErrors;
    });
  };

  const handleSelectDate = (selectedDate: Date) => {
    const normalizedDate = startOfDay(selectedDate);

    setSelectedDob(normalizedDate);
    updateField("dob", formatDateForRequest(normalizedDate));
    setCalendarVisible(false);
  };

  const handleOpenCalendar = () => {
    setCalendarMonth(startOfMonth(selectedDob ?? today));
    setCalendarVisible(true);
  };

  const handleRegister = () => {
    if (isRegistrationLoading) {
      return;
    }

    const nextErrors = getValidationErrors(formValues);

    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      showErrorToast({
        title: "Check your details",
        message: "Please correct the highlighted fields and try again.",
      });
      return;
    }

    const { confirmPassword: _confirmPassword, ...registrationValues } = formValues;
    dispatch(createUserAccountRequestAction(registrationValues));
  };

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
      return;
    }

    showErrorToast({
      title: "Navigation unavailable",
      message: "Login screen navigation is not connected yet.",
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
        <View style={styles.screen}>
          <PatternHeader />

          <View style={styles.content}>
            <Text style={styles.title}>Create Account</Text>

            <View style={styles.formGroup}>
              <RegisterField
                label="Full Name"
                value={formValues.fullName}
                onChangeText={(text) => updateField("fullName", text)}
                placeholder="Enter your full name"
                autoCapitalize="words"
                error={formErrors.fullName}
              />

              <RegisterField
                label="Date of Birth"
                value={selectedDob ? formatDate(selectedDob) : ""}
                placeholder="Select your date of birth"
                onPress={handleOpenCalendar}
                rightAccessory={<ChevronDownIcon />}
                error={formErrors.dob}
              />

              <RegisterField
                label="Mobile"
                value={formValues.mobile}
                onChangeText={(text) =>
                  updateField("mobile", text.replace(/\D/g, "").slice(0, 15))
                }
                placeholder="Enter your mobile number"
                keyboardType="phone-pad"
                error={formErrors.mobile}
                maxLength={15}
              />

              <RegisterField
                label="Email"
                value={formValues.email}
                onChangeText={(text) => updateField("email", text)}
                placeholder="Enter your email address"
                keyboardType="email-address"
                autoCapitalize="none"
                error={formErrors.email}
              />

              <RegisterField
                label="Password"
                value={formValues.password}
                onChangeText={(text) => updateField("password", text)}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                rightAccessory={
                  <View style={styles.passwordAccessoryRow}>
                    <Pressable
                      onPress={() => setShowPasswordTooltip((current) => !current)}
                      hitSlop={10}
                      style={styles.accessoryButton}
                    >
                      <InfoIcon />
                    </Pressable>
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
                  </View>
                }
                error={formErrors.password}
                helperText={
                  showPasswordTooltip
                    ? "Password rules: minimum 8 characters, at least 1 number, and 1 special character."
                    : undefined
                }
              />

              <RegisterField
                label="Confirm Password"
                value={formValues.confirmPassword}
                onChangeText={(text) => updateField("confirmPassword", text)}
                placeholder="Re-enter your password"
                secureTextEntry={!showConfirmPassword}
                rightAccessory={
                  <Pressable
                    onPress={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                    hitSlop={10}
                    style={[
                      styles.passwordToggleButton,
                      showConfirmPassword
                        ? styles.passwordToggleButtonActive
                        : null,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    <EyeIcon
                      color={showConfirmPassword ? colors.primary : "#7C88A1"}
                      isVisible={showConfirmPassword}
                    />
                  </Pressable>
                }
                error={formErrors.confirmPassword}
              />
            </View>

            <CustomButton
              title="Register"
              onPress={handleRegister}
              disabled={isRegistrationLoading}
              style={styles.registerButton}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Pressable onPress={handleLogin}>
                <Text style={styles.footerLink}>Sign In</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={isCalendarVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setCalendarVisible(false)}
          />

          <View style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
              <Pressable
                style={{ ...styles.calendarNavButton, backgroundColor: hexToRgba(colors.primary, 0.1) }}
                onPress={() =>
                  setCalendarMonth((currentMonth) =>
                    addMonths(currentMonth, -1)
                  )
                }
              >
                <Text style={styles.calendarNavText}>{"<"}</Text>
              </Pressable>

              <Text style={styles.calendarTitle}>
                {MONTH_NAMES[calendarMonth.getMonth()]}{" "}
                {calendarMonth.getFullYear()}
              </Text>

              <Pressable
                style={[
                  styles.calendarNavButton,
                  !canGoToNextMonth ? styles.calendarNavButtonDisabled : null,
                  { backgroundColor: hexToRgba(colors.primary, 0.1) }
                ]}
                onPress={() =>
                  canGoToNextMonth
                    ? setCalendarMonth((currentMonth) =>
                      addMonths(currentMonth, 1)
                    )
                    : undefined
                }
                disabled={!canGoToNextMonth}
              >
                <Text style={styles.calendarNavText}>{">"}</Text>
              </Pressable>
            </View>

            <View style={styles.weekRow}>
              {WEEK_DAYS.map((day,i) => (
                <Text key={day+i} style={styles.weekDayText}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {calendarDays.map((day) => {
                const isSelected = isSameDay(selectedDob, day.date);

                return (
                  <Pressable
                    key={day.key}
                    style={[
                      styles.dayCell,
                      isSelected ? styles.dayCellSelected : null,
                    ]}
                    onPress={() => handleSelectDate(day.date)}
                    disabled={day.isDisabled}
                  >
                    <Text
                      style={[
                        styles.dayCellText,
                        !day.isCurrentMonth ? styles.dayCellTextMuted : null,
                        day.isDisabled ? styles.dayCellTextDisabled : null,
                        isSelected ? styles.dayCellTextSelected : null,
                      ]}
                    >
                      {day.date.getDate()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={styles.calendarCloseButton}
              onPress={() => setCalendarVisible(false)}
            >
              <Text style={styles.calendarCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <AppLoader visible={isRegistrationLoading} />
    </SafeAreaView>
  );
}


export default RegisterScreen;
