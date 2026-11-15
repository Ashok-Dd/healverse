// Runs on the EAS build server before `npm install` (npm hook "eas-build-pre-install").
// android/ is committed, so `expo prebuild` does not run on EAS and nothing would place
// google-services.json for the Gradle google-services plugin. The file is stored as an EAS
// FILE environment variable (GOOGLE_SERVICES_JSON = path to the file on the build runner).
const fs = require('fs');
const path = require('path');

const source = process.env.GOOGLE_SERVICES_JSON;
const target = path.join(__dirname, '..', 'android', 'app', 'google-services.json');

if (source && fs.existsSync(source)) {
  fs.copyFileSync(source, target);
  console.log('google-services.json copied to android/app/');
} else if (fs.existsSync(target)) {
  console.log('GOOGLE_SERVICES_JSON not set; using existing android/app/google-services.json');
} else {
  console.error('GOOGLE_SERVICES_JSON is not set and android/app/google-services.json is missing.');
  process.exit(1);
}
