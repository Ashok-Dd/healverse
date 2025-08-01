// app/index.tsx
import { Redirect } from "expo-router";

export default function Index() {
  // Remove navigation logic from here - let layout.tsx handle it
  return <Redirect href={"/(root)/(tabs)/tracker"} />;
}
