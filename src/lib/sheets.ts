import Tabletop from 'tabletop';

export interface Candidate {
  id: string;
  name: string;
  party: string;
  photo: string;
  bio: string;
  website: string;
}

export interface Question {
  id: string;
  text: string;
  topic: string;
  explanation?: string;
  type?: 'general' | 'local';
}

export interface CandidateAnswer {
  candidateId: string;
  questionId: string;
  value: number;
}

export interface Topic {
  id: string;
  name: string;
  description?: string;
  category?: 'general' | 'local';
}

export interface TopicImportance {
  candidateId: string;
  topicId: string;
  weight: number;
}

export interface UserTopicWeight {
  topicId: string;
  weight: number;
}

export interface QuizData {
  candidates: Candidate[];
  questions: Question[];
  candidateAnswers: CandidateAnswer[];
  topics: Topic[];
  topicImportance?: TopicImportance[];
}

/**
 * Validates that the sheet has all required tabs and columns
 */
function validateSheetData(tabletop: any): string | null {
  // Check if required sheets exist
  const requiredSheets = ['Candidates', 'Questions', 'CandidateAnswers'];
  for (const sheetName of requiredSheets) {
    if (!tabletop.sheets(sheetName)) {
      return `Missing required tab: "${sheetName}". Please make sure your Google Sheet has this tab.`;
    }
  }

  // Validate Candidates sheet columns
  const candidateColumns = ['id', 'name', 'party', 'photo', 'bio', 'website'];
  const candidateSample = tabletop.sheets('Candidates').all()[0] || {};
  for (const column of candidateColumns) {
    if (!(column in candidateSample)) {
      return `Missing required column "${column}" in the Candidates tab.`;
    }
  }

  // Validate Questions sheet columns
  const questionColumns = ['id', 'text', 'topic'];
  const questionSample = tabletop.sheets('Questions').all()[0] || {};
  for (const column of questionColumns) {
    if (!(column in questionSample)) {
      return `Missing required column "${column}" in the Questions tab.`;
    }
  }

  // Validate CandidateAnswers sheet columns
  const answerColumns = ['candidateId', 'questionId', 'value'];
  const answerSample = tabletop.sheets('CandidateAnswers').all()[0] || {};
  for (const column of answerColumns) {
    if (!(column in answerSample)) {
      return `Missing required column "${column}" in the CandidateAnswers tab.`;
    }
  }

  return null; // No validation errors
}

/**
 * Validates that a string is a properly formatted Google Sheet ID
 * @param id The Sheet ID to validate
 * @returns True if the ID appears to be valid
 */
function isValidSheetId(id: string): boolean {
  // Google Sheet IDs are typically 44 characters long and contain letters, numbers, hyphens, and underscores
  return /^[a-zA-Z0-9-_]{30,50}$/.test(id);
}

/**
 * Fetches data from a Google Sheet using Tabletop.js
 * @param sheetId The ID of the Google Sheet
 * @returns Promise that resolves to the QuizData object
 */
export async function fetchSheetData(sheetId: string | null): Promise<QuizData> {
  if (!sheetId || !isValidSheetId(sheetId)) {
    throw new Error('Valid Google Sheet ID required. Format: 1ayBgqVYpBirba1Scg8zgYlrmk4K61HrxgvrsYJO7G7Y');
  }

  return new Promise((resolve, reject) => {
    try {
      const tabletopOptions = {
        key: sheetId,
        callback: (data: any, tabletop: any) => {
          try {
            // Validate sheet structure
            const validationError = validateSheetData(tabletop);
            if (validationError) {
              reject(new Error(validationError));
              return;
            }

            // Get data from each sheet
            const candidates = tabletop.sheets('Candidates').all() as Candidate[];
            const questions = tabletop.sheets('Questions').all() as Question[];
            const candidateAnswers = tabletop.sheets('CandidateAnswers').all() as CandidateAnswer[];
            
            // Topics sheet is optional
            let topics: Topic[] = [];
            try {
              if (tabletop.sheets('Topics')) {
                topics = tabletop.sheets('Topics').all() as Topic[];
              }
            } catch (e) {
              console.log('Topics tab not found, continuing without it.');
            }

            // Topic importance is optional
            let topicImportance: TopicImportance[] = [];
            try {
              if (tabletop.sheets('TopicImportance')) {
                topicImportance = tabletop.sheets('TopicImportance').all() as TopicImportance[];
              }
            } catch (e) {
              console.log('TopicImportance tab not found, continuing without it.');
            }

            // Convert string values to numbers in candidateAnswers
            const processedAnswers = candidateAnswers.map(answer => ({
              ...answer,
              value: typeof answer.value === 'string' ? parseInt(answer.value, 10) : answer.value
            }));

            // Convert string weights to numbers in topicImportance
            const processedImportance = topicImportance.map(importance => ({
              ...importance,
              weight: typeof importance.weight === 'string' ? parseInt(importance.weight, 10) : importance.weight
            }));

            resolve({
              candidates,
              questions,
              candidateAnswers: processedAnswers,
              topics,
              topicImportance: processedImportance
            });
          } catch (error) {
            reject(new Error(`Error processing sheet data: ${error instanceof Error ? error.message : String(error)}`));
          }
        },
        simpleSheet: false,
        debug: false
      };

      Tabletop.init(tabletopOptions);
    } catch (error) {
      reject(new Error(`Failed to initialize Tabletop: ${error instanceof Error ? error.message : String(error)}`));
    }
  });
} 