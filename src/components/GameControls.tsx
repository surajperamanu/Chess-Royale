import React from 'react';
import { Settings, MessageSquare, Medal, RotateCcw } from 'lucide-react';

const GameControls: React.FC = () => {
  return (
    <div className="flex gap-2 mt-4">
      {[
        { icon: Settings, label: 'Settings' },
        { icon: MessageSquare, label: 'Chat' },
        { icon: Medal, label: 'Achievements' },
        { icon: RotateCcw, label: 'Restart' }
      ].map(({ icon: Icon, label }) => (
        <button
          key={label}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 
                     transition-colors duration-200 rounded-lg border border-amber-600/20"
        >
          <Icon className="w-5 h-5 text-amber-400" />
          <span className="text-neutral-300">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default GameControls;