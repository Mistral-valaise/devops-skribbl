'use client';

import { useEffect, useState, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSocket } from '@/lib/socket';
import Canvas from '@/components/Canvas';
import Chat from '@/components/Chat';
import Scoreboard from '@/components/Scoreboard';

export default function GameRoom({ params }: { params: Promise<{ roomId: string }> }) {
    // Unwrap params using React.use()
    const { roomId } = use(params);
    const searchParams = useSearchParams();
    const username = searchParams.get('username') || 'Anonymous';

    // In a real app we would sync this state via socket
    const [isDrawer, setIsDrawer] = useState(false);
    const socket = getSocket();

    useEffect(() => {
        socket.connect();
        socket.emit('join-room', roomId, username);

        // Simple logic: first user becomes drawer or strictly manual toggle for MVP
        // Ideally handled by server game state

        return () => {
            socket.disconnect();
        };
    }, [roomId, username, socket]);

    return (
        <div className="flex flex-col min-h-screen p-4 bg-gray-950">
            <header className="flex justify-between items-center mb-6 px-4 py-2 bg-gray-900 border-b border-gray-800">
                <h1 className="text-2xl font-bold text-green-500 font-mono">DevOps Skribbl :: Room {roomId}</h1>
                <div className="text-gray-400">User: <span className="text-white">{username}</span></div>
            </header>

            <div className="flex flex-1 gap-6 justify-center">
                <div className="hidden md:block">
                    <Scoreboard />
                </div>

                <div className="flex-col items-center">
                    <div className="mb-2 text-center text-yellow-500 font-mono">
                        {isDrawer ? "YOU ARE Drawing: DOCKER" : "Guess the word!"}
                    </div>
                    <Canvas socket={socket} roomId={roomId} isDrawer={isDrawer} />
                    <div className="mt-4 flex justify-center gap-4">
                        <button
                            onClick={() => setIsDrawer(!isDrawer)}
                            className="text-xs bg-gray-800 p-2 rounded text-gray-400 hover:text-white"
                        >
                            [DEV] Toggle Drawer Role
                        </button>
                    </div>
                </div>

                <div>
                    <Chat socket={socket} roomId={roomId} username={username} />
                </div>
            </div>
        </div>
    );
}
