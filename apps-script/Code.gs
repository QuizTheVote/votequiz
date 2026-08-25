/**
 * Quiz The Vote - Base Template Apps Script
 * Includes validation, formatting, health checks, AND candidate survey generation
 * UPDATED: Now supports custom link_text column for candidate links
 */

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🗳️ Quiz Tools')
    .addItem('📋 Check Template Health', 'checkTemplateHealth')
    .addItem('🎨 Apply Standard Formatting', 'setupAdvancedFormatting')
    .addItem('🔧 Reset Validation Rules', 'setupValidation')
    .addItem('📊 Generate Summary', 'generateSummary')
    .addSeparator()
    .addItem('📝 Generate Candidate Survey', 'generateCandidateSurvey')
    .addItem('📧 Email Survey to Candidates', 'emailSurveyToCandidates')
    .addItem('🔄 Sync Survey Responses', 'syncSurveyResponses')
    .addSeparator()
    .addItem('🚀 Prepare for Publishing', 'prepareForPublishing')
    .addItem('💾 Create Backup', 'createBackup')
    .addItem('❓ Get Help', 'showHelp')
    .addToUi();
}

// ==============================================
// UPDATED FUNCTIONS (Custom Menu Toolkit)
// ==============================================

/**
 * Health check, rewritten 2026-08-25 to match the checks the quiz app runs at
 * load time (`diagnoseSheet` in src/lib/sheets.ts). The old version only looked
 * at whether headers were named and positioned like the template, so it reported
 * a quiz "healthy" while it scored wrongly — see docs/HEALTHCHECK_AUDIT.md.
 *
 * Severity mirrors the app:
 *   ISSUE  the results a voter sees will be wrong or missing (shown publicly)
 *   NOTE   the owner should tidy this, but scoring is correct
 */
function checkTemplateHealth() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    const issues = [];
    const notes = [];

    const quiz = readTab_(ss, 'Quiz_Data');
    const candidatesTab = readTab_(ss, 'Candidates');
    const topicsTab = readTab_(ss, 'Topics');
    const settingsTab = readTab_(ss, 'Settings');

    // Required tabs. The app reads Quiz_Data and Candidates; Topics is optional
    // and Instructions is never read, so neither is required here.
    if (!quiz) issues.push('There is no "Quiz_Data" tab, so no questions can be read.');
    if (!candidatesTab) issues.push('There is no "Candidates" tab.');

    if (quiz) {
      if (!hasHeader_(quiz, 'Question')) {
        issues.push('The Quiz_Data tab has no "Question" column, so no questions can be read.');
      }
      if (!hasHeader_(quiz, 'Topic')) {
        notes.push('The Quiz_Data tab has no "Topic" column, so topic ranking will not affect scores.');
      }
    }

    if (candidatesTab) {
      ['id', 'name'].forEach(function (col) {
        if (!hasHeader_(candidatesTab, col)) {
          issues.push('The Candidates tab has no "' + col + '" column.');
        }
      });
      if (hasHeader_(candidatesTab, 'website') && !hasHeader_(candidatesTab, 'link_url')) {
        notes.push('The Candidates tab still uses a "website" column. Rename it to "link_url" ' +
          '(and optionally add "link_text"), or candidate links will not appear.');
      }
    }

    // The join that matters most: each candidate name must exactly equal a
    // Quiz_Data column header, or that candidate is scored against nothing.
    var candidateNames = [];
    if (candidatesTab && quiz) {
      candidateNames = columnValues_(candidatesTab, 'name').filter(function (n) { return n !== ''; });
      var quizHeaders = quiz.headers;
      candidateNames.forEach(function (name) {
        if (quizHeaders.indexOf(name) !== -1) return; // exact match
        var nearMiss = quizHeaders.filter(function (h) { return h !== ''; }).find(function (h) {
          return normalizeForComparison_(h) === normalizeForComparison_(name);
        });
        if (nearMiss) {
          issues.push('Candidate "' + name + '" does not match the Quiz_Data column "' + nearMiss +
            '". The two must be identical, including capitalisation and spaces.');
        } else {
          issues.push('Candidate "' + name + '" has no matching column in Quiz_Data, so they will ' +
            'score zero against every question.');
        }
      });
    }

    // Active questions and topic joins.
    var totalQuestions = 0;
    var activeQuestions = [];
    if (quiz) {
      var activePresent = hasHeader_(quiz, 'Active');
      quiz.rows.forEach(function (row) {
        var q = String(get_(quiz, row, 'Question') || '').trim();
        if (!q) return;
        totalQuestions++;
        if (parseActive_(get_(quiz, row, 'Active'), activePresent)) {
          activeQuestions.push({ text: q, topic: String(get_(quiz, row, 'Topic') || '').trim() });
        }
      });

      if (totalQuestions > 0 && activeQuestions.length === 0) {
        issues.push('Every question in Quiz_Data is inactive, so the quiz has nothing to ask. ' +
          'Set Active to TRUE for the questions you want to use.');
      }
    }

    if (topicsTab && quiz) {
      var topicIds = columnValues_(topicsTab, 'id').filter(function (t) { return t !== ''; });
      var usedTopicIds = [];
      activeQuestions.forEach(function (q) {
        if (q.topic && usedTopicIds.indexOf(q.topic) === -1) usedTopicIds.push(q.topic);
      });
      usedTopicIds.forEach(function (used) {
        if (topicIds.indexOf(used) === -1) {
          issues.push('Question topic "' + used + '" is not an id in the Topics tab, so the ' +
            "voter's ranking is ignored for those questions.");
        }
      });
      topicIds.forEach(function (declared) {
        if (usedTopicIds.indexOf(declared) === -1) {
          notes.push('Topic "' + declared + '" is offered on the ranking screen but no active ' +
            'question uses it, so ranking it changes nothing.');
        }
      });
    }

    // Optional Settings tab: validate the two URL fields the app reads.
    if (settingsTab) {
      var settings = settingsMap_(settingsTab);
      if (settings.completion_button_url && !isHttpUrl_(settings.completion_button_url)) {
        notes.push('The Settings tab\'s "completion_button_url" is not a valid http/https link, ' +
          'so the end-of-quiz button will not appear.');
      }
      if (settings.share_url && !isHttpUrl_(settings.share_url)) {
        notes.push('The Settings tab\'s "share_url" is not a valid http/https link, so shares ' +
          'will fall back to the QuizTheVote homepage.');
      }
    }

    // Build the report.
    var report = '🔍 TEMPLATE HEALTH CHECK\n\n';
    report += '📊 ' + totalQuestions + ' question(s), ' + activeQuestions.length + ' active; ' +
      candidateNames.length + ' candidate(s).\n\n';

    if (issues.length === 0) {
      report += '🎉 No problems that would make results wrong.\n';
    } else {
      report += '❌ ' + issues.length + ' issue(s) that will make results wrong or missing:\n';
      issues.forEach(function (m) { report += '   • ' + m + '\n'; });
    }

    if (notes.length > 0) {
      report += '\n⚠️ ' + notes.length + ' thing(s) to tidy (results still correct):\n';
      notes.forEach(function (m) { report += '   • ' + m + '\n'; });
    }

    ui.alert('Template Health Check', report, ui.ButtonSet.OK);

  } catch (error) {
    ui.alert('Error', 'Health check failed: ' + error.toString(), ui.ButtonSet.OK);
  }
}

// ==============================================
// HEALTH CHECK HELPERS (mirror src/lib/sheets.ts)
// ==============================================

/** Reads a tab into { headers, rows } or null if the tab is absent/empty. */
function readTab_(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) return null;
  var values = sheet.getDataRange().getValues();
  if (values.length === 0) return null;
  var headers = values[0].map(function (h) { return String(h == null ? '' : h).trim(); });
  return { headers: headers, rows: values.slice(1) };
}

function hasHeader_(tab, name) {
  return tab.headers.indexOf(name) !== -1;
}

/** Cell value for a named column in a row array, or '' if the column is absent. */
function get_(tab, row, name) {
  var idx = tab.headers.indexOf(name);
  return idx === -1 ? '' : row[idx];
}

/** All values in a named column, trimmed to strings. */
function columnValues_(tab, name) {
  var idx = tab.headers.indexOf(name);
  if (idx === -1) return [];
  return tab.rows.map(function (row) { return String(row[idx] == null ? '' : row[idx]).trim(); });
}

/** Same tolerance as parseActiveFlag in sheets.ts. */
function parseActive_(raw, columnPresent) {
  if (!columnPresent) return true;
  if (raw === true) return true;
  if (raw === false) return false;
  var v = String(raw == null ? '' : raw).trim().toLowerCase();
  if (v === '') return true;
  return v === 'true' || v === 'yes' || v === 'y' || v === '1';
}

/** Same normalisation as normalizeForComparison in sheets.ts. */
function normalizeForComparison_(value) {
  return String(value == null ? '' : value).trim().toLowerCase().replace(/\s+/g, ' ');
}

/** Reads the Settings tab into a lowercased key/value object. */
function settingsMap_(tab) {
  var keyIdx = tab.headers.indexOf('key');
  var valIdx = tab.headers.indexOf('value');
  if (keyIdx === -1) keyIdx = 0;
  if (valIdx === -1) valIdx = 1;
  var map = {};
  tab.rows.forEach(function (row) {
    var k = String(row[keyIdx] == null ? '' : row[keyIdx]).trim().toLowerCase();
    var v = String(row[valIdx] == null ? '' : row[valIdx]).trim();
    if (k) map[k] = v;
  });
  return map;
}

function isHttpUrl_(raw) {
  return /^https?:\/\/\S+$/i.test(String(raw || '').trim());
}

function setupAdvancedFormatting() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  try {
    const quizSheet = ss.getSheetByName('Quiz_Data');
    if (!quizSheet) {
      ui.alert('Error', 'Quiz_Data sheet not found', ui.ButtonSet.OK);
      return;
    }
    
    // Header formatting
    const headerRange = quizSheet.getRange(1, 1, 1, 16);
    headerRange.setBackground('#4a90e2')
             .setFontColor('#ffffff')
             .setFontWeight('bold')
             .setFontSize(11);
    
    // Freeze header row
    quizSheet.setFrozenRows(1);
    
    // Column widths
    const columnWidths = [300, 120, 100, 100, 80, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120];
    columnWidths.forEach((width, index) => {
      quizSheet.setColumnWidth(index + 1, width);
    });
    
    // Format Candidates sheet
    const candidatesSheet = ss.getSheetByName('Candidates');
    if (candidatesSheet) {
      const candidateHeaderRange = candidatesSheet.getRange(1, 1, 1, 7);
      candidateHeaderRange.setBackground('#4a90e2')
                         .setFontColor('#ffffff')
                         .setFontWeight('bold')
                         .setFontSize(11);
      
      // Set candidate column widths
      const candidateColumnWidths = [100, 150, 120, 200, 300, 200, 120]; // Added width for link_text
      candidateColumnWidths.forEach((width, index) => {
        candidatesSheet.setColumnWidth(index + 1, width);
      });
      
      candidatesSheet.setFrozenRows(1);
    }
    
    // Conditional formatting for Active column
    const activeRange = quizSheet.getRange('E2:E100');
    const rules = quizSheet.getConditionalFormatRules();
    
    // Remove existing rules for Active column
    const filteredRules = rules.filter(rule => {
      const range = rule.getRanges()[0];
      return !(range.getColumn() === 5 && range.getRow() === 2);
    });
    
    // Add new rule for FALSE values only
    const falseRule = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('FALSE')
      .setBackground('#f0f0f0')
      .setRanges([activeRange])
      .build();
    
    filteredRules.push(falseRule);
    quizSheet.setConditionalFormatRules(filteredRules);
    
    ui.alert('Success', '✅ Advanced formatting applied!\n\n• Header styled and frozen\n• Column widths optimized\n• Conditional formatting for inactive questions\n• Candidates sheet formatted', ui.ButtonSet.OK);
    
  } catch (error) {
    ui.alert('Error', 'Formatting failed: ' + error.toString(), ui.ButtonSet.OK);
  }
}

function setupValidation() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  try {
    const quizSheet = ss.getSheetByName('Quiz_Data');
    if (!quizSheet) {
      ui.alert('Error', 'Quiz_Data sheet not found', ui.ButtonSet.OK);
      return;
    }
    
    // Type column validation (C2:C100)
    const typeRange = quizSheet.getRange('C2:C100');
    const typeValidation = SpreadsheetApp.newDataValidation()
      .requireValueInList(['agree_5', 'support_3', 'binary_choice', 'pick_1_3', 'pick_1_4', 'pick_1_5', 'multiple_choice'])
      .setAllowInvalid(false)
      .setHelpText('Select a valid question type')
      .build();
    typeRange.setDataValidation(typeValidation);
    
    // Priority column validation (D2:D100)
    const priorityRange = quizSheet.getRange('D2:D100');
    const priorityValidation = SpreadsheetApp.newDataValidation()
      .requireValueInList(['Essential', 'Additional'])
      .setAllowInvalid(false)
      .setHelpText('Choose Essential (always shown) or Additional (optional)')
      .build();
    priorityRange.setDataValidation(priorityValidation);
    
    // Active column validation (E2:E100)
    const activeRange = quizSheet.getRange('E2:E100');
    const activeValidation = SpreadsheetApp.newDataValidation()
      .requireValueInList(['TRUE', 'FALSE'])
      .setAllowInvalid(false)
      .setHelpText('TRUE to include in quiz, FALSE to disable')
      .build();
    activeRange.setDataValidation(activeValidation);
    
    ui.alert('Success', '✅ Validation rules applied!\n\n• Type: 7 question types\n• Priority: Essential/Additional\n• Active: TRUE/FALSE only', ui.ButtonSet.OK);
    
  } catch (error) {
    ui.alert('Error', 'Validation setup failed: ' + error.toString(), ui.ButtonSet.OK);
  }
}

function generateSummary() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  try {
    const quizSheet = ss.getSheetByName('Quiz_Data');
    if (!quizSheet) {
      ui.alert('Error', 'Quiz_Data sheet not found', ui.ButtonSet.OK);
      return;
    }
    
    const lastRow = quizSheet.getLastRow();
    if (lastRow <= 1) {
      ui.alert('No Data', 'No questions found in Quiz_Data sheet', ui.ButtonSet.OK);
      return;
    }
    
    const data = quizSheet.getRange(2, 1, lastRow - 1, 16).getValues();
    
    let summary = '📊 QUIZ SUMMARY\n\n';
    
    // Question counts
    const totalQuestions = data.filter(row => row[0] && row[0].toString().trim() !== '').length;
    const activeQuestions = data.filter(row => (row[0] && row[0].toString().trim() !== '') && (row[4] === true || row[4] === 'TRUE')).length;
    const essentialQuestions = data.filter(row => (row[0] && row[0].toString().trim() !== '') && (row[4] === true || row[4] === 'TRUE') && row[3] === 'Essential').length;
    const additionalQuestions = data.filter(row => (row[0] && row[0].toString().trim() !== '') && (row[4] === true || row[4] === 'TRUE') && row[3] === 'Additional').length;
    
    summary += `📝 Questions: ${totalQuestions} total, ${activeQuestions} active\n`;
    summary += `⭐ Essential: ${essentialQuestions}, Additional: ${additionalQuestions}\n\n`;
    
    // Question types
    const questionTypes = {};
    data.forEach(row => {
      if (row[0] && row[0].toString().trim() !== '' && (row[4] === true || row[4] === 'TRUE')) {
        const type = row[2] || 'unknown';
        questionTypes[type] = (questionTypes[type] || 0) + 1;
      }
    });
    
    summary += '📋 Question Types:\n';
    Object.entries(questionTypes).forEach(([type, count]) => {
      summary += `• ${type}: ${count}\n`;
    });
    
    // Candidates with enhanced info
    const candidatesSheet = ss.getSheetByName('Candidates');
    if (candidatesSheet) {
      const candidateData = candidatesSheet.getRange(2, 1, candidatesSheet.getLastRow() - 1, 7).getValues();
      const candidatesWithData = candidateData.filter(row => row[0] && row[1]); // id and name required
      
      summary += `\n👥 Candidates: ${candidatesWithData.length}\n`;
      candidatesWithData.forEach(row => {
        const [id, name, party, photo, bio, link_url, link_text] = row;
        const linkDisplay = link_text || 'Visit website';
        summary += `• ${name} (${party}) - Link: "${linkDisplay}"\n`;
      });
      
      // Check for custom link text usage
      const customLinkTexts = candidateData.filter(row => row[6] && row[6].toString().trim() !== '' && row[6] !== 'Visit website').length;
      if (customLinkTexts > 0) {
        summary += `\n🔗 Custom Link Text: ${customLinkTexts} candidates using custom link text\n`;
      }
    } else {
      const candidateHeaders = data.length > 0 ? [10, 11, 12, 13, 14, 15].map(col => quizSheet.getRange(1, col + 1).getValue()).filter(name => name && name.toString().trim() !== '') : [];
      summary += `\n🎯 Candidates: ${candidateHeaders.length}\n`;
      candidateHeaders.forEach(name => {
        summary += `• ${name}\n`;
      });
    }
    
    // Publishing readiness
    summary += '\n🚀 PUBLISHING READINESS:\n';
    if (activeQuestions === 0) {
      summary += '❌ No active questions\n';
    } else {
      summary += '✅ Has active questions\n';
    }
    
    if (candidatesSheet) {
      const candidateData = candidatesSheet.getRange(2, 1, candidatesSheet.getLastRow() - 1, 7).getValues();
      const candidatesWithData = candidateData.filter(row => row[0] && row[1]).length;
      if (candidatesWithData === 0) {
        summary += '❌ No candidates defined\n';
      } else {
        summary += '✅ Has candidates\n';
      }
    }
    
    ui.alert('Quiz Summary', summary, ui.ButtonSet.OK);
    
  } catch (error) {
    ui.alert('Error', 'Summary generation failed: ' + error.toString(), ui.ButtonSet.OK);
  }
}

function prepareForPublishing() {
  const ui = SpreadsheetApp.getUi();
  
  const message = '🚀 PUBLISHING CHECKLIST\n\n' +
    '1. ✅ Run "Check Template Health" first\n' +
    '2. ✅ Verify all candidate answers are filled\n' +
    '3. ✅ Test quiz with "Generate Summary"\n' +
    '4. 🔓 CRITICAL: Click "Share" → "Anyone with the link" → "Viewer"\n' +
    '5. 📋 Click the "Quiz_Data" tab at the bottom\n' +
    '6. 📤 File → Share → Publish to web → Quiz_Data → CSV → Publish\n' +
    '7. 🔗 Copy URL from browser address bar (NOT dialog box)\n' +
    '   📋 Use the URL that looks like:\n' +
    '   docs.google.com/spreadsheets/d/YOUR_ID/edit\n' +
    '8. 🎯 Visit https://www.quizthevote.com/build-your-quiz/\n' +
    '9. 📋 Paste your browser URL to generate embed code\n\n' +
    '🚨 CRITICAL SEQUENCE:\n' +
    '   Step 4: Make sheet public (Share permissions)\n' +
    '   Step 5: Go to Quiz_Data tab FIRST\n' +
    '   Step 6: Publish that specific tab as CSV\n' +
    '   Step 7: Use browser URL, not dialog URL\n\n' +
    '💡 TIP: Always test your quiz before going live!\n\n' +
    '🔗 NEW: Custom link text allows you to change "Visit Website" to\n' +
    '"Read Our Coverage", "Campaign Info", etc. for each candidate.';
    
  ui.alert('Prepare for Publishing', message, ui.ButtonSet.OK);
}

function showHelp() {
  const ui = SpreadsheetApp.getUi();
  
  const helpText = '❓ QUIZ TOOLS HELP\n\n' +
    '📋 Check Template Health - Verify your setup\n' +
    '🎨 Apply Standard Formatting - Fix appearance\n' +
    '🔧 Reset Validation Rules - Fix dropdown issues\n' +
    '📊 Generate Summary - Review your quiz stats\n\n' +
    'CANDIDATE SURVEYS:\n' +
    '📝 Generate Candidate Survey - Create Google Form\n' +
    '📧 Email Survey to Candidates - Send invitations\n' +
    '🔄 Sync Survey Responses - Import candidate answers\n\n' +
    'PUBLISHING:\n' +
    '🚀 Prepare for Publishing - Step-by-step guide\n' +
    '💾 Create Backup - Save a copy before changes\n\n' +
    'NEW FEATURES:\n' +
    '🔗 Custom Link Text - Change "Visit Website" to custom text\n' +
    '   Examples: "Read Our Coverage", "Campaign Info", etc.\n' +
    '   Set in Candidates sheet, Column G (link_text)\n\n' +
    '🌐 Visit: https://www.quizthevote.com/build-your-quiz/\n' +
    '📧 Support: https://www.quizthevote.com/contact';
    
  ui.alert('Quiz Tools Help', helpText, ui.ButtonSet.OK);
}

// ==============================================
// CANDIDATE SURVEY FUNCTIONS (Unchanged)
// ==============================================

function generateCandidateSurvey() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  
  if (sheet.getName() !== 'Quiz_Data') {
    ui.alert('Survey Generator', 'Please run this from the "Quiz_Data" sheet.', ui.ButtonSet.OK);
    return;
  }
  
  try {
    // Get active questions
    const lastRow = sheet.getLastRow();
    const data = sheet.getRange(2, 1, lastRow - 1, 10).getValues(); // A-J columns
    
    const activeQuestions = data.filter(row => {
      const [question, topic, type, priority, active] = row;
      return question && (active === true || active === 'TRUE');
    });
    
    if (activeQuestions.length === 0) {
      ui.alert('No Active Questions', 'Please enable at least one question before generating candidate survey.', ui.ButtonSet.OK);
      return;
    }
    
    // Create new Google Form
    const form = FormApp.create('Candidate Survey - ' + ss.getName());
    
    // Set form description
    form.setDescription(
      'Please complete this survey to share your positions with voters. ' +
      'Your responses will be used in our candidate matching quiz to help voters ' +
      'understand where candidates stand on key issues.\n\n' +
      'All responses will be reviewed before publication. ' +
      'Please answer honestly and completely.'
    );
    
    // Add candidate name field (always first)
    form.addTextItem()
      .setTitle('Candidate Name')
      .setHelpText('Please enter your full name as it appears on the ballot')
      .setRequired(true);
    
    // Add email field for follow-up
    form.addTextItem()
      .setTitle('Email Address')
      .setHelpText('For follow-up questions and confirmation (not published)')
      .setRequired(true);
    
    // Add campaign contact field
    form.addTextItem()
      .setTitle('Campaign Contact')
      .setHelpText('Name and phone number of campaign contact person')
      .setRequired(false);
    
    // Process each active question
    activeQuestions.forEach((questionData, index) => {
      const [questionText, topic, type, priority, active, opt1, opt2, opt3, opt4, opt5] = questionData;
      
      // Add section break for organization
      if (index > 0) {
        form.addPageBreakItem()
          .setTitle(`Question ${index + 1}`)
          .setHelpText(`Topic: ${topic}`);
      }
      
      // Add the question based on type
      addQuestionToForm(form, questionText, type, [opt1, opt2, opt3, opt4, opt5], topic);
    });
    
    // Add final section
    form.addPageBreakItem()
      .setTitle('Additional Information')
      .setHelpText('Optional supplementary details');
    
    form.addParagraphTextItem()
      .setTitle('Additional Comments')
      .setHelpText('Any additional context or clarifications for your positions (optional)')
      .setRequired(false);
    
    // Configure form settings
    form.setAcceptingResponses(true)
        .setAllowResponseEdits(true)
        .setCollectEmail(true)
        .setConfirmationMessage(
          'Thank you for completing the candidate survey! ' +
          'Your responses have been recorded and will be reviewed before publication. ' +
          'You will be notified when the quiz goes live.'
        );
    
    // Link the form to this spreadsheet. setDestination creates its own response
    // sheet (usually "Form Responses 1"); inserting our own leaves an empty
    // decoy that the sync would read instead. Detect the sheet Google adds and
    // rename it to Survey_Responses so the rest of the toolkit finds it.
    const namesBefore = ss.getSheets().map(function (s) { return s.getName(); });
    form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
    SpreadsheetApp.flush();
    const created = ss.getSheets().filter(function (s) { return namesBefore.indexOf(s.getName()) === -1; });
    if (created.length > 0) {
      const existing = ss.getSheetByName('Survey_Responses');
      if (existing) ss.deleteSheet(existing);
      created[0].setName('Survey_Responses');
    }
    
    // Get form URL
    const formUrl = form.getPublishedUrl();
    
    // Store form ID for later reference
    PropertiesService.getScriptProperties().setProperty('CANDIDATE_SURVEY_FORM_ID', form.getId());
    PropertiesService.getScriptProperties().setProperty('CANDIDATE_SURVEY_URL', formUrl);
    
    // Show success message with form URL
    const message = '✅ CANDIDATE SURVEY CREATED!\n\n' +
      'Form URL:\n' + formUrl + '\n\n' +
      'NEXT STEPS:\n' +
      '1. Test the form yourself first\n' +
      '2. Send to candidates via email\n' +
      '3. Monitor responses in "Survey_Responses" sheet\n' +
      '4. Use "Sync Survey Responses" to populate candidate columns\n\n' +
      '💡 TIP: Use "Email Survey to Candidates" for professional messaging.';
    
    ui.alert('Survey Generated', message, ui.ButtonSet.OK);
    
  } catch (error) {
    ui.alert('Error', 'Survey generation failed: ' + error.toString(), ui.ButtonSet.OK);
  }
}

function addQuestionToForm(form, questionText, questionType, options, topic) {
  const validOptions = options.filter(opt => opt && opt.toString().trim() !== '');
  
  switch (questionType) {
    case 'agree_5':
      form.addScaleItem()
        .setTitle(questionText)
        .setHelpText(`Topic: ${topic} | Rate your agreement from 1 (Strongly Disagree) to 5 (Strongly Agree)`)
        .setBounds(1, 5)
        .setLabels('Strongly Disagree', 'Strongly Agree')
        .setRequired(true);
      break;
      
    case 'support_3':
      form.addScaleItem()
        .setTitle(questionText)
        .setHelpText(`Topic: ${topic} | Rate your support from 1 (Less Support) to 3 (More Support)`)
        .setBounds(1, 3)
        .setLabels('Less Support', 'More Support')
        .setRequired(true);
      break;
      
    case 'binary_choice':
      form.addMultipleChoiceItem()
        .setTitle(questionText)
        .setHelpText(`Topic: ${topic} | Select your position`)
        .setChoiceValues(validOptions)
        .setRequired(true);
      break;
      
    case 'pick_1_3':
    case 'pick_1_4':
    case 'pick_1_5':
      form.addMultipleChoiceItem()
        .setTitle(questionText)
        .setHelpText(`Topic: ${topic} | Select the option that best represents your position`)
        .setChoiceValues(validOptions)
        .setRequired(true);
      break;
      
    case 'multiple_choice':
      form.addCheckboxItem()
        .setTitle(questionText)
        .setHelpText(`Topic: ${topic} | Select all that apply (your responses will be combined as comma-separated values)`)
        .setChoiceValues(validOptions)
        .setRequired(true);
      break;
      
    default:
      // Fallback to text input
      form.addParagraphTextItem()
        .setTitle(questionText)
        .setHelpText(`Topic: ${topic} | Please provide your detailed position`)
        .setRequired(true);
      break;
  }
}

/**
 * Rewritten 2026-08-25. The old version matched answers to questions by
 * position, so any reordering of Quiz_Data, an added or removed question, or a
 * candidate skipping a non-required item shifted every answer into the wrong
 * row — silently. It now matches each response column to a Quiz_Data question by
 * the question text (the form item title), which is stable under reordering. See
 * docs/CANDIDATE_SURVEY.md for the remaining breakpoints.
 */
function syncSurveyResponses() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();

  if (sheet.getName() !== 'Quiz_Data') {
    ui.alert('Sync Responses', 'Please run this from the "Quiz_Data" sheet.', ui.ButtonSet.OK);
    return;
  }

  try {
    const responseSheet = ss.getSheetByName('Survey_Responses');
    if (!responseSheet) {
      ui.alert('No Responses', 'No survey responses found. Generate a survey first.', ui.ButtonSet.OK);
      return;
    }

    const values = responseSheet.getDataRange().getValues();
    if (values.length < 2) {
      ui.alert('No Responses', 'No candidate responses received yet.', ui.ButtonSet.OK);
      return;
    }

    const responseHeaders = values[0].map(function (h) { return String(h == null ? '' : h).trim(); });
    const nameIdx = responseHeaders.indexOf('Candidate Name');
    if (nameIdx === -1) {
      ui.alert('Sync Responses',
        'Could not find a "Candidate Name" column in Survey_Responses. This sync expects the ' +
        'form generated by "Generate Candidate Survey".', ui.ButtonSet.OK);
      return;
    }

    const activeQuestions = getActiveQuizQuestions_(sheet); // [{ rowNum, text, type }]

    let syncCount = 0;
    let unmatched = 0;
    for (let r = 1; r < values.length; r++) {
      const row = values[r];
      const candidateName = String(row[nameIdx] == null ? '' : row[nameIdx]).trim();
      if (!candidateName) continue;

      const candidateCol = findOrCreateCandidateColumn(sheet, candidateName);

      activeQuestions.forEach(function (q) {
        const colIdx = matchHeaderIndex_(responseHeaders, q.text);
        if (colIdx === -1) { unmatched++; return; }

        let value = row[colIdx];
        // A skipped optional question is blank; do not overwrite an existing answer.
        if (value === '' || value == null) return;

        // Checkbox (multiple_choice) responses arrive comma-joined; the app
        // parses candidate answers on "|". Convert so both sides agree.
        if (q.type === 'multiple_choice') {
          value = String(value).split(',').map(function (s) { return s.trim(); })
            .filter(function (s) { return s !== ''; }).join('|');
        }

        sheet.getRange(q.rowNum, candidateCol).setValue(value);
      });
      syncCount++;
    }

    let message = '✅ Synced ' + syncCount + ' candidate response(s).\n\n' +
      'Answers were matched to questions by question text, so reordering Quiz_Data is safe.';
    if (unmatched > 0) {
      message += '\n\n⚠️ ' + unmatched + ' question(s) in a response had no matching Quiz_Data ' +
        'question text. If you edited a question wording after generating the survey, the old ' +
        'wording will not match. See docs/CANDIDATE_SURVEY.md.';
    }
    message += '\n\nRun "Check Template Health" to verify.';

    ui.alert('Responses Synced', message, ui.ButtonSet.OK);

  } catch (error) {
    ui.alert('Error', 'Response sync failed: ' + error.toString(), ui.ButtonSet.OK);
  }
}

/** Active questions with their Quiz_Data row number and type, for title-keyed sync. */
function getActiveQuizQuestions_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const data = sheet.getRange(2, 1, lastRow - 1, 5).getValues(); // A-E: Question, Topic, Type, Priority, Active
  const active = [];
  data.forEach(function (row, i) {
    const text = String(row[0] == null ? '' : row[0]).trim();
    if (!text) return;
    if (parseActive_(row[4], true)) {
      active.push({ rowNum: i + 2, text: text, type: String(row[2] == null ? '' : row[2]).trim() });
    }
  });
  return active;
}

/** Finds a response column for a question title: exact first, then normalised. */
function matchHeaderIndex_(headers, text) {
  const exact = headers.indexOf(text);
  if (exact !== -1) return exact;
  const target = normalizeForComparison_(text);
  for (let i = 0; i < headers.length; i++) {
    if (normalizeForComparison_(headers[i]) === target) return i;
  }
  return -1;
}

function findOrCreateCandidateColumn(sheet, candidateName) {
  // Check existing candidate columns (K-P, columns 11-16)
  for (let col = 11; col <= 16; col++) {
    const headerValue = sheet.getRange(1, col).getValue();
    if (headerValue && headerValue.toString().trim() === candidateName) {
      return col; // Found existing candidate
    }
  }
  
  // Find first empty candidate column
  for (let col = 11; col <= 16; col++) {
    const headerValue = sheet.getRange(1, col).getValue();
    if (!headerValue || headerValue.toString().trim() === '') {
      sheet.getRange(1, col).setValue(candidateName);
      return col; // Created new candidate column
    }
  }
  
  throw new Error(`No available candidate columns. Maximum 6 candidates supported (columns K-P).`);
}

function emailSurveyToCandidates() {
  const ui = SpreadsheetApp.getUi();
  
  // Get stored form URL
  const formUrl = PropertiesService.getScriptProperties().getProperty('CANDIDATE_SURVEY_URL');
  
  if (!formUrl) {
    ui.alert('No Survey Found', 'Please generate a candidate survey first using "Generate Candidate Survey".', ui.ButtonSet.OK);
    return;
  }
  
  const message = '📧 EMAIL CANDIDATE SURVEY\n\n' +
    'Form URL to send to candidates:\n' + formUrl + '\n\n' +
    'SUGGESTED EMAIL TEMPLATE:\n\n' +
    'Subject: Candidate Survey for Voter Guide\n\n' +
    'Dear [Candidate Name],\n\n' +
    'We are creating a voter guide to help citizens understand where candidates stand on key issues. Please complete this brief survey to share your positions with voters.\n\n' +
    'Survey link: ' + formUrl + '\n\n' +
    'This should take 5-10 minutes to complete. Your responses will be reviewed before publication.\n\n' +
    'Please complete by: [DATE]\n\n' +
    'Questions? Contact us at [YOUR EMAIL]\n\n' +
    'Thank you for participating!\n\n' +
    '💡 TIP: Copy the form URL and send personalized emails to each candidate.';
    
  ui.alert('Email Survey', message, ui.ButtonSet.OK);
}

function createBackup() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  try {
    const backupName = ss.getName() + ' - Backup ' + new Date().toISOString().split('T')[0];
    const backup = ss.copy(backupName);
    
    ui.alert('Backup Created', 
      `✅ Backup created successfully!\n\n` +
      `Name: ${backupName}\n\n` +
      'The backup has been saved to your Google Drive. ' +
      'You can find it in your Drive and restore from it if needed.',
      ui.ButtonSet.OK);
      
  } catch (error) {
    ui.alert('Error', 'Backup creation failed: ' + error.toString(), ui.ButtonSet.OK);
  }
}
