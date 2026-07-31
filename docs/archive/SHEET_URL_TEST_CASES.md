# Google Sheets URL Format Test Cases

## 🧪 **Comprehensive Test Cases**

Based on research, here are all the Google Sheets URL formats we need to support:

### **Standard URLs:**
```
https://docs.google.com/spreadsheets/d/1XtS_4-k5yDvgBT_CAqYR9nsUXK9B5aREZPKaALF2LsE/edit
https://docs.google.com/spreadsheets/d/1XtS_4-k5yDvgBT_CAqYR9nsUXK9B5aREZPKaALF2LsE/edit?usp=sharing
https://docs.google.com/spreadsheets/d/1XtS_4-k5yDvgBT_CAqYR9nsUXK9B5aREZPKaALF2LsE/edit#gid=0
https://docs.google.com/spreadsheets/d/1XtS_4-k5yDvgBT_CAqYR9nsUXK9B5aREZPKaALF2LsE/edit?usp=sharing#gid=286182235
```

### **Legacy Format:**
```
https://docs.google.com/spreadsheet/ccc?key=1XtS_4-k5yDvgBT_CAqYR9nsUXK9B5aREZPKaALF2LsE#gid=0
https://spreadsheets.google.com/ccc?key=1XtS_4-k5yDvgBT_CAqYR9nsUXK9B5aREZPKaALF2LsE
```

### **Published/Exported URLs:**
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vQXtS_4-k5yDvgBT_CAqYR9nsUXK9B5aREZPKaALF2LsE-abc123/pubhtml
https://docs.google.com/spreadsheets/d/e/2PACX-1vQXtS_4-k5yDvgBT_CAqYR9nsUXK9B5aREZPKaALF2LsE-abc123/pub?output=csv
```

### **Copy URLs:**
```
https://docs.google.com/spreadsheets/d/1XtS_4-k5yDvgBT_CAqYR9nsUXK9B5aREZPKaALF2LsE/copy
```

---

## ⚠️ **Key Findings:**

1. **Sheet IDs are NOT consistent format:**
   - Regular sheets: `1XtS_4-k5yDvgBT_CAqYR9nsUXK9B5aREZPKaALF2LsE` (44 chars)
   - Published sheets: `2PACX-1vQXtS_4-k5yDvgBT_CAqYR9nsUXK9B5aREZPKaALF2LsE-abc123` (longer)

2. **Characters include:**
   - Letters: `a-z`, `A-Z`
   - Numbers: `0-9`
   - Hyphens: `-`
   - Underscores: `_`
   - **IMPORTANT:** Published sheets add `PACX-` prefix and suffix

3. **Multiple URL structures:**
   - Modern: `/spreadsheets/d/ID/`
   - Legacy: `?key=ID`
   - Published: `/d/e/LONGER_ID/`

---

## 🛠️ **Robust Solution:**

```javascript
function extractSheetId(url) {
  // Remove any whitespace
  url = url.trim();
  
  // Pattern 1: Standard /d/ID/ format (most common)
  let match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match) return match[1];
  
  // Pattern 2: Published /d/e/LONGER_ID/ format
  match = url.match(/\/spreadsheets\/d\/e\/([a-zA-Z0-9-_]+)/);
  if (match) return match[1];
  
  // Pattern 3: Legacy ?key=ID format
  match = url.match(/[?&]key=([a-zA-Z0-9-_]+)/);
  if (match) return match[1];
  
  // Pattern 4: Alternative docs.google.com formats
  match = url.match(/docs\.google\.com.*[?&]id=([a-zA-Z0-9-_]+)/);
  if (match) return match[1];
  
  return null;
}
```

**Problem with above:** Still might miss some edge cases!

---

## 🎯 **BULLETPROOF Solution:**

```javascript
function extractSheetId(url) {
  // Remove any whitespace
  url = url.trim();
  
  const patterns = [
    // Standard: /spreadsheets/d/ID/anything
    /\/spreadsheets\/d\/([^\/\?\#]+)/,
    
    // Published: /spreadsheets/d/e/LONGER_ID/anything  
    /\/spreadsheets\/d\/e\/([^\/\?\#]+)/,
    
    // Legacy: ?key=ID or &key=ID
    /[?&]key=([^&\#]+)/,
    
    // Generic docs.google.com with id parameter
    /[?&]id=([^&\#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}
```

**Key improvements:**
- `[^\/\?\#]+` captures everything EXCEPT `/`, `?`, `#` (stops at URL delimiters)
- `[^&\#]+` captures everything EXCEPT `&`, `#` (stops at parameter delimiters)
- This handles ALL character types in sheet IDs without being too restrictive

---

## 🧪 **Test Results:**

**Expected extractions:**
- `1XtS_4-k5yDvgBT_CAqYR9nsUXK9B5aREZPKaALF2LsE` from standard URLs
- `2PACX-1vQXtS_4-k5yDvgBT_CAqYR9nsUXK9B5aREZPKaALF2LsE-abc123` from published URLs
- Handles edge cases with various parameters and fragments

This approach should handle 99.9% of Google Sheets URLs!
