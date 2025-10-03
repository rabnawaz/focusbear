import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
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

const DistractionScreen = ({ navigation, route }) => {
  const { quizData, mission, topic, currentRound, totalRounds, wrongAttempts } = route.params || {};
  const [explosionAnim] = useState(new Animated.Value(0));
  const [lineAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Start explosion animation
    Animated.timing(explosionAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Start line animation
    Animated.timing(lineAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Navigate back to quiz after showing animation
    setTimeout(() => {
      navigation.navigate('Quiz', {
        quizData,
        mission,
        topic,
        currentRound: currentRound + 1,
        totalRounds,
        wrongAttempts: 0
      });
    }, 3000);
  }, []);

  const handleLeaderboard = () => {
    console.log('Open leaderboard');
  };

  const renderAnswerOption = (option, index) => {
    const isSelected = index === 3; // Bottom right card is selected
    
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.answerCard,
          isSelected && styles.selectedAnswer,
        ]}
        disabled={true}
      >
        <Text style={styles.answerText}>{option}</Text>
        {isSelected && (
          <Animated.View 
            style={[
              styles.explosion,
              {
                opacity: explosionAnim,
                transform: [
                  { scale: explosionAnim },
                  { rotate: explosionAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  })}
                ],
              },
            ]}
          >
            <Text style={styles.explosionText}>💥</Text>
          </Animated.View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Distraction Banner */}
      <View style={styles.distractionBanner}>
        <Text style={styles.distractionIcon}>!</Text>
        <Text style={styles.distractionText}>Distraction got you!</Text>
      </View>

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
          <Text style={styles.gameStatText}>Round {currentRound}/{totalRounds}</Text>
          <Text style={styles.gameStatText}>Best RT — ms</Text>
          <Text style={styles.gameStatText}>Streak 0</Text>
          <Text style={styles.gameStatText}>Score {currentRound * 10 - (wrongAttempts * 5)}</Text>
          <View style={styles.scoreIcon}>
            <Text style={styles.scoreIconText}>⚡</Text>
          </View>
        </View>
        
        {/* Leaderboard Button */}
        <TouchableOpacity style={styles.leaderboardButton} onPress={handleLeaderboard}>
          <Text style={styles.leaderboardButtonText}>Leaderboard</Text>
        </TouchableOpacity>
      </View>

      {/* Answer Grid */}
      <View style={styles.answerGrid}>
        {mockData.quizQuestions[1].options.map((option, index) => renderAnswerOption(option, index))}
      </View>

      {/* Bear Icon with Connection Line */}
      <View style={styles.bearContainer}>
        <Animated.View 
          style={[
            styles.connectionLine,
            {
              opacity: lineAnim,
              transform: [
                { scaleY: lineAnim },
                { rotate: lineAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '120deg'], // Point to bottom-right (distraction)
                })}
              ],
            },
          ]}
        />
        <View style={styles.bearIcon}>
          <Text style={styles.bearText}>🐻</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  distractionBanner: {
    backgroundColor: colors.red,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 8,
  },
  distractionIcon: {
    fontSize: 20,
    color: colors.white,
    marginRight: 8,
    fontWeight: 'bold',
  },
  distractionText: {
    ...typography.button,
    color: colors.white,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
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
    gap: 12,
    flexWrap: 'wrap',
    flex: 1,
    justifyContent: 'center',
  },
  gameStatText: {
    ...typography.gameStat,
    fontSize: 11,
    whiteSpace: 'nowrap',
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  leaderboardButtonText: {
    ...typography.buttonSmall,
    color: colors.white,
  },
  answerGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 16,
  },
  answerCard: {
    width: '45%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  selectedAnswer: {
    backgroundColor: colors.blue,
  },
  answerText: {
    ...typography.bodySmall,
    textAlign: 'center',
    lineHeight: 20,
  },
  explosion: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  explosionText: {
    fontSize: 24,
  },
  bearContainer: {
    alignItems: 'center',
    paddingBottom: 20,
    position: 'relative',
  },
  connectionLine: {
    position: 'absolute',
    width: 5,
    height: 100,
    backgroundColor: colors.green,
    top: -50,
    left: '50%',
    marginLeft: -2.5, // Center the line
    transformOrigin: 'bottom center',
    shadowColor: colors.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 8,
  },
  bearIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.green,
  },
  bearText: {
    fontSize: 20,
  },
});

export default DistractionScreen;
