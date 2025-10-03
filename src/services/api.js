const API_BASE_URL = 'https://backenddistractionblocker.onrender.com/api/tasks';

// Test function to verify API connectivity with dynamic topic
export const testAPI = async (topic) => {
  if (!topic) {
    console.log('No topic provided for API test');
    return false;
  }
  try {
    console.log(`Testing API connectivity with topic: ${topic}`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('API test timeout after 5 seconds');
      controller.abort();
    }, 9000); // 5 second timeout
    
    const response = await fetch(`${API_BASE_URL}/${topic}`, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    console.log('Test response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Test API response received successfully');
      return true;
    } else {
      console.log(`API test failed with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('API test timed out');
    } else {
      console.log('API test failed:', error.message);
    }
    return false;
  }
};

export const fetchQuizData = async (topic) => {
  try {
    console.log(`Fetching quiz data for topic: ${topic}`);
    
    // Try multiple variations of the topic
    const topicVariations = [
      topic, // Original case
      topic.toLowerCase(), // Lowercase
      topic.toUpperCase(), // Uppercase
      topic.charAt(0).toUpperCase() + topic.slice(1).toLowerCase(), // Title case
    ];
    
    let response;
    let data;
    let lastError;
    let connectionError = false;
    
    for (const topicVariation of topicVariations) {
      try {
        console.log(`Trying topic variation: ${topicVariation}`);
        const url = `${API_BASE_URL}/${topicVariation}`;
        console.log(`Fetching from: ${url}`);
        
        // Add timeout handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
        
        response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          data = await response.json();
          console.log('API Response received successfully');
          break;
        } else {
          console.log(`Failed with status: ${response.status} for ${topicVariation}`);
          if (response.status >= 500) {
            connectionError = true;
          }
        }
      } catch (err) {
        lastError = err;
        console.log(`Error for ${topicVariation}:`, err.message);
        if (err.name === 'AbortError') {
          console.log('Request timed out for', topicVariation);
          connectionError = true;
        } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
          connectionError = true;
        }
      }
    }
    
    if (!response || !response.ok) {
      const errorMessage = connectionError 
        ? `Connection failed! Unable to reach the server. Please check your internet connection.`
        : `HTTP error! status: ${response?.status} for topic: ${topic}. Tried variations: ${topicVariations.join(', ')}`;
      throw new Error(errorMessage);
    }
    
    console.log('API Response:', data);
    
    if (data && data.success && data.data) {
      // Transform the API data into our quiz format
      const quizQuestions = [];
      
      // Convert each group (1-6) into quiz questions
      Object.keys(data.data).forEach((groupKey, groupIndex) => {
        const group = data.data[groupKey];
        if (Array.isArray(group) && group.length > 0) {
          // Find the correct answer (isCorrectOption: true)
          const correctIndex = group.findIndex(item => item.isCorrectOption === true);
          
          if (correctIndex !== -1) {
            const question = {
              id: groupIndex + 1,
              question: `Select the ${topic.toLowerCase()}-related task:`,
              options: group.map(item => item.task),
              correctAnswer: correctIndex,
              isCorrect: false
            };
            quizQuestions.push(question);
          }
        }
      });
      
      console.log(`Generated ${quizQuestions.length} quiz questions`);
      return quizQuestions;
    }
    
    console.warn('API response structure unexpected, using fallback data');
    return getFallbackQuizData(topic);
  } catch (error) {
    console.error('Error fetching quiz data:', error);
    // Return fallback data if API fails
    return getFallbackQuizData(topic);
  }
};

const getFallbackQuizData = (topic) => {
  const fallbackData = {
    'yoga': [
      {
        id: 1,
        question: `Select the ${topic.toLowerCase()}-related task:`,
        options: [
          "Practice a basic downward-facing dog pose to stretch hamstrings and calves.",
          "Solve a quadratic equation for homework practice.",
          "Explain the process of photosynthesis in plants.",
          "List the capitals of three European countries."
        ],
        correctAnswer: 0,
        isCorrect: false
      },
      {
        id: 2,
        question: `Choose the ${topic.toLowerCase()} activity:`,
        options: [
          "Hold a warrior pose for 30 seconds to improve balance.",
          "Calculate the area of a triangle using geometry formulas.",
          "Describe the water cycle in nature.",
          "Name five different types of flowers."
        ],
        correctAnswer: 0,
        isCorrect: false
      },
      {
        id: 3,
        question: `Which is a ${topic.toLowerCase()} practice?`,
        options: [
          "Perform 5 minutes of mindful breathing meditation.",
          "Solve a complex algebra problem step by step.",
          "Explain how a car engine works.",
          "List the ingredients for making bread."
        ],
        correctAnswer: 0,
        isCorrect: false
      }
    ],
    'python': [
      {
        id: 1,
        question: `Select the ${topic.toLowerCase()}-related task:`,
        options: [
          "Write a Python function to calculate the factorial of a number.",
          "Describe the history of medieval castles in Europe.",
          "Explain how to bake a chocolate cake from a recipe.",
          "List the capitals of three European countries."
        ],
        correctAnswer: 0,
        isCorrect: false
      },
      {
        id: 2,
        question: `Choose the ${topic.toLowerCase()} programming task:`,
        options: [
          "Create a Python script to read and process a CSV file.",
          "Explain the process of making homemade pasta.",
          "Describe the life cycle of a butterfly.",
          "List the names of five famous painters."
        ],
        correctAnswer: 0,
        isCorrect: false
      },
      {
        id: 3,
        question: `Which is a ${topic.toLowerCase()} coding exercise?`,
        options: [
          "Implement a binary search algorithm in Python.",
          "Describe how to grow tomatoes in a garden.",
          "Explain the structure of the human heart.",
          "List the steps to change a car tire."
        ],
        correctAnswer: 0,
        isCorrect: false
      }
    ],
    'gym': [
      {
        id: 1,
        question: `Select the ${topic.toLowerCase()}-related task:`,
        options: [
          "Perform 10 push-ups to build upper body strength.",
          "Solve a quadratic equation for homework practice.",
          "Explain the process of photosynthesis in plants.",
          "List the capitals of three European countries."
        ],
        correctAnswer: 0,
        isCorrect: false
      },
      {
        id: 2,
        question: `Choose the ${topic.toLowerCase()} workout:`,
        options: [
          "Do 3 sets of 15 squats to strengthen your legs.",
          "Calculate the volume of a rectangular prism.",
          "Describe the process of making coffee.",
          "Name three different types of trees."
        ],
        correctAnswer: 0,
        isCorrect: false
      },
      {
        id: 3,
        question: `Which is a ${topic.toLowerCase()} exercise?`,
        options: [
          "Complete a 20-minute cardio session on the treadmill.",
          "Solve a system of linear equations.",
          "Explain how a refrigerator keeps food cold.",
          "List the steps to plant a flower garden."
        ],
        correctAnswer: 0,
        isCorrect: false
      }
    ]
  };
  
  return fallbackData[topic.toLowerCase()] || fallbackData['python'];
};
