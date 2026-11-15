// Local Expo config plugin, applied on `expo prebuild` so the settings survive android/ regeneration.
//  1. Release builds are HTTPS-only (network_security_config); debug builds allow cleartext for Metro.
//  2. Release size: R8 minify + resource shrinking, and no x86/x86_64 native libraries.
const fs = require('fs');
const path = require('path');
const { withAndroidManifest, withDangerousMod, withGradleProperties } = require('expo/config-plugins');

const NETWORK_SECURITY_CONFIG = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <!-- No plain-HTTP traffic in release builds. -->
    <base-config cleartextTrafficPermitted="false" />
</network-security-config>
`;

// Debug builds (dev client) must load the JS bundle from Metro over plain HTTP on the LAN,
// so the debug source set overrides the strict config with a permissive one. Never shipped in release.
const DEBUG_NETWORK_SECURITY_CONFIG = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true" />
</network-security-config>
`;

const withNetworkSecurityConfig = (config) => {
  config = withDangerousMod(config, [
    'android',
    async (cfg) => {
      const dir = path.join(cfg.modRequest.platformProjectRoot, 'app/src/main/res/xml');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'network_security_config.xml'), NETWORK_SECURITY_CONFIG);
      const debugDir = path.join(cfg.modRequest.platformProjectRoot, 'app/src/debug/res/xml');
      fs.mkdirSync(debugDir, { recursive: true });
      fs.writeFileSync(path.join(debugDir, 'network_security_config.xml'), DEBUG_NETWORK_SECURITY_CONFIG);
      return cfg;
    },
  ]);
  return withAndroidManifest(config, (cfg) => {
    const app = cfg.modResults.manifest.application[0];
    app.$['android:networkSecurityConfig'] = '@xml/network_security_config';
    return cfg;
  });
};

const setProp = (props, key, value) => {
  const existing = props.find((p) => p.type === 'property' && p.key === key);
  if (existing) existing.value = value;
  else props.push({ type: 'property', key, value });
};

const withReleaseSize = (config) =>
  withGradleProperties(config, (cfg) => {
    setProp(cfg.modResults, 'android.enableProguardInReleaseBuilds', 'true');
    setProp(cfg.modResults, 'android.enableShrinkResourcesInReleaseBuilds', 'true');
    setProp(cfg.modResults, 'reactNativeArchitectures', 'armeabi-v7a,arm64-v8a');
    return cfg;
  });

module.exports = (config) => withReleaseSize(withNetworkSecurityConfig(config));
