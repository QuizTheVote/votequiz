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

// New enhanced question interface for SVO framework
export interface QuestionSVO {
  id: string;
  text: string;
  topic: string;
  explanation?: string;
  type: 'agree_5' | 'pick_1_3' | 'pick_1_4' | 'pick_1_5' | 'binary_choice' | 'support_3' | 'multiple_choice';
  priority: 'Essential' | 'Additional';
  active: boolean;
  options: string[];
}

export interface CandidateAnswer {
  candidateId: string;
  questionId: string;
  value: number;
}

// New enhanced candidate answer interface for SVO framework
export interface CandidateAnswerSVO {
  candidateId: string;
  questionId: string;
  value: number | string; // Support both numeric scales and text choices
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

// New enhanced quiz data interface for SVO framework
export interface QuizDataSVO {
  candidates: Candidate[];
  questions: QuestionSVO[];
  candidateAnswers: CandidateAnswerSVO[];
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
 * Fetches SVO data from a Google Sheet using the new Quiz_Data structure
 * @param sheetId The ID of the Google Sheet
 * @returns Promise that resolves to the QuizDataSVO object
 */
/**
 * Modern CSV-based approach for fetching Google Sheets data
 */
async function fetchSheetAsCSV(sheetId: string, sheetName: string): Promise<any[]> {
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
  console.log(`Fetching CSV from: ${csvUrl}`);
  
  const response = await fetch(csvUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${sheetName}: ${response.status} ${response.statusText}`);
  }
  
  const csvText = await response.text();
  return parseCSV(csvText);
}

function parseCSV(csvText: string): any[] {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    rows.push(row);
  }
  
  return rows;
}

export async function fetchSheetDataSVO(sheetId: string | null): Promise<QuizDataSVO> {
  if (!sheetId || !isValidSheetId(sheetId)) {
    throw new Error('Valid Google Sheet ID required. Format: 1ayBgqVYpBirba1Scg8zgYlrmk4K61HrxgvrsYJO7G7Y');
  }

  try {
    console.log('Fetching SVO data using modern CSV approach');
    
    // Fetch all sheets as CSV
    const [quizDataRows, candidates, topics] = await Promise.all([
      fetchSheetAsCSV(sheetId, 'Quiz_Data'),
      fetchSheetAsCSV(sheetId, 'Candidates'), 
      fetchSheetAsCSV(sheetId, 'Topics').catch(() => []) // Topics is optional
    ]);
    
    console.log('Quiz_Data rows:', quizDataRows.length);
    console.log('Candidates found:', candidates.length);
    console.log('Topics found:', topics.length);

    // Parse questions from Quiz_Data
    const questions: QuestionSVO[] = [];
    const candidateAnswers: CandidateAnswerSVO[] = [];
    
    quizDataRows.forEach((row, index) => {
      console.log(`Processing row ${index + 1}:`, row);
      
      // Create question
      const question: QuestionSVO = {
        id: `q${index + 1}`,
        text: row.Question || '',
        topic: row.Topic || '',
        explanation: row.Explanation || '',
        type: row.Type || 'agree_5',
        priority: row.Priority || 'Essential',
        active: row.Active === 'TRUE' || row.Active === true,
        options: [
          row.Option1,
          row.Option2, 
          row.Option3,
          row.Option4,
          row.Option5
        ].filter(opt => opt && opt.trim() !== '')
      };
      
      console.log('Created question:', question);
      questions.push(question);

      // Extract candidate answers from the same row
      candidates.forEach(candidate => {
        // Use full candidate name to match column headers
        const candidateColumnName = candidate.name.trim();
        const answerValue = row[candidateColumnName];
        
        console.log(`Looking for column '${candidateColumnName}' for candidate ${candidate.id}:`, answerValue);
        console.log(`Available columns:`, Object.keys(row));
        
        if (answerValue !== undefined && answerValue !== '') {
          candidateAnswers.push({
            candidateId: candidate.id,
            questionId: question.id,
            value: answerValue
          });
        } else {
          console.warn(`⚠️ No answer found for candidate ${candidate.name} in question ${question.id}`);
        }
      });
    });
    
    console.log('Final questions:', questions.length);
    console.log('Final candidate answers:', candidateAnswers.length);

    return {
      candidates,
      questions,
      candidateAnswers,
      topics,
      topicImportance: []
    };
  } catch (error) {
    throw new Error(`Error processing SVO sheet data: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Fetches data from a Google Sheet using Tabletop.js (traditional structure)
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