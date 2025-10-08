import { QUIZ_CONSTANTS } from '../constants/quizConstants';

// Calculate laser position and angle based on actual measured layouts
export const getLaserData = (answerIndex, bearLayout, cardLayouts) => {
  // Return null if layouts aren't measured yet
  if (!bearLayout || !cardLayouts[answerIndex]) {
    return null;
  }
  
  const card = cardLayouts[answerIndex];
  const bear = bearLayout;
  
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

// Update game statistics
export const updateGameStats = (isCorrect, reactionTime, currentStats) => {
  const { currentScore, currentStreak, correctAnswers, totalAnswered, bestRT } = currentStats;
  
  const newTotalAnswered = totalAnswered + 1;
  const newCorrectAnswers = isCorrect ? correctAnswers + 1 : correctAnswers;
  const newStreak = isCorrect ? currentStreak + 1 : 0;
  
  // Calculate score based on correct answers
  let scoreIncrease = 0;
  if (isCorrect) {
    scoreIncrease = QUIZ_CONSTANTS.SCORING.BASE_POINTS; // +10 for correct answer
  } else {
    scoreIncrease = QUIZ_CONSTANTS.SCORING.WRONG_PENALTY; // -5 for incorrect answer
  }
  
  const newScore = Math.max(QUIZ_CONSTANTS.SCORING.MIN_SCORE, currentScore + scoreIncrease);
  
  // Update best reaction time
  const newBestRT = bestRT === 0 ? reactionTime : Math.min(bestRT, reactionTime);
  
  console.log(`Scoring: ${isCorrect ? 'Correct' : 'Incorrect'} - Score change: ${scoreIncrease}, New score: ${newScore}, New streak: ${newStreak}`);
  
  return {
    score: newScore,
    streak: newStreak,
    correctAnswers: newCorrectAnswers,
    totalAnswered: newTotalAnswered,
    bestRT: newBestRT,
    accuracy: Math.round((newCorrectAnswers / newTotalAnswered) * 100)
  };
};

// Calculate accuracy percentage
export const calculateAccuracy = (correctAnswers, totalAnswered) => {
  if (totalAnswered === 0) return 0;
  return Math.round((correctAnswers / totalAnswered) * 100);
};
