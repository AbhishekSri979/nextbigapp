import React, { useState } from "react";
import {
  Alert,
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

type LoginScreenProps = {
  onRegister?: () => void;
};

type LoginFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
};

const HEADER_PATTERN = [
  { top: -14, left: -10, size: 62, radius: 22, rotate: "45deg" },
  { top: 2, left: 42, size: 70, radius: 35, rotate: "0deg" },
  { top: -18, left: 114, size: 60, radius: 18, rotate: "45deg" },
  { top: 8, left: 166, size: 74, radius: 37, rotate: "0deg" },
  { top: -12, left: 238, size: 58, radius: 18, rotate: "45deg" },
  { top: 58, left: -18, size: 72, radius: 36, rotate: "0deg" },
  { top: 72, left: 38, size: 58, radius: 18, rotate: "45deg" },
  { top: 66, left: 92, size: 74, radius: 36, rotate: "0deg" },
  { top: 74, left: 168, size: 64, radius: 20, rotate: "45deg" },
  { top: 60, left: 222, size: 78, radius: 39, rotate: "0deg" },
] as const;

const SCREEN_BACKGROUND = colors.white;

function PatternHeader(): React.JSX.Element {
  return (
    <View style={styles.header}>
      {HEADER_PATTERN.map((shape, index) => (
        <View
          key={`shape-${index}`}
          style={[
            styles.headerShape,
            {
              top: shape.top,
              left: shape.left,
              width: shape.size,
              height: shape.size,
              borderRadius: shape.radius,
              transform: [{ rotate: shape.rotate }],
            },
          ]}
        />
      ))}

      <View style={styles.logoBadge}>
        <View style={styles.logoMark}>
          <View style={styles.logoCircle} />
          <View style={styles.logoCut} />
        </View>
      </View>
    </View>
  );
}

function LoginField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
}: LoginFieldProps): React.JSX.Element {
  return (
    <View style={styles.fieldCard}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#C1C4CC"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        selectionColor="#111111"
      />
    </View>
  );
}

function LoginScreen({ onRegister }: LoginScreenProps): React.JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    Alert.alert("Login", "Login functionality to be implemented");
  };

  const handleRegister = () => {
    if (onRegister) {
      onRegister();
      return;
    }

    Alert.alert("Register", "Register functionality to be implemented");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={SCREEN_BACKGROUND}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.card}>
          <PatternHeader />

          <View style={styles.content}>
            <Text style={styles.title}>Login</Text>

            <View style={styles.formGroup}>
              <LoginField
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="hello@reallygreatsite.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <LoginField
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="........"
                secureTextEntry
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.loginButton,
                pressed ? styles.loginButtonPressed : null,
              ]}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </Pressable>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have any account? </Text>
              <Pressable onPress={handleRegister}>
                <Text style={styles.footerLink}>Sign Up</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: SCREEN_BACKGROUND,
    backgroundColor: "#FFFFF",
  },
  scrollContent: {
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 38,
    elevation: 8,
    overflow: "hidden",
    shadowColor: "#6B7280",
    shadowOffset: {
      width: 0,
      height: 18,
    },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    width: "100%",
  },
  header: {
    alignItems: "center",
    backgroundColor: "#111111",
    height: 190,
    overflow: "hidden",
    paddingTop: 60,
    position: "relative",
  },
  headerShape: {
    backgroundColor: "#1E1E1E",
    opacity: 0.95,
    position: "absolute",
  },
  logoBadge: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 14,
    height: 58,
    justifyContent: "center",
    width: 58,
  },
  logoMark: {
    height: 28,
    position: "relative",
    width: 28,
  },
  logoCircle: {
    backgroundColor: "#111111",
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
    marginTop: -50,
    // minHeight: 382,
    // paddingBottom: 28,
    paddingHorizontal: 24,
    paddingTop: 38,
    height: "100%",
    width:'100%',
  },
  title: {
    color: "#1F1F1F",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 34,
    textAlign: "center",
  },
  formGroup: {
    gap: 14,
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
  fieldLabel: {
    color: "#1F1F1F",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  fieldInput: {
    color: "#1F1F1F",
    fontSize: 14,
    paddingVertical: 0,
  },
  loginButton: {
    alignItems: "center",
    backgroundColor: "#050505",
    borderRadius: 10,
    elevation: 4,
    marginTop: 22,
    paddingVertical: 14,
    shadowColor: "#111111",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
  loginButtonPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
  loginButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 110,
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
});

export default LoginScreen;
