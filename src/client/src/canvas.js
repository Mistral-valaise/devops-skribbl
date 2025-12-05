import { getSocket } from './socket.js';

export class GameCanvas {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.isDrawing = false;
    this.color = '#000000';
    this.width = 5;
    this.socket = getSocket();
    
    this.initListeners();
    this.initSocketListeners();
    
    // Resize canvas
    this.canvas.width = 800;
    this.canvas.height = 600;
  }

  initListeners() {
    this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
    this.canvas.addEventListener('mousemove', this.draw.bind(this));
    this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
    this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));
  }

  initSocketListeners() {
    this.socket.on('draw:stroke', (stroke) => {
      this.drawStroke(stroke);
    });

    this.socket.on('draw:clear', () => {
      this.clearCanvas();
    });
  }

  startDrawing(e) {
    this.isDrawing = true;
    const { x, y } = this.getPos(e);
    this.lastX = x;
    this.lastY = y;
    
    // Emit start event if needed, or just start drawing
  }

  draw(e) {
    if (!this.isDrawing) return;
    
    const { x, y } = this.getPos(e);
    
    const stroke = {
      x: this.lastX,
      y: this.lastY,
      toX: x,
      toY: y,
      color: this.color,
      width: this.width
    };
    
    this.drawStroke(stroke);
    this.socket.emit('draw:stroke', stroke);
    
    this.lastX = x;
    this.lastY = y;
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  getPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  drawStroke(stroke) {
    this.ctx.beginPath();
    this.ctx.moveTo(stroke.x, stroke.y);
    this.ctx.lineTo(stroke.toX, stroke.toY);
    this.ctx.strokeStyle = stroke.color;
    this.ctx.lineWidth = stroke.width;
    this.ctx.lineCap = 'round';
    this.ctx.stroke();
    this.ctx.closePath();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  emitClear() {
    this.clearCanvas();
    this.socket.emit('draw:clear');
  }
}
