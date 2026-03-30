import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '@utils/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}) => {
  const getContainerStyle = () => {
    switch (variant) {
      case 'outline': return [styles.container, styles.outlineContainer];
      case 'ghost': return [styles.container, styles.ghostContainer];
      default: return [styles.container, styles.primaryContainer];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline': return [styles.text, styles.outlineText];
      case 'ghost': return [styles.text, styles.ghostText];
      default: return [styles.text, styles.primaryText];
    }
  };

  return (
    <TouchableOpacity
      style={[getContainerStyle(), disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFF' : COLORS.primary} />
      ) : (
        <Text style={getTextStyle()}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.sm,
  },
  primaryContainer: { backgroundColor: COLORS.primary },
  outlineContainer: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.primary },
  ghostContainer: { backgroundColor: 'transparent' },
  disabled: { opacity: 0.5 },
  text: { fontSize: FONT_SIZE.md, fontWeight: '600' },
  primaryText: { color: COLORS.textPrimary },
  outlineText: { color: COLORS.primary },
  ghostText: { color: COLORS.primary },
});
