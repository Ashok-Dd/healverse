# HealVerse mobile: server changes to handle, and building + releasing the APK

Reference for the app (`healverse-client`). Written 2026-11-15 against server PR #4 and later (production-ready server).
"Verified" means I read it in this repo; items marked **check** are things to confirm while doing the work.

---

## Implementation status (branch `feat/release-setup`, committed locally, not pushed)

**Verified** = I ran it and saw the result. **Not run** = needs you, a device, or an account.

| # | Done | Verified how |
|---|---|---|
| A1 | `constants/api.ts` reads `EXPO_PUBLIC_API_URL` (dev fallback `http://10.0.2.2:8080`); release builds throw if it is missing or a private/LAN host. `set-ip.js` now writes git-ignored `.env.local` (`npm run set-ip`). `.env` was tracked in git: untracked and ignored. | Verified: `expo export` production bundle contains `51.20.149.43` and no `192.168`. |
| A2 | `checkAuth` clears the token only on 401/403. Otherwise it keeps the token and root layout shows "Can't reach the server" with Try again. | Verified: tsc. Not run: on device. |
| A3 | `fetchApi`: global 401 handler (registered by `authStore`) clears token and goes to login; 60 s default timeout for AI endpoints; friendly 429/502/5xx/timeout/offline messages; react-query never retries 429/502. `ApiError` is now exported. | Verified: tsc. Not run: on device. |
| A4 | Voice hidden (no `VoiceModel`, mic button off). Hook handles 410. Files kept for later. | Verified: tsc, bundle. |
| A5 | Food photo is resized to 1024 px JPEG (quality 0.7) with `expo-image-manipulator` before upload. | Verified: tsc, bundle. Not run: upload against server. |
| A6 | Login shows the server message; button disabled for 30 s after a 429. | Verified: tsc. Not run: on device. |
| B7 | Identity `HealVerse` / `healverse` / `healverse` / `com.bytehealers.healverse`. `expo prebuild --platform android --clean` run; diff reviewed: only expected changes (package folder, app name, scheme, icons), no custom native edits were lost. | Verified: diff reviewed. Not run: Gradle build. |
| B8 | Permissions blocked via `android.blockedPermissions` (calendar, SYSTEM_ALERT_WINDOW, external storage, BOOT_COMPLETED, RECORD_AUDIO, MODIFY_AUDIO_SETTINGS). Speech-recognition and expo-audio plugins removed. | Verified: generated manifest shows `tools:node="remove"`. Not run: merged manifest of a real build. |
| B9 | `plugins/withReleaseAndroid.js` adds `network_security_config.xml` (cleartext only for `51.20.149.43`, TODO to switch to HTTPS) and survives future prebuilds. | Verified: generated XML + manifest attribute. Not run: on device. |
| B10 | Firebase: see manual steps. File was not read. | n/a |
| C11 | `eas.json` `preview` = APK, `environment: preview`, `EXPO_PUBLIC_API_URL`. `production` has no URL on purpose (build fails until an HTTPS URL is set). | Verified: file. Not run: eas build. |
| C12 | `scripts/eas-pre-install.js` (npm hook `eas-build-pre-install`) copies `$GOOGLE_SERVICES_JSON` to `android/app/`. | Verified: `eas env:set --help` lists `--type file`. **Not verified:** exact file-variable path behaviour on the build runner (docs say the variable holds a path). |
| C13 | `.github/workflows/android.yml`: tags `v*` + manual; tag must equal `app.json` version; typecheck (blocks), lint (does not block, see below); `eas-cli@27.10.0 build`; APK downloaded; `gh release create`. Actions pinned to SHAs from `git ls-remote`: checkout v7.0.1, setup-node v7.1.0, upload-artifact v7.0.2. Release created with `gh` (no third-party action). | Verified: SHAs resolved. **Not run:** actionlint (Docker daemon not running), the workflow itself. **Not verified:** `eas build --json` output field `.[0].artifacts.buildUrl` (docs do not show it). |
| Cleanup | Deleted 11 unreferenced images, 13 unreferenced components/files, `LOGOUT_IMPLEMENTATION.md`, broken `reset-project` script. Removed 22 unused npm deps. Kept `@shopify/flash-list` (peer of `react-native-ruler-picker`; bundle failed without it). | Verified: tsc + production bundle. |
| Size | Images 59 MB to about 1.2 MB (900 px max, 256-colour PNG). R8 minify + resource shrink on, `x86`/`x86_64` ABIs dropped. Bundle is Hermes bytecode, 6 MB. | Not run: real APK size. R8 can break reflection-based libraries: test the release APK. |
| Icons | `app.json` points to `icon.png`, `adaptive-icon.png`, `splash-icon.png`. Placeholders until final art is supplied. | Not run. |

**Progress since the table above (2026-11-15):**
- Dev client build on EAS **succeeded** after replacing `google-services.json` with the new package's file.
- Dev client could not reach Metro (CLEARTEXT error): a network security config disables the debug cleartext allowance. Fixed in commit `3dc3262` with a debug-only permissive config; **needs one more dev build** (or use `npx expo start --dev-client --tunnel -c` meanwhile).
- Icons: transparent mark cut from the ChatGPT sheet; `icon`, `adaptive-icon`, `adaptive-icon-monochrome`, `splash-icon`, `logo`, `favicon` generated and wired (commit d3ec7ee). Background colour `#0B8714`.
- Open items: HTTPS URL in `eas.json` (security review flagged the HTTP exception), `preview` file variable, EXPO_TOKEN secret, first preview build, device testing of everything marked "Not run", 12 pre-existing lint errors, `eas-cli` upgrade on your PC.

**Pre-existing, not fixed:** `npm run lint` reports 12 errors (react/no-unescaped-entities in onboarding and other files) and about 46 warnings. Fixed on 2026-11-18: lint is clean and the CI lint step now blocks.

**Manual steps for you** are listed at the end of the assistant summary and repeated in section 6.

---

## 0. Do these before the first release build (short list)

| # | What | Why |
|---|---|---|
| 1 | Point the app at the real server through an env variable, not the LAN IP in `constants/api.ts` | The release build must not contain `192.168.x.x`. Live server: `http://51.20.149.43` (port 80, no `:8080`). |
| 2 | Allow HTTP for that server, **or** get a domain + HTTPS first (recommended) | Android only allows plain HTTP in **debug** builds (`android/app/src/debug/AndroidManifest.xml` sets `usesCleartextTraffic`). A release APK calling `http://` fails with "Network request failed". See section 4. |
| 3 | Decide the final **package name** now (`com.anonymous.RN` is the template placeholder) |npx expo start --dev-client --tunnel -c
 It identifies the app forever (updates, Play Store, Firebase). Changing it later = a different app. See section 3. |
| 4 | Hide or handle the **voice assistant** (server now returns 410) | `components/chat/ChatScreen.tsx` renders `<VoiceModel/>`. See section 2, item 4. |
| 5 | Stop `checkAuth` logging users out on any hiccup | `store/authStore.ts`: every failure clears the token. See section 2, item 2. |
| 6 | Create a **release signing key** (or let EAS manage it) | The Android release build is currently signed with the debug keystore. See section 5. |

---

## 1. Server facts

- **Base URL:** `http://51.20.149.43` today. HTTPS + domain is still to do; when it lands, only the base URL changes.
- **Auth:** `Authorization: Bearer <jwt>`. Token lifetime is **7 days**, there is **no refresh endpoint**, and `/auth/check-auth`
  returns the *same* token (it does not extend it). After 7 days the user must log in again.
- **Every response** uses `{ "success": boolean, "message": string, "data": ... }`, including errors
  (`success:false`, `data:null`). `lib/fetchApi.ts` already expects this.
- **Unchanged:** all paths (`/api/<feature>`, `/auth/*`), JSON field names, enum values, date formats.
- **Gone in production:** Swagger UI and `/v3/api-docs`. Public health probes: `/actuator/health/liveness` and `/actuator/health/readiness`
  (readiness 200 = server and database are up).

---

## 2. What changed on the server that the app must watch

### 1. Real HTTP status codes (was: almost everything was 400)

| Status | Meaning now | Typical `message` |
|---|---|---|
| 400 | Invalid input | `field: reason; field: reason` (all invalid fields in one string), `Malformed request body`, `Invalid value for 'date'`, `Missing required parameter 'x'`, `Unsupported image type. Use JPEG, PNG or WebP.` |
| 401 | Missing/expired/invalid token, or wrong login | `Authentication required to access this resource`, `Invalid credentials` |
| 403 | Not allowed | `Access denied` |
| 404 | Not found **or belongs to another user** | `Food log not found`, `Diet plan not found`, ... |
| 409 | Conflict | duplicate username/email, `Request conflicts with existing data` |
| 410 | Feature switched off | voice assistant (item 4) |
| 429 | Too many login attempts | message in body |
| 502 | The AI provider failed or is rate limited | `The AI service could not ... Please try again.` |
| 500 | Unexpected server error | `Internal server error` |

Also: messages no longer contain raw exception text, so don't parse them; branch on the **status code**.

What this means in the app (verified): `lib/fetchApi.ts` throws `ApiError(message, status)` and shows `message` as a toast, which now
reads well. `lib/react-query-client.ts` already skips retries on 401/403/404 and retries other errors once. Check the places that assumed
"any failure = 400": `store/dietPlan.ts:143` and `services/api.ts:34` already special-case 404, which is now a *real* 404.

### 2. Sessions and 401

- Verified: there is **no global 401 handler**. `checkAuth()` in `store/authStore.ts` calls `/auth/check-auth` at launch and, on **any** error
  (timeout, offline, 502, 429, 401), deletes the token and logs the user out. A brief server hiccup or a Neon cold start would log everyone out.
  **Change:** clear the token only for 401/403; for network errors or 5xx keep the token and show "can't reach server, retry".
- Add one global rule: if any authenticated call returns **401**, clear the token and go to login (covers the 7-day expiry mid-session).
- **Login throttle:** 5 failed logins per client address + username per 15 minutes, then **429**. Show the server `message` and keep the
  button disabled for a while instead of letting the user keep tapping.

### 3. Registration and profile

Payload is validated (`{ user: {username, password, ...}, profile: {...} }`). Bad input gives 400 with the field list; a taken username
gives 409. Show those messages on the form.

### 4. Voice assistant: switched off (410)

All `/api/voice-chat/**` endpoints return **410 Gone** (`The voice assistant is currently unavailable`) while the server flag
`app.voice.enabled=false`. Reason: Groq text-to-speech is preview, WAV-only and limited to 200 characters, while the app plays MP3.
Verified: `hooks/useVoiceAssistant.tsx` uses raw `fetch` (not `fetchApi`) and throws a generic `HTTP error! status: 410`.
**Do:** hide the voice button/modal (`<VoiceModel/>` in `ChatScreen.tsx`) for now, or catch 410 and show "Voice is coming soon".
Text chat (`/api/conversations/...`) works normally. If voice returns later it will need WAV playback and short chunks.

### 5. AI calls are slower and can fail on rate limits

The server now uses Groq (`gpt-oss-120b` for text, `qwen/qwen3.8-27b` for food photos).

- Typical latency 5-20 s per AI call (diet plan generation the longest). `fetchApi` defaults to **30 s**, which can be tight:
  pass `timeout: 60000` for `/api/diet-plans/generate*`, `/api/food-logs/log/*` and chat messages. Show a progress state, not a frozen button.
- Groq's free tier is limited (~8,000 tokens/min). Several users at once produce **502** "try again". Show a friendly retry message and
  **do not auto-retry in a loop**.
- The AI is a different model: chat replies and meal wording will look different from before. Re-check any UI that assumed a format.

### 6. Food photo upload (`POST /api/food-logs/log/image`)

- Multipart parts: `image` (file) and `mealType` (`BREAKFAST|LUNCH|DINNER|SNACK`). Max request size 10 MB.
- Accepted types: **JPEG, PNG, WebP** only (else 400). Verified: `app/(root)/calorie-counter/[type]/index.tsx` hardcodes
  `name: "meal.jpg"`, `type: "image/jpeg"` even if the picker returns a PNG/HEIC file. **Do:** use the asset's real `mimeType`,
  or better, convert/resize to JPEG first (`expo-image-manipulator`, about 1024 px wide, quality 0.7): faster upload, fewer AI tokens, no HEIC problems.
- **`imageUrl` is now always `null`**: the server analyses the photo but does not store it. Verified: `FoodLogCard.tsx` only renders the image when
  `imageUrl` exists, so nothing breaks, but there will be no thumbnail. If you want one, keep the local file URI in app state.
- The extra `loggedAt` field the app appends is ignored for photo logs (the server stamps the time).

### 7. Small things

- Deleting a missing/foreign water, exercise or food log returns **404 with the standard body** (water used to return an empty 404).
- Regenerating a diet plan or meal you don't own returns 404.
- CORS is irrelevant for native builds.

---

## 3. App changes checklist

- [x] **API URL from env.** `constants/api.ts` currently holds `http://192.168.29.197:8080`, rewritten by `set-ip.js` every time it runs. **DONE** (commit 1bcaa44).
  Change it to `export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.x.x:8080"` (dev fallback) and set
  `EXPO_PUBLIC_API_URL` per build profile (section 5). Expo bakes `EXPO_PUBLIC_*` values into the JS bundle **at build time**.
  Keep `set-ip.js` for local dev only; never run it before a release build.
- [x] **App identity** (`app.json`): `name: "R-N"`, `slug: "R-N"`, `scheme: "rn"`, `package: "com.anonymous.RN"` are placeholders. **DONE**: `com.bytehealers.healverse`, HealVerse, scheme `healverse`; android/ regenerated by prebuild. EAS project re-created for the new slug.
  Pick real values (for example `HealVerse`, `healverse`, `com.bytehealers.healverse`).
  The Android project is **committed** (`android/`), so `app.json` changes to the package do **not** apply by themselves: either run
  `npx expo prebuild --clean` and commit the result, or edit `namespace`/`applicationId` in `android/app/build.gradle`, the
  `MainActivity`/`MainApplication` package folders and `AndroidManifest.xml`.
- [x] **Firebase.** `google-services.json` is **not in git** (git-ignored) but the build needs it in `android/app/`. It is tied to the package **DONE** for dev builds: new `google-services.json` for the new package is in place locally; EAS file variable `GOOGLE_SERVICES_JSON` set for `development`. **TODO:** set it for `preview` too.
  name: when you change the package, add a new Android app in the Firebase console and download a new file. CI gets the file from a secret (section 5).
  Notifications use it; if you are not using push yet, you can still keep the file so the build succeeds.
- [x] **Permissions.** `android/app/src/main/AndroidManifest.xml` still asks for `READ_CALENDAR`, `WRITE_CALENDAR`, `SYSTEM_ALERT_WINDOW`, **DONE** via `blockedPermissions` in app.json.
  `READ/WRITE_EXTERNAL_STORAGE`, `RECEIVE_BOOT_COMPLETED`, `RECORD_AUDIO` (leftovers from the removed medication module and the voice screen).
  Remove what the app does not use; fewer permissions means a cleaner Play Store review and fewer scary install prompts.
  (`expo-speech-recognition` and `expo-audio` in `app.json` add the audio permissions: drop them while voice is off.)
- [x] **Version.** Currently `1.0.0` / versionCode `1`. Each release needs a higher versionCode (CI sets it, section 5). Still `1.0.0`; EAS remote versioning handles versionCode. Bump `app.json` version per release.
- [x] **Voice** hidden or 410-aware (section 2, item 4). **checkAuth** and **401** handling (item 2). **Timeouts** (item 5). **Photo upload** (item 6). **DONE**. Not yet device-tested.

---

## 4. HTTP vs HTTPS (read before building)

A release build cannot use `http://` unless you allow it. Two ways:

1. **Recommended: HTTPS first.** Get a domain, put Caddy (automatic certificates) or an ALB in front of the EC2 instance, set
   `EXPO_PUBLIC_API_URL=https://api.yourdomain.com`. Nothing else changes in the app.
2. **Temporary, for internal testers only:** allow cleartext. Add the `expo-build-properties` plugin
   (`["expo-build-properties", { "android": { "usesCleartextTraffic": true } }]`) or add `android:usesCleartextTraffic="true"` to the
   `<application>` tag of the main manifest. Be aware: logins, JWTs and health data then travel **unencrypted**. Fine for a closed test with
   fake data, not for real users. A tighter option is a `network_security_config.xml` that allows cleartext for the server IP only.

---

## 5. Building the APK

The project is a **bare-style** Expo project (the `android/` folder is committed) on Expo SDK 53 / React Native 0.79, with an EAS project already
set up (`app.json` has `extra.eas.projectId`, and `eas.json` has `development`, `preview`, `production` profiles).
Today's signing state: the release build type uses the **debug keystore** (`android/app/build.gradle`), so it must not be shared as a real release.

### Option A: EAS Build, triggered from GitHub Actions (simplest start)

- Expo's cloud builds the app and **manages the signing key** for you (created on the first build and stored with your Expo account).
- Cost: Expo's free plan has a limited number of builds per month and queue waits: check expo.dev/pricing.
- One-time setup:
  1. In `eas.json` make the `preview` profile an APK and set the API URL:
     ```json
     "preview": {
       "distribution": "internal",
       "android": { "buildType": "apk" },
       "env": { "EXPO_PUBLIC_API_URL": "http://51.20.149.43" }
     }
     ```
  2. First build by hand (creates the keystore): `npm i -g eas-cli && eas login && eas build -p android --profile preview`.
  3. Firebase file: `eas secret:create` is deprecated. Use: `eas env:set preview --name GOOGLE_SERVICES_JSON --type file --visibility secret --value ./google-services.json --scope project --non-interactive`
     (done in the repo: `scripts/eas-pre-install.js` copies it to `android/app/google-services.json`).
  4. Create an Expo access token (expo.dev -> Account settings -> Access tokens) and save it as the GitHub secret `EXPO_TOKEN`.
- Workflow: see `.github/workflows/android.yml` (written, **not yet run**; replaces the old starter that used unpinned actions).

### Option B: build with Gradle inside GitHub Actions (free, no Expo account needed)

- Works because `android/` is committed. About 10-15 minutes per build on a GitHub runner. You own and store the signing key.
- One-time setup:
  1. Create a release keystore **once** and back it up somewhere safe (password manager plus an offline copy). **If it is lost, installed
     apps can never be updated**:
     `keytool -genkeypair -v -storetype PKCS12 -keystore healverse-release.keystore -alias healverse -keyalg RSA -keysize 2048 -validity 10000`
  2. Edit `android/app/build.gradle`: add `signingConfigs.release` reading Gradle properties (`RELEASE_STORE_FILE`, `RELEASE_STORE_PASSWORD`,
     `RELEASE_KEY_ALIAS`, `RELEASE_KEY_PASSWORD`), point the `release` build type at it instead of `signingConfigs.debug`, and read
     `versionCode`/`versionName` from `-PVERSION_CODE` / `-PVERSION_NAME`.
  3. Make sure `android/gradlew` is **executable in git** (`git update-index --chmod=+x android/gradlew`). This is the same "Permission denied"
     problem the server's `mvnw` had.
  4. GitHub secrets: `ANDROID_KEYSTORE_BASE64` (`base64 -w0 healverse-release.keystore`), `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`,
     `ANDROID_KEY_PASSWORD`, `GOOGLE_SERVICES_JSON_BASE64`.
- Workflow starter (**not yet run**): same trigger and release step as Option A, with these build steps:
  ```yaml
  - uses: actions/setup-node@v4
    with: { node-version: 20, cache: npm }
  - uses: actions/setup-java@v4
    with: { distribution: temurin, java-version: "17" }
  - run: npm ci
  - name: Firebase config and signing key
    run: |
      echo "${{ secrets.GOOGLE_SERVICES_JSON_BASE64 }}" | base64 -d > android/app/google-services.json
      echo "${{ secrets.ANDROID_KEYSTORE_BASE64 }}" | base64 -d > android/app/release.keystore
  - name: Build the release APK
    working-directory: android
    env:
      EXPO_PUBLIC_API_URL: https://api.yourdomain.com
    run: >
      ./gradlew assembleRelease
      -PRELEASE_STORE_FILE=release.keystore
      -PRELEASE_STORE_PASSWORD=${{ secrets.ANDROID_KEYSTORE_PASSWORD }}
      -PRELEASE_KEY_ALIAS=${{ secrets.ANDROID_KEY_ALIAS }}
      -PRELEASE_KEY_PASSWORD=${{ secrets.ANDROID_KEY_PASSWORD }}
      -PVERSION_CODE=${{ github.run_number }}
      -PVERSION_NAME=${GITHUB_REF_NAME#v}
  # the APK is at android/app/build/outputs/apk/release/app-release.apk
  ```

### Which one?

| | A: EAS | B: Gradle in Actions |
|---|---|---|
| Setup effort | Low | Medium (gradle edit, keystore, secrets) |
| Cost | Free tier limited, then paid | Free |
| Build time | Queue + about 10 min | About 10-15 min |
| Signing key | Managed by Expo | You keep it (back it up!) |
| Play Store later | Easy (`production` profile gives an AAB) | Also easy (`bundleRelease`) |

Start with **A** to get a first installable APK quickly; move to **B** if you hit the build limit or want everything inside GitHub.

---

## 6. Releasing

1. Bump the version in `app.json` (`version`) and merge to `main`.
2. Release, either way (both spend one EAS build):
   - **Tag push:** `git tag v1.0.1 && git push origin v1.0.1` (push only that tag). The workflow builds the APK and attaches it to a **GitHub Release** named after the tag.
   - **Manual run** (use this if the tag push does not start the workflow, as happened with v1.0.0): Actions, "Android APK", Run workflow on `main`, tick **publish**, enter the tag (`v1.0.1`). It builds and creates the release and the tag.
   A release is refused unless the tag matches `app.json` `version` and the commit is on `main`. `versionCode` goes up on every build (`autoIncrement` in `eas.json`, EAS remote versioning), so a new APK always installs over the previous one.
   A manual run without **publish** only builds the APK and keeps it as a workflow artifact.
3. Testers open the Release page on their phone, download `healverse.apk`, and allow "Install unknown apps" for their browser when Android asks.
   If the client repo is **private**, testers must be GitHub collaborators to download release files.
4. For the **Play Store** later you need a Google Play developer account (one-time fee), an **AAB** (not APK) from the `production` profile / `bundleRelease`,
   a privacy policy (the app collects health data), and HTTPS. iOS needs a separate Apple developer account and is not covered here.

## 7. Release checklist

- [ ] `EXPO_PUBLIC_API_URL` points to the live server (HTTPS preferred); no `192.168.*` anywhere in the build **OPEN:** `eas.json` `preview` still has `http://51.20.149.43`; switch to the HTTPS URL and remove the cleartext exception in `plugins/withReleaseAndroid.js` before any release.
- [x] Package name final; matching `google-services.json` (done for dev; repeat the file variable for `preview`)
- [ ] Release is signed with the **release** key, not the debug keystore; key backed up
- [x] Voice hidden or handled; `checkAuth` no longer logs out on network errors; 401 sends the user to login (coded; needs device test)
- [x] AI request timeouts raised; friendly message on 502/429 (coded; needs device test)
- [x] Unused permissions removed
- [ ] Installed the APK on a real phone and tested: register, login, log water, log food by text and by photo, diet plan, chat, logout, login again
- [ ] Server health check OK: `curl.exe http://<server>/actuator/health/readiness` returns `{"status":"UP"}` (in PowerShell use `curl.exe`; plain `curl` is an alias and prints raw bytes)
