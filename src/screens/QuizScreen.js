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
  Vibration,
} from 'react-native';
import { Audio } from 'expo-av';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { mockData } from '../data/mockData';
import LeaderboardModal from '../components/LeaderboardModal';

// Create laser hit sound using expo-av
const createLaserHitSound = async (isCorrect) => {
  console.log(`Creating ${isCorrect ? 'correct' : 'incorrect'} laser sound`);
  
  try {
    const sound = new Audio.Sound();
    
    // Create different sound characteristics
    // For correct: higher pitch, shorter duration (laser hit)
    // For incorrect: thunderous gunshot with multiple frequencies
    const frequency = isCorrect ? 1200 : 200; // Much lower for gunshot
    const duration = isCorrect ? 0.2 : 0.8; // Longer for thunderous effect
    
    // Create a simple tone using Web Audio API approach
    const createTone = () => {
      const sampleRate = 44100;
      const samples = Math.floor(sampleRate * duration);
      const buffer = new ArrayBuffer(44 + samples * 2);
      const view = new DataView(buffer);
      
      // WAV header
      const writeString = (offset, string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };
      
      writeString(0, 'RIFF');
      view.setUint32(4, 36 + samples * 2, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeString(36, 'data');
      view.setUint32(40, samples * 2, true);
      
      // Generate sound wave
      for (let i = 0; i < samples; i++) {
        const t = i / sampleRate;
        let sample = 0;
        
        if (isCorrect) {
          // Simple high-pitched laser hit
          const envelope = Math.exp(-t * 6);
          sample = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3;
        } else {
          // Thunderous gunshot with multiple frequencies and noise
          const envelope = Math.exp(-t * 2); // Slower decay for thunder
          
          // Base frequency (low rumble)
          sample += Math.sin(2 * Math.PI * frequency * t) * envelope * 0.4;
          
          // Add harmonics for more complex sound
          sample += Math.sin(2 * Math.PI * frequency * 2 * t) * envelope * 0.2;
          sample += Math.sin(2 * Math.PI * frequency * 3 * t) * envelope * 0.1;
          
          // Add some noise for gunshot crack
          const noise = (Math.random() - 0.5) * 0.3;
          sample += noise * envelope;
          
          // Add a sharp crack at the beginning
          if (t < 0.1) {
            const crackEnvelope = Math.exp(-t * 50);
            sample += Math.sin(2 * Math.PI * 800 * t) * crackEnvelope * 0.5;
          }
        }
        
        // Clamp the sample to prevent distortion
        sample = Math.max(-1, Math.min(1, sample));
        view.setInt16(44 + i * 2, sample * 32767, true);
      }
      
      return buffer;
    };
    
    const audioBuffer = createTone();
    const bytes = new Uint8Array(audioBuffer);
    
    // Convert to base64 manually
    let base64 = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    for (let i = 0; i < bytes.length; i += 3) {
      const a = bytes[i];
      const b = bytes[i + 1] || 0;
      const c = bytes[i + 2] || 0;
      const bitmap = (a << 16) | (b << 8) | c;
      base64 += chars.charAt((bitmap >> 18) & 63);
      base64 += chars.charAt((bitmap >> 12) & 63);
      base64 += chars.charAt((bitmap >> 6) & 63);
      base64 += chars.charAt(bitmap & 63);
    }
    
    const dataUri = `data:audio/wav;base64,${base64}`;
    console.log(`Loading ${isCorrect ? 'correct' : 'incorrect'} sound with data URI length:`, dataUri.length);
    await sound.loadAsync({ uri: dataUri });
    console.log(`Successfully loaded ${isCorrect ? 'correct' : 'incorrect'} sound`);
    
    return {
      play: async () => {
        try {
          console.log(`Playing ${isCorrect ? 'correct' : 'incorrect'} laser sound`);
          
          // Play the audio
          await sound.replayAsync();
          
          // Add vibration feedback
          if (isCorrect) {
            Vibration.vibrate([0, 30, 15, 30, 15, 60]);
          } else {
            // Thunderous gunshot vibration pattern
            Vibration.vibrate([0, 100, 50, 150, 75, 200, 100, 100]);
          }
        } catch (error) {
          console.log('Sound playback error:', error);
          // Fallback to vibration only
          if (isCorrect) {
            Vibration.vibrate([0, 30, 15, 30, 15, 60]);
          } else {
            // Thunderous gunshot fallback vibration
            Vibration.vibrate([0, 100, 50, 150, 75, 200, 100, 100]);
          }
        }
      },
      unload: async () => {
        try {
          await sound.unloadAsync();
        } catch (error) {
          console.log('Error unloading sound:', error);
        }
      }
    };
  } catch (error) {
    console.log('Error creating sound:', error);
    // Fallback to vibration only
    return {
      play: async () => {
        console.log(`Playing fallback ${isCorrect ? 'correct' : 'incorrect'} vibration`);
        if (isCorrect) {
          Vibration.vibrate([0, 30, 15, 30, 15, 60]);
        } else {
          // Thunderous gunshot fallback vibration
          Vibration.vibrate([0, 100, 50, 150, 75, 200, 100, 100]);
        }
      },
      unload: async () => {}
    };
  }
};

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

  console.log(`Quiz Screen - Round: ${currentRoundState}/${totalRounds}, Wrong Attempts: ${currentWrongAttempts}, Question:`, currentQuestion);

  useEffect(() => {
    if (showFeedback) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 150,
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
      try {
        console.log('Initializing laser hit sounds...');
        
        // Configure audio mode for Android
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: false, // Don't duck other audio
          playThroughEarpieceAndroid: false,
        });
        
        // Create simple laser hit sounds
        const correctSoundData = await createLaserHitSound(true);
        const incorrectSoundData = await createLaserHitSound(false);
        
        setCorrectSound(correctSoundData);
        setIncorrectSound(incorrectSoundData);
        console.log('Laser hit sounds initialized successfully');
      } catch (error) {
        console.log('Error loading sounds:', error);
      }
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
    
    console.log('Answer selected:', index, 'isCorrect:', isCorrect);
    console.log('correctSound available:', !!correctSound);
    console.log('incorrectSound available:', !!incorrectSound);
    console.log('soundToPlay available:', !!soundToPlay);
    
    if (soundToPlay) {
      console.log('Playing sound...');
      soundToPlay.play();
    } else {
      console.log('No sound available, using fallback vibration');
      // Fallback vibration
      if (isCorrect) {
        Vibration.vibrate([0, 30, 15, 30, 15, 60]);
      } else {
        Vibration.vibrate([0, 80, 40, 80, 40, 120]);
      }
    }
    
    // Vibration is handled by the sound effect above
    
    // Start laser pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(laserPulseAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(laserPulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Calculate reaction time (simplified - in real app you'd track actual time)
    const reactionTime = Math.floor(Math.random() * 5000) + 1000; // 1-6 seconds
    
    // Update game stats
    const updatedStats = updateGameStats(isCorrect, reactionTime);
    
    console.log(`Answer selected: ${index}, Correct: ${isCorrect}, Score: ${updatedStats.score}, Streak: ${updatedStats.streak}`);
    
    // Navigate to next screen after showing feedback
    setTimeout(() => {
      const nextRound = currentRoundState + 1;
      
      if (nextRound > totalRounds) {
        // All rounds completed - go to results
        navigation.navigate('Results', {
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
        navigation.navigate('Quiz', {
          quizData,
          mission,
          topic,
          currentRound: nextRound,
          totalRounds,
          wrongAttempts: 0,
          gameStats: updatedStats
        });
      }
    }, 1500); // Reduced timeout for faster flow
  };


  const calculateScore = () => {
    return currentScore;
  };

  const calculateAccuracy = () => {
    if (totalAnswered === 0) return 0;
    return Math.round((correctAnswers / totalAnswered) * 100);
  };

  const updateGameStats = (isCorrect, reactionTime) => {
    const newTotalAnswered = totalAnswered + 1;
    const newCorrectAnswers = isCorrect ? correctAnswers + 1 : correctAnswers;
    const newStreak = isCorrect ? currentStreak + 1 : 0;
    
    // Calculate score based on correct answers and streak
    let scoreIncrease = 0;
    if (isCorrect) {
      scoreIncrease = 10 + (newStreak * 2); // Base 10 points + 2 bonus per streak
    } else {
      scoreIncrease = -5; // Penalty for wrong answers
    }
    
    const newScore = Math.max(0, currentScore + scoreIncrease); // Don't go below 0
    
    // Update best reaction time
    const newBestRT = bestRT === 0 ? reactionTime : Math.min(bestRT, reactionTime);
    
    setCurrentScore(newScore);
    setCurrentStreak(newStreak);
    setCorrectAnswers(newCorrectAnswers);
    setTotalAnswered(newTotalAnswered);
    setBestRT(newBestRT);
    
    return {
      score: newScore,
      streak: newStreak,
      correctAnswers: newCorrectAnswers,
      totalAnswered: newTotalAnswered,
      bestRT: newBestRT,
      accuracy: Math.round((newCorrectAnswers / newTotalAnswered) * 100)
    };
  };

  const handleLeaderboard = () => {
    setShowLeaderboard(true);
  };

  // Calculate laser position and angle based on actual measured layouts
  const getLaserData = (answerIndex) => {
    // Return null if layouts aren't measured yet
    if (!bearLayout || !cardLayouts[answerIndex]) {
      return null;
    }
    
    const card = cardLayouts[answerIndex];
    const bear = bearLayout;
    
    // Since onLayout gives relative positions within parent (answerGrid),
    // we can calculate the offset from bear to card center
    // Bear is below all cards in the same container
    
    // Calculate center of card relative to answerGrid
    const cardCenterX = card.x + card.width / 2;
    const cardCenterY = card.y + card.height / 2;
    
    // Calculate center of bear relative to answerGrid  
    const bearCenterX = bear.x + bear.width / 2;
    const bearCenterY = bear.y + bear.height / 2;
    
    // Calculate vector from bear center to card center
    const deltaX = cardCenterX - bearCenterX;
    const deltaY = cardCenterY - bearCenterY;
    
    // Calculate angle: atan2(x, -y) because y-axis is inverted in screen coordinates
    // and we want 0° to point up
    const angleRad = Math.atan2(deltaX, -deltaY);
    const angleDeg = angleRad * (180 / Math.PI);
    
    // Calculate distance
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    console.log(`Laser for card ${answerIndex}:`, {
      card: { x: card.x.toFixed(1), y: card.y.toFixed(1), w: card.width.toFixed(1), h: card.height.toFixed(1) },
      bear: { x: bear.x.toFixed(1), y: bear.y.toFixed(1), w: bear.width.toFixed(1), h: bear.height.toFixed(1) },
      cardCenter: { x: cardCenterX.toFixed(1), y: cardCenterY.toFixed(1) },
      bearCenter: { x: bearCenterX.toFixed(1), y: bearCenterY.toFixed(1) },
      delta: { x: deltaX.toFixed(1), y: deltaY.toFixed(1) },
      angle: angleDeg.toFixed(1) + '°',
      length: length.toFixed(1) + 'px'
    });
    
    return {
      angle: `${angleDeg}deg`,
      length: length,
      endX: deltaX,
      endY: deltaY
    };
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
            {selectedAnswer === currentQuestion.correctAnswer ? 'Nailed it!' : 'Not quite!'}
          </Text>
        </Animated.View>
      )}

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
          <Text style={styles.gameStatText}>Round {currentRoundState}/{totalRounds}</Text>
          <Text style={styles.gameStatText}>Best RT {bestRT > 0 ? `${bestRT}ms` : '— ms'}</Text>
          <Text style={styles.gameStatText}>Streak {currentStreak}</Text>
          <Text style={styles.gameStatText}>Score {calculateScore()}</Text>
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
            const laserData = getLaserData(selectedAnswer);
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
  feedbackBanner: {
    backgroundColor: colors.green,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 8,
  },
  feedbackBannerError: {
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
  feedbackIcon: {
    fontSize: 20,
    color: colors.white,
    marginRight: 8,
  },
  feedbackText: {
    ...typography.button,
    color: colors.white,
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
    fontSize: 9,
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
    fontSize: 9,
  },
  answerGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    paddingBottom: 10,
    gap: 16,
    justifyContent: 'center',
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
    lineHeight: 20,
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.green,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.red,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bearContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    paddingTop: 0,
    marginTop: 10,
    position: 'relative',
    width: '100%',
  },
  bearIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bearText: {
    fontSize: 24,
  },
  connectionLine: {
    position: 'absolute',
    width: 4, // Thinner line
    height: 100, // Will be overridden dynamically
    bottom: 20, // Start from center of bear (bear icon is 40px, center at 20px)
    left: '50%',
    marginLeft: -2, // Center the line (half of width 4)
    transformOrigin: 'bottom center', // Rotate from the bear position
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 100,
  },
  laserEndPoint: {
    position: 'absolute',
    width: 40, // Larger for impact graphic
    height: 40,
    bottom: 20, // Start from center of bear
    left: '50%',
    marginLeft: -20, // Center the point (half of width 40)
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 15,
    zIndex: 101,
  },
  impactGraphic: {
    fontSize: 32,
    textAlign: 'center',
  },
});

export default QuizScreen;
