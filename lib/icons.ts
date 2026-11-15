import { Entypo, Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { cssInterop } from "nativewind";

/**
 * Lets icons take a Tailwind colour class (`<Ionicons className="text-foreground" />`), so
 * they follow the light/dark scheme without any JS colour lookups.
 * Imported once from app/_layout.tsx.
 */
for (const Icon of [Entypo, Feather, Ionicons, MaterialCommunityIcons, MaterialIcons]) {
  cssInterop(Icon, { className: { target: "style", nativeStyleToProp: { color: true } } });
}
