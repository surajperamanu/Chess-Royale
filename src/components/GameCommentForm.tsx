import React, { useState } from 'react';
import { addGameComment, GameCommentData } from '../lib/db';

interface GameCommentFormProps {
  gameId?: string;
  currentMoveNumber?: number;
  onCommentAdded?: () => void;
  activePosition?: string; // FEN notation of current position
}

const GameCommentForm: React.FC<GameCommentFormProps> = ({
  gameId,
  currentMoveNumber,
  onCommentAdded,
  activePosition
}) => {
  const [formData, setFormData] = useState({
    comment: '',
    moveNumber: currentMoveNumber?.toString() || '',
    rating: '',
    playerSide: '',
    tacticalIdea: '',
    evaluation: '', // Engine evaluation (+1.2, -0.5, etc.)
    timeSpent: '', // Time spent thinking on this move
    alternative: '', // Alternative move suggestion
  });
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.comment.trim()) {
      setError('Comment is required');
      return;
    }

    try {
      setStatus('submitting');
      
      const commentData: GameCommentData = {
        game_id: gameId,
        move_number: formData.moveNumber ? parseInt(formData.moveNumber, 10) : undefined,
        comment: formData.comment,
        rating: formData.rating ? parseInt(formData.rating, 10) : undefined,
        player_side: formData.playerSide || undefined,
        tactical_idea: formData.tacticalIdea || undefined,
        position: activePosition,
        evaluation: formData.evaluation || undefined,
        time_spent: formData.timeSpent ? parseInt(formData.timeSpent, 10) : undefined,
        alternative: formData.alternative || undefined,
      };
      
      const result = await addGameComment(commentData);

      if (result.success) {
        setStatus('success');
        // Reset form
        setFormData({
          comment: '',
          moveNumber: currentMoveNumber?.toString() || '',
          rating: '',
          playerSide: '',
          tacticalIdea: '',
          evaluation: '',
          timeSpent: '',
          alternative: '',
        });
        setError('');
        
        // Call the callback if provided
        if (onCommentAdded) {
          onCommentAdded();
        }
        
        // Reset status after 3 seconds
        setTimeout(() => {
          setStatus('idle');
        }, 3000);
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  return (
    <div className="p-4 bg-neutral-800 rounded-lg text-white">
      <h2 className="text-xl font-bold mb-4 text-amber-400">Add Game Analysis</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="comment" className="block text-sm font-medium mb-1">
            Analysis
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Your analysis or thoughts about this position..."
            className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            rows={3}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="moveNumber" className="block text-sm font-medium mb-1">
              Move Number
            </label>
            <input
              type="number"
              id="moveNumber"
              name="moveNumber"
              value={formData.moveNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Move #"
            />
          </div>
          
          <div>
            <label htmlFor="rating" className="block text-sm font-medium mb-1">
              Position Rating (1-10)
            </label>
            <input
              type="number"
              id="rating"
              name="rating"
              min="1"
              max="10"
              value={formData.rating}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Rating"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="playerSide" className="block text-sm font-medium mb-1">
              Player Side
            </label>
            <select
              id="playerSide"
              name="playerSide"
              value={formData.playerSide}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Select Side</option>
              <option value="white">White</option>
              <option value="black">Black</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="tacticalIdea" className="block text-sm font-medium mb-1">
              Tactical Idea
            </label>
            <select
              id="tacticalIdea"
              name="tacticalIdea"
              value={formData.tacticalIdea}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Select Idea</option>
              <option value="attack">Attack</option>
              <option value="defense">Defense</option>
              <option value="fork">Fork</option>
              <option value="pin">Pin</option>
              <option value="skewer">Skewer</option>
              <option value="discovery">Discovery</option>
              <option value="doubleAttack">Double Attack</option>
              <option value="sacrifice">Sacrifice</option>
              <option value="promotion">Promotion</option>
              <option value="zugzwang">Zugzwang</option>
              <option value="tempo">Tempo</option>
              <option value="endgame">Endgame Technique</option>
              <option value="opening">Opening Theory</option>
              <option value="middlegame">Middlegame Strategy</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="evaluation" className="block text-sm font-medium mb-1">
              Engine Evaluation
            </label>
            <input
              type="text"
              id="evaluation"
              name="evaluation"
              value={formData.evaluation}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="e.g. +0.7, -1.2"
            />
          </div>
          
          <div>
            <label htmlFor="timeSpent" className="block text-sm font-medium mb-1">
              Time Spent (seconds)
            </label>
            <input
              type="number"
              id="timeSpent"
              name="timeSpent"
              value={formData.timeSpent}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Time in seconds"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="alternative" className="block text-sm font-medium mb-1">
            Alternative Move
          </label>
          <input
            type="text"
            id="alternative"
            name="alternative"
            value={formData.alternative}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="e.g. Nf3, e4"
          />
        </div>
        
        <button
          type="submit"
          disabled={status === 'submitting'}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors
            ${status === 'submitting' 
              ? 'bg-amber-700 cursor-not-allowed' 
              : 'bg-amber-600 hover:bg-amber-700'
            }`}
        >
          {status === 'submitting' ? 'Submitting...' : 'Submit Analysis'}
        </button>
      </form>
      
      {status === 'success' && (
        <div className="mt-4 p-2 bg-green-900 text-green-300 rounded-md">
          Analysis submitted successfully!
        </div>
      )}
      
      {status === 'error' && (
        <div className="mt-4 p-2 bg-red-900 text-red-300 rounded-md">
          Error: {error || 'Failed to submit analysis'}
        </div>
      )}
    </div>
  );
};

export default GameCommentForm; 