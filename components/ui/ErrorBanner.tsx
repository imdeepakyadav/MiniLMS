import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '@utils/theme';

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onDismiss }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} hitSlop={10} style={styles.closeBtn}>
          <Text style={styles.dismissText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.error,
    padding: SPACING.md,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: SPACING.sm,
    width: '100%',
  },
  text: { color: '#FFF', fontSize: FONT_SIZE.sm, flex: 1, marginRight: SPACING.sm },
  closeBtn: { padding: 2 },
  dismissText: { color: '#FFF', fontSize: FONT_SIZE.md, fontWeight: 'bold' }
});
