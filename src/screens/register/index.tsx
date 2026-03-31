import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { TextInputProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton } from "../../components/common";
import { colors } from "../../theme/colors";

type RegisterScreenProps = {
  onLogin?: () => void;
};

type FormFieldIcon = "person" | "calendar" | "phone" | "mail" | "lock";

type FormValues = {
  fullName: string;
  dob: Date | null;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

type AuthFieldProps = {
  icon: FormFieldIcon;
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  rightAccessory?: React.ReactNode;
  onPress?: () => void;
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

function PersonIcon(): React.JSX.Element {
  return (
    <View style={styles.personIcon}>
      <View style={styles.personHead} />
      <View style={styles.personBody} />
    </View>
  );
}

function CalendarIcon(): React.JSX.Element {
  return (
    <View style={styles.calendarIcon}>
      <View style={styles.calendarRings}>
        <View style={styles.calendarRing} />
        <View style={styles.calendarRing} />
      </View>
      <View style={styles.calendarTopBand} />
      <View style={styles.calendarIconGrid}>
        <View style={styles.calendarGridDot} />
        <View style={styles.calendarGridDot} />
        <View style={styles.calendarGridDot} />
        <View style={styles.calendarGridDot} />
      </View>
    </View>
  );
}

function PhoneIcon(): React.JSX.Element {
  return (
    <View style={styles.phoneIcon}>
      <View style={styles.phoneScreen} />
      <View style={styles.phoneButton} />
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

function FieldIcon({ icon }: { icon: FormFieldIcon }): React.JSX.Element {
  switch (icon) {
    case "person":
      return <PersonIcon />;
    case "calendar":
      return <CalendarIcon />;
    case "phone":
      return <PhoneIcon />;
    case "lock":
      return <LockIcon />;
    case "mail":
    default:
      return <MailIcon />;
  }
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
  onPress,
  error,
  helperText,
  maxLength,
}: AuthFieldProps): React.JSX.Element {
  const content = onPress ? (
    <Pressable style={styles.fieldValueWrap} onPress={onPress}>
      <Text
        style={[
          styles.fieldInput,
          !value ? styles.fieldPlaceholderText : null,
        ]}
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
      placeholderTextColor={colors.textMuted}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      selectionColor={colors.primary}
      maxLength={maxLength}
    />
  );

  return (
    <View style={styles.fieldBlock}>
      <View style={[styles.fieldShell, error ? styles.fieldShellError : null]}>
        <View style={styles.fieldIconWrap}>
          <FieldIcon icon={icon} />
        </View>
        <View style={styles.fieldTextWrap}>
          <Text style={styles.fieldLabel}>{label}</Text>
          {content}
        </View>
        {rightAccessory ? (
          <View style={styles.fieldRightAccessory}>{rightAccessory}</View>
        ) : null}
      </View>
      {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.shell}>
          <View style={styles.hero}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Enter your details below to register an account.
            </Text>
          </View>

          <View style={styles.form}>
            <AuthField
              icon="person"
              label="Full Name"
              value={formValues.fullName}
              onChangeText={(text) => updateField("fullName", text)}
              placeholder="Enter your full name"
              autoCapitalize="words"
              error={formErrors.fullName}
            />

            <AuthField
              icon="calendar"
              label="Date of Birth"
              value={formValues.dob ? formatDate(formValues.dob) : ""}
              placeholder="Select your DOB"
              onPress={handleOpenCalendar}
              error={formErrors.dob}
            />

            <AuthField
              icon="phone"
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

            <AuthField
              icon="mail"
              label="Email"
              value={formValues.email}
              onChangeText={(text) => updateField("email", text)}
              placeholder="Enter your email address"
              keyboardType="email-address"
              autoCapitalize="none"
              error={formErrors.email}
            />

            <AuthField
              icon="lock"
              label="Password"
              value={formValues.password}
              onChangeText={(text) => updateField("password", text)}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              rightAccessory={
                <Pressable
                  onPress={() => setShowPassword((current) => !current)}
                  hitSlop={10}
                >
                  <EyeIcon />
                </Pressable>
              }
              error={formErrors.password}
              helperText="Use at least 8 characters with 1 number and 1 special character."
            />

            <AuthField
              icon="lock"
              label="Confirm Password"
              value={formValues.confirmPassword}
              onChangeText={(text) => updateField("confirmPassword", text)}
              placeholder="Re-enter your password"
              secureTextEntry={!showConfirmPassword}
              rightAccessory={
                <Pressable
                  onPress={() => setShowConfirmPassword((current) => !current)}
                  hitSlop={10}
                >
                  <EyeIcon />
                </Pressable>
              }
              error={formErrors.confirmPassword}
            />

            <CustomButton
              title="Register"
              onPress={handleRegister}
              style={styles.registerButton}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <Pressable onPress={handleLogin}>
                <Text style={styles.loginLink}>Sign In</Text>
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
    backgroundColor: colors.authBackground,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 22,
    paddingVertical: 24,
  },
  shell: {
    alignSelf: "center",
    backgroundColor: colors.white,
    borderColor: colors.panelBorder,
    borderRadius: 34,
    borderWidth: 6,
    elevation: 12,
    maxWidth: 380,
    paddingBottom: 28,
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
    textAlign: "center",
  },
  form: {
    marginTop: 18,
    width: "100%",
  },
  fieldBlock: {
    marginBottom: 12,
  },
  fieldShell: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.inputBorder,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
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
  fieldShellError: {
    borderColor: "#D65A5A",
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
  fieldValueWrap: {
    justifyContent: "center",
    minHeight: 18,
  },
  fieldInput: {
    color: colors.textPrimary,
    fontSize: 14,
    minHeight: 18,
    paddingVertical: 0,
  },
  fieldPlaceholderText: {
    color: colors.textMuted,
  },
  fieldRightAccessory: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  helperText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 6,
    paddingHorizontal: 4,
  },
  errorText: {
    color: "#D64545",
    fontSize: 12,
    marginTop: 6,
    paddingHorizontal: 4,
  },
  registerButton: {
    marginTop: 8,
  },
  loginContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },
  loginText: {
    color: colors.textSecondary,
    fontSize: 15,
  },
  loginLink: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    backgroundColor: "rgba(20, 35, 76, 0.42)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  calendarCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 14,
    },
    shadowOpacity: 0.18,
    shadowRadius: 22,
    width: "100%",
  },
  calendarHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  calendarTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "800",
  },
  calendarNavButton: {
    alignItems: "center",
    backgroundColor: colors.panelSurface,
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  calendarNavButtonDisabled: {
    opacity: 0.4,
  },
  calendarNavText: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: "700",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  weekDayText: {
    color: colors.textSecondary,
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    alignItems: "center",
    borderRadius: 16,
    height: 42,
    justifyContent: "center",
    marginBottom: 6,
    width: "14.285%",
  },
  dayCellSelected: {
    backgroundColor: colors.primary,
  },
  dayCellText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  dayCellTextMuted: {
    color: colors.textMuted,
  },
  dayCellTextDisabled: {
    color: "#C3CCDA",
  },
  dayCellTextSelected: {
    color: colors.white,
  },
  calendarCloseButton: {
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 10,
  },
  calendarCloseText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "700",
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
  personIcon: {
    alignItems: "center",
    height: 18,
    justifyContent: "center",
    width: 18,
  },
  personHead: {
    backgroundColor: "#8C98B3",
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  personBody: {
    backgroundColor: "#8C98B3",
    borderRadius: 6,
    height: 7,
    marginTop: 1,
    width: 14,
  },
  calendarIcon: {
    alignItems: "center",
    borderColor: "#8C98B3",
    borderRadius: 4,
    borderWidth: 1.5,
    height: 16,
    justifyContent: "flex-start",
    overflow: "hidden",
    width: 18,
  },
  calendarRings: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 1,
    width: 10,
  },
  calendarRing: {
    backgroundColor: "#8C98B3",
    borderRadius: 1,
    height: 4,
    width: 2,
  },
  calendarTopBand: {
    backgroundColor: "#8C98B3",
    height: 3,
    marginTop: 1,
    width: "100%",
  },
  calendarIconGrid: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 2,
    paddingHorizontal: 2,
    rowGap: 1,
  },
  calendarGridDot: {
    backgroundColor: "#8C98B3",
    borderRadius: 1,
    height: 2,
    marginHorizontal: 1,
    width: 2,
  },
  phoneIcon: {
    alignItems: "center",
    borderColor: "#8C98B3",
    borderRadius: 4,
    borderWidth: 1.5,
    height: 18,
    justifyContent: "space-between",
    paddingBottom: 1,
    paddingTop: 2,
    width: 11,
  },
  phoneScreen: {
    backgroundColor: "#8C98B3",
    borderRadius: 1,
    height: 9,
    width: 5,
  },
  phoneButton: {
    backgroundColor: "#8C98B3",
    borderRadius: 1.5,
    height: 3,
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
});

export default RegisterScreen;
