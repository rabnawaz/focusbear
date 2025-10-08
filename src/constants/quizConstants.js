// Quiz Screen Constants
export const QUIZ_CONSTANTS = {
  // Animation durations
  ANIMATION_DURATION: {
    FEEDBACK_FADE: 300,
    SCALE_UP: 150,
    SCALE_DOWN: 150,
    LASER_PULSE: 200,
    NAVIGATION_DELAY: 1500,
  },

  // Sound settings
  SOUND: {
    CORRECT_FREQUENCY: 1200,
    INCORRECT_FREQUENCY: 200,
    CORRECT_DURATION: 0.2,
    INCORRECT_DURATION: 0.8,
    SAMPLE_RATE: 44100,
    VOLUME: 0.3,
  },

  // Vibration patterns
  VIBRATION: {
    CORRECT: [0, 30, 15, 30, 15, 60],
    INCORRECT: [0, 100, 50, 150, 75, 200, 100, 100],
    FALLBACK_CORRECT: [0, 30, 15, 30, 15, 60],
    FALLBACK_INCORRECT: [0, 80, 40, 80, 40, 120],
  },

  // Game scoring
  SCORING: {
    BASE_POINTS: 10,
    STREAK_BONUS: 0,
    WRONG_PENALTY: -5,
    MIN_SCORE: 0,
  },

  // UI dimensions
  DIMENSIONS: {
    BEAR_ICON_SIZE: 60,
    BEAR_ICON_RADIUS: 30,
    BEAR_TEXT_SIZE: 32,
    LASER_LINE_WIDTH: 4,
    LASER_END_POINT_SIZE: 40,
    ANSWER_CARD_MIN_HEIGHT: 160,
    ANSWER_CARD_WIDTH: '45%',
    CHECKMARK_SIZE: 24,
    CHECKMARK_RADIUS: 12,
    FEEDBACK_ICON_SIZE: 20,
    IMPACT_GRAPHIC_SIZE: 32,
  },

  // Spacing and padding
  SPACING: {
    TOP_SECTION_PADDING_IOS: 70,
    TOP_SECTION_PADDING_ANDROID: 60,
    TOP_SECTION_MIN_HEIGHT: 180,
    ANSWER_GRID_PADDING_TOP: 10,
    ANSWER_GRID_PADDING: 15,
    ANSWER_CARD_PADDING: 10,
    ANSWER_CARD_MARGIN_BOTTOM: 10,
    BEAR_CONTAINER_PADDING_BOTTOM: 15,
    BEAR_CONTAINER_PADDING_TOP: 15,
    BEAR_CONTAINER_MARGIN_TOP: 15,
    FEEDBACK_BANNER_TOP: 100,
    FEEDBACK_BANNER_HORIZONTAL: 20,
    FEEDBACK_BANNER_PADDING_VERTICAL: 12,
    FEEDBACK_BANNER_PADDING_HORIZONTAL: 20,
    FEEDBACK_BANNER_RADIUS: 8,
  },

  // Text sizes
  TEXT_SIZES: {
    GAME_STAT: 14,
    LEADERBOARD_BUTTON: 14,
    ANSWER_TEXT: 16,
    ANSWER_TEXT_LINE_HEIGHT: 26,
    CHECKMARK_TEXT: 16,
    SCORE_ICON: 18,
  },

  // Z-index values
  Z_INDEX: {
    FEEDBACK_BANNER: 1000,
    LASER_LINE: 100,
    LASER_END_POINT: 101,
  },

  // Feedback messages
  FEEDBACK: {
    CORRECT_ICON: '✓',
    INCORRECT_ICON: '✗',
    CORRECT_TEXT: 'Nailed it!',
    INCORRECT_TEXT: 'Not quite!',
    CORRECT_IMPACT: '✨',
    INCORRECT_IMPACT: '💥',
  },

  // Audio mode configuration
  AUDIO_MODE: {
    allowsRecordingIOS: false,
    staysActiveInBackground: false,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: false,
    playThroughEarpieceAndroid: false,
  },
};

// Text content constants
export const TEXT_CONTENT = {
  LEADERBOARD_BUTTON: 'Leaderboard',
  ROUND_PREFIX: 'Round',
  BEST_RT_PREFIX: 'Best RT',
  STREAK_PREFIX: 'Streak',
  SCORE_PREFIX: 'Score',
  NO_TIME_PLACEHOLDER: '— ms',
  SCORE_ICON: '⚡',
  BEAR_EMOJI: '🐻',
};

// Navigation route constants
export const NAVIGATION_ROUTES = {
  RESULTS: 'Results',
  QUIZ: 'Quiz',
  MISSION_BRIEFING: 'MissionBriefing',
  DISTRACTION: 'Distraction',
};

// Error messages
export const ERROR_MESSAGES = {
  SOUND_CREATION: 'Error creating sound:',
  SOUND_LOADING: 'Error loading sounds:',
  SOUND_PLAYBACK: 'Sound playback error:',
  SOUND_UNLOAD: 'Error unloading sound:',
};

// Console log messages
export const LOG_MESSAGES = {
  CREATING_SOUND: 'Creating',
  LASER_SOUND: 'laser sound',
  INITIALIZING_SOUNDS: 'Initializing laser hit sounds...',
  SOUNDS_INITIALIZED: 'Laser hit sounds initialized successfully',
  LOADING_SOUND: 'Loading',
  SOUND_LOADED: 'Successfully loaded',
  PLAYING_SOUND: 'Playing',
  FALLBACK_VIBRATION: 'Playing fallback',
  NO_SOUND_AVAILABLE: 'No sound available, using fallback vibration',
  ANSWER_SELECTED: 'Answer selected:',
  QUIZ_SCREEN: 'Quiz Screen - Round:',
};
