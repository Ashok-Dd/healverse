import { useEffect, useRef } from "react";
import { Animated, Keyboard, KeyboardEvent, Platform, View } from "react-native";

/**
 * Keeps a bottom-anchored input above the keyboard.
 *
 * With Android edge-to-edge the window is not resized for the keyboard, and
 * KeyboardAvoidingView is unreliable there. Instead this measures how far the keyboard overlaps
 * the container (so tab bars and safe-area padding are accounted for) and animates bottom
 * padding by exactly that amount.
 *
 * Usage: attach `ref` to an `Animated.View` and spread `style` on it.
 */
export function useKeyboardInset(onShown?: () => void) {
  const ref = useRef<View>(null);
  const inset = useRef(new Animated.Value(0)).current;
  const onShownRef = useRef(onShown);
  onShownRef.current = onShown;

  useEffect(() => {
    const ios = Platform.OS === "ios";

    const animateTo = (toValue: number, duration: number) =>
      Animated.timing(inset, { toValue, duration, useNativeDriver: false }).start();

    const handleShow = (event: KeyboardEvent) => {
      const keyboardTop = event.endCoordinates.screenY;
      ref.current?.measureInWindow((_x, y, _width, height) => {
        const overlap = Math.max(0, y + height - keyboardTop);
        animateTo(overlap, event.duration || 150);
        if (overlap > 0) setTimeout(() => onShownRef.current?.(), (event.duration || 150) + 30);
      });
    };
    const handleHide = (event?: KeyboardEvent) => animateTo(0, event?.duration || 150);

    const subscriptions = [
      Keyboard.addListener(ios ? "keyboardWillChangeFrame" : "keyboardDidShow", handleShow),
      Keyboard.addListener(ios ? "keyboardWillHide" : "keyboardDidHide", handleHide),
    ];
    return () => subscriptions.forEach((s) => s.remove());
  }, [inset]);

  return { ref, style: { paddingBottom: inset } };
}
