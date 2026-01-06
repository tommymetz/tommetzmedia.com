# Tom Metz Media LLC

The official website for Tom Metz Media LLC, showcasing services in music production, audio engineering, software development, and creative media.

## About

This is a modern, interactive web application built with React, TypeScript, and Three.js, featuring a dynamic 3D background and content managed through Prismic CMS. The website presents Tom Metz's portfolio, services, and contact information in an engaging, visually appealing format.

## Tech Stack

- **Frontend Framework:** React 19.2.3
- **Language:** TypeScript 5.9.3
- **Build Tool:** Vite 7.3.0
- **3D Graphics:** Three.js with React Three Fiber
- **CMS:** Prismic
- **Testing:** Vitest 4.0.16 with React Testing Library
- **Linting:** ESLint 9.39.2

## Prerequisites

- **Node.js:** Version ^20.19.0 or >=22.12.0 (see `.nvmrc`)
- **npm:** Included with Node.js

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tommymetz/tommetzmedia.com.git
   cd tommetzmedia.com
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## Available Scripts

- `npm run dev` - Start the development server with hot module replacement
- `npm run build` - Build the application for production (runs TypeScript compiler + Vite build)
- `npm run lint` - Run ESLint to check code quality
- `npm run test` - Run tests with Vitest
- `npm run preview` - Preview the production build locally

## Development Guidelines

### Component Structure

When creating a new component, follow this structure:

1. Create a directory for the component in `src/components/` using **kebab-case**
2. Include these files with **PascalCase** names matching the component:
   - `ComponentName.tsx` - The main component file
   - `ComponentName.css` - Component styles
   - `ComponentName.test.tsx` - Component tests
   - `index.ts` - Export file for the component
3. **Always** export the component from `index.ts` in the component directory
4. **Always** add the export to `/src/components/index.ts`

Example (for a component named "MyComponent"):
```
src/components/my-component/        ← kebab-case directory
  ├── MyComponent.tsx               ← PascalCase files
  ├── MyComponent.css
  ├── MyComponent.test.tsx
  └── index.ts                      ← exports the component
```

And update `/src/components/index.ts`:
```typescript
export * from './my-component'      ← kebab-case directory name
```

### Text Components

**All text content must be wrapped in the `Text` component.** Do not use plain HTML text elements like `<p>`, `<h1>`, `<h2>`, etc. directly.

Example:
```tsx
import { Text } from '../components'

// Good
<Text level="h1">My Heading</Text>
<Text level="body">My paragraph</Text>

// Bad
<h1>My Heading</h1>
<p>My paragraph</p>
```

### TypeScript

- Use explicit types for component props
- Define prop types using TypeScript `type` or `interface`
- Leverage type inference where appropriate

### Testing

- Write tests for all components using Vitest and React Testing Library
- Use descriptive test names
- Test user interactions and component behavior

## Project Structure

```
tommetzmedia.com/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # External services (e.g., Prismic)
│   ├── tests/          # Test utilities
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── vite.config.ts      # Vite configuration
└── vitest.config.ts    # Vitest configuration
```

## Contributing

1. Follow the component structure and development guidelines outlined above
2. Ensure all tests pass before submitting changes
3. Run linting to maintain code quality
4. Write tests for new features or components

## License

Private project for Tom Metz Media LLC
