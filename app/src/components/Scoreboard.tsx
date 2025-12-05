'use client';

interface Player {
    username: string;
    score: number;
}

interface ScoreboardProps {
    players?: Player[];
}

export default function Scoreboard({ players = [] }: ScoreboardProps) {
    // Mock players if empty
    const displayPlayers = players.length > 0 ? players : [
        { username: 'root', score: 100 },
        { username: 'devops_eng', score: 80 }
    ];

    return (
        <div className="w-60 bg-gray-900 border border-gray-700 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4 text-center text-white border-b border-gray-700 pb-2">LEADERBOARD</h2>
            <ul className="space-y-2">
                {displayPlayers.sort((a, b) => b.score - a.score).map((p, i) => (
                    <li key={i} className={`flex justify-between p-2 rounded ${i === 0 ? 'bg-yellow-900 text-yellow-200' : 'text-gray-300'}`}>
                        <span>#{i + 1} {p.username}</span>
                        <span className="font-bold">{p.score}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
