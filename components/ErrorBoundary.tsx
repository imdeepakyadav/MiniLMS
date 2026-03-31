import { Button } from "@components/ui/Button";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@store/themeStore";
import { AppTheme, FONT_SIZE, FONT_WEIGHT, SPACING } from "@utils/theme";
import * as Updates from "expo-updates";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ThemedErrorBoundaryProps extends ErrorBoundaryProps {
  colors: AppTheme;
}

class ErrorBoundaryBase extends React.Component<
  ThemedErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  handleRestart = async () => {
    try {
      await Updates.reloadAsync();
    } catch (error) {
      console.error("Failed to reload app", error);
    }
  };

  render() {
    if (this.state.hasError) {
      const { colors } = this.props;
      const styles = createStyles(colors);

      return (
        <View style={styles.container}>
          <Ionicons
            name="warning-outline"
            size={44}
            color={colors.warning}
            style={styles.icon}
          />
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            {this.state.error?.message || "An unexpected error occurred."}
          </Text>
          <Button label="Restart App" onPress={this.handleRestart} />
        </View>
      );
    }

    return this.props.children;
  }
}

export const ErrorBoundary = ({ children }: ErrorBoundaryProps) => {
  const { colors } = useTheme();

  return <ErrorBoundaryBase colors={colors}>{children}</ErrorBoundaryBase>;
};

const createStyles = (colors: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: SPACING.lg,
    },
    icon: {
      marginBottom: SPACING.md,
    },
    title: {
      color: colors.textPrimary,
      fontSize: FONT_SIZE.xl,
      fontWeight: FONT_WEIGHT.bold,
      marginBottom: SPACING.sm,
      textAlign: "center",
    },
    message: {
      color: colors.textSecondary,
      fontSize: FONT_SIZE.md,
      textAlign: "center",
      marginBottom: SPACING.lg,
      maxWidth: 320,
    },
  });
