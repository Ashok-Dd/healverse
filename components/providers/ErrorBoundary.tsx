import React from "react";
import { Button } from "@/components/ui/Button";
import { Text, View } from "react-native";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

// Catches render-time crashes anywhere below it so the app shows a recoverable
// screen instead of going blank/stuck with no feedback.
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary] Caught render error:", error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <View className="flex-1 items-center justify-center bg-background px-6">
          <Text className="mb-2 text-center font-display text-xl text-foreground">
            Something went wrong
          </Text>
          <Text className="mb-6 text-center font-body text-sm text-muted-foreground">
            {this.state.error.message || "An unexpected error occurred."}
          </Text>
          <Button title="Try again" onPress={this.reset} />
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
