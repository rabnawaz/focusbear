import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform } from 'react-native';

// Import screens
import MissionBriefingScreen from './src/screens/MissionBriefingScreen';
import QuizScreen from './src/screens/QuizScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import DistractionScreen from './src/screens/DistractionScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar 
        style="light" 
        backgroundColor="#0A0E27" 
        translucent={Platform.OS === 'android'}
      />
      <View style={styles.container}>
        <Stack.Navigator
          initialRouteName="MissionBriefing"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#0A0E27' },
            gestureEnabled: false
          }}
        >
          <Stack.Screen name="MissionBriefing" component={MissionBriefingScreen} />
          <Stack.Screen name="Quiz" component={QuizScreen} />
          <Stack.Screen name="Results" component={ResultsScreen} />
          <Stack.Screen name="Distraction" component={DistractionScreen} />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
});
