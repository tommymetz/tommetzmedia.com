# AI Agent Instructions for Tom Metz Media LLC

This document provides guidelines and conventions for AI coding agents working on the Tom Metz Media LLC website.

## Project Overview

This is a React + TypeScript + Vite project for Tom Metz Media LLC's website. The project uses modern web technologies and follows specific conventions to maintain code consistency.

## Tech Stack

- **Frontend Framework:** React 19.2.3
- **Language:** TypeScript 5.9.3
- **Build Tool:** Vite 7.3.0
- **Testing:** Vitest 4.0.16 with React Testing Library
- **Linting:** ESLint 9.39.2
- **3D Graphics:** Three.js with React Three Fiber
- **CMS:** Prismic
- **Node Version:** ^20.19.0 || >=22.12.0

## Component Structure

When creating a new component, follow this structure:

1. Create a directory for the component in `src/components/` using **kebab-case**
2. Include these files with **PascalCase** names matching the component:
   - `ComponentName.tsx` - The main component file
   - `ComponentName.css` - Component styles
   - `ComponentName.test.tsx` - Component tests
   - `index.ts` - Export file for the component
3. **Always** export the component from `index.ts` in the component directory
4. **Always** add the export to `/src/components/index.ts`

### Example Structure

For a component named "MyComponent":

```
src/components/my-component/        ← kebab-case directory
  ├── MyComponent.tsx               ← PascalCase files
  ├── MyComponent.css
  ├── MyComponent.test.tsx
  └── index.ts                      ← exports the component
```

The `index.ts` file should export the component:
```typescript
export * from './MyComponent'
```

And update `/src/components/index.ts` to include:
```typescript
export * from './my-component'      ← kebab-case directory name
```

## Code Conventions

### Text Components

**All text content must be wrapped in the `Text` component.** Do not use plain HTML text elements like `<p>`, `<h1>`, `<h2>`, etc. directly.

Example:
```tsx
import { Text } from '../components'

// Good ✓
<Text level="h1">My Heading</Text>
<Text level="body">My paragraph</Text>

// Bad ✗
<h1>My Heading</h1>
<p>My paragraph</p>
```

### TypeScript

- Use explicit types for component props
- Define prop types using TypeScript `type` or `interface`
- Leverage type inference where appropriate
- All component props should have defined types

### Testing

- Write tests for all components using Vitest and React Testing Library
- Use descriptive test names that explain what is being tested
- Test user interactions and component behavior
- Follow existing test patterns in the codebase

## Build & Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production (runs TypeScript compiler + Vite build)
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest
- `npm run preview` - Preview production build

## Important Notes

- The project uses Vite, so ensure any configuration changes are compatible with Vite
- Three.js components require special handling with React Three Fiber
- The Prismic service is used for content management - see `src/services/prismic/`
- All tests should pass before committing changes
- Always run `npm run lint` before committing to ensure code quality