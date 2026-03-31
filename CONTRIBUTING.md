# Contributing

MiniLMS is organized as a small production-style Expo application. Contributions should preserve the app's current structure, TypeScript safety, and mobile-first behavior.

## Development Standards

- Keep new code TypeScript-safe and avoid introducing `any` unless there is a strong technical reason.
- Follow the existing feature-based folder structure.
- Reuse shared UI components instead of duplicating styles or patterns.
- Keep persistence decisions consistent: SecureStore for sensitive tokens, AsyncStorage for app data.
- Prefer small, readable changes over broad rewrites.

## Before You Open a Pull Request

- Run the TypeScript compiler.
- Test the affected screens on a device or emulator.
- Verify that authentication, persistence, and navigation still work after your change.
- Update documentation if the behavior, setup, or build process changes.

## Suggested PR Format

Include the following in a pull request:

- What changed.
- Why the change was needed.
- How it was tested.
- Any known limitations or follow-up work.

## Branching Guidance

- Create a short-lived branch for each task.
- Keep commits focused on a single concern.
- Avoid mixing unrelated refactors with feature work.

## Issue Reporting

If you open an issue, include:

- The screen or feature affected.
- Expected behavior.
- Actual behavior.
- Device or emulator details.
- Screenshots or a short screen recording if possible.

## Design and Code Review Notes

- Preserve the app's theme tokens and avoid hard-coded colors unless they are part of the existing design language.
- Keep analytics, streak, and notification behavior consistent with the current local-first implementation.
- If a change affects app state, ensure it survives restart or explain why it should not.
