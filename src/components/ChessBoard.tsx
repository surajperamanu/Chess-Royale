import React, { useState, useEffect } from 'react';
import { Chess, Square } from 'chess.js';

// Chess piece Unicode characters
const PIECES = {
  BLACK: {
    KING: '♚',
    QUEEN: '♛',
    ROOK: '♜',
    BISHOP: '♝',
    KNIGHT: '♞',
    PAWN: '♟︎',
  },
  WHITE: {
    KING: '♔',
    QUEEN: '♕',
    ROOK: '♖',
    BISHOP: '♗',
    KNIGHT: '♘',
    PAWN: '♙︎',
  },
};

interface ChessBoardProps {
  onMovesChange?: (moves: string[]) => void;
  onPositionChange?: (fen: string) => void;
}

const getPieceCharacter = (piece: string): string => {
  const mapping: { [key: string]: string } = {
    'k': PIECES.BLACK.KING,
    'q': PIECES.BLACK.QUEEN,
    'r': PIECES.BLACK.ROOK,
    'b': PIECES.BLACK.BISHOP,
    'n': PIECES.BLACK.KNIGHT,
    'p': PIECES.BLACK.PAWN,
    'K': PIECES.WHITE.KING,
    'Q': PIECES.WHITE.QUEEN,
    'R': PIECES.WHITE.ROOK,
    'B': PIECES.WHITE.BISHOP,
    'N': PIECES.WHITE.KNIGHT,
    'P': PIECES.WHITE.PAWN,
  };
  return mapping[piece] || '';
};

const ChessBoard: React.FC<ChessBoardProps> = ({ onMovesChange, onPositionChange }) => {
  // Initialize chess.js instance
  const [game] = useState(new Chess());
  // Track board state, selected square, and valid moves
  const [board, setBoard] = useState<string[][]>(Array(8).fill(0).map(() => Array(8).fill('')));
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<Square[]>([]);
  const [gameStatus, setGameStatus] = useState('');

  // Convert from our array coordinates to chess.js algebraic notation
  const toAlgebraic = (row: number, col: number): Square => {
    const file = String.fromCharCode(97 + col); // 'a' is 97 in ASCII
    const rank = 8 - row;
    return `${file}${rank}` as Square;
  };
  
  // Notify parent component about move history changes
  const updateMoveHistory = () => {
    // Notify parent component if callback provided
    if (onMovesChange) {
      onMovesChange(game.history());
    }
  };

  // Notify parent component about position changes
  const updatePosition = () => {
    if (onPositionChange) {
      onPositionChange(game.fen());
    }
  };
  
  // Sync board state with chess.js
  const updateBoard = () => {
    const newBoard = Array(8).fill(0).map(() => Array(8).fill(''));
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = toAlgebraic(row, col);
        const piece = game.get(square);
        
        if (piece) {
          // Convert to our notation (p/P for pawns, etc.)
          const pieceChar = piece.type.toUpperCase(); // Get piece type (p, n, b, r, q, k)
          newBoard[row][col] = piece.color === 'w' 
            ? pieceChar 
            : pieceChar.toLowerCase();
        }
      }
    }
    
    setBoard(newBoard);
    updateGameStatus();
    updateMoveHistory();
    updatePosition();
  };
  
  // Update game status (checkmate, check, etc.)
  const updateGameStatus = () => {
    if (game.isCheckmate()) {
      setGameStatus(`Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins!`);
    } else if (game.isDraw()) {
      setGameStatus('Draw!');
    } else if (game.isCheck()) {
      setGameStatus(`${game.turn() === 'w' ? 'White' : 'Black'} is in check!`);
    } else {
      setGameStatus(`${game.turn() === 'w' ? 'White' : 'Black'} to move`);
    }
  };
  
  // Handle square click
  const handleSquareClick = (row: number, col: number) => {
    const clickedSquare = toAlgebraic(row, col);
    
    // If square already selected, try to move
    if (selectedSquare) {
      try {
        // Attempt to make move
        const move = game.move({
          from: selectedSquare,
          to: clickedSquare,
          promotion: 'q' // Always promote to queen for simplicity
        });
        
        // If move was successful, update board
        if (move) {
          updateBoard();
          setSelectedSquare(null);
          setValidMoves([]);
        }
      } catch (e) {
        // Invalid move, check if selecting new piece
        const piece = game.get(clickedSquare);
        if (piece && piece.color === game.turn()) {
          // Select new piece
          setSelectedSquare(clickedSquare);
          highlightMoves(clickedSquare);
        } else {
          // Clear selection
          setSelectedSquare(null);
          setValidMoves([]);
        }
      }
    } else {
      // No piece selected, try to select one
      const piece = game.get(clickedSquare);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(clickedSquare);
        highlightMoves(clickedSquare);
      }
    }
  };
  
  // Find valid moves for a piece
  const highlightMoves = (square: Square) => {
    const moves = game.moves({ 
      square,
      verbose: true 
    });
    
    // Extract destination squares
    const destinations = moves.map(move => move.to);
    setValidMoves(destinations);
  };
  
  // Initialize the board on component mount
  useEffect(() => {
    updateBoard();
  }, []);
  
  // Reset the game
  const resetGame = () => {
    game.reset();
    updateBoard();
    setSelectedSquare(null);
    setValidMoves([]);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 text-amber-400 font-semibold text-lg">
        {gameStatus}
      </div>
      <div className="grid grid-cols-8 w-[600px] h-[600px] bg-gradient-to-br from-neutral-900 to-neutral-800 shadow-2xl border border-amber-600/20 relative">
        {board.flat().map((piece, i) => {
          const row = Math.floor(i / 8);
          const col = i % 8;
          const squareNotation = toAlgebraic(row, col);
          const isBlack = (row + col) % 2 === 1;
          const pieceChar = getPieceCharacter(piece);
          const isWhitePiece = piece === piece.toUpperCase();
          const isPawn = piece?.toLowerCase() === 'p';
          
          // Highlight states
          const isSelected = selectedSquare === squareNotation;
          const isValidMove = validMoves.includes(squareNotation);
          
          return (
            <div
              key={i}
              className={`
                ${isBlack ? 'bg-[#8B4513]' : 'bg-[#DEB887]'}
                ${isSelected ? 'ring-4 ring-blue-500 ring-inset' : ''}
                ${isValidMove ? 'ring-4 ring-green-500 ring-inset' : ''}
                transition-colors duration-300 hover:bg-amber-600/20
                relative
                cursor-pointer
              `}
              onClick={() => handleSquareClick(row, col)}
            >
              {piece && (
                <div
                  className={`absolute inset-0 flex items-center justify-center select-none ${isPawn ? 'text-[2.8rem]' : 'text-[3rem]'}`}
                  style={{
                    color: isWhitePiece ? '#FFFFFF' : '#000000',
                    fontWeight: 'bold',
                  }}
                >
                  {pieceChar}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <button 
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        onClick={resetGame}
      >
        Reset Game
      </button>
    </div>
  );
};

export default ChessBoard;