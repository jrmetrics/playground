# Agent Academy (Interactive, No-Code Friendly)

Agent Academy is a beginner-first interactive web app that teaches how AI agents work using guided simulations.

## What this app includes
- 10 interactive modules (Explain → Show → Guide → Interact → Reflect → Business apply)
- A configurable sandbox to run and compare simulated agent behavior
- An Agent Business Builder that generates editable blueprints
- Local progress saving in your browser
- Markdown export for your final blueprint

## For non-coders: how to run
1. Open this folder on your computer.
2. Double-click `index.html` to run locally in your browser.
   - Or run a simple local server (recommended):
     - `python3 -m http.server 8000`
     - visit `http://localhost:8000`

## Where lesson content lives
- Main module definitions and interactions: `app.js`
- UI styles: `styles.css`
- Architecture notes: `ARCHITECTURE.md`

## How to add a new module
1. In `app.js`, add an item in the `modules` list.
2. Create a renderer function, e.g. `renderMyModule()`.
3. Add it to the `map` object in `render()`.
4. Include:
   - explanation
   - interactive controls
   - reflection/business section

## How the simulation engine works
This app uses a simple deterministic simulation pattern:
- User inputs role, goal, tools, memory, and rules
- Scenario logic branches based on those inputs
- The app displays step-by-step “agent behavior” text
- No real external APIs are called in v1

## Future upgrades
- Migrate to Next.js + TypeScript + Tailwind components
- Add real LLM API calls behind a “safe mode” toggle
- Add persistent user profiles with a database
- Add reusable scenario JSON files instead of inline logic
- Add scoring rubrics and richer quizzes

## Next milestone recommendation
Implement a TypeScript refactor with:
- module content in `data/*.json`
- shared simulation engine utilities
- richer drag-and-drop planner and branching scenario player
