import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { mockData } from '../data/mockData';
import GameHeader from '../components/GameHeader';
import LeaderboardModal from '../components/LeaderboardModal';
import { saveQuizResult } from '../services/sessionStorage';

const ResultsScreen = ({ navigation, route }) => {
  const { mission, topic, accuracy, fastestRT, score, totalRounds, completedRounds } = route.params || mockData.results;
  const [scoreName, setScoreName] = useState(`${topic} quiz`);
  const [confettiAnim] = useState(new Animated.Value(0));
  const [progressAnim] = useState(new Animated.Value(0));
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Calculate progress based on success rate (accuracy + score performance)
  const calculateProgressPercentage = () => {
    const accuracyWeight = 0.7; // 70% weight for accuracy
    const scoreWeight = 0.3; // 30% weight for score performance
    
    // Normalize accuracy (0-100% becomes 0-1)
    const normalizedAccuracy = accuracy / 100;
    
    // Calculate max possible score based on perfect performance
    // Base score: 10 points per correct answer
    // Streak bonus: up to 5 additional points per answer
    const maxPossibleScore = totalRounds * 15; // 15 points per round max
    const normalizedScore = Math.min(score / maxPossibleScore, 1);
    
    // Calculate weighted progress
    const progress = (normalizedAccuracy * accuracyWeight) + (normalizedScore * scoreWeight);
    
    // Convert to percentage and ensure it's between 0-100
    const finalProgress = Math.min(Math.max(progress * 100, 0), 100);
    
    console.log(`Progress Calculation: Accuracy=${accuracy}%, Score=${score}/${maxPossibleScore}, Final=${finalProgress}%`);
    
    return finalProgress;
  };

  const progressPercentage = calculateProgressPercentage();

  useEffect(() => {
    // Start confetti animation
    Animated.timing(confettiAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Start progress bar animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleSaveScore = async () => {
    try {
      const quizData = {
        scoreName: scoreName,
        score: score,
        bestRT: fastestRT,
        accuracy: accuracy,
        topic: topic,
        completedRounds: completedRounds,
        totalRounds: totalRounds,
        mission: mission,
      };
      
      await saveQuizResult(quizData);
      console.log('Score saved successfully:', scoreName);
      navigation.navigate('MissionBriefing');
    } catch (error) {
      console.error('Error saving score:', error);
      // Still navigate even if save fails
      navigation.navigate('MissionBriefing');
    }
  };

  const handleLeaderboard = () => {
    setShowLeaderboard(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Game Header */}
      <GameHeader 
        currentRound={completedRounds}
        totalRounds={totalRounds}
        bestRT={fastestRT}
        currentStreak={completedRounds === totalRounds ? completedRounds : 0}
        currentScore={score}
        onLeaderboardPress={handleLeaderboard}
      />

      {/* Results Card */}
      <View style={styles.resultsCard}>
        {/* Celebration Message */}
        <View style={styles.celebrationContainer}>
          <Animated.Text 
            style={[
              styles.confetti,
              {
                opacity: confettiAnim,
                transform: [
                  { scale: confettiAnim },
                  { rotate: confettiAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  })}
                ],
              },
            ]}
          >
            🎉
          </Animated.Text>
          <Text style={styles.celebrationTitle}>Perfect! Focus primed. Ready?</Text>
          <Animated.Text 
            style={[
              styles.confetti,
              {
                opacity: confettiAnim,
                transform: [
                  { scale: confettiAnim },
                  { rotate: confettiAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '-360deg'],
                  })}
                ],
              },
            ]}
          >
            🎉
          </Animated.Text>
        </View>

        {/* Performance Metrics */}
        <View style={styles.metricsContainer}>
          <Text style={styles.metricText}>Accuracy {accuracy}%</Text>
          <Text style={styles.metricText}>Fastest RT {fastestRT}ms</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <Animated.View 
            style={[
              styles.progressBar,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', `${progressPercentage}%`],
                }),
                backgroundColor: progressPercentage >= 80 ? colors.green : 
                                progressPercentage >= 60 ? colors.teal : 
                                progressPercentage >= 40 ? colors.yellow : colors.red,
              },
            ]}
          />
          <Text style={styles.progressText}>{Math.round(progressPercentage)}% Success Rate</Text>
        </View>

        {/* Score Input */}
        <View style={styles.scoreInputContainer}>
          <TextInput
            style={styles.scoreInput}
            value={scoreName}
            onChangeText={setScoreName}
            placeholder="Enter score name"
            placeholderTextColor={colors.gray}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveScore}>
            <Text style={styles.saveButtonText}>Save your score</Text>
          </TouchableOpacity>
        </View>
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
  resultsCard: {
    backgroundColor: colors.card,
    margin: 20,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    flex: 1,
  },
  celebrationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  confetti: {
    fontSize: 24,
    marginHorizontal: 8,
  },
  celebrationTitle: {
    ...typography.h2,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  metricText: {
    ...typography.body,
    fontSize: 18,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.secondary,
    borderRadius: 4,
    marginBottom: 24,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.teal,
    borderRadius: 4,
  },
  progressText: {
    ...typography.bodySmall,
    color: colors.white,
    textAlign: 'center',
    marginTop: 8,
    fontSize: 12,
  },
  scoreInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scoreInput: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...typography.input,
    borderBottomWidth: 1,
    borderBottomColor: colors.red,
  },
  saveButton: {
    backgroundColor: colors.blue,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    ...typography.button,
    color: colors.white,
  },
});

export default ResultsScreen;
