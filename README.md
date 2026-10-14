# Movie Night

Movie Night is an Expo SDK 57 React Native app that displays episodes from season one of The IT Crowd. It loads episode data from the OMDb API and shows each episode's title, number, release date, IMDb rating, and IMDb ID.

## Requirements

- Node.js 22.13 or newer and npm
- An Android emulator, iOS simulator on macOS, or a device with Expo Go

## Run locally

```sh
npm ci
npm start
```

Scan Expo's QR code to open the app on a device, or run `npm run ios` or `npm run android` for a simulator. See the [Expo environment setup guide](https://docs.expo.dev/get-started/set-up-your-environment/) if needed. Generated `ios/` and `android/` directories are ignored by Git.

## Project layout

| Path | Purpose |
| --- | --- |
| `App.tsx` | Root navigator and screen registration |
| `src/services/movie-service.ts` | OMDb season and episode requests |
| `src/components/home-screen.tsx` | Episode feed, data loading, and layout switch |
| `src/components/movie-card.tsx` | Episode card UI |
| `src/components/episode.tsx` | Episode details screen |
| `index.ts` | Registers the root component with Expo |
| `app.json` | Expo app identity and configuration |
| `__tests__/` | Episode feed and service tests |

Add feature modules under `src/`, component tests in `__tests__/` or alongside their code, and images under `assets/`.

## Checks

```sh
npm run typecheck
npm test
npm run test:coverage
```

TypeScript uses strict checking. Jest with React Native Testing Library covers the episode feed and mocked OMDb requests. Coverage must meet the 100% threshold in `.coverage-thresholds.json`; keep Jest's `collectCoverageFrom` in `package.json` aligned when application code is added outside `App.tsx` and `src/`.
