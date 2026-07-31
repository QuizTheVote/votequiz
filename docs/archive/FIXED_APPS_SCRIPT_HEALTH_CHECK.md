# FIXED APPS SCRIPT - FLEXIBLE HEALTH CHECK

## 🔧 **Updated Health Check Function**

Replace the `checkTemplateHealth()` function in your Apps Script with this improved version:

```javascript
function checkTemplateHealth() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  try {
    let report = '🔍 TEMPLATE HEALTH CHECK\n\n';
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
      
      // Required core headers (first 5 columns)
      const requiredCoreHeaders = ['Question', 'Topic', 'Type', 'Priority', 'Active'];
      const requiredOptionHeaders = ['Option1', 'Option2', 'Option3', 'Option4', 'Option5'];
      
      let headerIssues = 0;
      
      // Check core headers (columns 1-5)
      requiredCoreHeaders.forEach((header, index) => {
        if (headers[index] !== header) {
          headerIssues++;
          report += `❌ Column ${index + 1}: Expected "${header}", found "${headers[index] || 'empty'}"\n`;
        }
      });
      
      // Check option headers (columns 6-10)
      requiredOptionHeaders.forEach((header, index) => {
        const columnIndex = index + 5; // Options start at column 6 (index 5)
        if (headers[columnIndex] !== header) {
          headerIssues++;
          report += `❌ Column ${columnIndex + 1}: Expected "${header}", found "${headers[columnIndex] || 'empty'}"\n`;
        }
      });
      
      // Check candidate columns (columns 11-16) - flexible names
      const candidateColumns = headers.slice(10, 16).filter(name => name && name.toString().trim() !== '');
      if (candidateColumns.length === 0) {
        headerIssues++;
        report += `❌ No candidate columns found (columns 11-16)\n`;
      } else {
        report += `✅ Found ${candidateColumns.length} candidate columns: ${candidateColumns.join(', ')}\n`;
      }
      
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
```

## 🎯 **Key Improvements:**

### ✅ **Flexible Candidate Names:**
- No longer expects `Candidate1`, `Candidate2`, etc.
- Accepts **any candidate names** in columns 11-16
- Shows **actual candidate names** found: "Ronald, Pria, Marcus, Linda, Carla, Ian"

### ✅ **Better Error Reporting:**
- Shows **specific column issues** with expected vs actual values
- Reports **which columns** have problems
- Lists **found candidate names** for verification

### ✅ **Same Validation:**
- Still checks core structure (Question, Topic, Type, Priority, Active)
- Still validates Option1-Option5 columns
- Still counts active vs total questions

## 🚀 **How to Apply:**

1. **Go to Apps Script** in your Base Template (Extensions → Apps Script)
2. **Find the `checkTemplateHealth()` function**
3. **Replace it entirely** with the code above
4. **Save** (Ctrl+S / Cmd+S)
5. **Test it** by running "🗳️ Quiz Tools" → "Check Template Health"

This should now show **0 header issues** and display your actual candidate names! 🎉
