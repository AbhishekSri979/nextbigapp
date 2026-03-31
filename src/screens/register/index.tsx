import React, { useState } from "react";
import {
  Alert,
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

import { colors } from "../../theme/colors";

type RegisterScreenProps = {
  onLogin?: () => void;
};

type FormValues = {
  fullName: string;
  dob: Date | null;
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
  return `${date.getDate().toString().padStart(2, "0")} ${
    MONTH_NAMES[date.getMonth()]
  } ${date.getFullYear()}`;
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

function EyeIcon(): React.JSX.Element {
  return (
    <View style={styles.eyeIcon}>
      <View style={styles.eyePupil} />
    </View>
  );
}

function InfoIcon(): React.JSX.Element {
  return (
    <View style={styles.infoIcon}>
      <View style={styles.infoIconDot} />
      <View style={styles.infoIconStem} />
    </View>
  );
}

function ChevronDownIcon(): React.JSX.Element {
  return (
    <View style={styles.chevronDown}>
      <View style={styles.chevronDownLeft} />
      <View style={styles.chevronDownRight} />
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
  const today = startOfDay(new Date());
  const [formValues, setFormValues] = useState<FormValues>({
    fullName: "",
    dob: null,
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<Date>(startOfMonth(today));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);

  const calendarDays = buildCalendarDays(calendarMonth, today);
  const canGoToNextMonth =
    addMonths(calendarMonth, 1).getTime() <= startOfMonth(today).getTime();

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
    updateField("dob", selectedDate);
    setCalendarVisible(false);
  };

  const handleOpenCalendar = () => {
    setCalendarMonth(startOfMonth(formValues.dob ?? today));
    setCalendarVisible(true);
  };

  const handleRegister = () => {
    const nextErrors = getValidationErrors(formValues);

    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    Alert.alert(
      "Registration Ready",
      "All fields look good. You can connect this button to your API next."
    );
  };

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
      return;
    }

    Alert.alert("Sign In", "Login screen navigation is not connected yet.");
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
                value={formValues.dob ? formatDate(formValues.dob) : ""}
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
                      style={styles.accessoryButton}
                    >
                      <EyeIcon />
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
                    style={styles.accessoryButton}
                  >
                    <EyeIcon />
                  </Pressable>
                }
                error={formErrors.confirmPassword}
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.registerButton,
                pressed ? styles.registerButtonPressed : null,
              ]}
              onPress={handleRegister}
            >
              <Text style={styles.registerButtonText}>Register</Text>
            </Pressable>

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
                style={styles.calendarNavButton}
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
              {WEEK_DAYS.map((day) => (
                <Text key={day} style={styles.weekDayText}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {calendarDays.map((day) => {
                const isSelected = isSameDay(formValues.dob, day.date);

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
  screen: {
    backgroundColor: colors.surface,
    flex: 1,
    width: "100%",
  },
  header: {
    alignItems: "center",
    backgroundColor: colors.primary,
    height: 190,
    overflow: "hidden",
    paddingTop: 60,
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
    top: 42,
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
    borderTopLeftRadius: 100,
    borderTopRightRadius: 20,
    flex: 1,
    marginTop: -50,
    paddingBottom: 28,
    paddingHorizontal: 24,
    paddingTop: 38,
  },
  title: {
    color: "#1F1F1F",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 28,
    textAlign: "center",
  },
  formGroup: {
    gap: 14,
  },
  fieldBlock: {
    gap: 6,
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
  fieldCardError: {
    borderColor: "#F0B6B8",
  },
  fieldLabel: {
    color: "#1F1F1F",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  fieldRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  fieldControl: {
    flex: 1,
  },
  fieldValueWrap: {
    minHeight: 20,
    justifyContent: "center",
  },
  fieldInput: {
    color: "#1F1F1F",
    fontSize: 14,
    paddingVertical: 0,
  },
  fieldPlaceholderText: {
    color: "#C1C4CC",
  },
  fieldAccessory: {
    marginLeft: 12,
  },
  passwordAccessoryRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  accessoryButton: {
    alignItems: "center",
    justifyContent: "center",
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
  infoIcon: {
    alignItems: "center",
    borderColor: "#97A3BD",
    borderRadius: 7,
    borderWidth: 1.4,
    height: 14,
    justifyContent: "center",
    width: 14,
  },
  infoIconDot: {
    backgroundColor: "#97A3BD",
    borderRadius: 1.1,
    height: 2.2,
    marginBottom: 1.2,
    width: 2.2,
  },
  infoIconStem: {
    backgroundColor: "#97A3BD",
    borderRadius: 1,
    height: 4.5,
    width: 2,
  },
  chevronDown: {
    height: 12,
    position: "relative",
    width: 16,
  },
  chevronDownLeft: {
    backgroundColor: "#97A3BD",
    height: 1.6,
    left: 1,
    position: "absolute",
    top: 6,
    transform: [{ rotate: "38deg" }],
    width: 8,
  },
  chevronDownRight: {
    backgroundColor: "#97A3BD",
    height: 1.6,
    position: "absolute",
    right: 1,
    top: 6,
    transform: [{ rotate: "-38deg" }],
    width: 8,
  },
  helperText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    paddingHorizontal: 4,
  },
  errorText: {
    color: "#D14343",
    fontSize: 12,
    fontWeight: "500",
    paddingHorizontal: 4,
  },
  registerButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 10,
    elevation: 4,
    marginTop: 24,
    paddingVertical: 14,
    shadowColor: "#111111",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
  registerButtonPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
  registerButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 36,
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
  modalOverlay: {
    backgroundColor: "rgba(15, 23, 42, 0.32)",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  calendarCard: {
    backgroundColor: colors.surface,
    borderRadius: 26,
    elevation: 10,
    padding: 20,
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 18,
    },
    shadowOpacity: 0.18,
    shadowRadius: 24,
  },
  calendarHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  calendarNavButton: {
    alignItems: "center",
    backgroundColor: hexToRgba(colors.primary, 0.1),
    borderRadius: 12,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  calendarNavButtonDisabled: {
    opacity: 0.35,
  },
  calendarNavText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "700",
  },
  calendarTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  weekDayText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    width: `${100 / 7}%`,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    alignItems: "center",
    borderRadius: 12,
    height: 40,
    justifyContent: "center",
    marginBottom: 8,
    width: `${100 / 7}%`,
  },
  dayCellSelected: {
    backgroundColor: colors.primary,
  },
  dayCellText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "500",
  },
  dayCellTextMuted: {
    color: "#B7C0D1",
  },
  dayCellTextDisabled: {
    color: "#D2D8E4",
  },
  dayCellTextSelected: {
    color: colors.white,
    fontWeight: "700",
  },
  calendarCloseButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 12,
    marginTop: 10,
    paddingVertical: 12,
  },
  calendarCloseText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
});

export default RegisterScreen;
