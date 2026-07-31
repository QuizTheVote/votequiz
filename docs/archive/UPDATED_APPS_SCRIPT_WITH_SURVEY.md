# UPDATED APPS SCRIPT CODE FOR BASE TEMPLATE
## Complete Quiz Tools Menu with Candidate Survey Generator

**Purpose:** This replaces the entire Apps Script in the Base Template to include both the custom menu toolkit AND the new candidate survey generation features.

---

## 🚀 **Complete Apps Script Code**

```javascript
/**
 * Quiz The Vote - Base Template Apps Script
 * Includes validation, formatting, health checks, AND candidate survey generation
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
// EXISTING FUNCTIONS (Custom Menu Toolkit)
// ==============================================

function checkTemplateHealth() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  try {
    let report = '🏥 TEMPLATE HEALTH CHECK\n\n';
    let issues = 0;
    
    // Check required sheets
    const requiredSheets = ['Quiz_Data', 'Candidates', 'Topics', 'Instructions'];
    const existingSheets = ss.getSheets().map(sheet => sheet.getName());
    
    requiredSheets.forEach(sheetName => {
      if (existingSheets.includes(sheetName)) {
        report += `✅ ${sheetName} sheet exists\n`;
      } else {
        report += `❌ Missing ${sheetName} sheet\n`;
        issues++;
      }
    });
    
    // Check Quiz_Data structure
    const quizSheet = ss.getSheetByName('Quiz_Data');
    if (quizSheet) {
      const headers = quizSheet.getRange(1, 1, 1, 16).getValues()[0];
      const expectedHeaders = ['Question', 'Topic', 'Type', 'Priority', 'Active', 'Option1', 'Option2', 'Option3', 'Option4', 'Option5', 'Candidate1', 'Candidate2', 'Candidate3', 'Candidate4', 'Candidate5', 'Candidate6'];
      
      let headerIssues = 0;
      expectedHeaders.forEach((header, index) => {
        if (headers[index] !== header) {
          headerIssues++;
        }
      });
      
      if (headerIssues === 0) {
        report += '✅ Quiz_Data headers are correct\n';
      } else {
        report += `⚠️ ${headerIssues} header issues in Quiz_Data\n`;
        issues++;
      }
      
      // Check active questions
      const lastRow = quizSheet.getLastRow();
      if (lastRow > 1) {
        const data = quizSheet.getRange(2, 1, lastRow - 1, 5).getValues();
        const activeQuestions = data.filter(row => row[4] === true || row[4] === 'TRUE').length;
        const totalQuestions = data.filter(row => row[0] && row[0].toString().trim() !== '').length;
        
        report += `📊 Questions: ${totalQuestions} total, ${activeQuestions} active\n`;
        
        if (activeQuestions === 0) {
          report += '⚠️ No active questions found\n';
          issues++;
        }
      }
    }
    
    // Summary
    report += '\n';
    if (issues === 0) {
      report += '🎉 TEMPLATE IS HEALTHY!\nReady for newsroom use.';
    } else {
      report += `⚠️ Found ${issues} issue(s) that need attention.`;
    }
    
    ui.alert('Template Health Check', report, ui.ButtonSet.OK);
    
  } catch (error) {
    ui.alert('Error', 'Health check failed: ' + error.toString(), ui.ButtonSet.OK);
  }
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
    
    ui.alert('Success', '✅ Advanced formatting applied!\n\n• Header styled and frozen\n• Column widths optimized\n• Conditional formatting for inactive questions', ui.ButtonSet.OK);
    
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
    
    // Candidates
    const candidateHeaders = data.length > 0 ? [10, 11, 12, 13, 14, 15].map(col => quizSheet.getRange(1, col + 1).getValue()).filter(name => name && name.toString().trim() !== '') : [];
    summary += `\n🎯 Candidates: ${candidateHeaders.length}\n`;
    candidateHeaders.forEach(name => {
      summary += `• ${name}\n`;
    });
    
    // Publishing readiness
    summary += '\n🚀 PUBLISHING READINESS:\n';
    if (activeQuestions === 0) {
      summary += '❌ No active questions\n';
    } else {
      summary += '✅ Has active questions\n';
    }
    
    if (candidateHeaders.length === 0) {
      summary += '❌ No candidates defined\n';
    } else {
      summary += '✅ Has candidates\n';
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
    '4. 📤 File → Share → Publish to web\n' +
    '5. 🔗 Copy published URL for embed generator\n' +
    '6. 🎯 Visit Quiz The Vote newsroom page\n' +
    '7. 📋 Generate embed code with your URL\n\n' +
    '💡 TIP: Always test your quiz before going live!';
    
  ui.alert('Prepare for Publishing', message, ui.ButtonSet.OK);
}

function createBackup() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const copy = ss.copy(ss.getName() + ' - Backup ' + new Date().toLocaleDateString());
    
    const message = '💾 BACKUP CREATED!\n\n' +
      'Backup name: ' + copy.getName() + '\n\n' +
      'Your backup includes:\n' +
      '• All questions and candidate data\n' +
      '• Validation rules and formatting\n' +
      '• Custom menu functions\n\n' +
      '🔗 Open backup: ' + copy.getUrl();
      
    ui.alert('Backup Complete', message, ui.ButtonSet.OK);
    
  } catch (error) {
    ui.alert('Error', 'Backup failed: ' + error.toString(), ui.ButtonSet.OK);
  }
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
    '🌐 Visit: Quiz The Vote newsroom page\n' +
    '📧 Support: Include your sheet URL for help';
    
  ui.alert('Quiz Tools Help', helpText, ui.ButtonSet.OK);
}

// ==============================================
// NEW FUNCTIONS (Candidate Survey Generator)
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
    
    // Create response sheet for data collection
    const responseSheet = ss.insertSheet('Survey_Responses');
    form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
    
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
        .setHelpText(`Topic: ${topic} | Rate your support from 1 (Oppose) to 3 (Strong Support)`)
        .setBounds(1, 3)
        .setLabels('Oppose', 'Strong Support')
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

function syncSurveyResponses() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  
  if (sheet.getName() !== 'Quiz_Data') {
    ui.alert('Sync Responses', 'Please run this from the "Quiz_Data" sheet.', ui.ButtonSet.OK);
    return;
  }
  
  try {
    // Get the survey responses sheet
    const responseSheet = ss.getSheetByName('Survey_Responses');
    if (!responseSheet) {
      ui.alert('No Responses', 'No survey responses found. Generate a survey first.', ui.ButtonSet.OK);
      return;
    }
    
    // Get response data (skip header row)
    const responseData = responseSheet.getRange(2, 1, responseSheet.getLastRow() - 1, responseSheet.getLastColumn()).getValues();
    
    if (responseData.length === 0) {
      ui.alert('No Responses', 'No candidate responses received yet.', ui.ButtonSet.OK);
      return;
    }
    
    // Process each response
    let syncCount = 0;
    responseData.forEach(response => {
      const [timestamp, candidateName, email, campaignContact, ...answers] = response;
      
      if (candidateName && candidateName.toString().trim() !== '') {
        // Find or create candidate column
        const candidateCol = findOrCreateCandidateColumn(sheet, candidateName.toString().trim());
        
        // Map answers to quiz questions
        mapAnswersToQuestions(sheet, candidateCol, answers);
        syncCount++;
      }
    });
    
    ui.alert('Responses Synced', 
      `✅ Successfully synced ${syncCount} candidate response(s)!\n\n` +
      'Candidate answers have been populated in the Quiz_Data sheet. ' +
      'Review the responses and run "Check Template Health" to verify everything looks correct.',
      ui.ButtonSet.OK);
      
  } catch (error) {
    ui.alert('Error', 'Response sync failed: ' + error.toString(), ui.ButtonSet.OK);
  }
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

function mapAnswersToQuestions(sheet, candidateCol, answers) {
  // Get active questions to map responses
  const lastRow = sheet.getLastRow();
  const questionData = sheet.getRange(2, 1, lastRow - 1, 5).getValues(); // A-E columns
  
  let answerIndex = 0;
  questionData.forEach((row, rowIndex) => {
    const [question, topic, type, priority, active] = row;
    
    if (question && (active === true || active === 'TRUE')) {
      if (answerIndex < answers.length) {
        const answer = answers[answerIndex];
        const rowNum = rowIndex + 2;
        
        // Format answer based on question type
        let formattedAnswer = answer;
        if (type === 'multiple_choice' && Array.isArray(answer)) {
          formattedAnswer = answer.join(', ');
        }
        
        sheet.getRange(rowNum, candidateCol).setValue(formattedAnswer);
        answerIndex++;
      }
    }
  });
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
```

---

## 🚀 **Implementation Steps:**

1. **Access Base Template:** https://docs.google.com/spreadsheets/d/1XtS_4-k5yDvgBT_CAqYR9nsUXK9B5aREZPKaALF2LsE/edit
2. **Open Apps Script:** Extensions → Apps Script
3. **Replace all existing code** with the complete code above
4. **Save and authorize** the new functions
5. **Test the new menu** in Quiz_Data sheet

## ✨ **New Features Added:**

- **📝 Generate Candidate Survey** - Creates Google Form from active questions
- **📧 Email Survey to Candidates** - Provides form URL and email template
- **🔄 Sync Survey Responses** - Maps form responses to candidate columns

**This makes Quiz The Vote the ONLY platform with full candidate data automation!** 🎯
