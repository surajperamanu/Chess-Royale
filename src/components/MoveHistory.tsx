import React from 'react';
import { ScrollText } from 'lucide-react';

interface MoveHistoryProps {
  moves: string[];
  onMoveSelect?: (moveIndex: number) => void;
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ moves = [], onMoveSelect }) => {
  const formatMoves = () => {
    const formattedMoves = [];
    for (let i = 0; i < moves.length; i += 2) {
      const moveNumber = Math.floor(i / 2) + 1;
      const whiteMove = moves[i] || '';
      const blackMove = moves[i + 1] || '';
      
      formattedMoves.push({ moveNumber, whiteMove, blackMove });
    }
    return formattedMoves;
  };

  const handleMoveClick = (moveIndex: number) => {
    if (onMoveSelect) {
      onMoveSelect(moveIndex);
    }
  };

  return (
    <div className="bg-neutral-900 border border-amber-600/20 rounded-lg p-4 h-[300px] overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <ScrollText className="w-5 h-5 text-amber-400" />
        <h3 className="text-amber-400 font-bold">Move History</h3>
      </div>
      <div className="space-y-2 text-neutral-400">
        {formatMoves().map((move, index) => (
          <div key={index} className="flex gap-4">
            <span className="text-amber-600">{move.moveNumber}.</span>
            {move.whiteMove && (
              <span 
                className="cursor-pointer hover:text-white transition-colors"
                onClick={() => handleMoveClick(index * 2)}
              >
                {move.whiteMove}
              </span>
            )}
            {move.blackMove && (
              <span 
                className="cursor-pointer hover:text-white transition-colors"
                onClick={() => handleMoveClick(index * 2 + 1)}
              >
                {move.blackMove}
              </span>
            )}
          </div>
        ))}
        {moves.length === 0 && (
          <div className="text-gray-500 italic">No moves yet</div>
        )}
      </div>
    </div>
  );
};

export default MoveHistory;