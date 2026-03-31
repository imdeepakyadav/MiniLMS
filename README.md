# MiniLMS

A production-ready Mini Learning Management System built with
React Native Expo.

## Tech Stack

- React Native Expo (SDK [version])
- TypeScript (strict mode)
- Expo Router (file-based navigation)
- React Native StyleSheet (custom theme system)
- Expo SecureStore + AsyncStorage
- Axios (with interceptors + manual retry logic)
- expo-notifications
- react-native-webview

## Setup Instructions

1. Clone the repository
2. Run `npm install`
3. Run `npx expo start`
4. Scan QR code with Expo Go (Android/iOS)

For development build:
npx expo run:android
npx expo run:ios

## Key Architectural Decisions

- Feature-based folder structure (not type-based) for scalability
- React Context + useReducer for state (no third-party library needed
  at this scale — reduces bundle size and dependency risk)
- Manual axios retry logic (no axios-retry dependency — full control
  over retry behavior and error normalization)
- Centralized theme.ts (single source of truth for all design tokens —
  colors, spacing, typography, radius)
- WebView bidirectional communication via postMessage/injectJavaScript
  (native sends course data to HTML, HTML sends completion events back
  to native)
- WebView transport metadata also uses headers, then injectJavaScript
  mirrors them into DOM state because react-native-webview does not
  expose request headers directly to page scripts
- SecureStore used only for auth token; all other persistence uses
  AsyncStorage (principle of least privilege for sensitive data)

## Known Limitations

- Course data is mocked by combining randomproducts + randomusers APIs
  (no real LMS backend)
- Notifications require a physical device (not available in Expo Go
  simulator on iOS)
- Profile picture is stored as local URI (not uploaded to server)

## Screenshots

[Add screenshots here]

## APK Build

Run: `eas build --platform android --profile preview`
Requires EAS CLI: `npm install -g eas-cli`
