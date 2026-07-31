/**
 * Converts Google Drive sharing URLs to direct image URLs
 * @param url - Original photo URL (could be Google Drive sharing URL or direct URL)
 * @returns Direct image URL suitable for <img> src attribute
 */
export function convertToDirectImageUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return url;
  }

  // Check if it's a Google Drive sharing URL
  const googleDriveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (googleDriveMatch) {
    const fileId = googleDriveMatch[1];
    return `https://lh3.googleusercontent.com/d/${fileId}=w400`;
  }

  // Check if it's already a converted Google Drive URL
  if (url.includes('lh3.googleusercontent.com/d/')) {
    return url;
  }

  // For all other URLs (CMS, direct image URLs, etc.), return as-is
  return url;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  photo: string;
  bio: string;
  link_url: string;
  link_text?: string;
}

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

/**
 * A problem found in the spreadsheet.
 *
 * `error` means the quiz a voter sees is wrong: a candidate is being scored
 * against no answers, a topic ranking is being discarded, or a required column
 * is absent. These are shown in the app, because the alternative is publishing
 * a plausible-looking but incorrect quiz.
 *
 * `notice` means something is untidy but the results are still sound. These are
 * shown only in development or with ?debug=true.
 */
export interface SheetDiagnostic {
  severity: 'error' | 'notice';
  message: string;
}

export interface QuizDataSVO {
  candidates: Candidate[];
  questions: QuestionSVO[];
  candidateAnswers: CandidateAnswerSVO[];
  topics: Topic[];
  topicImportance?: TopicImportance[];
  diagnostics?: SheetDiagnostic[];
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

interface CsvSheet {
  headers: string[];
  rows: any[];
}

/**
 * Modern CSV-based approach for fetching Google Sheets data
 */
async function fetchSheetAsCSV(sheetId: string, sheetName: string): Promise<CsvSheet> {
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

  const response = await fetch(csvUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${sheetName}: ${response.status} ${response.statusText}`);
  }

  return parseCSV(await response.text());
}

function parseCSV(csvText: string): CsvSheet {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length === 0) return { headers: [], rows: [] };

  const headers = parseCSVLine(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    rows.push(row);
  }

  return { headers, rows };
}

// Proper CSV line parsing that handles quoted fields with commas
function parseCSVLine(line: string): string[] {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Field delimiter outside quotes
      result.push(current.trim());
      current = '';
    } else {
      // Regular character
      current += char;
    }
  }

  // Add final field
  result.push(current.trim());

  return result;
}

/**
 * Reads the Active column tolerantly.
 *
 * A sheet that says `true` or `Yes` instead of `TRUE` would otherwise mark every
 * question inactive, which empties the quiz. An absent column means the newsroom
 * never opted into the feature, so everything is active.
 */
function parseActiveFlag(raw: unknown, columnPresent: boolean): boolean {
  if (!columnPresent) return true;
  if (typeof raw === 'boolean') return raw;
  const value = String(raw ?? '').trim().toLowerCase();
  if (value === '') return true;
  return value === 'true' || value === 'yes' || value === 'y' || value === '1';
}

/** Compares sheet headers to candidate names the way a human would. */
function normalizeForComparison(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Every join in this app is an exact string match with no referential integrity,
 * so a typo produces a quiz that looks fine and scores wrongly. This names the
 * exact cell to fix.
 */
function diagnoseSheet(
  quizData: CsvSheet,
  candidateSheet: CsvSheet,
  candidates: Candidate[],
  questions: QuestionSVO[],
  topics: Topic[]
): SheetDiagnostic[] {
  const diagnostics: SheetDiagnostic[] = [];
  // Severity decides who sees it. Reserve error for "the voter's matches will be
  // wrong or absent", because those surface to the public. Anything the sheet
  // owner should fix but that leaves scoring correct is a notice, shown only
  // under ?debug=true.
  const error = (message: string) => diagnostics.push({ severity: 'error', message });
  const notice = (message: string) => diagnostics.push({ severity: 'notice', message });

  if (!quizData.headers.includes('Question')) {
    error('The Quiz_Data tab has no "Question" column, so no questions could be read.');
  }
  if (!quizData.headers.includes('Topic')) {
    notice('The Quiz_Data tab has no "Topic" column, so topic ranking will not affect scores.');
  }

  for (const required of ['id', 'name'] as const) {
    if (!candidateSheet.headers.includes(required)) {
      error(`The Candidates tab has no "${required}" column.`);
    }
  }

  // The template renamed website to link_url. A sheet copied before that change
  // loses its candidate links with no other symptom. Scoring is unaffected, so
  // this stays a notice.
  if (candidateSheet.headers.includes('website') && !candidateSheet.headers.includes('link_url')) {
    notice(
      'The Candidates tab still uses a "website" column. Rename it to "link_url" ' +
        '(and optionally add "link_text"), or candidate links will not appear.'
    );
  }

  // The join that matters most: a Quiz_Data column header must exactly equal the
  // candidate's name, or that candidate is scored against nothing.
  for (const candidate of candidates) {
    const name = candidate.name?.trim();
    if (!name) {
      error('A row in the Candidates tab has an empty "name", so it cannot be matched to answers.');
      continue;
    }
    if (quizData.headers.includes(name)) continue;

    const nearMiss = quizData.headers.find(
      header => normalizeForComparison(header) === normalizeForComparison(name)
    );
    if (nearMiss) {
      error(
        `Candidate "${name}" does not match the Quiz_Data column "${nearMiss}". ` +
          'The two must be identical, including capitalisation and spaces.'
      );
    } else {
      error(
        `Candidate "${name}" has no matching column in Quiz_Data, so they will score ` +
          `zero against every question. Quiz_Data columns are: ${quizData.headers.join(', ')}.`
      );
    }
  }

  const activeQuestions = questions.filter(q => q.active);
  if (questions.length > 0 && activeQuestions.length === 0) {
    error(
      'Every question in Quiz_Data is inactive, so the quiz has nothing to ask. ' +
        'Set Active to TRUE for the questions you want to use.'
    );
  }

  // Topic weighting is applied by matching Quiz_Data.Topic against Topics.id.
  if (topics.length > 0) {
    const topicIds = new Set(topics.map(t => t.id?.trim()).filter(Boolean));
    const usedTopicIds = new Set(activeQuestions.map(q => q.topic?.trim()).filter(Boolean));

    for (const used of usedTopicIds) {
      if (!topicIds.has(used)) {
        error(
          `Question topic "${used}" is not an id in the Topics tab, so the voter's ranking ` +
            'is ignored for those questions.'
        );
      }
    }
    for (const declared of topicIds) {
      if (!usedTopicIds.has(declared)) {
        notice(
          `Topic "${declared}" is offered on the ranking screen but no active question uses it, ` +
            'so ranking it changes nothing.'
        );
      }
    }
  }

  return diagnostics;
}

export async function fetchSheetDataSVO(sheetId: string | null): Promise<QuizDataSVO> {
  if (!sheetId || !isValidSheetId(sheetId)) {
    throw new Error(
      'That does not look like a Google Sheet ID. Copy the ID from your sheet\'s address bar ' +
        'URL, the part between /d/ and /edit, not the "Publish to web" URL. ' +
        'Example: 1ayBgqVYpBirba1Scg8zgYlrmk4K61HrxgvrsYJO7G7Y'
    );
  }

  try {
    const [quizDataSheet, candidateSheet, topicSheet] = await Promise.all([
      fetchSheetAsCSV(sheetId, 'Quiz_Data'),
      fetchSheetAsCSV(sheetId, 'Candidates'),
      fetchSheetAsCSV(sheetId, 'Topics').catch(() => ({ headers: [], rows: [] }) as CsvSheet)
    ]);

    const candidates = candidateSheet.rows as Candidate[];
    const topics = topicSheet.rows as Topic[];

    candidates.forEach(candidate => {
      if (candidate.photo) {
        candidate.photo = convertToDirectImageUrl(candidate.photo);
      }
    });

    const hasActiveColumn = quizDataSheet.headers.includes('Active');
    const questions: QuestionSVO[] = [];
    const candidateAnswers: CandidateAnswerSVO[] = [];
    const answerCounts = new Map<string, number>();
    let skippedRows = 0;

    quizDataSheet.rows.forEach(row => {
      const questionText = (row.Question || '').trim();
      if (!questionText) {
        skippedRows++;
        return;
      }

      const question: QuestionSVO = {
        id: `q${questions.length + 1}`,
        text: questionText,
        topic: row.Topic || '',
        explanation: row.Explanation || '',
        type: row.Type || 'agree_5',
        priority: row.Priority || 'Essential',
        active: parseActiveFlag(row.Active, hasActiveColumn),
        options: [row.Option1, row.Option2, row.Option3, row.Option4, row.Option5].filter(
          opt => opt && opt.trim() !== ''
        )
      };
      questions.push(question);

      candidates.forEach(candidate => {
        const answerValue = row[candidate.name?.trim()];
        if (answerValue !== undefined && answerValue !== '') {
          candidateAnswers.push({
            candidateId: candidate.id,
            questionId: question.id,
            value: answerValue
          });
          answerCounts.set(candidate.id, (answerCounts.get(candidate.id) ?? 0) + 1);
        }
      });
    });

    const diagnostics = diagnoseSheet(quizDataSheet, candidateSheet, candidates, questions, topics);

    if (skippedRows > 0) {
      diagnostics.push({
        severity: 'notice',
        message: `${skippedRows} Quiz_Data row(s) were skipped because the Question cell was empty.`
      });
    }

    const activeCount = questions.filter(q => q.active).length;
    for (const candidate of candidates) {
      const answered = answerCounts.get(candidate.id) ?? 0;
      if (answered === 0 && activeCount > 0) {
        diagnostics.push({
          severity: 'notice',
          message: `${candidate.name || candidate.id} has no answers in Quiz_Data and will be listed as a non-responder.`
        });
      }
    }

    console.log(
      `Loaded ${questions.length} question(s) (${activeCount} active), ${candidates.length} candidate(s), ` +
        `${topics.length} topic(s), ${diagnostics.filter(d => d.severity === 'error').length} error(s).`
    );
    diagnostics.forEach(d =>
      d.severity === 'error' ? console.error(`[sheet] ${d.message}`) : console.warn(`[sheet] ${d.message}`)
    );

    return {
      candidates,
      questions,
      candidateAnswers,
      topics,
      topicImportance: [],
      diagnostics
    };
  } catch (error) {
    throw new Error(
      `Error processing sheet data: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
