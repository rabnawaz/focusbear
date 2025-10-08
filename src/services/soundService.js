import { Audio } from 'expo-av';
import { Vibration } from 'react-native';
import { QUIZ_CONSTANTS, LOG_MESSAGES, ERROR_MESSAGES } from '../constants/quizConstants';

// Create laser hit sound using expo-av
export const createLaserHitSound = async (isCorrect) => {
  console.log(`${LOG_MESSAGES.CREATING_SOUND} ${isCorrect ? 'correct' : 'incorrect'} ${LOG_MESSAGES.LASER_SOUND}`);
  
  try {
    const sound = new Audio.Sound();
    
    // Create different sound characteristics
    const frequency = isCorrect ? QUIZ_CONSTANTS.SOUND.CORRECT_FREQUENCY : QUIZ_CONSTANTS.SOUND.INCORRECT_FREQUENCY;
    const duration = isCorrect ? QUIZ_CONSTANTS.SOUND.CORRECT_DURATION : QUIZ_CONSTANTS.SOUND.INCORRECT_DURATION;
    
    // Create a simple tone using Web Audio API approach
    const createTone = () => {
      const sampleRate = QUIZ_CONSTANTS.SOUND.SAMPLE_RATE;
      const samples = Math.floor(sampleRate * duration);
      const buffer = new ArrayBuffer(44 + samples * 2);
      const view = new DataView(buffer);
      
      // WAV header
      const writeString = (offset, string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };
      
      writeString(0, 'RIFF');
      view.setUint32(4, 36 + samples * 2, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeString(36, 'data');
      view.setUint32(40, samples * 2, true);
      
      // Generate sound wave
      for (let i = 0; i < samples; i++) {
        const t = i / sampleRate;
        let sample = 0;
        
        if (isCorrect) {
          // Simple high-pitched laser hit
          const envelope = Math.exp(-t * 6);
          sample = Math.sin(2 * Math.PI * frequency * t) * envelope * QUIZ_CONSTANTS.SOUND.VOLUME;
        } else {
          // Thunderous gunshot with multiple frequencies and noise
          const envelope = Math.exp(-t * 2); // Slower decay for thunder
          
          // Base frequency (low rumble)
          sample += Math.sin(2 * Math.PI * frequency * t) * envelope * 0.4;
          
          // Add harmonics for more complex sound
          sample += Math.sin(2 * Math.PI * frequency * 2 * t) * envelope * 0.2;
          sample += Math.sin(2 * Math.PI * frequency * 3 * t) * envelope * 0.1;
          
          // Add some noise for gunshot crack
          const noise = (Math.random() - 0.5) * 0.3;
          sample += noise * envelope;
          
          // Add a sharp crack at the beginning
          if (t < 0.1) {
            const crackEnvelope = Math.exp(-t * 50);
            sample += Math.sin(2 * Math.PI * 800 * t) * crackEnvelope * 0.5;
          }
        }
        
        // Clamp the sample to prevent distortion
        sample = Math.max(-1, Math.min(1, sample));
        view.setInt16(44 + i * 2, sample * 32767, true);
      }
      
      return buffer;
    };
    
    const audioBuffer = createTone();
    const bytes = new Uint8Array(audioBuffer);
    
    // Convert to base64 manually
    let base64 = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    for (let i = 0; i < bytes.length; i += 3) {
      const a = bytes[i];
      const b = bytes[i + 1] || 0;
      const c = bytes[i + 2] || 0;
      const bitmap = (a << 16) | (b << 8) | c;
      base64 += chars.charAt((bitmap >> 18) & 63);
      base64 += chars.charAt((bitmap >> 12) & 63);
      base64 += chars.charAt((bitmap >> 6) & 63);
      base64 += chars.charAt(bitmap & 63);
    }
    
    const dataUri = `data:audio/wav;base64,${base64}`;
    console.log(`${LOG_MESSAGES.LOADING_SOUND} ${isCorrect ? 'correct' : 'incorrect'} sound with data URI length:`, dataUri.length);
    await sound.loadAsync({ uri: dataUri });
    console.log(`${LOG_MESSAGES.SOUND_LOADED} ${isCorrect ? 'correct' : 'incorrect'} sound`);
    
    return {
      play: async () => {
        try {
          console.log(`${LOG_MESSAGES.PLAYING_SOUND} ${isCorrect ? 'correct' : 'incorrect'} laser sound`);
          
          // Play the audio
          await sound.replayAsync();
          
          // Add vibration feedback
          const vibrationPattern = isCorrect ? QUIZ_CONSTANTS.VIBRATION.CORRECT : QUIZ_CONSTANTS.VIBRATION.INCORRECT;
          Vibration.vibrate(vibrationPattern);
        } catch (error) {
          console.log(ERROR_MESSAGES.SOUND_PLAYBACK, error);
          // Fallback to vibration only
          const fallbackPattern = isCorrect ? QUIZ_CONSTANTS.VIBRATION.FALLBACK_CORRECT : QUIZ_CONSTANTS.VIBRATION.FALLBACK_INCORRECT;
          Vibration.vibrate(fallbackPattern);
        }
      },
      unload: async () => {
        try {
          await sound.unloadAsync();
        } catch (error) {
          console.log(ERROR_MESSAGES.SOUND_UNLOAD, error);
        }
      }
    };
  } catch (error) {
    console.log(ERROR_MESSAGES.SOUND_CREATION, error);
    // Fallback to vibration only
    return {
      play: async () => {
        console.log(`${LOG_MESSAGES.FALLBACK_VIBRATION} ${isCorrect ? 'correct' : 'incorrect'} vibration`);
        const fallbackPattern = isCorrect ? QUIZ_CONSTANTS.VIBRATION.FALLBACK_CORRECT : QUIZ_CONSTANTS.VIBRATION.FALLBACK_INCORRECT;
        Vibration.vibrate(fallbackPattern);
      },
      unload: async () => {}
    };
  }
};

// Initialize sound effects
export const initializeSounds = async () => {
  try {
    console.log(LOG_MESSAGES.INITIALIZING_SOUNDS);
    
    // Configure audio mode for Android
    await Audio.setAudioModeAsync(QUIZ_CONSTANTS.AUDIO_MODE);
    
    // Create simple laser hit sounds
    const correctSoundData = await createLaserHitSound(true);
    const incorrectSoundData = await createLaserHitSound(false);
    
    console.log(LOG_MESSAGES.SOUNDS_INITIALIZED);
    
    return {
      correctSound: correctSoundData,
      incorrectSound: incorrectSoundData
    };
  } catch (error) {
    console.log(ERROR_MESSAGES.SOUND_LOADING, error);
    return {
      correctSound: null,
      incorrectSound: null
    };
  }
};
