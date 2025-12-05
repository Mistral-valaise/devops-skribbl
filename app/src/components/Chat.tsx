'use client';

import { useEffect, useState, useRef } from 'react';
import { Socket } from 'socket.io-client';

interface ChatProps {
    socket: Socket;
    roomId: string;
    username: string;
}

interface Message {
    user: string;
    message: string;
}

export default function Chat({ socket, roomId, username }: ChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMessage = (msg: Message) => {
            setMessages((prev) => [...prev, msg]);
        };
        socket.on('chat-message', handleMessage);

        return () => {
            socket.off('chat-message', handleMessage);
        };
    }, [socket]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        socket.emit('chat-message', { roomId, user: username, message: input });
        setInput('');
    };

    return (
        <div className="flex flex-col h-[600px] w-80 bg-black border border-green-500 rounded-lg overflow-hidden">
            <div className="bg-green-900 p-2 border-b border-green-500 text-center font-bold text-black">
                TERMINAL CHAT
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-sm">
                {messages.map((msg, i) => (
                    <div key={i} className="break-words">
                        <span className="text-green-500 font-bold">{msg.user}$: </span>
                        <span className="text-green-300">{msg.message}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="p-2 border-t border-green-500 flex">
                <span className="text-green-500 mr-2">{'>'}</span>
                <input
                    className="flex-1 bg-transparent text-green-300 focus:outline-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="..."
                />
            </form>
        </div>
    );
}
