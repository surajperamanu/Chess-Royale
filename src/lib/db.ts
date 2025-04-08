import { neon } from '@neondatabase/serverless';

// Environment variable should be set in your .env file
const DATABASE_URL = import.meta.env.VITE_DATABASE_URL;

if (!DATABASE_URL) {
  console.error('Missing VITE_DATABASE_URL environment variable');
}

// Create a database connection instance
export const db = neon(DATABASE_URL || '');

// Initialize the database with required tables
export const initDatabase = async () => {
  try {
    await db`
      CREATE TABLE IF NOT EXISTS game_comments (
        id SERIAL PRIMARY KEY,
        game_id TEXT,
        move_number INT,
        comment TEXT NOT NULL,
        rating INT,
        player_side TEXT,
        tactical_idea TEXT,
        position TEXT,
        evaluation TEXT,
        time_spent INT,
        alternative TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return false;
  }
};

// Interface for comment data
export interface GameCommentData {
  game_id?: string;
  move_number?: number;
  comment: string;
  rating?: number;
  player_side?: string;
  tactical_idea?: string;
  position?: string;
  evaluation?: string;
  time_spent?: number;
  alternative?: string;
}

// Add a new comment to the database
export const addGameComment = async (commentData: GameCommentData) => {
  try {
    const result = await db`
      INSERT INTO game_comments (
        game_id, 
        move_number, 
        comment, 
        rating, 
        player_side, 
        tactical_idea,
        position,
        evaluation,
        time_spent,
        alternative
      ) VALUES (
        ${commentData.game_id || null}, 
        ${commentData.move_number || null}, 
        ${commentData.comment}, 
        ${commentData.rating || null}, 
        ${commentData.player_side || null}, 
        ${commentData.tactical_idea || null},
        ${commentData.position || null},
        ${commentData.evaluation || null},
        ${commentData.time_spent || null},
        ${commentData.alternative || null}
      ) RETURNING *
    `;
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Failed to add comment:', error);
    return { success: false, error };
  }
};

// Get all comments for a specific game
export const getGameComments = async (gameId?: string) => {
  try {
    let comments;
    if (gameId) {
      comments = await db`
        SELECT * FROM game_comments 
        WHERE game_id = ${gameId}
        ORDER BY move_number, created_at DESC
      `;
    } else {
      comments = await db`
        SELECT * FROM game_comments 
        ORDER BY created_at DESC 
        LIMIT 50
      `;
    }
    return { success: true, data: comments };
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return { success: false, error };
  }
};

// Get comments for a specific move in a game
export const getMoveComments = async (gameId: string, moveNumber: number) => {
  try {
    const comments = await db`
      SELECT * FROM game_comments 
      WHERE game_id = ${gameId} AND move_number = ${moveNumber}
      ORDER BY created_at DESC
    `;
    return { success: true, data: comments };
  } catch (error) {
    console.error('Failed to fetch move comments:', error);
    return { success: false, error };
  }
};

// Get game statistics
export const getGameStats = async (gameId: string) => {
  try {
    const stats = await db`
      SELECT 
        COUNT(*) as total_comments,
        AVG(rating) as avg_rating,
        COUNT(DISTINCT move_number) as moves_with_comments
      FROM game_comments 
      WHERE game_id = ${gameId}
    `;
    return { success: true, data: stats[0] };
  } catch (error) {
    console.error('Failed to fetch game statistics:', error);
    return { success: false, error };
  }
}; 