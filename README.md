# Focus Bear App - React Native

A focus training quiz game built with React Native, featuring a dark theme and engaging UI animations.

## Features

- **Mission Briefing Screen**: Input your focus mission and start training
- **Quiz Game**: Multiple choice questions with real-time feedback
- **Distraction Screen**: Visual feedback when distracted
- **Results Screen**: Performance metrics and score saving
- **Leaderboard**: Track your progress against others
- **Dark Theme**: Modern dark UI with smooth animations

## Screenshots

The app includes 5 main screens:
1. Mission Briefing - Input your focus goal
2. Quiz Screen - Answer questions with visual feedback
3. Distraction Screen - Shows when you get distracted
4. Results Screen - Performance summary and score saving
5. Leaderboard Modal - Competitive rankings

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Run on Android:**
   ```bash
   npm run android
   ```

4. **Run on iOS:**
   ```bash
   npm run ios
   ```

## Project Structure

```
src/
├── components/
│   └── LeaderboardModal.js    # Leaderboard modal component
├── data/
│   └── mockData.js           # Hardcoded data for development
├── screens/
│   ├── MissionBriefingScreen.js
│   ├── QuizScreen.js
│   ├── DistractionScreen.js
│   └── ResultsScreen.js
└── theme/
    ├── colors.js             # Color palette
    └── typography.js         # Typography styles
```

## Technology Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **React Navigation** - Navigation library
- **React Native Reanimated** - Animations
- **React Native Vector Icons** - Icons

## Development Notes

This is a UI-only version with hardcoded data. The app includes:
- Smooth animations and transitions
- Responsive design for different screen sizes
- Dark theme implementation
- Interactive elements with visual feedback
- Modal components for leaderboard



## License


