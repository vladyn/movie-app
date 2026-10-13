# Movie Night

Movie Night is an Expo SDK 57 React Native app that presents a scrolling feed of three fictional films. Each card shows a local poster, title, and description. The feed starts at a random film and appends another cycle of the same three films when you reach the end. Movie listings are local mock data; there is no catalog API or account system.

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
| `App.tsx` | Movie feed, poster cards, responsive sizing, and load-more behavior |
| `src/data/movies.ts` | Three fictional movie titles, descriptions, and poster references |
| `assets/movies/` | Local movie poster images |
| `index.ts` | Registers the root component with Expo |
| `app.json` | Expo app identity and configuration |
| `__tests__/App.test.tsx` | Movie feed component tests |
| `AGENTS.md`, `.metaswarm/` | Contributor and Metaswarm guidance |

Add feature modules under `src/`, component tests in `__tests__/` or alongside their code, and images under `assets/`.

## Checks

```sh
npm run typecheck
npm test
npm run test:coverage
```

TypeScript uses strict checking. Jest with React Native Testing Library covers visible feed behavior, random starting position, poster sizing, and repeated loading. Coverage must meet the 100% threshold in `.coverage-thresholds.json`; keep Jest's `collectCoverageFrom` in `package.json` aligned when application code is added outside `App.tsx` and `src/`.

## Metaswarm workflow

This repository includes a Metaswarm project profile and contributor instructions in `AGENTS.md`. Follow those instructions when planning and reviewing changes, and keep this README current as the app grows.
