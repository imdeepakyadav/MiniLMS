# Security Policy

MiniLMS is an academic project, but it still follows a security-first approach in how it stores data, handles authentication, and interacts with device features.

## Supported Versions

Security fixes are applied to the current `main` branch.

## Reporting a Vulnerability

If you find a security issue, please report it privately to the repository owner instead of opening a public issue. Include the following details:

- A short description of the issue.
- The affected screen, service, or feature.
- Steps to reproduce the problem.
- Any screenshots, logs, or proof of concept material.

## Security Practices in the App

- Access and refresh tokens are stored in SecureStore, not AsyncStorage.
- Non-sensitive app data such as bookmarks and course progress is stored locally on the device.
- Network requests use an Axios client with token injection and refresh-token recovery.
- The app avoids exposing raw credentials in the UI or logs.
- Biometric login is optional and only used on supported devices.

## Developer Guidance

If you contribute to the app, do not commit secrets, access tokens, or private API keys. Keep any new data handling aligned with the existing storage model and update the documentation if your change introduces a new security-relevant behavior.
