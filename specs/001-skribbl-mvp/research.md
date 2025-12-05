# Research: UI/UX Modernization

**Feature**: UI/UX Modernization
**Status**: Complete

## Decisions

### 1. CSS Architecture

- **Decision**: Use Vanilla CSS with CSS Variables (Custom Properties).
- **Rationale**:
  - **Performance**: No build step required, native browser support.
  - **Maintainability**: Variables allow easy theming (colors, spacing).
  - **Simplicity**: Aligns with the "No Frameworks" constitution rule.
- **Alternatives**:
  - *SASS/SCSS*: Requires a build step/preprocessor.
  - *Tailwind CSS*: Requires a build step and adds dependency complexity.

### 2. Layout Strategy

- **Decision**: CSS Grid for the main game layout, Flexbox for components.
- **Rationale**:
  - Grid is perfect for the 2D layout of the game board (sidebar, canvas, chat).
  - Flexbox is ideal for 1D layouts (lists, toolbars).

### 3. Mobile Responsiveness

- **Decision**: Stacked layout for mobile.
- **Rationale**:
  - Canvas needs maximum width.
  - Chat and tools can be secondary/collapsible.

## Unknowns Resolved

- **Canvas Resizing**: Will use a container with `aspect-ratio` or JS-based resize listener to keep the canvas drawing context correct. For MVP, we will scale the canvas visually via CSS but keep internal resolution fixed, or handle resize events in `ui.js`.
