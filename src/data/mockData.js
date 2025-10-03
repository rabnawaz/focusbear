export const mockData = {
  gameStats: {
    round: 1,
    totalRounds: 6,
    bestRT: 0,
    streak: 0,
    score: 0
  },
  
  quizQuestions: [
    {
      id: 1,
      question: "Select the programming question:",
      options: [
        "Show How To Use Python's List Comprehension To Filter Even Numbers From A List.",
        "Explain The Principles Of Baking Sourdough Bread.",
        "Guide To Painting A Portrait Using Acrylics On Canvas.",
        "Discuss The Basics Of Quantum Entanglement For Beginners."
      ],
      correctAnswer: 0,
      isCorrect: true
    },
    {
      id: 2,
      question: "Select the programming question:",
      options: [
        "Implement A Python Class With Methods For Adding, Removing, And Listing Items In A To-Do App.",
        "Describe How To Perform A Hip Replacement Surgery Step By Step.",
        "Explain How To Knit A Scarf In Garter Stitch.",
        "Outline A Plan For Running A Marathon Over 16 Weeks."
      ],
      correctAnswer: 0,
      isCorrect: false
    }
  ],
  
  leaderboard: [
    { rank: 1, userName: "python", score: 60, bestRT: 6301 },
    { rank: 2, userName: "React", score: 60, bestRT: 7655 },
    { rank: 3, userName: "gym", score: 60, bestRT: 1866 },
    { rank: 4, userName: "Python quizz", score: 45, bestRT: 4955 },
    { rank: 5, userName: "gym quizz", score: 30, bestRT: 7902 }
  ],
  
  results: {
    accuracy: 83.33,
    fastestRT: 4955,
    score: 45,
    round: 6,
    totalRounds: 6,
    streak: 2
  }
};
