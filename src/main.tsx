import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrismicProvider } from "@prismicio/react";
import './index.css'
import App from './App.tsx'
import { prismicClient } from "./services";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrismicProvider client={prismicClient}>
      <App />
    </PrismicProvider>
  </StrictMode>,
)
