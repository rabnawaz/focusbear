import { StyleSheet } from 'react-native';

export const typography = StyleSheet.create({
  // Headers
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Body text
  body: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  bodySmall: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  
  // Button text
  button: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Game stats
  gameStat: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  
  // Input text
  input: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  placeholder: {
    fontSize: 16,
    color: '#808080',
  },
});
