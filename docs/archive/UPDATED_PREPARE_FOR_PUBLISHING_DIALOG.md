# UPDATED "PREPARE FOR PUBLISHING" DIALOG

## 🔧 **Replace this function in the Apps Script:**

```javascript
function prepareForPublishing() {
  const ui = SpreadsheetApp.getUi();
  
  const message = '🚀 PUBLISHING CHECKLIST\n\n' +
    '1. ✅ Run "Check Template Health" first\n' +
    '2. ✅ Verify all candidate answers are filled\n' +
    '3. ✅ Test quiz with "Generate Summary"\n' +
    '4. 📤 File → Share → Publish to web → Entire Document\n' +
    '5. 🔗 IMPORTANT: Copy URL from browser address bar\n' +
    '   📋 Use the URL that looks like:\n' +
    '   docs.google.com/spreadsheets/d/YOUR_ID/edit\n' +
    '   ❌ NOT the published URL from the dialog!\n' +
    '6. 🎯 Visit Quiz The Vote newsroom page\n' +
    '7. 📋 Paste your browser URL to generate embed code\n\n' +
    '💡 TIP: Always test your quiz before going live!\n' +
    '🔍 The embed generator needs your sheet\'s EDIT URL!';
    
  ui.alert('Prepare for Publishing', message, ui.ButtonSet.OK);
}
```

## 🎯 **Key Changes Made:**

### ✅ **Clarified URL Instructions:**
- **Step 5:** Explicitly says "Copy URL from browser address bar"
- **Visual example:** Shows what the URL should look like
- **Warning:** Clear "NOT the published URL from dialog"

### ✅ **Better User Guidance:**
- **Step 7:** Specifies to "paste your browser URL"
- **Tip at bottom:** Reinforces that embed generator needs EDIT URL

## 🚀 **How to Apply:**

1. **Go to Apps Script** in your Base Template
2. **Find the `prepareForPublishing()` function** (around line 281)
3. **Replace it entirely** with the code above
4. **Save** (Ctrl+S / Cmd+S)

This will make the publishing instructions crystal clear! 🎯
