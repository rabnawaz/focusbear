import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { QUIZ_CONSTANTS, TEXT_CONTENT } from '../../constants/quizConstants';

const FeedbackBanner = ({ showFeedback, isCorrect, fadeAnim }) => {
  if (!showFeedback) return null;

  return (
    <Animated.View 
      style={[
        isCorrect ? styles.feedbackBanner : styles.feedbackBannerError,
        { opacity: fadeAnim }
      ]}
    >
      <Text style={styles.feedbackIcon}>
        {isCorrect ? TEXT_CONTENT.CORRECT_ICON : TEXT_CONTENT.INCORRECT_ICON}
      </Text>
      <Text style={styles.feedbackText}>
        {isCorrect ? TEXT_CONTENT.CORRECT_TEXT : TEXT_CONTENT.INCORRECT_TEXT}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  feedbackBanner: {
    position: 'absolute',
    top: QUIZ_CONSTANTS.SPACING.FEEDBACK_BANNER_TOP,
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
    top: QUIZ_CONSTANTS.SPACING.FEEDBACK_BANNER_TOP,
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
});

export default FeedbackBanner;
