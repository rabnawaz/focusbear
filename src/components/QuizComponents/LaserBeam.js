import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { QUIZ_CONSTANTS, TEXT_CONTENT } from '../../constants/quizConstants';

const LaserBeam = ({ 
  selectedAnswer, 
  currentQuestion, 
  getLaserData, 
  laserPulseAnim, 
  fadeAnim, 
  scaleAnim 
}) => {
  if (selectedAnswer === null) return null;

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
          {isCorrect ? TEXT_CONTENT.CORRECT_IMPACT : TEXT_CONTENT.INCORRECT_IMPACT}
        </Text>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
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

export default LaserBeam;
