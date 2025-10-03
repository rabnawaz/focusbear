import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { mockData } from '../data/mockData';
import LeaderboardModal from '../components/LeaderboardModal';
import { fetchQuizData, testAPI } from '../services/api';

// Local fallback data function
const getFallbackQuizData = (topic) => {
  const fallbackData = {
    'python': [
      {
        id: 1,
        question: `Select the ${topic.toLowerCase()}-related task:`,
        options: [
          "Write a Python function to calculate the factorial of a number.",
          "Describe the history of medieval castles in Europe.",
          "Explain how to bake a chocolate cake from a recipe.",
          "List the capitals of three European countries."
        ],
        correctAnswer: 0,
        isCorrect: false
      },
      {
        id: 2,
        question: `Choose the ${topic.toLowerCase()} programming task:`,
        options: [
          "Create a Python script to read and process a CSV file.",
          "Explain the process of making homemade pasta.",
          "Describe the life cycle of a butterfly.",
          "List the names of five famous painters."
        ],
        correctAnswer: 0,
        isCorrect: false
      },
      {
        id: 3,
        question: `Which is a ${topic.toLowerCase()} coding exercise?`,
        options: [
          "Implement a binary search algorithm in Python.",
          "Describe how to grow tomatoes in a garden.",
          "Explain the structure of the human heart.",
          "List the steps to change a car tire."
        ],
        correctAnswer: 0,
        isCorrect: false
      }
    ]
  };
  
  return fallbackData[topic.toLowerCase()] || fallbackData['python'];
};

const MissionBriefingScreen = ({ navigation }) => {
  const [mission, setMission] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStartWarmUp = async () => {
    if (!mission.trim()) {
      Alert.alert('Error', 'Please enter a mission before starting');
      return;
    }

    setLoading(true);
    
    // Add a small delay to ensure loading screen appears
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      // Extract topic from mission with better logic
      let topic = mission.toLowerCase().trim();
      
      // Common topic mappings
      const topicMappings = {
        'gym': 'Gym',
        'workout': 'Gym',
        'exercise': 'Gym',
        'python': 'Python',
        'javascript': 'Javascript',
        'js': 'Javascript',
        'yoga': 'Yoga',
        'meditation': 'Yoga',
        'coding': 'Python',
        'programming': 'Python',
        'study': 'Python',
        'learn': 'Python'
      };
      
      // Check if mission contains any mapped topics
      let extractedTopic = null;
      for (const [key, value] of Object.entries(topicMappings)) {
        if (topic.includes(key)) {
          extractedTopic = value;
          break;
        }
      }
      
      // If no mapping found, use the last word and capitalize it
      if (!extractedTopic) {
        const lastWord = topic.split(' ').pop();
        extractedTopic = lastWord.charAt(0).toUpperCase() + lastWord.slice(1);
      }
      
      console.log(`Mission: "${mission}" -> Extracted topic: "${extractedTopic}"`);
      
      // Test API connectivity first with the extracted topic
      console.log('Testing API connectivity...');
      let apiWorking = false;
      try {
        apiWorking = await testAPI(extractedTopic);
        console.log('API working:', apiWorking);
      } catch (testError) {
        console.log('API test failed:', testError.message);
        apiWorking = false;
      }
      
      // Always try the main API call first, regardless of test result
      let quizData;
      let apiSuccess = false;
      
      if (apiWorking) {
        console.log('API test passed, attempting to fetch quiz data...');
        try {
          quizData = await Promise.race([
            fetchQuizData(extractedTopic),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Request timeout')), 10000)
            )
          ]);
          apiSuccess = true;
          console.log('API data fetched successfully');
        } catch (fetchError) {
          console.log('Main API call failed:', fetchError.message);
          apiSuccess = false;
        }
      }
      
      // If API failed or test failed, use fallback data
      if (!apiSuccess) {
        console.log('Using fallback data due to API failure');
        quizData = getFallbackQuizData(extractedTopic);
      }
      
      // Navigate to quiz screen with the data (either from API or fallback)
      navigation.navigate('Quiz', { 
        quizData, 
        mission, 
        topic: extractedTopic,
        currentRound: 1,
        totalRounds: 6,
        wrongAttempts: 0,
        gameStats: {
          score: 0,
          streak: 0,
          bestRT: 0,
          correctAnswers: 0,
          totalAnswered: 0
        }
      });
      
    } catch (error) {
      console.error('Error in handleStartWarmUp:', error);
      
      // If we get here, something went wrong with the entire process
      // Use fallback data and navigate directly
      const fallbackData = getFallbackQuizData(extractedTopic);
      navigation.navigate('Quiz', { 
        quizData: fallbackData, 
        mission, 
        topic: extractedTopic,
        currentRound: 1,
        totalRounds: 6,
        wrongAttempts: 0,
        gameStats: {
          score: 0,
          streak: 0,
          bestRT: 0,
          correctAnswers: 0,
          totalAnswered: 0
        }
      });
      
    } finally {
      // Always clear loading state
      setLoading(false);
    }
  };

  const handleLeaderboard = () => {
    setShowLeaderboard(true);
  };

  const { height: screenHeight } = Dimensions.get('window');
  const statusBarHeight = Platform.OS === 'ios' ? 44 : 24;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Top Section */}
      <View style={styles.topSection}>
        {/* Progress Dots */}
        <View style={styles.progressDots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        
        {/* Game Stats */}
        <View style={styles.gameStats}>
          <Text style={styles.gameStatText}>Round {mockData.gameStats.round}/{mockData.gameStats.totalRounds}</Text>
          <Text style={styles.gameStatText}>Best RT — ms</Text>
          <Text style={styles.gameStatText}>Streak {mockData.gameStats.streak}</Text>
          <Text style={styles.gameStatText}>Score {mockData.gameStats.score}</Text>
          <View style={styles.scoreIcon}>
            <Text style={styles.scoreIconText}>⚡</Text>
          </View>
        </View>
        
        {/* Leaderboard Button */}
        <TouchableOpacity style={styles.leaderboardButton} onPress={handleLeaderboard}>
          <Text style={styles.leaderboardButtonText}>Leaderboard</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Screen */}
      {loading && (
        <View style={styles.loadingScreen}>
          <View style={styles.loadingContent}>
            <Text style={styles.bearIcon}>🐻</Text>
            <Text style={styles.loadingText}>Loading Quiz Data...</Text>
            <Text style={styles.loadingSubtext}>Please wait while we prepare your questions</Text>
          </View>
        </View>
      )}

      {/* Mission Briefing Card */}
      <View style={[styles.missionCard, loading && styles.missionCardHidden]}>
        <Text style={styles.missionTitle}>Mission briefing</Text>
        
        <TextInput
          style={styles.missionInput}
          placeholder="e.g., Go to gym"
          placeholderTextColor={colors.gray}
          value={mission}
          onChangeText={setMission}
        />
        
        <TouchableOpacity 
          style={[styles.startButton, loading && styles.startButtonDisabled]} 
          onPress={handleStartWarmUp}
          disabled={loading}
        >
          <Text style={styles.startButtonText}>
            {loading ? 'Loading Quiz Data...' : 'Start Warm-Up'}
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.tipText}>
          Tip: keep it specific. We'll auto-generate relevant mini tasks + plausible fake work + common distractions.
        </Text>
      </View>

      {/* Leaderboard Modal */}
      <LeaderboardModal 
        visible={showLeaderboard} 
        onClose={() => setShowLeaderboard(false)} 
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 15,
    minHeight: 80,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.yellow,
  },
  gameStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'nowrap',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  gameStatText: {
    ...typography.gameStat,
    fontSize: 11,
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  scoreIcon: {
    marginLeft: 4,
  },
  scoreIconText: {
    fontSize: 16,
    color: colors.lightBlue,
  },
  leaderboardButton: {
    backgroundColor: colors.blue,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    flexShrink: 0,
  },
  leaderboardButtonText: {
    ...typography.buttonSmall,
    color: colors.white,
    fontSize: 11,
  },
  loadingScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bearIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  loadingText: {
    ...typography.h2,
    color: colors.white,
    marginBottom: 10,
    textAlign: 'center',
  },
  loadingSubtext: {
    ...typography.bodySmall,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
  missionCard: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginVertical: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  missionCardHidden: {
    opacity: 0.3,
  },
  missionTitle: {
    ...typography.h2,
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  missionInput: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    ...typography.input,
  },
  startButton: {
    backgroundColor: colors.blue,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  startButtonText: {
    ...typography.button,
    fontSize: 20,
  },
  startButtonDisabled: {
    backgroundColor: colors.gray,
    opacity: 0.6,
  },
  tipText: {
    ...typography.bodySmall,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default MissionBriefingScreen;
