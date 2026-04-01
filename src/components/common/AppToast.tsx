import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Toast, {
  type ToastConfig,
  type ToastPosition,
} from "react-native-toast-message";

import { colors } from "../../theme/colors";

type AppToastVariant = "success" | "error";

type ShowAppToastParams = {
  title: string;
  message?: string;
  position?: ToastPosition;
  visibilityTime?: number;
};

type ToastCardProps = {
  title?: string;
  message?: string;
  variant: AppToastVariant;
};

const DEFAULT_VISIBILITY_TIME = 3500;

const TOAST_VARIANTS: Record<
  AppToastVariant,
  {
    accentColor: string;
    backgroundColor: string;
    borderColor: string;
    label: string;
  }
> = {
  success: {
    accentColor: colors.success,
    backgroundColor: colors.successSurface,
    borderColor: colors.successBorder,
    label: "SUCCESS",
  },
  error: {
    accentColor: colors.error,
    backgroundColor: colors.errorSurface,
    borderColor: colors.errorBorder,
    label: "ERROR",
  },
};

function ToastCard({
  title,
  message,
  variant,
}: ToastCardProps): React.JSX.Element {
  const palette = TOAST_VARIANTS[variant];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: palette.backgroundColor,
          borderColor: palette.borderColor,
        },
      ]}
    >
      <View
        style={[styles.leadingBar, { backgroundColor: palette.accentColor }]}
      />

      <View style={styles.content}>
        <View style={styles.labelRow}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: palette.accentColor },
            ]}
          />
          <Text style={[styles.label, { color: palette.accentColor }]}>
            {palette.label}
          </Text>
        </View>

        {title ? <Text style={styles.title}>{title}</Text> : null}
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    </View>
  );
}

const toastConfig: ToastConfig = {
  success: ({ text1, text2 }) => (
    <ToastCard variant="success" title={text1} message={text2} />
  ),
  error: ({ text1, text2 }) => (
    <ToastCard variant="error" title={text1} message={text2} />
  ),
};

function showToast(
  variant: AppToastVariant,
  {
    title,
    message,
    position = "top",
    visibilityTime = DEFAULT_VISIBILITY_TIME,
  }: ShowAppToastParams
): void {
  Toast.show({
    type: variant,
    text1: title,
    text2: message,
    position,
    visibilityTime,
  });
}

export function showSuccessToast(params: ShowAppToastParams): void {
  showToast("success", params);
}

export function showErrorToast(params: ShowAppToastParams): void {
  showToast("error", params);
}

function AppToast(): React.JSX.Element {
  return (
    <Toast
      config={toastConfig}
      topOffset={60}
      visibilityTime={DEFAULT_VISIBILITY_TIME}
      autoHide
      position="top"
    />
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "stretch",
    alignSelf: "center",
    borderRadius: 18,
    borderWidth: 1,
    elevation: 10,
    flexDirection: "row",
    marginHorizontal: 16,
    minHeight: 76,
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    width: "92%",
  },
  leadingBar: {
    width: 6,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  labelRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 6,
  },
  statusDot: {
    borderRadius: 4,
    height: 8,
    marginRight: 8,
    width: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  message: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
});

export default AppToast;
