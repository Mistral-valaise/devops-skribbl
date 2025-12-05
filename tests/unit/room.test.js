const Room = require('../../src/game/room');
const Player = require('../../src/game/player');

describe('Room', () => {
  let room;
  let host;

  beforeEach(() => {
    host = new Player('socket1', 'Host');
    room = new Room('room1', host.id);
    room.addPlayer(host);
  });

  test('should initialize with host', () => {
    expect(room.id).toBe('room1');
    expect(room.hostId).toBe('socket1');
    expect(room.players.size).toBe(1);
    expect(room.getPlayer('socket1')).toBe(host);
  });

  test('should add a player', () => {
    const p2 = new Player('socket2', 'Player2');
    room.addPlayer(p2);
    expect(room.players.size).toBe(2);
    expect(room.getPlayer('socket2')).toBe(p2);
  });

  test('should remove a player', () => {
    const p2 = new Player('socket2', 'Player2');
    room.addPlayer(p2);
    room.removePlayer('socket2');
    expect(room.players.size).toBe(1);
    expect(room.getPlayer('socket2')).toBeUndefined();
  });
});
