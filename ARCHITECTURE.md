# Agent Academy Architecture (Simple v1)

## Why this stack
To ship quickly with strong interactivity and easy editing, v1 uses:
- React + TypeScript (via Vite)
- Tailwind CSS
- LocalStorage for persistence
- Simulated agent engine (no API calls)

This is slightly simpler than Next.js for a first interactive prototype because:
- Fewer framework concepts for a non-coder maintainer
- Fast startup and minimal boilerplate
- Easy to later migrate logic/components to Next.js

## Core architecture
- `src/data/modules.ts`: editable educational module content
- `src/engine/simulator.ts`: reusable simulation engine and scenarios
- `src/components/*`: reusable UI blocks (stepper, quiz, reflections, simulator view)
- `src/pages/*` style route sections in a single-page app with sidebar nav
- `src/lib/storage.ts`: progress + saved blueprints in LocalStorage

## Learning flow pattern per module
1. Explain
2. Show
3. Guide
4. Interact
5. Reflect
6. Apply to business

## Special modules
- Sandbox: customizable simulation with before/after compare
- Capstone: guided builder + markdown export

