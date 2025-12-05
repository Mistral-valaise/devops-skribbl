# Feature Specification: MVP Game Core

**Feature Branch**: `001-skribbl-mvp`
**Created**: 2025-12-05
**Status**: Draft
**Input**: User description: "MVP for devops-skribbl real-time drawing game"

## Goals & Scope

**Goals:**

- Deliver a playable real-time drawing and guessing game.
- Support 2-20 players per room with low latency.
- Provide a robust foundation for DevOps and AI experimentation.

**Non-Goals (Out of Scope for MVP):**

- User accounts, authentication, or avatars.
- Persistence of game history or stats across server restarts.
- Moderation tools (kick/ban) or profanity filters.
- Custom word lists (use a hardcoded server-side list for MVP).
- Spectator mode.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Room Management (Priority: P1)

As a player, I want to create a new room or join an existing one using a code so that I can play with my friends.

**Why this priority**: Fundamental entry point; without rooms, no game can exist.

**Independent Test**: Verify a user can create a room (getting a code) and another user can join that room using the code, appearing in the lobby.

**Acceptance Scenarios**:

1. **Given** a user on the landing page, **When** they enter a nickname and click "Create Room", **Then** they are redirected to a lobby with a unique room code and listed as the host.
2. **Given** a user on the landing page, **When** they enter a nickname and a valid room code, **Then** they join the lobby and see other players.
3. **Given** a user, **When** they try to join with an invalid code, **Then** they see an error message.

---

### User Story 2 - Game Loop & Round Lifecycle (Priority: P1)

As a host, I want to start the game and have the system manage rounds automatically so that we can play without manual intervention.

**Why this priority**: Core orchestration logic; drives the game forward.

**Independent Test**: Verify the game transitions from Lobby -> Word Selection -> Drawing -> Round End -> Next Round -> Game End.

**Acceptance Scenarios**:

1. **Given** a lobby with at least 2 players, **When** the host clicks "Start Game", **Then** the game begins and the first drawer is selected.
2. **Given** a round is active, **When** the timer expires, **Then** the round ends and the answer is revealed.
3. **Given** all rounds are completed, **Then** the game transitions to the final scoreboard.

---

### User Story 3 - Real-time Drawing (Priority: P1)

As a drawer, I want my drawing strokes to appear instantly on other players' screens so they can guess what I'm drawing.

**Why this priority**: The central mechanic of the game.

**Independent Test**: Verify strokes drawn on one client appear on another client within acceptable latency (<200ms).

**Acceptance Scenarios**:

1. **Given** it is my turn to draw, **When** I click and drag on the canvas, **Then** lines appear on my screen and all other players' screens.
2. **Given** I am drawing, **When** I change color or brush size, **Then** subsequent strokes use the new settings.
3. **Given** I am drawing, **When** I click "Clear", **Then** the canvas is wiped for everyone.

---

### User Story 4 - Guessing & Scoring (Priority: P1)

As a guesser, I want to type guesses into chat and get points if I'm correct so that I can compete to win.

**Why this priority**: The competitive element and feedback loop.

**Independent Test**: Verify correct guesses trigger score updates and system messages, while incorrect guesses just appear as chat.

**Acceptance Scenarios**:

1. **Given** a round is active, **When** I type the correct word, **Then** my message is hidden (or marked), I get points, and a "Player guessed the word!" message is broadcast.
2. **Given** a round is active, **When** I type an incorrect word, **Then** it appears as a normal chat message.
3. **Given** multiple players guess correctly, **Then** earlier guessers receive more points.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to create a room and receive a unique alphanumeric room code.
- **FR-002**: System MUST allow users to join a room via code, rejecting invalid or full rooms.
- **FR-003**: Host MUST be able to configure round count (default: 3) and draw time (default: 80s) before starting.
- **FR-004**: System MUST rotate the "Drawer" role sequentially among players.
- **FR-005**: System MUST present 3 random word options to the Drawer at the start of their turn.
- **FR-006**: System MUST broadcast drawing events (start, move, end, color, width, clear) to all players in the room in real-time.
- **FR-007**: System MUST validate chat messages against the secret word (case-insensitive).
- **FR-008**: System MUST calculate scores: max points for first guesser, decreasing for subsequent; points for drawer based on number of correct guesses.
- **FR-009**: System MUST show a leaderboard at the end of the game displaying final ranks.
- **FR-010**: System MUST handle player disconnects: if Drawer disconnects, round ends immediately; if Host disconnects, role is reassigned.

### Non-Functional Requirements

- **NFR-001**: Drawing latency should be perceived as near-instant (< 100ms ideal, < 200ms acceptable) on stable connections.
- **NFR-002**: System MUST support at least 20 concurrent players in a single room.
- **NFR-003**: UI MUST be responsive and usable on desktop (mouse) and tablet (touch).
- **NFR-004**: System MUST NOT crash if a player disconnects at any point.

### Key Entities

- **Room**: ID, HostID, Settings (rounds, time), State (Lobby, InGame, Ended), PlayerList.
- **Player**: ID, Nickname, Score, IsConnected, SocketID.
- **Round**: RoundNumber, DrawerID, SecretWord, TimeRemaining, GuessedPlayerIDs.
- **Stroke**: X, Y, Color, Width, Type (start/drag/end).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a room and start a game in under 1 minute.
- **SC-002**: Drawing strokes appear on other clients within 200ms.
- **SC-003**: System handles 20 concurrent players in a single room without crashing.
- **SC-004**: 95% of valid guesses are correctly identified and scored.
