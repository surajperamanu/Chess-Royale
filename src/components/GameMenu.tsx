import React, { useState } from 'react';
import { PlayCircle, Users, X, Copy, Check } from 'lucide-react';

interface GameMenuProps {
  onCreateGame: () => void;
  onJoinGame: (code: string) => void;
  onStartGame: () => void;
  gameCode: string | null;
}

const GameMenu: React.FC<GameMenuProps> = ({ onCreateGame, onJoinGame, onStartGame, gameCode }) => {
  const [showJoinPrompt, setShowJoinPrompt] = useState(false);
  const [joinGameCode, setJoinGameCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleJoinSubmit = () => {
    if (joinGameCode.trim()) {
      onJoinGame(joinGameCode);
      setJoinGameCode('');
      setShowJoinPrompt(false);
    }
  };

  const handleCopyCode = async () => {
    if (gameCode) {
      await navigator.clipboard.writeText(gameCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8 bg-neutral-900 rounded-2xl border border-amber-600/20 shadow-glow">
      <h1 className="text-4xl font-bold text-amber-400 animate-glow">
        Chess Royale
      </h1>
      
      <div className="flex flex-col gap-4 w-full max-w-md">
        {!gameCode ? (
          <>
            <button
              onClick={onCreateGame}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 
                       hover:from-amber-500 hover:to-amber-400 transition-all duration-300 rounded-lg 
                       text-neutral-900 font-bold text-lg shadow-lg hover:shadow-xl"
            >
              <PlayCircle className="w-6 h-6" />
              Create New Game
            </button>

            <button
              onClick={() => setShowJoinPrompt(true)}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-neutral-800 
                       hover:bg-neutral-700 transition-all duration-300 rounded-lg 
                       text-amber-400 font-bold text-lg border border-amber-600/20
                       hover:border-amber-600/40 shadow-lg hover:shadow-xl"
            >
              <Users className="w-6 h-6" />
              Join Existing Game
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-6 p-6 bg-neutral-800 rounded-xl border border-amber-600/20">
            <h2 className="text-xl font-bold text-amber-400">Game Code</h2>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-mono font-bold text-amber-400 tracking-wider">
                {gameCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
                title="Copy code"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5 text-amber-400" />
                )}
              </button>
            </div>
            <p className="text-neutral-400 text-center text-sm mb-4">
              Share this code with your opponent to start the game
            </p>
            <button
              onClick={onStartGame}
              className="w-full px-6 py-3 bg-amber-600 hover:bg-amber-500 
                       transition-colors rounded-lg text-neutral-900 font-bold"
            >
              Start Game
            </button>
          </div>
        )}
      </div>

      {showJoinPrompt && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-neutral-900 p-8 rounded-xl border border-amber-600/20 shadow-glow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-amber-400">Enter Game Code</h2>
              <button
                onClick={() => setShowJoinPrompt(false)}
                className="text-neutral-400 hover:text-amber-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <input
              type="text"
              value={joinGameCode}
              onChange={(e) => setJoinGameCode(e.target.value.toUpperCase())}
              placeholder="Enter code..."
              className="w-full px-4 py-2 bg-neutral-800 border border-amber-600/20 
                       rounded-lg text-amber-400 placeholder-neutral-500 mb-4
                       focus:outline-none focus:border-amber-600/40"
              onKeyDown={(e) => e.key === 'Enter' && handleJoinSubmit()}
            />
            
            <button
              onClick={handleJoinSubmit}
              className="w-full px-6 py-3 bg-amber-600 hover:bg-amber-500 
                       transition-colors rounded-lg text-neutral-900 font-bold"
            >
              Join Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameMenu;