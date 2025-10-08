import React from 'react';
import { TouchableOpacity, Text, Animated, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { QUIZ_CONSTANTS, TEXT_CONTENT } from '../../constants/quizConstants';

const AnswerCard = ({ 
  option, 
  index, 
  isSelected, 
  isCorrect, 
  isAnswerLocked, 
  onPress, 
  onLayout, 
  fadeAnim, 
  scaleAnim 
}) => {
  return (
    <TouchableOpacity
      key={index}
      style={[
        styles.answerCard,
        isSelected && isCorrect && styles.correctAnswer,
        isSelected && !isCorrect && styles.incorrectAnswer,
        isAnswerLocked && !isSelected && styles.disabledCard,
      ]}
      onPress={() => onPress(index)}
      disabled={isAnswerLocked}
      onLayout={onLayout}
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
            {isCorrect ? TEXT_CONTENT.CORRECT_ICON : TEXT_CONTENT.INCORRECT_ICON}
          </Text>
        </Animated.View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    height: '30%',
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
});

export default AnswerCard;
