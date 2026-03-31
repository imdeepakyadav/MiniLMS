# Setup

This document covers local setup for the MiniLMS Expo application.

## Prerequisites

- Node.js 18 or newer.
- npm 9 or newer.
- A physical Android or iOS device for testing biometrics and notifications.
- Expo Go installed on your device for development testing.
- EAS CLI if you want to build a standalone APK or IPA.

## Install

```bash
npm install
```

## Start the App

```bash
npx expo start
```

You can then scan the QR code with Expo Go or open the app on a simulator/emulator if the feature under test is supported there.

## Platform Scripts

```bash
npm run android
npm run ios
npm run web
```

These scripts are defined in `package.json` and match the standard Expo workflow.

## Configuration Notes

- The API base URL is defined in `utils/constants.ts` as `API_BASE_URL`.
- No separate `.env` file is required for the current codebase.
- Auth tokens are stored in SecureStore, while bookmarks, progress, streak data, and theme preferences use AsyncStorage.

## Build

### Android development build

```bash
npx expo run:android
```

### iOS development build

```bash
npx expo run:ios
```

### EAS preview build

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

## Device-Specific Features

- Local notifications require a physical device.
- Biometric login only appears when the device supports enrolled biometrics.
- Profile image selection uses the native image picker and stores a local URI.

## Troubleshooting

- If the app shows stale data, clear the app storage on the device or reinstall the app.
- If Metro behaves unexpectedly, restart it with cache clearing: `npx expo start -c`.
- If a build fails on a native module, verify your Expo SDK version and reinstall dependencies.
