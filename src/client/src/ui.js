import { getSocket } from './socket.js';
import { GameCanvas } from './canvas.js';

// DOM Elements
const views = {
  landing: document.getElementById('landing-view'),
  lobby: document.getElementById('lobby-view'),
  game: document.getElementById('game-view'),
};

const inputs = {
  nickname: document.getElementById('nickname'),
  roomCode: document.getElementById('room-code'),
  chat: document.getElementById('chat-input'),
};

const buttons = {
  createRoom: document.getElementById('btn-create-room'),
  joinRoom: document.getElementById('btn-join-room'),
  startGame: document.getElementById('btn-start-game'),
  clearCanvas: document.getElementById('btn-clear'),
};

const lobby = {
  roomCode: document.getElementById('lobby-room-code'),
  playerList: document.getElementById('lobby-player-list'),
  hostControls: document.getElementById('host-controls'),
  waitingMessage: document.getElementById('waiting-message'),
};

const overlay = {
  container: document.getElementById('word-selection-overlay'),
  options: document.getElementById('word-options'),
};

const game = {
  roundNumber: document.getElementById('round-number'),
  timer: document.getElementById('timer'),
  wordDisplay: document.getElementById('word-display'),
  chatMessages: document.getElementById('chat-messages'),
  canvas: document.getElementById('game-canvas'),
  playerList: document.getElementById('game-player-list'),
};

const gameOver = {
  overlay: document.getElementById('game-over-overlay'),
  scores: document.getElementById('final-scores'),
  btnReturn: document.getElementById('btn-return-lobby'),
};

const toasts = {
  container: document.getElementById('toast-container'),
};

// State
let state = {
  roomId: null,
  isHost: false,
  players: [],
  gameState: 'LOBBY',
  gameCanvas: null
};

const setLoading = (btn, isLoading) => {
  if (isLoading) {
    btn.classList.add('btn-loading');
  } else {
    btn.classList.remove('btn-loading');
  }
};

const clearLoading = () => {
  document.querySelectorAll('.btn-loading').forEach(btn => btn.classList.remove('btn-loading'));
};

// Helpers
const showView = (viewName) => {
  clearLoading();
  Object.values(views).forEach(el => el.classList.add('hidden'));
  views[viewName].classList.remove('hidden');
};

const renderPlayerList = (players) => {
  // Lobby list
  lobby.playerList.innerHTML = '';
  players.forEach(p => {
    const li = document.createElement('li');
    li.className = 'list-item flex justify-between items-center';
    li.innerHTML = `<span>${p.nickname}</span> <span class="text-sm text-muted">${p.score} pts</span>`;
    lobby.playerList.appendChild(li);
  });

  // Game list
  if (game.playerList) {
    game.playerList.innerHTML = '';
    const sorted = [...players].sort((a, b) => b.score - a.score);
    sorted.forEach((p, i) => {
      const li = document.createElement('li');
      li.className = 'flex justify-between items-center p-xs text-sm';
      li.innerHTML = `<span>#${i+1} ${p.nickname}</span> <span>${p.score}</span>`;
      game.playerList.appendChild(li);
    });
  }
};

const addChatMessage = (msg, type = 'chat') => {
  const div = document.createElement('div');
  div.textContent = msg;
  div.className = 'chat-msg';
  if (type === 'system') div.classList.add('chat-system');
  if (type === 'correct') div.classList.add('chat-correct');
  game.chatMessages.appendChild(div);
  game.chatMessages.scrollTop = game.chatMessages.scrollHeight;
};

export const showToast = (message, type = 'info') => {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  toasts.container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease-out forwards';
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 3000);
};

// Event Listeners
export const initUI = () => {
  const socket = getSocket();

  buttons.createRoom.addEventListener('click', () => {
    const nickname = inputs.nickname.value;
    if (!nickname) return showToast('Please enter a nickname', 'error');
    setLoading(buttons.createRoom, true);
    socket.emit('room:create', { nickname });
  });

  gameOver.btnReturn.addEventListener('click', () => {
    window.location.reload();
  });

    buttons.joinRoom.addEventListener('click', () => {
    const nickname = inputs.nickname.value;
    const roomId = inputs.roomCode.value;
    if (!nickname || !roomId) return showToast('Please enter nickname and room code', 'error');
    setLoading(buttons.joinRoom, true);
    socket.emit('room:join', { roomId, nickname });
  });

  buttons.startGame.addEventListener('click', () => {
    socket.emit('game:start');
  });

  buttons.clearCanvas.addEventListener('click', () => {
    if (state.gameCanvas) state.gameCanvas.emitClear();
  });

  document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.dataset.color;
      if (state.gameCanvas) state.gameCanvas.color = color;
      document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const size = parseInt(btn.dataset.size);
      if (state.gameCanvas) state.gameCanvas.width = size;
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  inputs.chat.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const message = inputs.chat.value;
      if (message) {
        socket.emit('chat:message', { message });
        inputs.chat.value = '';
      }
    }
  });

  // Socket Events
  socket.on('room:joined', (data) => {
    state.roomId = data.roomId;
    state.isHost = data.isHost;
    lobby.roomCode.textContent = data.roomId;
    
    if (state.isHost) {
      lobby.hostControls.classList.remove('hidden');
      lobby.waitingMessage.classList.add('hidden');
    } else {
      lobby.hostControls.classList.add('hidden');
      lobby.waitingMessage.classList.remove('hidden');
    }
    
    showView('lobby');
  });

  socket.on('room:update', (data) => {
    state.players = data.players;
    state.gameState = data.state;
    renderPlayerList(data.players);
  });

  socket.on('game:started', () => {
    showView('game');
    state.gameCanvas = new GameCanvas(game.canvas);
  });

  socket.on('round:start', (data) => {
    game.roundNumber.textContent = data.roundNumber;
    addChatMessage(`Round ${data.roundNumber} started!`, 'system');
  });

  socket.on('round:word_options', (data) => {
    overlay.container.classList.remove('hidden');
    overlay.options.innerHTML = '';
    data.words.forEach(word => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary';
      btn.textContent = word;
      btn.onclick = () => {
        socket.emit('round:choose_word', { word });
        overlay.container.classList.add('hidden');
      };
      overlay.options.appendChild(btn);
    });
  });

  socket.on('round:word_chosen', (data) => {
    game.wordDisplay.textContent = `GUESS THIS: ${'_ '.repeat(data.length)}`;
  });

  socket.on('chat:message', (data) => {
    addChatMessage(`${data.sender}: ${data.message}`, data.type);
  });

  socket.on('game:over', (data) => {
    const sortedPlayers = data.scoreboard.sort((a, b) => b.score - a.score);
    gameOver.scores.innerHTML = '';
    sortedPlayers.forEach((player, index) => {
      const row = document.createElement('div');
      row.className = 'flex justify-between items-center p-sm bg-surface rounded border';
      if (index === 0) row.classList.add('border-primary');
      row.innerHTML = `
        <div class="flex items-center gap-sm">
          <span class="font-bold text-lg">#${index + 1}</span>
          <span class="font-bold">${player.nickname}</span>
        </div>
        <span class="font-bold text-primary">${player.score} pts</span>
      `;
      gameOver.scores.appendChild(row);
    });
    gameOver.overlay.classList.remove('hidden');
  });

  socket.on('error', (err) => {
    clearLoading();
    showToast(err.message, 'error');
  });
};
