import React, { useState, useEffect } from 'react';
import { getGameComments, getMoveComments, getGameStats } from '../lib/db';
import GameCommentForm from './GameCommentForm';

interface GameComment {
  id: number;
  game_id: string | null;
  move_number: number | null;
  comment: string;
  rating: number | null;
  player_side: string | null;
  tactical_idea: string | null;
  position: string | null;
  evaluation: string | null;
  time_spent: number | null;
  alternative: string | null;
  created_at: string;
}

interface GameStats {
  total_comments: number;
  avg_rating: number | null;
  moves_with_comments: number;
}

interface GameCommentsProps {
  gameId?: string;
  currentMoveNumber?: number;
  activePosition?: string; // FEN notation of current position
}

const GameComments: React.FC<GameCommentsProps> = ({ 
  gameId, 
  currentMoveNumber,
  activePosition 
}) => {
  const [comments, setComments] = useState<GameComment[]>([]);
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'current'>('all');

  const fetchComments = async () => {
    setLoading(true);
    try {
      let result;
      
      if (filter === 'current' && currentMoveNumber && gameId) {
        result = await getMoveComments(gameId, currentMoveNumber);
      } else {
        result = await getGameComments(gameId);
      }
      
      if (result.success && result.data) {
        setComments(result.data as GameComment[]);
      } else {
        throw new Error('Failed to fetch comments');
      }
      
      // Fetch game stats if we have a gameId
      if (gameId) {
        const statsResult = await getGameStats(gameId);
        if (statsResult.success && statsResult.data) {
          setGameStats(statsResult.data as GameStats);
        }
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, filter, currentMoveNumber]);

  const handleCommentAdded = () => {
    fetchComments();
    setShowForm(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="bg-neutral-800 rounded-lg text-white p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-amber-400">Game Analysis</h2>
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'current')}
            className="px-2 py-1 bg-neutral-700 border border-neutral-600 rounded-md text-sm"
          >
            <option value="all">All Moves</option>
            <option value="current">Current Move</option>
          </select>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 rounded-md text-sm font-medium"
          >
            {showForm ? 'Hide Form' : 'Add Analysis'}
          </button>
        </div>
      </div>

      {/* Game Statistics Section */}
      {gameStats && (
        <div className="mb-4 p-3 bg-neutral-700 rounded-lg flex justify-between text-sm">
          <div>
            <span className="text-amber-400 font-medium">Total Comments:</span> {gameStats.total_comments}
          </div>
          <div>
            <span className="text-amber-400 font-medium">Avg Rating:</span> {gameStats.avg_rating ? gameStats.avg_rating.toFixed(1) : 'N/A'}
          </div>
          <div>
            <span className="text-amber-400 font-medium">Moves Analyzed:</span> {gameStats.moves_with_comments}
          </div>
        </div>
      )}

      {showForm && (
        <div className="mb-6">
          <GameCommentForm 
            gameId={gameId}
            currentMoveNumber={currentMoveNumber}
            onCommentAdded={handleCommentAdded}
            activePosition={activePosition}
          />
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">
          <p className="text-neutral-400">Loading comments...</p>
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <p className="text-red-400">{error}</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-4 border border-dashed border-neutral-700 rounded-lg">
          <p className="text-neutral-400">
            {filter === 'current' 
              ? 'No analysis for this move yet. Add your thoughts!'
              : 'No analysis yet. Be the first to comment!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-neutral-700 p-3 rounded-lg">
              <div className="flex justify-between text-sm text-neutral-400 mb-1">
                <div className="flex flex-wrap gap-2">
                  {comment.move_number && (
                    <span className="px-2 py-0.5 bg-neutral-600 rounded-full text-xs">
                      Move {comment.move_number}
                    </span>
                  )}
                  {comment.player_side && (
                    <span className="px-2 py-0.5 bg-neutral-600 rounded-full text-xs capitalize">
                      {comment.player_side}
                    </span>
                  )}
                  {comment.tactical_idea && (
                    <span className="px-2 py-0.5 bg-amber-800 text-amber-200 rounded-full text-xs">
                      {comment.tactical_idea}
                    </span>
                  )}
                </div>
                {comment.rating && (
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(comment.rating)].map((_, i) => (
                        <span key={i} className="text-amber-400">★</span>
                      ))}
                      {[...Array(10 - comment.rating)].map((_, i) => (
                        <span key={i} className="text-neutral-500">★</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <p className="mb-2 text-white">{comment.comment}</p>
              
              {/* Additional fields */}
              <div className="grid grid-cols-2 gap-4 mb-2 text-sm">
                {comment.evaluation && (
                  <div>
                    <span className="text-amber-400 font-medium">Evaluation:</span> {comment.evaluation}
                  </div>
                )}
                {comment.time_spent && (
                  <div>
                    <span className="text-amber-400 font-medium">Time:</span> {comment.time_spent}s
                  </div>
                )}
                {comment.alternative && (
                  <div className="col-span-2">
                    <span className="text-amber-400 font-medium">Alternative:</span> {comment.alternative}
                  </div>
                )}
              </div>
              
              <div className="text-xs text-neutral-400 text-right">
                {formatDate(comment.created_at)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameComments; 