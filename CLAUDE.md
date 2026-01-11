# CLAUDE.md - Development Guidelines

## Pre-Commit Requirements

Before creating any commit, the following checks MUST pass:

1. **Build**: Run `npm run build` - must complete without errors
2. **Tests**: Run `npm test` (if tests exist) - all tests must pass
3. **App Loads**: Verify the app loads correctly by running `npm run preview` and checking for console errors

## Commit Checklist

- [ ] `npm run build` succeeds
- [ ] No TypeScript/compilation errors
- [ ] App renders without runtime errors
- [ ] Core functionality works (weather loads, UI displays)

## Project Structure

- `/src/components/` - SolidJS UI components
- `/src/services/` - API and storage services
- `/src/store/` - State management
- `/src/types/` - TypeScript interfaces

## Key Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## GitHub Pages Deployment

This app deploys to GitHub Pages at `/kittie-weather/` subdirectory. The `base` path in `vite.config.ts` must remain set to `/kittie-weather/`.
