import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Vibration,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { mockData } from '../data/mockData';
import LeaderboardModal from '../components/LeaderboardModal';
import GameHeader from '../components/GameHeader';
import { initializeSounds } from '../services/soundService';
import { getLaserData, updateGameStats } from '../utils/gameUtils';
import { QUIZ_CONSTANTS, TEXT_CONTENT, LOG_MESSAGES, NAVIGATION_ROUTES } from '../constants/quizConstants';


const QuizScreen = ({ navigation, route }) => {
  const { quizData, mission, topic, currentRound, totalRounds, wrongAttempts, gameStats } = route.params || {};
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(1));
  const [laserPulseAnim] = useState(new Animated.Value(1));
  const [currentWrongAttempts, setCurrentWrongAttempts] = useState(wrongAttempts || 0);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  
  // Store actual card positions for precise laser targeting
  const [cardLayouts, setCardLayouts] = useState({});
  const [bearLayout, setBearLayout] = useState(null);
  
  // Sound effects
  const [correctSound, setCorrectSound] = useState(null);
  const [incorrectSound, setIncorrectSound] = useState(null);
  
  // Game state management
  const [currentScore, setCurrentScore] = useState(gameStats?.score || 0);
  const [currentStreak, setCurrentStreak] = useState(gameStats?.streak || 0);
  const [bestRT, setBestRT] = useState(gameStats?.bestRT || 0);
  const [correctAnswers, setCorrectAnswers] = useState(gameStats?.correctAnswers || 0);
  const [totalAnswered, setTotalAnswered] = useState(gameStats?.totalAnswered || 0);
  
  // Use currentRound from route params directly
  const currentRoundState = currentRound || 1;
  const currentQuestion = quizData?.[currentRoundState - 1] || mockData.quizQuestions[0];

  console.log(`${LOG_MESSAGES.QUIZ_SCREEN} ${currentRoundState}/${totalRounds}, Wrong Attempts: ${currentWrongAttempts}, Question:`, currentQuestion);

  useEffect(() => {
    if (showFeedback) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: QUIZ_CONSTANTS.ANIMATION_DURATION.FEEDBACK_FADE,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: QUIZ_CONSTANTS.ANIMATION_DURATION.SCALE_UP,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: QUIZ_CONSTANTS.ANIMATION_DURATION.SCALE_DOWN,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [showFeedback]);

  // Reset state when round changes
  useEffect(() => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsAnswerLocked(false);
    fadeAnim.setValue(0);
    scaleAnim.setValue(1);
  }, [currentRoundState]);

  // Initialize sound effects
  useEffect(() => {
    const loadSounds = async () => {
      const sounds = await initializeSounds();
      setCorrectSound(sounds.correctSound);
      setIncorrectSound(sounds.incorrectSound);
    };

    loadSounds();
  }, []);

  const handleAnswerSelect = (index) => {
    // Don't allow selection if answer is locked
    if (isAnswerLocked) return;
    
    setSelectedAnswer(index);
    setShowFeedback(true);
    setIsAnswerLocked(true);
    
    // Play laser hit sound effect
    const isCorrect = index === currentQuestion.correctAnswer;
    const soundToPlay = isCorrect ? correctSound : incorrectSound;
    
    console.log(`${LOG_MESSAGES.ANSWER_SELECTED} ${index} isCorrect: ${isCorrect}`);
    console.log('correctSound available:', !!correctSound);
    console.log('incorrectSound available:', !!incorrectSound);
    console.log('soundToPlay available:', !!soundToPlay);
    
    if (soundToPlay) {
      console.log('Playing sound...');
      soundToPlay.play();
    } else {
      console.log(LOG_MESSAGES.NO_SOUND_AVAILABLE);
      // Fallback vibration
      if (isCorrect) {
        Vibration.vibrate(QUIZ_CONSTANTS.VIBRATION.FALLBACK_CORRECT);
      } else {
        Vibration.vibrate(QUIZ_CONSTANTS.VIBRATION.FALLBACK_INCORRECT);
      }
    }
    
    // Vibration is handled by the sound effect above
    
    // Start laser pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(laserPulseAnim, {
          toValue: 1.2,
          duration: QUIZ_CONSTANTS.ANIMATION_DURATION.LASER_PULSE,
          useNativeDriver: true,
        }),
        Animated.timing(laserPulseAnim, {
          toValue: 1,
          duration: QUIZ_CONSTANTS.ANIMATION_DURATION.LASER_PULSE,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Calculate reaction time (simplified - in real app you'd track actual time)
    const reactionTime = Math.floor(Math.random() * 5000) + 1000; // 1-6 seconds
    
    // Update game stats
    const currentStats = {
      currentScore,
      currentStreak,
      correctAnswers,
      totalAnswered,
      bestRT
    };
    const updatedStats = updateGameStats(isCorrect, reactionTime, currentStats);
    
    // Update local state immediately to show updated values in the header
    setCurrentScore(updatedStats.score);
    setCurrentStreak(updatedStats.streak);
    setCorrectAnswers(updatedStats.correctAnswers);
    setTotalAnswered(updatedStats.totalAnswered);
    setBestRT(updatedStats.bestRT);
    
    console.log(`Answer selected: ${index}, Correct: ${isCorrect}, Score: ${updatedStats.score}, Streak: ${updatedStats.streak}`);
    
    // Navigate to next screen after showing feedback
    setTimeout(() => {
      const nextRound = currentRoundState + 1;
      
      if (nextRound > totalRounds) {
        // All rounds completed - go to results
        navigation.navigate(NAVIGATION_ROUTES.RESULTS, {
          mission,
          topic,
          accuracy: updatedStats.accuracy,
          fastestRT: updatedStats.bestRT,
          score: updatedStats.score,
          totalRounds,
          completedRounds: totalRounds
        });
      } else {
        // Move to next round with updated stats
        navigation.navigate(NAVIGATION_ROUTES.QUIZ, {
          quizData,
          mission,
          topic,
          currentRound: nextRound,
          totalRounds,
          wrongAttempts: 0,
          gameStats: updatedStats
        });
      }
    }, QUIZ_CONSTANTS.ANIMATION_DURATION.NAVIGATION_DELAY);
  };


  const calculateScore = () => {
    return currentScore;
  };

  const handleLeaderboard = () => {
    setShowLeaderboard(true);
  };

  // Calculate laser position and angle based on actual measured layouts
  const getLaserDataForAnswer = (answerIndex) => {
    return getLaserData(answerIndex, bearLayout, cardLayouts);
  };

  const renderAnswerOption = (option, index) => {
    const isSelected = selectedAnswer === index;
    const isCorrect = index === currentQuestion.correctAnswer;
    
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.answerCard,
          isSelected && isCorrect && styles.correctAnswer,
          isSelected && !isCorrect && styles.incorrectAnswer,
          isAnswerLocked && !isSelected && styles.disabledCard,
        ]}
        onPress={() => handleAnswerSelect(index)}
        disabled={isAnswerLocked}
        onLayout={(event) => {
          const { x, y, width, height } = event.nativeEvent.layout;
          setCardLayouts(prev => ({
            ...prev,
            [index]: { x, y, width, height }
          }));
        }}
      >
        <Text style={styles.answerText}>{option}</Text>
        {isSelected && (
          <Animated.View 
            style={[
              isCorrect ? styles.checkmark : styles.crossmark,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text style={styles.checkmarkText}>
              {isCorrect ? '✓' : '✗'}
            </Text>
          </Animated.View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Game Header */}
      <GameHeader 
        currentRound={currentRoundState}
        totalRounds={totalRounds}
        bestRT={bestRT}
        currentStreak={currentStreak}
        currentScore={calculateScore()}
        onLeaderboardPress={handleLeaderboard}
      />

      {/* Feedback Banner */}
      {showFeedback && (
        <Animated.View 
          style={[
            selectedAnswer === currentQuestion.correctAnswer ? styles.feedbackBanner : styles.feedbackBannerError,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={styles.feedbackIcon}>
            {selectedAnswer === currentQuestion.correctAnswer ? '✓' : '✗'}
          </Text>
          <Text style={styles.feedbackText}>
            {selectedAnswer === currentQuestion.correctAnswer ? TEXT_CONTENT.CORRECT_TEXT : TEXT_CONTENT.INCORRECT_TEXT}
          </Text>
        </Animated.View>
      )}

      {/* Answer Grid */}
      <View style={styles.answerGrid}>
        {currentQuestion.options.map((option, index) => renderAnswerOption(option, index))}

        {/* Bear Icon */}
        <View 
          style={styles.bearContainer}
          onLayout={(event) => {
            const { x, y, width, height } = event.nativeEvent.layout;
            setBearLayout({ x, y, width, height });
          }}
        >
          <View style={styles.bearIcon}>
            <Text style={styles.bearText}>🐻</Text>
          </View>
          {selectedAnswer !== null && (() => {
            const laserData = getLaserDataForAnswer(selectedAnswer);
            if (!laserData) return null;
            
            const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
            const laserColor = isCorrect ? colors.green : colors.red;
            
            return (
              <>
                {/* Laser beam line */}
                <Animated.View 
                  style={[
                    styles.connectionLine,
                    { 
                      opacity: 1,
                      height: laserData.length,
                      backgroundColor: laserColor,
                      shadowColor: laserColor,
                      transform: [
                        { rotate: laserData.angle },
                        { scale: laserPulseAnim }
                      ]
                    }
                  ]}
                />
                
                {/* Impact graphic at hit point */}
                <Animated.View 
                  style={[
                    styles.laserEndPoint,
                    {
                      opacity: fadeAnim,
                      transform: [
                        { translateX: laserData.endX },
                        { translateY: laserData.endY },
                        { scale: scaleAnim }
                      ]
                    }
                  ]}
                >
                  <Text style={styles.impactGraphic}>
                    {isCorrect ? '✨' : '💥'}
                  </Text>
                </Animated.View>
              </>
            );
          })()}
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
  answerGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: QUIZ_CONSTANTS.SPACING.ANSWER_GRID_PADDING,
    paddingTop: QUIZ_CONSTANTS.SPACING.ANSWER_GRID_PADDING_TOP,
    paddingBottom: 10,
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackBanner: {
    position: 'absolute',
    top: QUIZ_CONSTANTS.SPACING.TOP_SECTION_MIN_HEIGHT,
    left: QUIZ_CONSTANTS.SPACING.FEEDBACK_BANNER_HORIZONTAL,
    right: QUIZ_CONSTANTS.SPACING.FEEDBACK_BANNER_HORIZONTAL,
    backgroundColor: colors.green,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: QUIZ_CONSTANTS.SPACING.FEEDBACK_BANNER_PADDING_VERTICAL,
    paddingHorizontal: QUIZ_CONSTANTS.SPACING.FEEDBACK_BANNER_PADDING_HORIZONTAL,
    borderRadius: QUIZ_CONSTANTS.SPACING.FEEDBACK_BANNER_RADIUS,
    zIndex: QUIZ_CONSTANTS.Z_INDEX.FEEDBACK_BANNER,
  },
  feedbackBannerError: {
    position: 'absolute',
    top: QUIZ_CONSTANTS.SPACING.TOP_SECTION_MIN_HEIGHT,
    left: QUIZ_CONSTANTS.SPACING.FEEDBACK_BANNER_HORIZONTAL,
    right: QUIZ_CONSTANTS.SPACING.FEEDBACK_BANNER_HORIZONTAL,
    backgroundColor: colors.red,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: QUIZ_CONSTANTS.SPACING.FEEDBACK_BANNER_PADDING_VERTICAL,
    paddingHorizontal: QUIZ_CONSTANTS.SPACING.FEEDBACK_BANNER_PADDING_HORIZONTAL,
    borderRadius: QUIZ_CONSTANTS.SPACING.FEEDBACK_BANNER_RADIUS,
    zIndex: QUIZ_CONSTANTS.Z_INDEX.FEEDBACK_BANNER,
  },
  feedbackIcon: {
    fontSize: QUIZ_CONSTANTS.DIMENSIONS.FEEDBACK_ICON_SIZE,
    color: colors.white,
    marginRight: 8,
  },
  feedbackText: {
    ...typography.button,
    color: colors.white,
  },
  answerCard: {
    width: QUIZ_CONSTANTS.DIMENSIONS.ANSWER_CARD_WIDTH,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: QUIZ_CONSTANTS.SPACING.ANSWER_CARD_PADDING,
    minHeight: QUIZ_CONSTANTS.DIMENSIONS.ANSWER_CARD_MIN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: QUIZ_CONSTANTS.SPACING.ANSWER_CARD_MARGIN_BOTTOM,
    height: '35%',
  },
  correctAnswer: {
    backgroundColor: colors.blue,
  },
  incorrectAnswer: {
    backgroundColor: colors.red,
  },
  disabledCard: {
    opacity: 0.5,
  },
  answerText: {
    ...typography.bodySmall,
    textAlign: 'center',
    lineHeight: QUIZ_CONSTANTS.TEXT_SIZES.ANSWER_TEXT_LINE_HEIGHT,
    fontSize: QUIZ_CONSTANTS.TEXT_SIZES.ANSWER_TEXT,
  },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.green,
    borderRadius: QUIZ_CONSTANTS.DIMENSIONS.CHECKMARK_RADIUS,
    width: QUIZ_CONSTANTS.DIMENSIONS.CHECKMARK_SIZE,
    height: QUIZ_CONSTANTS.DIMENSIONS.CHECKMARK_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossmark: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.red,
    borderRadius: QUIZ_CONSTANTS.DIMENSIONS.CHECKMARK_RADIUS,
    width: QUIZ_CONSTANTS.DIMENSIONS.CHECKMARK_SIZE,
    height: QUIZ_CONSTANTS.DIMENSIONS.CHECKMARK_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: colors.white,
    fontSize: QUIZ_CONSTANTS.TEXT_SIZES.CHECKMARK_TEXT,
    fontWeight: 'bold',
  },
  bearContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: QUIZ_CONSTANTS.SPACING.BEAR_CONTAINER_PADDING_BOTTOM,
    paddingTop: QUIZ_CONSTANTS.SPACING.BEAR_CONTAINER_PADDING_TOP,
    marginTop: QUIZ_CONSTANTS.SPACING.BEAR_CONTAINER_MARGIN_TOP,
    position: 'relative',
    width: '100%',
  },
  bearIcon: {
    width: QUIZ_CONSTANTS.DIMENSIONS.BEAR_ICON_SIZE,
    height: QUIZ_CONSTANTS.DIMENSIONS.BEAR_ICON_SIZE,
    borderRadius: QUIZ_CONSTANTS.DIMENSIONS.BEAR_ICON_RADIUS,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bearText: {
    fontSize: QUIZ_CONSTANTS.DIMENSIONS.BEAR_TEXT_SIZE,
  },
  connectionLine: {
    position: 'absolute',
    width: QUIZ_CONSTANTS.DIMENSIONS.LASER_LINE_WIDTH,
    height: 100, // Will be overridden dynamically
    bottom: 30, // Start from center of bear (bear icon is 60px, center at 30px)
    left: '50%',
    marginLeft: -2, // Center the line (half of width 4)
    transformOrigin: 'bottom center', // Rotate from the bear position
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 10,
    zIndex: QUIZ_CONSTANTS.Z_INDEX.LASER_LINE,
  },
  laserEndPoint: {
    position: 'absolute',
    width: QUIZ_CONSTANTS.DIMENSIONS.LASER_END_POINT_SIZE,
    height: QUIZ_CONSTANTS.DIMENSIONS.LASER_END_POINT_SIZE,
    bottom: 30, // Start from center of bear
    left: '50%',
    marginLeft: -20, // Center the point (half of width 40)
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 15,
    zIndex: QUIZ_CONSTANTS.Z_INDEX.LASER_END_POINT,
  },
  impactGraphic: {
    fontSize: QUIZ_CONSTANTS.DIMENSIONS.IMPACT_GRAPHIC_SIZE,
    textAlign: 'center',
  },
});

export default QuizScreen;
