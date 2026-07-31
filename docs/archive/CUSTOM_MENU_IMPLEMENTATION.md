# CUSTOM MENU TOOLKIT IMPLEMENTATION
## Step-by-Step Guide for Adding Professional Menu to Base Template

**Target Template:** `https://docs.google.com/spreadsheets/d/1XtS_4-k5yDvgBT_CAqYR9nsUXK9B5aREZPKaALF2LsE/edit`

---

## 🛠️ **Step 1: Access Apps Script**

1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. Delete the default `myFunction()` code
3. Paste the complete code below

---

## 📋 **Step 2: Complete Apps Script Code**

```javascript
/**
 * Quiz The Vote - Professional Template Toolkit
 * Adds custom menu with helper functions for newsrooms
 */

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🗳️ Quiz Tools')
    .addItem('📋 Check Template Health', 'checkTemplateHealth')
    .addItem('🎨 Apply Standard Formatting', 'setupAdvancedFormatting')
    .addItem('🔧 Reset Validation Rules', 'setupValidation')
    .addItem('📊 Generate Summary', 'generateSummary')
    .addItem('🚀 Prepare for Publishing', 'prepareForPublishing')
    .addSeparator()
    .addItem('💾 Create Backup', 'createBackup')
    .addItem('❓ Get Help', 'showHelp')
    .addToUi();
}

/**
 * Comprehensive template health check
 */
function checkTemplateHealth() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const sheetName = sheet.getName();
  
  // Only run on Quiz_Data sheet
  if (sheetName !== 'Quiz_Data') {
    SpreadsheetApp.getUi().alert('Template Health Check', 'Please run this from the "Quiz_Data" sheet.', SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }
  
  const errors = [];
  const warnings = [];
  
  try {
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      errors.push('No quiz questions found. Add questions to row 2 and below.');
      showHealthResults(errors, warnings, {});
      return;
    }
    
    const data = sheet.getRange(2, 1, lastRow - 1, 16).getValues();
    const stats = {
      total: 0,
      essential: 0,
      additional: 0,
      active: 0,
      types: {},
      candidatesWithAnswers: 0
    };
    
    data.forEach((row, index) => {
      const rowNum = index + 2;
      const [question, topic, type, priority, active, opt1, opt2, opt3, opt4, opt5, cand1, cand2, cand3, cand4, cand5, cand6] = row;
      
      // Skip completely empty rows
      if (!question && !topic && !type) return;
      
      stats.total++;
      
      // Check required fields
      if (!question || question.toString().trim() === '') {
        errors.push(`Row ${rowNum}: Question text is required`);
      }
      
      if (!topic || topic.toString().trim() === '') {
        errors.push(`Row ${rowNum}: Topic is required`);
      }
      
      if (!type || type.toString().trim() === '') {
        errors.push(`Row ${rowNum}: Question type is required`);
      }
      
      // Count stats
      if (priority === 'Essential') stats.essential++;
      if (priority === 'Additional') stats.additional++;
      if (active === true || active === 'TRUE') stats.active++;
      
      if (type) {
        stats.types[type] = (stats.types[type] || 0) + 1;
      }
      
      // Check question type requirements
      if (type && (type.startsWith('pick_1_') || type === 'binary_choice' || type === 'multiple_choice')) {
        const expectedOptions = type === 'binary_choice' ? 2 : 
                               type === 'multiple_choice' ? 3 : 
                               parseInt(type.split('_')[2]) || 0;
        
        const options = [opt1, opt2, opt3, opt4, opt5].filter(opt => opt && opt.toString().trim() !== '');
        
        if (type === 'multiple_choice' && options.length < 3) {
          errors.push(`Row ${rowNum}: ${type} requires at least 3 options, found ${options.length}`);
        } else if (type !== 'multiple_choice' && options.length !== expectedOptions) {
          errors.push(`Row ${rowNum}: ${type} requires exactly ${expectedOptions} options, found ${options.length}`);
        }
      }
      
      // Check candidate answers
      const candidateAnswers = [cand1, cand2, cand3, cand4, cand5, cand6].filter(answer => answer && answer.toString().trim() !== '');
      
      if (candidateAnswers.length === 0) {
        warnings.push(`Row ${rowNum}: No candidate answers provided`);
      } else {
        stats.candidatesWithAnswers++;
        
        // Validate answer format based on question type
        candidateAnswers.forEach((answer, candIndex) => {
          if (!validateCandidateAnswer(answer, type, [opt1, opt2, opt3, opt4, opt5])) {
            warnings.push(`Row ${rowNum}, Candidate ${candIndex + 1}: Answer "${answer}" may not match question type "${type}"`);
          }
        });
      }
      
      // Check active/priority consistency
      if (priority === 'Essential' && (active === false || active === 'FALSE')) {
        warnings.push(`Row ${rowNum}: Essential question is disabled`);
      }
    });
    
    showHealthResults(errors, warnings, stats);
    
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error', 'Template health check failed: ' + error.toString(), SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Validate candidate answer matches question type
 */
function validateCandidateAnswer(answer, questionType, options) {
  if (!answer || !questionType) return true; // Skip validation for empty values
  
  const answerStr = answer.toString().trim();
  const validOptions = options.filter(opt => opt && opt.toString().trim() !== '');
  
  switch (questionType) {
    case 'agree_5':
      const num5 = parseInt(answerStr);
      return Number.isInteger(num5) && num5 >= 1 && num5 <= 5;
      
    case 'support_3':
      const num3 = parseInt(answerStr);
      return Number.isInteger(num3) && num3 >= 1 && num3 <= 3;
      
    case 'pick_1_3':
    case 'pick_1_4':
    case 'pick_1_5':
    case 'binary_choice':
      return validOptions.some(opt => opt.toString().trim() === answerStr);
      
    case 'multiple_choice':
      const selections = answerStr.split(',').map(s => s.trim());
      return selections.every(sel => validOptions.some(opt => opt.toString().trim() === sel));
      
    default:
      return true; // Unknown type, skip validation
  }
}

/**
 * Display health check results
 */
function showHealthResults(errors, warnings, stats) {
  let message = '✅ TEMPLATE HEALTH CHECK\n\n';
  
  if (errors.length === 0) {
    message += '🎉 No critical errors found!\n\n';
  } else {
    message += `❌ ${errors.length} CRITICAL ERRORS:\n`;
    errors.slice(0, 10).forEach(error => message += `• ${error}\n`);
    if (errors.length > 10) message += `• ... and ${errors.length - 10} more\n`;
    message += '\n';
  }
  
  if (warnings.length > 0) {
    message += `⚠️ ${warnings.length} WARNINGS:\n`;
    warnings.slice(0, 10).forEach(warning => message += `• ${warning}\n`);
    if (warnings.length > 10) message += `• ... and ${warnings.length - 10} more\n`;
    message += '\n';
  }
  
  if (stats.total) {
    message += `📊 SUMMARY:\n`;
    message += `• Total questions: ${stats.total}\n`;
    message += `• Essential questions: ${stats.essential}\n`;
    message += `• Additional questions: ${stats.additional}\n`;
    message += `• Active questions: ${stats.active}\n`;
    message += `• Questions with candidate answers: ${stats.candidatesWithAnswers}\n\n`;
    
    if (Object.keys(stats.types).length > 0) {
      message += `📋 Question Types:\n`;
      Object.entries(stats.types).forEach(([type, count]) => {
        message += `• ${type}: ${count}\n`;
      });
    }
  }
  
  SpreadsheetApp.getUi().alert('Template Health Check', message, SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Apply advanced conditional formatting
 */
function setupAdvancedFormatting() {
  const sheet = SpreadsheetApp.getActiveSheet();
  
  if (sheet.getName() !== 'Quiz_Data') {
    SpreadsheetApp.getUi().alert('Formatting', 'Please run this from the "Quiz_Data" sheet.', SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }
  
  try {
    // Clear existing conditional format rules
    sheet.clearConditionalFormatRules();
    
    const rules = [];
    
    // Rule 1: Gray out inactive questions (entire row)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND($E2<>"", $E2="FALSE")')
      .setBackground('#f5f5f5')
      .setFontColor('#999999')
      .setRanges([sheet.getRange('A2:P100')])
      .build());
    
    // Rule 2: Highlight Essential questions (blue background)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$D2="Essential"')
      .setBackground('#e3f2fd')
      .setRanges([sheet.getRange('A2:P100')])
      .build());
    
    // Rule 3: Highlight missing candidate answers (red background)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND($E2="TRUE", COUNTA($K2:$P2)=0)')
      .setBackground('#ffebee')
      .setRanges([sheet.getRange('K2:P100')])
      .build());
    
    sheet.setConditionalFormatRules(rules);
    
    SpreadsheetApp.getUi().alert('Formatting Applied', 
      '✅ Advanced formatting applied successfully!\n\n' +
      '• Inactive questions: Grayed out\n' +
      '• Essential questions: Blue highlight\n' +
      '• Missing answers: Red highlight', 
      SpreadsheetApp.getUi().ButtonSet.OK);
      
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error', 'Formatting failed: ' + error.toString(), SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Reset validation rules
 */
function setupValidation() {
  const sheet = SpreadsheetApp.getActiveSheet();
  
  if (sheet.getName() !== 'Quiz_Data') {
    SpreadsheetApp.getUi().alert('Validation', 'Please run this from the "Quiz_Data" sheet.', SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }
  
  try {
    // Active column (E) - TRUE/FALSE dropdown
    const activeRange = sheet.getRange('E2:E100');
    const activeRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['TRUE', 'FALSE'])
      .setAllowInvalid(false)
      .setHelpText('Select TRUE to include this question in the quiz, FALSE to exclude it')
      .build();
    activeRange.setDataValidation(activeRule);
    
    // Type column (C) - Question type dropdown
    const typeRange = sheet.getRange('C2:C100');
    const typeRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['agree_5', 'support_3', 'pick_1_3', 'pick_1_4', 'pick_1_5', 'binary_choice', 'multiple_choice'])
      .setAllowInvalid(false)
      .setHelpText('Select the question type that determines how users will answer')
      .build();
    typeRange.setDataValidation(typeRule);
    
    // Priority column (D) - Essential/Additional dropdown
    const priorityRange = sheet.getRange('D2:D100');
    const priorityRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['Essential', 'Additional'])
      .setAllowInvalid(false)
      .setHelpText('Essential questions appear in short quiz, Additional questions appear in full quiz')
      .build();
    priorityRange.setDataValidation(priorityRule);
    
    SpreadsheetApp.getUi().alert('Validation Reset', 
      '✅ Validation rules reset successfully!\n\n' +
      '• Active column: TRUE/FALSE dropdown\n' +
      '• Type column: Question type dropdown\n' +
      '• Priority column: Essential/Additional dropdown', 
      SpreadsheetApp.getUi().ButtonSet.OK);
      
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error', 'Validation setup failed: ' + error.toString(), SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Generate quiz summary
 */
function generateSummary() {
  const sheet = SpreadsheetApp.getActiveSheet();
  
  if (sheet.getName() !== 'Quiz_Data') {
    SpreadsheetApp.getUi().alert('Summary', 'Please run this from the "Quiz_Data" sheet.', SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }
  
  try {
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      SpreadsheetApp.getUi().alert('Summary', 'No quiz questions found to summarize.', SpreadsheetApp.getUi().ButtonSet.OK);
      return;
    }
    
    const data = sheet.getRange(2, 1, lastRow - 1, 16).getValues();
    
    const summary = {
      total: 0,
      essential: 0,
      additional: 0,
      active: 0,
      types: {},
      candidatesWithAnswers: 0
    };
    
    data.forEach(row => {
      const [question, topic, type, priority, active, , , , , , cand1, cand2, cand3, cand4, cand5, cand6] = row;
      
      // Skip empty rows
      if (!question && !topic && !type) return;
      
      summary.total++;
      
      if (priority === 'Essential') summary.essential++;
      if (priority === 'Additional') summary.additional++;
      if (active === true || active === 'TRUE') summary.active++;
      
      if (type) {
        summary.types[type] = (summary.types[type] || 0) + 1;
      }
      
      const candidateAnswers = [cand1, cand2, cand3, cand4, cand5, cand6].filter(answer => answer && answer.toString().trim() !== '');
      if (candidateAnswers.length > 0) {
        summary.candidatesWithAnswers++;
      }
    });
    
    let message = '📊 QUIZ SUMMARY\n\n';
    message += `📝 Questions: ${summary.active}/${summary.total} active\n`;
    message += `⚡ Essential: ${summary.essential}\n`;
    message += `➕ Additional: ${summary.additional}\n`;
    message += `👥 Questions with candidate answers: ${summary.candidatesWithAnswers}\n\n`;
    
    if (Object.keys(summary.types).length > 0) {
      message += `📋 Question Types:\n`;
      Object.entries(summary.types).forEach(([type, count]) => {
        message += `• ${type}: ${count}\n`;
      });
      message += '\n';
    }
    
    if (summary.active >= 5) {
      message += '🎯 Quiz ready for publishing!';
    } else {
      message += '⚠️ Recommendation: Enable at least 5 questions for a complete quiz experience.';
    }
    
    SpreadsheetApp.getUi().alert('Quiz Summary', message, SpreadsheetApp.getUi().ButtonSet.OK);
    
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error', 'Summary generation failed: ' + error.toString(), SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Prepare template for publishing
 */
function prepareForPublishing() {
  // Run health check first
  checkTemplateHealth();
  
  // Apply formatting
  setupAdvancedFormatting();
  
  // Show publishing instructions
  const message = '🚀 PUBLISHING PREPARATION\n\n' +
    '✅ Template health checked\n' +
    '✅ Formatting applied\n\n' +
    'NEXT STEPS:\n' +
    '1. File → Share → Publish to web\n' +
    '2. Select "Entire document"\n' +
    '3. Select "Comma-separated values (.csv)"\n' +
    '4. Click "Publish"\n' +
    '5. Copy the published URL\n' +
    '6. Extract Sheet ID from URL\n' +
    '7. Use at: https://evanwyloge.github.io/votequiz/?sheet=YOUR_SHEET_ID&svo=true\n\n' +
    '💡 Need help? Click "❓ Get Help" in the Quiz Tools menu.';
  
  SpreadsheetApp.getUi().alert('Ready for Publishing', message, SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Create backup copy
 */
function createBackup() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const timestamp = new Date().toISOString().split('T')[0];
    const backupName = `${ss.getName()} - Backup ${timestamp}`;
    
    const backup = ss.copy(backupName);
    
    SpreadsheetApp.getUi().alert('Backup Created', 
      `✅ Backup created successfully!\n\n` +
      `Name: ${backupName}\n\n` +
      'The backup is saved in your Google Drive and includes all your current quiz data and formatting.', 
      SpreadsheetApp.getUi().ButtonSet.OK);
      
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error', 'Backup creation failed: ' + error.toString(), SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Show help information
 */
function showHelp() {
  const message = '❓ QUIZ THE VOTE HELP\n\n' +
    '🛠️ MENU FUNCTIONS:\n' +
    '• Check Template Health: Scan for errors and get quiz statistics\n' +
    '• Apply Standard Formatting: Add visual cues (colors, highlighting)\n' +
    '• Reset Validation Rules: Restore dropdown menus and data validation\n' +
    '• Generate Summary: Quick overview of your quiz setup\n' +
    '• Prepare for Publishing: Complete pre-flight check and instructions\n' +
    '• Create Backup: Save a copy of your current template\n\n' +
    '🆘 NEED MORE HELP?\n' +
    '• Documentation: Check the "Setup_Guide" tab\n' +
    '• Technical Support: [Add your support email]\n' +
    '• Quiz The Vote Platform: https://evanwyloge.github.io/votequiz/\n\n' +
    '💡 TIP: Always run "Check Template Health" before publishing to catch any issues!';
  
  SpreadsheetApp.getUi().alert('Help & Support', message, SpreadsheetApp.getUi().ButtonSet.OK);
}
```

---

## 🎯 **Step 3: Save and Test**

1. **Save the script**: Ctrl+S or Cmd+S
2. **Close and reopen** your Google Sheet
3. **Look for "🗳️ Quiz Tools"** in the menu bar
4. **Test each function** to ensure they work

---

## 🔧 **Step 4: Authorization**

First time you run any function:
1. Google will ask for permissions
2. Click **"Review permissions"**
3. Choose your Google account
4. Click **"Allow"**
5. Functions will now work for all users

---

## ✅ **Expected Results**

After implementation, newsrooms will have:
- **Professional menu** with 7 helpful functions
- **One-click health checking** and error detection
- **Automatic formatting** and visual cues
- **Step-by-step publishing guidance**
- **Backup functionality** for data safety

This transforms the template from a basic spreadsheet into a **professional newsroom tool**!
