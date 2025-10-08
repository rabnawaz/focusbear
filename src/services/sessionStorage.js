import AsyncStorage from '@react-native-async-storage/async-storage';

const LEADERBOARD_KEY = 'focus_game_leaderboard';

// Fallback in-memory storage if AsyncStorage fails
let fallbackStorage = {
  leaderboard: [],
  currentSession: null
};

// Save quiz result to leaderboard
export const saveQuizResult = async (quizData) => {
  try {
    const { scoreName, score, bestRT, accuracy, topic, completedRounds, totalRounds } = quizData;
    
    const newEntry = {
      id: Date.now().toString(),
      userName: scoreName || `${topic} quiz`,
      score: score,
      bestRT: bestRT,
      accuracy: accuracy,
      topic: topic,
      completedRounds: completedRounds,
      totalRounds: totalRounds,
      timestamp: new Date().toISOString(),
    };

    // Get existing leaderboard data
    const existingData = await getLeaderboardData();
    
    // Add new entry
    const updatedData = [...existingData, newEntry];
    
    // Sort by score (highest first), then by bestRT (lowest first)
    updatedData.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.bestRT - b.bestRT;
    });

    // Keep only top 10 entries
    const topEntries = updatedData.slice(0, 10);
    
    // Save to storage
    await AsyncStorage.setItem(LEADERBOARD_KEY, JSON.stringify(topEntries));
    
    console.log('Quiz result saved to leaderboard:', newEntry);
    return newEntry;
  } catch (error) {
    console.error('Error saving quiz result to AsyncStorage, using fallback:', error);
    
    // Fallback to in-memory storage
    try {
      const newEntry = {
        id: Date.now().toString(),
        userName: quizData.scoreName || `${quizData.topic} quiz`,
        score: quizData.score,
        bestRT: quizData.bestRT,
        accuracy: quizData.accuracy,
        topic: quizData.topic,
        completedRounds: quizData.completedRounds,
        totalRounds: quizData.totalRounds,
        timestamp: new Date().toISOString(),
      };

      fallbackStorage.leaderboard.push(newEntry);
      fallbackStorage.leaderboard.sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return a.bestRT - b.bestRT;
      });
      fallbackStorage.leaderboard = fallbackStorage.leaderboard.slice(0, 10);
      
      console.log('Quiz result saved to fallback storage:', newEntry);
      return newEntry;
    } catch (fallbackError) {
      console.error('Error saving to fallback storage:', fallbackError);
      throw fallbackError;
    }
  }
};

// Get leaderboard data
export const getLeaderboardData = async () => {
  try {
    const data = await AsyncStorage.getItem(LEADERBOARD_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error getting leaderboard data from AsyncStorage, using fallback:', error);
    return fallbackStorage.leaderboard;
  }
};

// Clear all leaderboard data
export const clearLeaderboardData = async () => {
  try {
    await AsyncStorage.removeItem(LEADERBOARD_KEY);
    fallbackStorage.leaderboard = [];
    console.log('Leaderboard data cleared');
  } catch (error) {
    console.error('Error clearing leaderboard data:', error);
    fallbackStorage.leaderboard = [];
    throw error;
  }
};

// Get current session data
export const getCurrentSessionData = async () => {
  try {
    const data = await AsyncStorage.getItem('focus_game_current_session');
    if (data) {
      return JSON.parse(data);
    }
    return fallbackStorage.currentSession;
  } catch (error) {
    console.error('Error getting current session data from AsyncStorage, using fallback:', error);
    return fallbackStorage.currentSession;
  }
};

// Save current session data
export const saveCurrentSessionData = async (sessionData) => {
  try {
    await AsyncStorage.setItem('focus_game_current_session', JSON.stringify(sessionData));
    fallbackStorage.currentSession = sessionData;
    console.log('Current session data saved');
  } catch (error) {
    console.error('Error saving current session data to AsyncStorage, using fallback:', error);
    fallbackStorage.currentSession = sessionData;
    console.log('Current session data saved to fallback storage');
  }
};
