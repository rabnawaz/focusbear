import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { QUIZ_CONSTANTS, TEXT_CONTENT } from '../../constants/quizConstants';
import LaserBeam from './LaserBeam';

const BearIcon = ({ 
  onLayout, 
  selectedAnswer, 
  currentQuestion, 
  getLaserData, 
  laserPulseAnim, 
  fadeAnim, 
  scaleAnim 
}) => {
  return (
    <View 
      style={styles.bearContainer}
      onLayout={onLayout}
    >
      <View style={styles.bearIcon}>
        <Text style={styles.bearText}>{TEXT_CONTENT.BEAR_EMOJI}</Text>
      </View>
      <LaserBeam
        selectedAnswer={selectedAnswer}
        currentQuestion={currentQuestion}
        getLaserData={getLaserData}
        laserPulseAnim={laserPulseAnim}
        fadeAnim={fadeAnim}
        scaleAnim={scaleAnim}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default BearIcon;
