// Local Expo config plugin, applied on `expo prebuild` so the settings survive android/ regeneration.
//  1. Cleartext HTTP only for the API host (network_security_config), not globally.
//  2. Release size: R8 minify + resource shrinking, and no x86/x86_64 native libraries.
const fs = require('fs');
const path = require('path');
const { withAndroidManifest, withDangerousMod, withGradleProperties } = require('expo/config-plugins');

// TODO(https): remove this host entry (and the whole cleartext rule) once the API is served over HTTPS.
const CLEARTEXT_HOST = '51.20.149.43';

const NETWORK_SECURITY_CONFIG = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <!-- Everything is HTTPS-only by default. -->
    <base-config cleartextTrafficPermitted="false" />
    <!-- TODO(https): temporary plain-HTTP exception for the current API server only. -->
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="false">${CLEARTEXT_HOST}</domain>
    </domain-config>
</network-security-config>
`;

const withNetworkSecurityConfig = (config) => {
  config = withDangerousMod(config, [
    'android',
    async (cfg) => {
      const dir = path.join(cfg.modRequest.platformProjectRoot, 'app/src/main/res/xml');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'network_security_config.xml'), NETWORK_SECURITY_CONFIG);
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
