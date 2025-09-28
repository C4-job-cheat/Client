# Repository Guidelines

## Project Structure & Module Organization
- `src/` hosts the TypeScript React app: feature screens in `components/`, hooks in `hooks/`, context providers in `context/`, shared types in `types/`.
- `src/api/apiClient.ts` centralizes HTTP access; add new endpoints there and reuse exported DTOs.
- `public/` carries static assets, while `dist/` is generated output and must stay untouched.

## Build, Test, and Development Commands
- Run `npm install` after cloning to fetch dependencies.
- Use `npm run dev` for the Vite dev server with hot module replacement.
- Ship builds with `npm run build`; it runs `tsc -b` then `vite build` for type-safe bundles.
- Enforce quality via `npm run lint`; review the production bundle with `npm run preview`.

## Coding Style & Naming Conventions
- Follow the rules in `eslint.config.js`; default to 2-space indentation, strict TypeScript checks, and React function components.
- Components use PascalCase, hooks use camelCase starting with `use`, and shared helpers live in `utils/` and `constants/`.
- Lean on Tailwind utility classes; extract shared patterns with `class-variance-authority` when repetition appears.

## Testing Guidelines
- Adopt `vitest` with React Testing Library to match the Vite toolchain (tests are not yet wired).
- Place specs as `*.test.ts(x)` beside the source and mock network calls through `src/api/apiClient.ts`.
- Cover core flows (`Home`, `CoverLetter*`, `Interview*`) with smoke tests before merging.

## Commit & Pull Request Guidelines
- Use English Conventional Commit prefixes (`feat:`, `fix:`, `chore:`) with optional scope hints.
- Keep commits focused and describe behavioural changes in the body when context helps reviewers.
- PRs need a concise summary, screenshots for UI changes, linked issues, and evidence of local lint/tests.

## Security & Configuration Notes
- Keep secrets in `.env.local`; never commit credentials or Firebase keys.
- Read configuration from environment variables within `firebase.ts` and other setup files.
- Rotate keys promptly if exposed and document required env vars in `README.md` for onboarding.
