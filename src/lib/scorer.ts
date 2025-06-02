import type { CandidateAnswer, Candidate, Question, Topic, TopicImportance } from './sheets';

export interface UserAnswer {
  questionId: string;
  value: number;
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