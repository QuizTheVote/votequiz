# QUICK GOOGLE SHEET SETUP WITH CSV FILES

## 🚀 Super Fast Method (5 minutes instead of 20!)

I've created CSV files that contain all the data. Here's how to build the Google Sheet template quickly:

---

## Step 1: Create New Google Sheet
1. Go to **sheets.google.com**
2. Click **"+ Blank"**
3. **Name it**: "Quiz The Vote - Base Template"

---

## Step 2: Instructions Tab (Manual)
1. **Rename "Sheet1"** to **"Instructions"**
2. **Copy and paste this content** into cell A1 (merge cells A1:H15):

```
🗳️ SVO ELECTION QUIZ TEMPLATE - QUICK START GUIDE

🚀 GET STARTED IN 3 STEPS:

1. COPY THIS TEMPLATE
   • File → Make a Copy
   • Rename to: "[Your Organization] Election Quiz 2024"

2. CUSTOMIZE YOUR DATA
   • Go to "Quiz_Data" tab
   • Replace sample candidates with your local candidates
   • Enable/disable questions using the "Active" column (TRUE/FALSE)
   • Modify candidate positions based on their public statements

3. PUBLISH & DEPLOY
   • File → Share → Publish to Web → Entire Document → Link
   • Copy the published URL and extract the Sheet ID
   • Visit: https://yourorg.github.io/quiz?sheet=YOUR_SHEET_ID

📋 WHAT'S INCLUDED:
   • 5 Essential SVO questions (2-3 min quiz)
   • 5 Additional questions (4-5 min quiz total)  
   • 6 sample candidate archetypes
   • Scientific framework based on 40+ years of psychology research

❓ NEED HELP?
   • Full instructions: See "Setup_Guide" tab
   • Technical support: [Add your support email]
   • Documentation: [Add your docs URL]

⚠️ IMPORTANT: 
   • Keep the column structure unchanged
   • Only modify candidate names, positions, and Active status
   • Essential questions are pre-enabled; Additional questions start disabled
```

---

## Step 3: Import Quiz_Data.csv
1. **Add new sheet** (+ button)
2. **Name it**: "Quiz_Data"
3. **File → Import → Upload → Select Quiz_Data.csv**
4. **Import settings**:
   - Separator type: Comma
   - Convert text to numbers: **UNCHECKED** (important!)
   - Import location: "Replace current sheet"
5. **Click "Import data"**

---

## Step 4: Import Candidates.csv
1. **Add new sheet**
2. **Name it**: "Candidates"  
3. **File → Import → Upload → Select Candidates.csv**
4. **Same import settings** as above
5. **Click "Import data"**

---

## Step 5: Import Topics.csv
1. **Add new sheet**
2. **Name it**: "Topics"
3. **File → Import → Upload → Select Topics.csv**
4. **Same import settings** as above  
5. **Click "Import data"**

---

## Step 6: Add Data Validation (5 minutes - IMPORTANT!)
**This prevents 90% of common newsroom errors:**

### **Quiz_Data Tab Validation:**
1. **Go to Quiz_Data tab**
2. **Active Column (E2:E100):**
   - Select range E2:E100
   - Data → Data validation → List of items: `TRUE, FALSE`
   - ✅ Show dropdown, ✅ Reject invalid input
3. **Type Column (C2:C100):** 
   - Select range C2:C100
   - Data → Data validation → List of items: `agree_5, support_3, pick_1_3, pick_1_4, pick_1_5, binary_choice, multiple_choice`
   - ✅ Show dropdown, ✅ Reject invalid input
4. **Priority Column (D2:D100):**
   - Select range D2:D100  
   - Data → Data validation → List of items: `Essential, Additional`
   - ✅ Show dropdown, ✅ Reject invalid input

**Test it:** Click validated cells to see dropdowns, try typing invalid data to see errors.

**📋 Detailed validation guide:** See `TEMPLATE_VALIDATION_SETUP.md`

## Step 7: Format the Sheets
1. **Bold header rows** in each data sheet
2. **Freeze top row** in each sheet (View → Freeze → 1 row)
3. **Auto-resize columns** to fit content
4. **Reorder sheets**: Instructions, Quiz_Data, Candidates, Topics

---

## Step 8: Publish and Test
1. **File → Share → Publish to web**
2. **Select**: "Entire Document"
3. **Format**: "Link"
4. **Click "Publish"**
5. **Copy the published URL**
6. **Extract Sheet ID** (the long string between `/d/` and `/edit`)

### Test URL:
```
http://localhost:5173/?sheet=YOUR_SHEET_ID&svo=true
```

---

## 🎯 What Each CSV Contains:

**Quiz_Data.csv:**
- 10 SVO questions (5 Essential, 5 Additional)
- Mixed question types (pick_1_4, agree_5, multiple_choice, etc.)
- Active/Priority columns for newsroom control
- Complete candidate answer mappings

**Candidates.csv:**
- 6 political archetypes across the spectrum
- Profile photos, bios, party affiliations
- Ready-to-customize candidate data

**Topics.csv:**  
- 5 topic categories for question organization
- SVO-based descriptions focusing on values

**This method is MUCH faster than manual entry!**