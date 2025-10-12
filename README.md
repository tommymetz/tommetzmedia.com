# Tom Metz Media LLC

A modern portfolio website showcasing full-stack web development capabilities, built with React and Three.js.

## Technology Stack

### Frontend Framework
- **React 19.2** - Modern UI library with JSX syntax
- **TypeScript 5.9** - Type-safe JavaScript development
- **React Three Fiber 9.3** - React renderer for Three.js

### Build Tools & Development
- **Vite 7.1** - Fast build tool with HMR (Hot Module Replacement)
- **ESLint 9.37** - Code quality and consistency
- **TypeScript ESLint 8.46** - TypeScript-specific linting rules

### Content Management
- **Prismic CMS** - Headless CMS integration via `@prismicio/client`
- Content is fetched dynamically from the Prismic API
- Repository name: `tommetzmediallc`

### 3D Graphics & Animation
- **Three.js 0.180** - WebGL-based 3D graphics library
- Custom gravitational physics simulation for background spheres
- Dynamic lighting with ambient and hemisphere lights
- Interactive scene that responds to scroll position

### Component Architecture
```
src/
├── components/
│   ├── header/          - Site header component
│   ├── section/         - Reusable section wrapper
│   ├── three-background/ - 3D background scene with physics
│   └── project-card/    - Project display cards
├── services/
│   └── prismic/         - Prismic CMS client configuration
├── App.tsx              - Main application component
└── main.tsx             - Application entry point
```

### Key Technical Features
- **Single Page Application (SPA)** - Client-side rendered React application
- **Headless CMS Integration** - Content managed via Prismic
- **3D Background Physics** - Custom gravitational simulation with sphere collision
- **Responsive Design** - Mobile-first approach
- **SEO Optimization** - Meta tags, structured data, and social media integration
- **Analytics** - Google Analytics integration

### Runtime Requirements
- **Node.js**: ^20.19.0 or >=22.12.0 (specified in `.nvmrc` and `package.json`)

## Development

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```
This starts Vite's development server with HMR enabled.

### Build for Production
```bash
npm run build
```
Compiles TypeScript and bundles the application for production deployment.

### Lint Code
```bash
npm run lint
```
Runs ESLint to check code quality and style consistency.

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing.

## Architecture Notes

### State Management
- Uses React's built-in hooks (`useState`, `useEffect`, `useRef`)
- No external state management library required

### Rendering Strategy
- Client-side rendering with React DOM
- Content fetched asynchronously from Prismic API on initial load
- Three.js scene rendered via Canvas component from React Three Fiber

### Performance Optimizations
- `useRef` for DOM references to avoid unnecessary re-renders
- Pre-computed sphere properties to minimize runtime calculations
- Request animation frame (RAF) for smooth 3D animations
- Component-level code organization for maintainability
