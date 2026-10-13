# Service Inventory

> Updated by the orchestrator after each work unit commit.
> Coder agents MUST read this before implementing to avoid duplicating existing services.

## Services

| Service | File | Responsibility | Key Methods |
|---------|------|---------------|-------------|
| _None yet_ | — | — | — |

## Factories

| Factory | File | Creates | Used By |
|---------|------|---------|---------|
| _None yet_ | — | — | — |

## Database Tables

| Table | Schema File | Query Layer | Service |
|-------|------------|-------------|---------|
| _None yet_ | — | — | — |

## Shared Modules

| Module | File | Exports | Used By |
|--------|------|---------|---------|
| Movie data | `src/data/movies.ts` | `Movie` type and `movies` array with local poster sources | `App.tsx` |

## Established Patterns

- Expo managed workflow with `App.tsx` as the root screen and `index.ts` as the entry point.
- The movie feed starts at a random item, renders three local mock movies, and appends another cycle when the user reaches the end.
- Posters are local images in `assets/movies/`; no remote catalog service is configured.
- Jest component tests live in `__tests__/`.
