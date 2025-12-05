'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  const createRoom = () => {
    if (!username) return alert('Enter a username');
    const newRoomId = Math.random().toString(36).substring(7);
    router.push(`/game/${newRoomId}?username=${username}`);
  };

  const joinRoom = () => {
    if (!username || !roomId) return alert('Enter username and room ID');
    router.push(`/game/${roomId}?username=${username}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-6xl font-bold mb-8 neon-text tracking-tighter">DevOps Skribbl</h1>

      <div className="terminal-box p-8 rounded-lg max-w-md w-full space-y-6">
        <div className="space-y-2">
          <label className="block text-left text-sm font-bold text-accent">USER@SYSTEM:~$ Enter Alias</label>
          <input
            type="text"
            className="w-full bg-black border border-green-500 p-3 text-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="e.g. root_user"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <button
            onClick={createRoom}
            className="w-full bg-green-600 hover:bg-green-700 text-black font-bold py-3 px-4 rounded transform transition hover:scale-105"
          >
            init_new_room.sh
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink-0 mx-4 text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              className="w-full bg-black border border-gray-600 p-3 text-white focus:border-green-500 focus:outline-none"
              placeholder="Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <button
              onClick={joinRoom}
              className="w-full border border-green-500 text-green-500 hover:bg-green-900 font-bold py-3 px-4 rounded"
            >
              ssh ./connect_room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
