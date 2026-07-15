import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

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
        <View className="flex-1 items-center justify-center bg-white px-6">
          <Text className="text-lg font-semibold text-gray-800 mb-2 text-center">
            Something went wrong
          </Text>
          <Text className="text-sm text-gray-500 mb-6 text-center">
            {this.state.error.message || "An unexpected error occurred."}
          </Text>
          <TouchableOpacity
            className="px-5 py-3 bg-green-500 rounded-lg"
            onPress={this.reset}
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
