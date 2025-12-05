import { initSocket } from './socket.js';
import { initUI } from './ui.js';

console.log('App initializing...');
const socket = initSocket();
initUI();
