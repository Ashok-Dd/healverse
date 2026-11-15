import { useEffect, useRef } from "react";
import { Animated, Keyboard, KeyboardEvent, Platform, View } from "react-native";

interface Options {
  /**
   * Space the screen already keeps free below the container (tab bar height, bottom safe-area
   * inset). The keyboard covers this too, so only the rest needs padding.
   */
  bottomOffset?: number;
  /** Called once the input has moved, e.g. to scroll a list to its end. */
  onShown?: () => void;
}

/**
 * Keeps a bottom-anchored input above the keyboard.
 *
 * With Android edge-to-edge the window is not resized for the keyboard and
 * KeyboardAvoidingView is unreliable, so the padding is animated by hand. It is the larger of
 * two estimates, so the input never ends up under the keyboard:
 *  - keyboard height minus `bottomOffset`
 *  - how far the keyboard overlaps the measured container
 *
 * Usage: attach `ref` to an `Animated.View` and spread `style` on it (it already includes flex: 1).
 */
export function useKeyboardInset({ bottomOffset = 0, onShown }: Options = {}) {
  const ref = useRef<View>(null);
  const inset = useRef(new Animated.Value(0)).current;
  const onShownRef = useRef(onShown);
  onShownRef.current = onShown;
  const offsetRef = useRef(bottomOffset);
  offsetRef.current = bottomOffset;

  useEffect(() => {
    const ios = Platform.OS === "ios";

    const animateTo = (toValue: number, duration: number) =>
      Animated.timing(inset, { toValue, duration, useNativeDriver: false }).start();

    const handleShow = (event: KeyboardEvent) => {
      const { height, screenY } = event.endCoordinates;
      const duration = event.duration || 150;
      const fromHeight = Math.max(0, height - offsetRef.current);

      const apply = (overlap: number) => {
        animateTo(Math.max(fromHeight, overlap), duration);
        if (height > 0) setTimeout(() => onShownRef.current?.(), duration + 30);
      };

      if (!ref.current) return apply(0);
      ref.current.measureInWindow((_x, y, _width, h) => {
        const measured = Number.isFinite(y + h) ? Math.max(0, y + h - screenY) : 0;
        apply(measured);
      });
    };
    const handleHide = (event?: KeyboardEvent) => animateTo(0, event?.duration || 150);

    const subscriptions = [
      Keyboard.addListener(ios ? "keyboardWillChangeFrame" : "keyboardDidShow", handleShow),
      Keyboard.addListener(ios ? "keyboardWillHide" : "keyboardDidHide", handleHide),
    ];
    return () => subscriptions.forEach((s) => s.remove());
  }, [inset]);

  return { ref, style: { flex: 1, paddingBottom: inset } };
}
