import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { QUIZ_CONSTANTS, TEXT_CONTENT } from '../../constants/quizConstants';

const GameStats = ({ 
  currentRound, 
  totalRounds, 
  bestRT, 
  currentStreak, 
  currentScore 
}) => {
  return (
    <View style={styles.gameStats}>
      <Text style={styles.gameStatText}>
        {TEXT_CONTENT.ROUND_PREFIX} {currentRound}/{totalRounds}
      </Text>
      <Text style={styles.gameStatText}>
        {TEXT_CONTENT.BEST_RT_PREFIX} {bestRT > 0 ? `${bestRT}ms` : TEXT_CONTENT.NO_TIME_PLACEHOLDER}
      </Text>
      <Text style={styles.gameStatText}>
        {TEXT_CONTENT.STREAK_PREFIX} {currentStreak}
      </Text>
      <Text style={styles.gameStatText}>
        {TEXT_CONTENT.SCORE_PREFIX} {currentScore}
      </Text>
      <View style={styles.scoreIcon}>
        <Text style={styles.scoreIconText}>{TEXT_CONTENT.SCORE_ICON}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gameStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  gameStatText: {
    ...typography.gameStat,
    fontSize: QUIZ_CONSTANTS.TEXT_SIZES.GAME_STAT,
    whiteSpace: 'nowrap',
    flexShrink: 0,
    fontWeight: '600',
  },
  scoreIcon: {
    marginLeft: 6,
  },
  scoreIconText: {
    fontSize: QUIZ_CONSTANTS.TEXT_SIZES.SCORE_ICON,
    color: colors.lightBlue,
  },
});

export default GameStats;
