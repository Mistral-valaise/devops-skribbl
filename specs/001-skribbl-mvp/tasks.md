# Tasks: UI/UX Modernization

**Input**: Design documents from `specs/001-skribbl-mvp/`
**Prerequisites**: `plan.md`, `spec.md`
**Tests**: Manual verification via Playwright (visual check)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create CSS directory structure `src/client/public/css/`
- [ ] T002 Create empty CSS files: `variables.css`, `base.css`, `layout.css`, `components.css` in `src/client/public/css/`
- [ ] T003 Update `src/client/public/index.html` to link the new CSS files (and remove old inline styles/link if any)

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define the design system and shared layouts

- [ ] T004 Define CSS variables (colors, fonts, spacing) in `src/client/public/css/variables.css`
- [ ] T005 Implement CSS reset and base typography in `src/client/public/css/base.css`
- [ ] T006 Define utility classes (flex, grid, spacing) in `src/client/public/css/layout.css`
- [ ] T007 Define shared component styles (buttons, inputs, cards) in `src/client/public/css/components.css`

## Phase 3: User Story 1 - Room Management (Landing & Lobby)

**Goal**: Modernize the entry points (Landing and Lobby views).
**Story**: [US1] As a player, I want to create a new room or join an existing one...

- [ ] T008 [US1] Refactor Landing View HTML in `src/client/public/index.html` to use semantic structure and component classes
- [ ] T009 [US1] Apply styles to Landing View (Hero card, inputs, buttons) in `src/client/public/css/layout.css` or specific file
- [ ] T010 [US1] Refactor Lobby View HTML in `src/client/public/index.html` (Room info, Player list, Game Settings form)
- [ ] T011 [US1] Apply styles to Lobby View (Card layout, list items) in `src/client/public/css/layout.css`
- [ ] T012 [US1] Update `src/client/src/ui.js` to ensure event listeners attach to new Landing/Lobby DOM elements

## Phase 4: User Story 2 - Game Loop (Game Layout)

**Goal**: Create the main game layout structure.
**Story**: [US2] As a host, I want to start the game and have the system manage rounds...

- [ ] T013 [US2] Refactor Game View HTML container in `src/client/public/index.html` to use CSS Grid structure
- [ ] T014 [US2] Implement the main Game Grid layout (Sidebar, Canvas, Chat) in `src/client/public/css/layout.css`
- [ ] T015 [US2] Style the Game Header (Timer, Round Info, Word hint) in `src/client/public/css/components.css`
- [ ] T016 [US2] Update `src/client/src/ui.js` to ensure game state updates (timer, round) target correct elements
- [ ] T030 [US2] Style the Word Selection Overlay (Modal/Popup) in `src/client/public/css/components.css`

## Phase 5: User Story 3 - Real-time Drawing (Canvas & Tools)

**Goal**: Style the drawing area and tools.
**Story**: [US3] As a drawer, I want my drawing strokes to appear instantly...

- [ ] T017 [US3] Style the Canvas container (aspect ratio, shadow, border) in `src/client/public/css/components.css`
- [ ] T018 [US3] Refactor Toolbar HTML in `src/client/public/index.html` (Colors, Brushes, Clear button)
- [ ] T019 [US3] Style the Toolbar (Floating or Sidebar, active states for selected color/tool)
- [ ] T020 [US3] Update `src/client/src/ui.js` to handle tool selection with new DOM structure

## Phase 6: User Story 4 - Guessing & Scoring (Chat & Leaderboard)

**Goal**: Style the social and competitive elements.
**Story**: [US4] As a guesser, I want to type guesses into chat and get points...

- [ ] T021 [US4] Refactor Chat Component HTML in `src/client/public/index.html` (Message list, Input area)
- [ ] T022 [US4] Style Chat Component (Message bubbles, system vs user messages, sticky input)
- [ ] T023 [US4] Refactor Leaderboard HTML in `src/client/public/index.html`
- [ ] T024 [US4] Style Leaderboard (Ranks, scores, current drawer indicator)
- [ ] T025 [US4] Update `src/client/src/ui.js` to append chat messages and update leaderboard correctly
- [ ] T031 [US4] Style the Final Game Over Scoreboard in `src/client/public/css/components.css`

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final adjustments and responsiveness

- [ ] T026 [P] Implement mobile-specific stacked layout media queries in `src/client/public/css/layout.css`
- [ ] T027 [P] Add hover and active states to all interactive elements (buttons, list items)
- [ ] T028 [P] Verify and fix Canvas resizing/scaling behavior on different viewport sizes
- [ ] T029 [P] (Optional) Add "Toast" notification styles for game events in `src/client/public/css/components.css`

## Dependencies

1. **Setup & Foundation** (T001-T007) must be completed first.
2. **US1** (Landing/Lobby) is the entry point, good to do first.
3. **US2** (Game Layout) sets the container for US3 and US4.
4. **US3** (Drawing) and **US4** (Chat) can be done in parallel after US2.

## Implementation Strategy

- **MVP First**: Focus on getting the layout working on Desktop first.
- **Incremental**: Refactor one view at a time (Landing -> Lobby -> Game) to keep the app runnable.
- **Verification**: After each Phase, run the app and verify the view looks correct and functionality (buttons, inputs) still works.
