// Backend base URL, baked into the JS bundle at build time (EXPO_PUBLIC_* is inlined by Expo).
// - Release builds: set EXPO_PUBLIC_API_URL per EAS profile in eas.json.
// - Local dev: `npm run set-ip` writes your LAN IP to .env.local (git-ignored); otherwise the fallback below is used.
// TODO(https): the live server is plain HTTP for now (see android network_security_config). Switch to an https:// URL once a domain exists.
const DEV_FALLBACK_URL = "http://10.0.2.2:8080"; // Android emulator -> host machine

const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/+$/, "");

if (!__DEV__) {
  const isPrivateHost = /^https?:\/\/(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(envUrl ?? "");
  if (!envUrl || isPrivateHost) {
    // Fail fast rather than shipping an app that points at a LAN address.
    throw new Error("EXPO_PUBLIC_API_URL must be set to the public server URL for release builds.");
  }
}

export const API_URL: string = envUrl || DEV_FALLBACK_URL;
