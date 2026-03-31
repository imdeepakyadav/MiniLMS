# Instructions

MiniLMS is intended to be reviewed as a complete mobile learning product. This document explains how to use the app and what to check during evaluation.

## How to Use the App

1. Open the app and complete the authentication flow.
2. Browse courses from the Home tab.
3. Search for a course using the search bar.
4. Open a course to view its detail page.
5. Launch the lesson viewer to complete lessons in the WebView.
6. Return to the Home and Analytics tabs to see updated progress and streak data.
7. Open Profile to switch themes or enable biometric login when available.

## What the App Demonstrates

- Secure token handling with auto-login and refresh-token recovery.
- Local progress tracking across course detail, WebView, home, and analytics.
- Daily streak tracking and badge unlocking.
- Offline awareness and notification-driven engagement.
- A complete theme system with dark and light modes.

## Evaluation Checklist

When reviewing the project, verify the following:

- Login and register flows work.
- Auth persists after app restart.
- Bookmarks survive a restart.
- Lesson completion updates the course progress UI.
- The analytics dashboard reflects recent activity.
- Biometric login appears only on supported devices.
- Notifications are handled gracefully if permissions are denied.

## Mobile Notes

- Use a physical device for biometrics and local notifications.
- Some features are visible in Expo Go, but the most complete experience comes from a development build.
- The app is portrait-first and optimized for phone-sized screens.

## Support

If you extend the project, keep the feature-based structure intact and update the README and setup notes alongside any new screens or services.
