import type { CandidateAnswer, Candidate, Question, Topic, TopicImportance, CandidateAnswerSVO, QuestionSVO } from './sheets';

export interface UserAnswer {
  questionId: string;
  value: number;
}

// New interface for SVO user answers that support mixed data types
export interface UserAnswerSVO {
  questionId: string;
  value: number | string;
}

export interface UserTopicWeight {
  topicId: string;
  weight: number;
}

/**
 * Calculates the cosine similarity between two vectors
 * @param a First vector
 * @param b Second vector
 * @returns Cosine similarity (0-1 where 1 is perfect match)
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must be of the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Transforms a raw cosine similarity score (0-1) to an absolute percentage (0-100)
 * This provides an absolute percentage match regardless of other candidates
 * @param similarity Raw cosine similarity (0-1)
 * @returns Percentage match (0-100)
 */
export function absoluteCosineSimilarityToPercentage(similarity: number): number {
  // For perfectly identical answers (extremely rare)
  if (similarity >= 0.9999) return 100;
  
  // For completely opposite answers
  if (similarity <= 0) return 20;
  
  // Apply a linear transformation with adjusted range to spread out results
  // Map similarity of 0-1 to a percentage of 20-100
  // This creates more differentiation in the higher ranges
  // The formula maps:
  // 0 -> 20%
  // 0.25 -> 40%
  // 0.5 -> 60%
  // 0.75 -> 80%
  // 1.0 -> 100%
  const percentage = 20 + (similarity * 80);
  
  return Math.round(percentage);
}

/**
 * Transforms a similarity score (0-1) to a more differentiated percentage (0-100)
 * @param similarity Raw similarity score (0-1)
 * @returns Transformed percentage value (0-100)
 */
export function transformSimilarityToPercentage(similarity: number): number {
  // Apply a power transformation to amplify differences
  // Using power of 1.5 to spread out high values more
  // Then scale to 0-100 range with a minimum of 20% to avoid too low scores
  const transformed = Math.pow(similarity, 1.5);
  return Math.round(20 + (transformed * 80));
}

/**
 * Calculates the weighted cosine similarity between two vectors
 * @param a First vector
 * @param b Second vector
 * @param weights Vector of weights corresponding to each position
 * @returns Weighted cosine similarity (0-1 where 1 is perfect match)
 */
export function weightedCosineSimilarity(a: number[], b: number[], weights: number[]): number {
  if (a.length !== b.length || a.length !== weights.length) {
    throw new Error('Vectors must be of the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    const weight = weights[i] || 1;
    dotProduct += weight * a[i] * b[i];
    normA += weight * a[i] * a[i];
    normB += weight * b[i] * b[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Applies normalization to a set of scores to ensure greater differentiation
 * @param scores Array of raw scores
 * @returns Array of normalized scores spread across a wider range
 */
export function normalizeScores(scores: number[]): number[] {
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  
  // If all values are the same, use absolute scoring instead of defaulting to 50%
  if (max === min) {
    // Convert cosine similarity (typically 0-1) to a meaningful percentage
    // This will vary based on the actual match rather than giving every candidate 50%
    return scores.map(score => absoluteCosineSimilarityToPercentage(score));
  }
  
  // Apply a normalization that spreads values from 20-100
  return scores.map(score => {
    const normalized = 20 + (score - min) / (max - min) * 80;
    return Math.round(normalized);
  });
}

/**
 * Calculates match percentages between user answers and all candidates
 * @param userAnswers Array of user answers
 * @param candidateAnswers Array of all candidate answers
 * @param candidates Array of candidates
 * @param questions Array of questions
 * @returns Array of candidates with match percentages, sorted by match percentage
 */
export function calculateMatches(
  userAnswers: UserAnswer[],
  candidateAnswers: CandidateAnswer[],
  candidates: Candidate[],
  questions: Question[]
): Array<Candidate & { matchPercentage: number }> {
  // Create a sorted list of question IDs to ensure consistent vector positions
  const questionIds = questions.map(q => q.id);
  
  // Convert user answers to a vector
  const userVector = questionIds.map(qId => {
    const answer = userAnswers.find(a => a.questionId === qId);
    return answer ? answer.value : 0;
  });
  
  // Calculate raw similarity scores for each candidate
  const candidateScores = candidates.map(candidate => {
    // Convert candidate answers to a vector
    const candidateVector = questionIds.map(qId => {
      const answer = candidateAnswers.find(
        a => a.candidateId === candidate.id && a.questionId === qId
      );
      return answer ? answer.value : 0;
    });
    
    // Calculate similarity
    const similarity = cosineSimilarity(userVector, candidateVector);
    
    return {
      ...candidate,
      rawScore: similarity
    };
  });
  
  // Normalize scores to ensure better differentiation
  const rawScores = candidateScores.map(c => c.rawScore);
  const normalizedScores = normalizeScores(rawScores);
  
  // Apply normalized scores
  const candidateMatches = candidateScores.map((candidate, index) => ({
    ...candidate,
    matchPercentage: normalizedScores[index]
  }));
  
  // Sort by match percentage (descending)
  return candidateMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

//
// NEW SVO-BASED SCORING FUNCTIONS
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
  questionType: string
): number {
  switch (questionType) {
    case 'agree_5':
      // 5-point scale: calculate normalized distance
      if (typeof userAnswer === 'number' && typeof candidateAnswer === 'number') {
        return 1 - Math.abs(userAnswer - candidateAnswer) / 4; // 4 is max distance (5-1)
      }
      return 0;

    case 'support_3':
      // 3-point scale: calculate normalized distance
      if (typeof userAnswer === 'number' && typeof candidateAnswer === 'number') {
        return 1 - Math.abs(userAnswer - candidateAnswer) / 2; // 2 is max distance (3-1)
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
          question.type
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
    
    // Debug logging for participation tracking
    console.log(`📊 ${candidate.name}: answered ${answeredQuestions}/${totalActiveQuestions} questions (${Math.round(participationRate * 100)}% participation)`);
    
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
          question.type
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
    
    // Debug logging for participation tracking
    console.log(`📊 ${candidate.name}: answered ${answeredQuestions}/${totalActiveQuestions} questions (${Math.round(participationRate * 100)}% participation)`);
    
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

/**
 * Calculates weighted match percentages between user answers and all candidates
 * @param userAnswers Array of user answers
 * @param userTopicWeights Array of user topic weights
 * @param candidateAnswers Array of all candidate answers
 * @param candidates Array of candidates
 * @param questions Array of questions
 * @param topics Array of topics
 * @returns Array of candidates with match percentages and topic-specific matches, sorted by overall match percentage
 */
export function calculateWeightedMatches(
  userAnswers: UserAnswer[],
  userTopicWeights: UserTopicWeight[],
  candidateAnswers: CandidateAnswer[],
  candidates: Candidate[],
  questions: Question[],
  topics: Topic[]
): Array<Candidate & { 
  matchPercentage: number, 
  topicMatches: { topicId: string, topicName: string, matchPercentage: number }[] 
}> {
  // Create a sorted list of question IDs to ensure consistent vector positions
  const questionIds = questions.map(q => q.id);
  
  // Convert user answers to a vector
  const userVector = questionIds.map(qId => {
    const answer = userAnswers.find(a => a.questionId === qId);
    return answer ? answer.value : 0;
  });
  
  // Create a mapping of questions to their topics
  const questionTopicMap = questions.reduce((map, question) => {
    map[question.id] = question.topic;
    return map;
  }, {} as Record<string, string>);
  
  // Create a mapping of topics to their weights
  const topicWeightMap = userTopicWeights.reduce((map, weight) => {
    map[weight.topicId] = weight.weight;
    return map;
  }, {} as Record<string, number>);
  
  // Create a weights vector aligned with questionIds
  const weightVector = questionIds.map(qId => {
    const topicId = questionTopicMap[qId];
    return topicWeightMap[topicId] || 1; // Default weight 1 if not specified
  });
  
  // Calculate raw similarity scores for each candidate
  const candidateScoresWithTopics = candidates.map(candidate => {
    // Convert candidate answers to a vector
    const candidateVector = questionIds.map(qId => {
      const answer = candidateAnswers.find(
        a => a.candidateId === candidate.id && a.questionId === qId
      );
      return answer ? answer.value : 0;
    });
    
    // Calculate overall weighted similarity
    const weightedSimilarity = weightedCosineSimilarity(userVector, candidateVector, weightVector);
    
    // Calculate per-topic match percentages
    const topicMatches = topics.map(topic => {
      // Get questions for this topic
      const topicQuestionIndices = questionIds.map((qId, index) => 
        questionTopicMap[qId] === topic.id ? index : -1
      ).filter(index => index !== -1);
      
      if (topicQuestionIndices.length === 0) {
        return {
          topicId: topic.id,
          topicName: topic.name,
          matchPercentage: 0,
          rawScore: 0
        };
      }
      
      // Extract topic-specific vectors
      const topicUserVector = topicQuestionIndices.map(index => userVector[index]);
      const topicCandidateVector = topicQuestionIndices.map(index => candidateVector[index]);
      
      // Calculate topic-specific similarity
      const topicSimilarity = cosineSimilarity(topicUserVector, topicCandidateVector);
      
      return {
        topicId: topic.id,
        topicName: topic.name,
        rawScore: topicSimilarity,
        matchPercentage: 0 // Will be normalized later
      };
    });
    
    return {
      ...candidate,
      rawScore: weightedSimilarity,
      topicMatches
    };
  });
  
  // Normalize overall scores
  const rawScores = candidateScoresWithTopics.map(c => c.rawScore);
  const normalizedScores = normalizeScores(rawScores);
  
  // Normalize topic scores for each topic
  topics.forEach(topic => {
    const topicRawScores = candidateScoresWithTopics.map(
      c => c.topicMatches.find(t => t.topicId === topic.id)?.rawScore || 0
    );
    
    // Use absolute percentages for topic-specific matches too
    if (Math.max(...topicRawScores) - Math.min(...topicRawScores) < 0.1) {
      // When scores are very similar, use absolute percentages
      candidateScoresWithTopics.forEach(candidate => {
        const topicMatch = candidate.topicMatches.find(t => t.topicId === topic.id);
        if (topicMatch) {
          topicMatch.matchPercentage = absoluteCosineSimilarityToPercentage(topicMatch.rawScore);
        }
      });
    } else {
      // When there's sufficient differentiation, use normalized scores
      const topicNormalizedScores = normalizeScores(topicRawScores);
      
      // Update topic match percentages
      candidateScoresWithTopics.forEach((candidate, candidateIndex) => {
        const topicMatch = candidate.topicMatches.find(t => t.topicId === topic.id);
        if (topicMatch) {
          topicMatch.matchPercentage = topicNormalizedScores[candidateIndex];
        }
      });
    }
  });
  
  // Apply normalized overall scores
  const candidateMatches = candidateScoresWithTopics.map((candidate, index) => ({
    ...candidate,
    matchPercentage: normalizedScores[index],
    topicMatches: candidate.topicMatches.map(t => ({
      topicId: t.topicId,
      topicName: t.topicName,
      matchPercentage: t.matchPercentage
    }))
  }));
  
  // Sort by overall match percentage (descending)
  return candidateMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);
} 