# Implementation Plan: UI/UX Modernization

**Branch**: `001-skribbl-mvp` | **Date**: 2025-12-05 | **Spec**: [specs/001-skribbl-mvp/spec.md](./spec.md)
**Input**: User request to "make style UI UX of the game better reponsiv modern"

## Summary

Enhance the existing MVP frontend with a modern, responsive UI/UX. This involves replacing the basic HTML/CSS with a structured CSS approach (using CSS Variables for theming), improving the layout for mobile responsiveness (stacking on small screens), and adding better visual feedback for game events (e.g., toast notifications, distinct chat message styles).

## Technical Context

**Language/Version**: HTML5, CSS3 (Variables, Flexbox, Grid), Vanilla JS (ES6+)
**Primary Dependencies**: None (Pure CSS/JS to keep it lightweight per Constitution)
**Storage**: N/A (Frontend only)
**Testing**: Manual verification via Playwright (visual regression if possible, but manual for MVP)
**Target Platform**: Modern Browsers (Chrome, Firefox, Safari, Edge), Mobile & Desktop
**Project Type**: Web application (Frontend enhancement)
**Performance Goals**: 60fps rendering, instant UI feedback
**Constraints**: No heavy frontend frameworks (React/Vue) for this phase; stick to Vanilla JS/CSS.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Clarity**: Using CSS Variables and organized CSS files improves clarity over inline styles.
- **Modular Architecture**: UI logic remains separated from Game Logic.
- **Testing**: UI changes should be verified; we have Playwright setup.
- **UX**: Directly addresses "UI MUST be clean, responsive, and accessible".
- **Performance**: Pure CSS is performant.

## Project Structure

### Documentation (this feature)

```text
specs/001-skribbl-mvp/
├── plan.md              # This file (Updated)
├── spec.md              # Feature specification
└── checklists/          # Quality checklists
```

### Source Code (repository root)

```text
src/client/
├── public/
│   ├── css/
│   │   ├── main.css     # Global styles & variables
│   │   ├── layout.css   # Grid/Flex layouts
│   │   └── components.css # Buttons, Inputs, Cards
│   ├── index.html       # Updated HTML structure
│   └── assets/          # Icons/Images (if any)
└── src/
    ├── ui.js            # Updated UI logic for new DOM structure
    └── ...
```

**Structure Decision**: We will introduce a `css/` directory in `public/` to organize styles. We will refactor `index.html` to use semantic classes instead of inline styles.

## 1. UI/UX Design Strategy

### Visual Style

- **Theme**: "Modern Playful" - Bright colors, rounded corners, soft shadows.
- **Typography**: System sans-serif font stack (Inter/Roboto feel).
- **Color Palette**:
  - Primary: `#4F46E5` (Indigo)
  - Secondary: `#10B981` (Emerald)
  - Background: `#F3F4F6` (Light Gray)
  - Surface: `#FFFFFF` (White)
  - Text: `#1F2937` (Dark Gray)

### Layouts

- **Landing**: Centered card with "Hero" title.
- **Lobby**: Two-column layout (Room Info | Player List).
- **Game**:
  - **Desktop**: 3-column or 2-column with sidebar.
    - Left: Toolbar/Tools
    - Center: Canvas (Main focus)
    - Right: Chat & Leaderboard
  - **Mobile**: Stacked layout.
    - Top: Canvas
    - Middle: Toolbar
    - Bottom: Chat (collapsible or small height)

### Interactions

- **Buttons**: Hover effects, active states.
- **Chat**: Distinct bubbles for System vs User messages.
- **Canvas**: Cursor changes based on tool (Pen/Eraser).

## 2. Implementation Details

### CSS Architecture

We will use standard CSS with variables for maintainability.

```css
:root {
  --color-primary: #4F46E5;
  --color-bg: #F3F4F6;
  --radius-md: 0.5rem;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
```

### DOM Structure Changes

Refactor `index.html` to remove inline styles and use semantic containers.

```html
<div class="game-container">
  <header class="game-header">...</header>
  <main class="game-board">
    <aside class="tools-panel">...</aside>
    <canvas class="drawing-surface"></canvas>
    <aside class="chat-panel">...</aside>
  </main>
</div>
```

## 3. Complexity Tracking

- **Responsiveness**: Handling Canvas resizing on mobile is tricky. We might need to fix the canvas aspect ratio or allow scrolling. For MVP, we'll try to fit it within the viewport width.

## 4. Tasks (Preview)

1. Create `src/client/public/css/` structure.
2. Define CSS variables and base styles.
3. Refactor Landing Page HTML/CSS.
4. Refactor Lobby HTML/CSS.
5. Refactor Game View HTML/CSS (Grid layout).
6. Style Chat and Player List components.
7. Update `ui.js` to target new class names if IDs changed (try to keep IDs stable).
