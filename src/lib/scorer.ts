import type { Candidate, Topic, TopicImportance, CandidateAnswerSVO, QuestionSVO } from './sheets';

export interface UserAnswerSVO {
  questionId: string;
  value: number | string;
}

export interface UserTopicWeight {
  topicId: string;
  weight: number;
}

//
// SVO-BASED SCORING FUNCTIONS
//
// The vector-math helpers that used to live here — cosineSimilarity,
// weightedCosineSimilarity, normalizeScores and two percentage transforms —
// existed only for the legacy scorers and went with them. SVO scoring compares
// answers per question through calculateQuestionSimilarity rather than building
// one vector per candidate, because answers are no longer all numeric.
//

/**
 * Calculates Jaccard similarity between two sets (for multiple choice questions)
 * @param userSelections Array of user's selected options
 * @param candidateSelections Array of candidate's selected options  
 * @returns Jaccard similarity coefficient (0-1)
 */
export function jaccardSimilarity(userSelections: string[], candidateSelections: string[]): number {
  if (userSelections.length === 0 && candidateSelections.length === 0) {
    return 1.0; // Both empty = perfect match
  }
  
  const set1 = new Set(userSelections);
  const set2 = new Set(candidateSelections);
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

/**
 * Calculates similarity for a single question based on its type
 * @param userAnswer User's answer (number or string)
 * @param candidateAnswer Candidate's answer (number or string)
 * @param questionType Type of question
 * @returns Similarity score (0-1)
 */
export function calculateQuestionSimilarity(
  userAnswer: number | string,
  candidateAnswer: number | string,
  questionType: string,
  questionOptions?: string[]
): number {
  switch (questionType) {
    case 'agree_5':
      // 5-point scale: graduated matching with neutral boundary
      // Convert text answers to numbers using custom options if available
      let userNum5 = typeof userAnswer === 'number' ? userAnswer : parseFloat(String(userAnswer));
      let candNum5 = typeof candidateAnswer === 'number' ? candidateAnswer : parseFloat(String(candidateAnswer));
      
      // If parseFloat failed and we have custom options, try reverse mapping
      if (isNaN(candNum5) && questionOptions && questionOptions.length >= 5) {
        const index = questionOptions.findIndex(opt => opt === String(candidateAnswer));
        if (index >= 0) {
          candNum5 = 5 - index; // Option1 = 5, Option5 = 1
        }
      }
      
      if (isNaN(userNum5) && questionOptions && questionOptions.length >= 5) {
        const index = questionOptions.findIndex(opt => opt === String(userAnswer));
        if (index >= 0) {
          userNum5 = 5 - index;
        }
      }
      
      if (!isNaN(userNum5) && !isNaN(candNum5)) {
        const distance = Math.abs(userNum5 - candNum5);
        
        // Perfect match
        if (distance === 0) return 1.0;
        
        // Adjacent strong values only (not crossing neutral)
        if (distance === 1) {
          // Both on agree side (4,5)
          if (userNum5 >= 4 && candNum5 >= 4) return 0.5;
          // Both on disagree side (1,2)
          if (userNum5 <= 2 && candNum5 <= 2) return 0.5;
          // Crossing neutral boundary (2↔3 or 3↔4)
          return 0;
        }
        
        // Distance 2+: no match
        return 0;
      }
      return 0;

    case 'support_3':
      // 3-point scale: asymmetric graduated matching
      // Convert text answers to numbers using custom options if available
      let userNum3 = typeof userAnswer === 'number' ? userAnswer : parseFloat(String(userAnswer));
      let candNum3 = typeof candidateAnswer === 'number' ? candidateAnswer : parseFloat(String(candidateAnswer));
      
      // If parseFloat failed and we have custom options, try reverse mapping
      if (isNaN(candNum3) && questionOptions && questionOptions.length >= 3) {
        const index = questionOptions.findIndex(opt => opt === String(candidateAnswer));
        if (index >= 0) {
          candNum3 = 3 - index; // Option1 = 3, Option3 = 1
        }
      }
      
      if (isNaN(userNum3) && questionOptions && questionOptions.length >= 3) {
        const index = questionOptions.findIndex(opt => opt === String(userAnswer));
        if (index >= 0) {
          userNum3 = 3 - index;
        }
      }
      
      if (!isNaN(userNum3) && !isNaN(candNum3)) {
        const distance = Math.abs(userNum3 - candNum3);
        
        // Perfect match
        if (distance === 0) return 1.0;
        
        // Asymmetric partial credit: only when candidate is extreme (1 or 3) and user is neutral (2)
        if (distance === 1) {
          // Candidate extreme (Support=3 or Oppose=1), User neutral (2)
          if ((candNum3 === 3 || candNum3 === 1) && userNum3 === 2) return 0.25;
          // All other adjacent combinations: no match
          return 0;
        }
        
        // Opposite (1↔3): no match
        return 0;
      }
      return 0;

    case 'pick_1_3':
    case 'pick_1_4':
    case 'pick_1_5':
    case 'binary_choice':
      // Categorical: exact match or no match
      return userAnswer === candidateAnswer ? 1.0 : 0.0;

    case 'multiple_choice':
      // Multiple choice: use Jaccard similarity with pipe delimiter
      if (typeof userAnswer === 'string' && typeof candidateAnswer === 'string') {
        const userSelections = userAnswer.split('|').map(s => s.trim()).filter(s => s.length > 0);
        const candidateSelections = candidateAnswer.split('|').map(s => s.trim()).filter(s => s.length > 0);
        return jaccardSimilarity(userSelections, candidateSelections);
      }
      return 0;

    default:
      // Unknown type: assume exact match
      return userAnswer === candidateAnswer ? 1.0 : 0.0;
  }
}

/**
 * Calculates match percentages for SVO questions with mixed data types
 * @param userAnswers Array of user answers with mixed types
 * @param candidateAnswers Array of candidate answers with mixed types
 * @param candidates Array of candidates
 * @param questions Array of SVO questions
 * @returns Array of candidates with match percentages, sorted by match percentage
 */
export function calculateSVOMatches(
  userAnswers: UserAnswerSVO[],
  candidateAnswers: CandidateAnswerSVO[],
  candidates: Candidate[],
  questions: QuestionSVO[]
): Array<Candidate & { matchPercentage: number }> {
  // Filter to only active questions
  const activeQuestions = questions.filter(q => q.active);
  const activeQuestionIds = activeQuestions.map(q => q.id);
  
  // Calculate raw similarity scores for each candidate
  const candidateScores = candidates.map(candidate => {
    let totalSimilarity = 0;
    let questionCount = 0;
    let answeredQuestions = 0;
    
    for (const question of activeQuestions) {
      const userAnswer = userAnswers.find(a => a.questionId === question.id);
      const candidateAnswer = candidateAnswers.find(
        a => a.candidateId === candidate.id && a.questionId === question.id
      );
      
      // Count questions candidate actually answered (not null/empty)
      if (candidateAnswer && candidateAnswer.value !== null && candidateAnswer.value !== '' && candidateAnswer.value !== undefined) {
        answeredQuestions++;
      }
      
      if (userAnswer && candidateAnswer) {
        const similarity = calculateQuestionSimilarity(
          userAnswer.value,
          candidateAnswer.value,
          question.type,
          question.options
        );
        totalSimilarity += similarity;
        questionCount++;
      }
    }
    
    // Calculate average similarity across all questions
    const averageSimilarity = questionCount > 0 ? totalSimilarity / questionCount : 0;
    
    // Calculate participation rate
    const totalActiveQuestions = activeQuestions.length;
    const participationRate = totalActiveQuestions > 0 ? answeredQuestions / totalActiveQuestions : 0;

    return {
      ...candidate,
      rawScore: averageSimilarity,
      participationRate: participationRate,
      answeredQuestions: answeredQuestions,
      totalQuestions: totalActiveQuestions
    };
  });
  
  // Convert to percentages (0-100)
  const candidateMatches = candidateScores.map(candidate => ({
    ...candidate,
    matchPercentage: Math.round(candidate.rawScore * 100)
  }));
  
  // Sort by match percentage (descending)
  return candidateMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

/**
 * Calculates weighted SVO matches with topic importance
 * @param userAnswers Array of user answers with mixed types
 * @param userTopicWeights Array of user topic weights
 * @param candidateAnswers Array of candidate answers with mixed types
 * @param candidates Array of candidates
 * @param questions Array of SVO questions
 * @param topics Array of topics
 * @returns Array of candidates with match percentages and topic breakdowns
 */
export function calculateWeightedSVOMatches(
  userAnswers: UserAnswerSVO[],
  userTopicWeights: UserTopicWeight[],
  candidateAnswers: CandidateAnswerSVO[],
  candidates: Candidate[],
  questions: QuestionSVO[],
  topics: Topic[]
): Array<Candidate & { 
  matchPercentage: number, 
  topicMatches: { topicId: string, topicName: string, matchPercentage: number }[],
  participationRate: number,
  answeredQuestions: number,
  totalQuestions: number
}> {
  // Filter to only active questions
  const activeQuestions = questions.filter(q => q.active);
  
  // Create a mapping of questions to their topics
  const questionTopicMap = activeQuestions.reduce((map, question) => {
    map[question.id] = question.topic;
    return map;
  }, {} as Record<string, string>);
  
  // Create a mapping of topics to their weights
  const topicWeightMap = userTopicWeights.reduce((map, weight) => {
    map[weight.topicId] = weight.weight;
    return map;
  }, {} as Record<string, number>);
  
  // Calculate topic-level matches for each candidate
  const candidateMatches = candidates.map(candidate => {
    // Group questions by topic and calculate topic-level similarities
    const topicSimilarities: Record<string, { total: number, count: number }> = {};
    let answeredQuestions = 0;
    
    for (const question of activeQuestions) {
      const userAnswer = userAnswers.find(a => a.questionId === question.id);
      const candidateAnswer = candidateAnswers.find(
        a => a.candidateId === candidate.id && a.questionId === question.id
      );
      
      // Count questions candidate actually answered (not null/empty)
      if (candidateAnswer && candidateAnswer.value !== null && candidateAnswer.value !== '' && candidateAnswer.value !== undefined) {
        answeredQuestions++;
      }
      
      if (userAnswer && candidateAnswer) {
        const similarity = calculateQuestionSimilarity(
          userAnswer.value,
          candidateAnswer.value,
          question.type,
          question.options
        );
        
        const topicId = question.topic;
        if (!topicSimilarities[topicId]) {
          topicSimilarities[topicId] = { total: 0, count: 0 };
        }
        topicSimilarities[topicId].total += similarity;
        topicSimilarities[topicId].count++;
      }
    }
    
    // Calculate topic averages and apply weights
    let weightedTotal = 0;
    let totalWeight = 0;
    const topicMatches: { topicId: string, topicName: string, matchPercentage: number }[] = [];
    
    for (const [topicId, similarity] of Object.entries(topicSimilarities)) {
      const topicAverage = similarity.count > 0 ? similarity.total / similarity.count : 0;
      const topicWeight = topicWeightMap[topicId] || 1;
      const topic = topics.find(t => t.id === topicId);
      
      weightedTotal += topicAverage * topicWeight;
      totalWeight += topicWeight;
      
      topicMatches.push({
        topicId,
        topicName: topic?.name || topicId,
        matchPercentage: Math.round(topicAverage * 100)
      });
    }
    
    // Calculate overall weighted average
    const overallMatch = totalWeight > 0 ? weightedTotal / totalWeight : 0;
    
    // Calculate participation rate
    const totalActiveQuestions = activeQuestions.length;
    const participationRate = totalActiveQuestions > 0 ? answeredQuestions / totalActiveQuestions : 0;

    return {
      ...candidate,
      matchPercentage: Math.round(overallMatch * 100),
      topicMatches: topicMatches.sort((a, b) => b.matchPercentage - a.matchPercentage),
      participationRate: participationRate,
      answeredQuestions: answeredQuestions,
      totalQuestions: totalActiveQuestions
    };
  });
  
  // Sort by overall match percentage (descending)
  return candidateMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);
}
