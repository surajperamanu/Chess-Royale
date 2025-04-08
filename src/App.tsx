import React, { useState } from 'react';
import ChessBoard from './components/ChessBoard';
import PlayerPanel from './components/PlayerPanel';
import MoveHistory from './components/MoveHistory';
import GameControls from './components/GameControls';
import GameMenu from './components/GameMenu';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [moves, setMoves] = useState<string[]>([]);

  const generateGameCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  const handleCreateGame = () => {
    const code = generateGameCode();
    setGameCode(code);
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleJoinGame = (code: string) => {
    console.log('Joining game with code:', code);
    setGameStarted(true);
  };

  const handleMovesChange = (newMoves: string[]) => {
    setMoves(newMoves);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-8">
        <GameMenu 
          onCreateGame={handleCreateGame}
          onJoinGame={handleJoinGame}
          onStartGame={handleStartGame}
          gameCode={gameCode}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="flex gap-8">
        <div className="flex flex-col">
          <PlayerPanel name="Magnus Carlsen" rating={2847} time="05:00" />
          <ChessBoard onMovesChange={handleMovesChange} />
          <PlayerPanel name="Hikaru Nakamura" rating={2812} time="05:00" isBottom />
        </div>
        
        <div className="w-[300px] flex flex-col gap-4">
          <MoveHistory moves={moves} />
          <GameControls />
        </div>
      </div>
    </div>
  );
}

export default App;