<!-- Sync Impact Report
- Version change: (New) -> 1.0.0
- List of modified principles: Initial ratification of all principles.
- Added sections: Core Principles (1-7), Governance.
- Templates requiring updates: .specify/templates/tasks-template.md (✅ updated to mandate testing).
-->

# devops-skribbl Constitution

## Core Principles

### I. Code Clarity & Simplicity

Prefer clear, explicit code over clever abstractions. Keep modules small, cohesive, and well-named. Avoid premature optimization; optimize only when needed and measured.

### II. Modular Architecture

Separate "game engine" logic (rounds, scoring, room state) from transport (Socket.IO events, HTTP). Keep frontend rendering and client-side state manageable; avoid unnecessary frameworks for the MVP. Make it easy to later add persistence (e.g. Redis, database) without rewriting the whole app.

### III. Comprehensive Testing

Every core game rule (round transitions, scoring, turn rotation) MUST be covered by automated tests. Prefer fast unit tests for game logic and light integration tests for WebSocket flows. Include basic smoke tests for the HTTP and WebSocket endpoints.

### IV. User-Centric Design

UI MUST be clean, responsive, and accessible on desktop and tablet. Use semantic HTML and basic ARIA roles where appropriate. Avoid flashy animations that hurt readability or performance.

### V. Performance & Resilience

Keep the realtime experience smooth for 2–20 concurrent players per room. Handle disconnects gracefully (e.g. drawer leaving mid-round). Avoid blocking the event loop with CPU-heavy logic.

### VI. Operational Excellence

The app MUST always be runnable via `npm start`, Docker, and Helm. Configuration MUST come from environment variables where appropriate. Scripts and tooling should be documented in the README and/or SPEC docs.

### VII. AI-Augmented Workflow

Specs and plans are human-reviewed before large implementations. AI should not delete important files or tests without explicit human approval. Any major architectural change must first be reflected in the spec and plan.

## Governance

This constitution supersedes all other project practices. Amendments require documentation, approval, and a migration plan. All PRs and reviews must verify compliance with these principles. Complexity must be justified.

**Version**: 1.0.0 | **Ratified**: 2025-12-05 | **Last Amended**: 2025-12-05
