import { Platform, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

const brandFontFamily =
  Platform.select({
    ios: "Georgia",
    android: "serif",
    default: "serif",
  }) ?? "serif";

const LOGIN_HEADER_COLOR = colors.primary;

export const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.primary,
    // flex: 1,
  },
  scrollContent: {
    backgroundColor: "#FFFFFF",
    flexGrow: 1,
  },
  hero: {
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingBottom: 46,
    paddingTop: 40,
    flex:1,
  },
  brandMarkOuter: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    elevation: 8,
    height: 84,
    justifyContent: "center",
    marginBottom: 22,
    shadowColor: "#17345C",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    width: 84,
  },
  brandMarkInner: {
    backgroundColor: LOGIN_HEADER_COLOR,
    borderRadius: 12,
    height: 34,
    width: 34,
  },
  brandTitle: {
    color: "#FFFFFF",
    fontFamily: brandFontFamily,
    fontSize: 40,
    marginBottom: 10,
  },
  brandSubtitle: {
    color: "#C7D4EA",
    fontFamily: brandFontFamily,
    fontSize: 18,
    lineHeight: 26,
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingBottom: 40,
    paddingHorizontal: 28,
    paddingTop: 30,
    borderTopLeftRadius:40,
    marginTop: -28,
    backgroundColor: "#FFFFFF",
  },
  fieldLabel: {
    color: "#2D3450",
    fontFamily: brandFontFamily,
    fontSize: 17,
    marginBottom: 12,
  },
  inputShell: {
    backgroundColor: "#FFFFFF",
    borderColor: colors.primary,
    borderRadius: 18,
    borderWidth: 2,
    elevation: 2,
    justifyContent: "center",
    minHeight: 60,
    paddingHorizontal: 20,
  },
  inputShellError: {
    borderColor: "#D66060",
  },
  input: {
    color: "#3B4157",
    fontFamily: brandFontFamily,
    fontSize: 17,
    paddingVertical: 0,
  },
  errorText: {
    color: "#D66060",
    fontSize: 13,
    marginTop: 8,
  },
  helperText: {
    color: "#7B8196",
    fontFamily: brandFontFamily,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
    marginTop: 12,
  },
  primaryButton: {
    backgroundColor: LOGIN_HEADER_COLOR,
    borderRadius: 18,
    elevation: 5,
    minHeight: 60,
    shadowColor: "#1F365C",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.16,
    shadowRadius: 14,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontFamily: brandFontFamily,
    fontSize: 18,
  },
  dividerRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 22,
    marginTop: 26,
  },
  dividerLine: {
    backgroundColor: "#E1E4EC",
    flex: 1,
    height: 1,
  },
  dividerText: {
    color: "#8A90A3",
    fontFamily: brandFontFamily,
    fontSize: 18,
    marginHorizontal: 16,
  },
  googleButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#D9DEE8",
    borderRadius: 18,
    borderWidth: 1.2,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 60,
    paddingHorizontal: 20,
    shadowColor: "#23395B",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 14,
  },
  googleButtonPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
  googleIcon: {
    height: 22,
    marginRight: 12,
    width: 22,
  },
  googleButtonText: {
    color: "#2E3650",
    fontFamily: brandFontFamily,
    fontSize: 17,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
  },
  footerText: {
    color: "#8A90A3",
    fontFamily: brandFontFamily,
    fontSize: 16,
  },
  footerLink: {
    color: "#3C78EF",
    fontFamily: brandFontFamily,
    fontSize: 16,
  },
});
