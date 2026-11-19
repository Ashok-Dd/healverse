import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";

/**
 * Height of the open keyboard, 0 when it is closed. Android with edge-to-edge does not resize the
 * window for the keyboard, and KeyboardAvoidingView does nothing inside a translucent Modal, so
 * screens and sheets with text fields add this as bottom space themselves.
 */
export function useKeyboardHeight(active = true): number {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!active) return;
    const show = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (event) => setHeight(event.endCoordinates.height)
    );
    const hide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setHeight(0)
    );
    return () => {
      show.remove();
      hide.remove();
      setHeight(0);
    };
  }, [active]);

  return height;
}
