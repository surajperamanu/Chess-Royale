import React from 'react';
import { Clock, Crown, Trophy } from 'lucide-react';

interface PlayerPanelProps {
  name: string;
  rating: number;
  time: string;
  isBottom?: boolean;
}

const PlayerPanel: React.FC<PlayerPanelProps> = ({ name, rating, time, isBottom }) => {
  return (
    <div className={`
      flex items-center gap-4 p-4 
      bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900
      border border-amber-600/20 rounded-lg
      ${isBottom ? 'mt-4' : 'mb-4'}
    `}>
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
        <Crown className="w-6 h-6 text-neutral-900" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold">{name}</span>
          <Trophy className="w-4 h-4 text-amber-600" />
          <span className="text-neutral-400">{rating}</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-400">
          <Clock className="w-4 h-4" />
          <span>{time}</span>
        </div>
      </div>
    </div>
  );
};

export default PlayerPanel;