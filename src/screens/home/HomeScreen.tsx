import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Screen from '../../components/layout/Screen';
import { appConfig } from '../../constants/app';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const structureNotes = [
  'app: app entry point, providers, and startup wiring',
  'screens: route-level views and screen composition',
  'components: shared UI building blocks',
  'features: domain-specific modules such as events or bookings',
  'services: API clients and external integrations',
  'store: global state and persistence',
  'theme: colors, spacing, and design tokens',
  'utils/types/hooks: cross-cutting helpers and shared contracts',
];

function HomeScreen(): React.JSX.Element {
  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Project scaffold</Text>
        <Text style={styles.title}>{appConfig.name}</Text>
        <Text style={styles.subtitle}>{appConfig.tagline}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Suggested structure</Text>
        {structureNotes.map(item => (
          <Text key={item} style={styles.cardItem}>
            {`- ${item}`}
          </Text>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
  },
  hero: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 36,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    padding: spacing.lg,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  cardItem: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: spacing.sm,
  },
});

export default HomeScreen;
