import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";

interface CustomTextInputProps extends TextInputProps {
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  errorTextStyle?: StyleProp<TextStyle>;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  style,
  error,
  containerStyle,
  errorTextStyle,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={[styles.input, style, error ? styles.inputError : null]}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
      {error ? (
        <Text style={[styles.errorText, errorTextStyle]}>{error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  input: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: spacing.sm,
  },
});

export default CustomTextInput;
