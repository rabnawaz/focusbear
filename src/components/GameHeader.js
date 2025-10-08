import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { QUIZ_CONSTANTS, TEXT_CONTENT } from '../constants/quizConstants';

const GameHeader = ({ 
  currentRound = 1, 
  totalRounds = 6, 
  bestRT = 0, 
  currentStreak = 0, 
  currentScore = 0,
  onLeaderboardPress 
}) => {
  return (
    <View style={styles.topSection}>
      {/* Top Line - Progress Dots, Score, and Leaderboard Button */}
      <View style={styles.topLine}>
        {/* Progress Dots */}
        <View style={styles.progressDots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        
        {/* Score with Icon */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            {TEXT_CONTENT.SCORE_PREFIX} {currentScore}
          </Text>
          <View style={styles.scoreIcon}>
            <Text style={styles.scoreIconText}>{TEXT_CONTENT.SCORE_ICON}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.leaderboardButton} onPress={onLeaderboardPress}>
          <Text style={styles.leaderboardButtonText}>{TEXT_CONTENT.LEADERBOARD_BUTTON}</Text>
        </TouchableOpacity>
      </View>
      
      {/* Bottom Line - Round, BestRT, Streak with space-between */}
      <View style={styles.bottomLine}>
        <Text style={styles.gameStatText}>
          {TEXT_CONTENT.ROUND_PREFIX} {currentRound}/{totalRounds}
        </Text>
        <Text style={styles.gameStatText}>
          {TEXT_CONTENT.BEST_RT_PREFIX} {bestRT > 0 ? `${bestRT}ms` : TEXT_CONTENT.NO_TIME_PLACEHOLDER}
        </Text>
        <Text style={styles.gameStatText}>
          {TEXT_CONTENT.STREAK_PREFIX} {currentStreak}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topSection: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? QUIZ_CONSTANTS.SPACING.TOP_SECTION_PADDING_IOS : QUIZ_CONSTANTS.SPACING.TOP_SECTION_PADDING_ANDROID,
    paddingBottom: 20,
    minHeight: QUIZ_CONSTANTS.SPACING.TOP_SECTION_MIN_HEIGHT,
  },
  topLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 50,
  },
  bottomLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 40,
  },
  gameStatText: {
    ...typography.gameStat,
    fontSize: QUIZ_CONSTANTS.TEXT_SIZES.GAME_STAT,
    whiteSpace: 'nowrap',
    flexShrink: 0,
    fontWeight: '600',
  },
  progressDots: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.yellow,
    shadowColor: colors.yellow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreText: {
    ...typography.gameStat,
    fontSize: QUIZ_CONSTANTS.TEXT_SIZES.GAME_STAT + 4,
    fontWeight: '700',
    color: colors.white,
  },
  scoreIcon: {
    marginLeft: 4,
  },
  scoreIconText: {
    fontSize: QUIZ_CONSTANTS.TEXT_SIZES.SCORE_ICON + 4,
    color: colors.lightBlue,
  },
  leaderboardButton: {
    backgroundColor: colors.blue,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flexShrink: 0,
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  leaderboardButtonText: {
    ...typography.buttonSmall,
    color: colors.white,
    fontSize: QUIZ_CONSTANTS.TEXT_SIZES.LEADERBOARD_BUTTON,
    fontWeight: '600',
  },
});

export default GameHeader;
