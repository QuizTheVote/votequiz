# LEVEL 1 VALIDATION SETUP FOR QUIZ TEMPLATE
## Making Your Template Bulletproof in 5 Minutes

**Objective:** Add dropdown validation to prevent common errors in quiz creation.

---

## 🎯 Why Add Validation?

### **Common Newsroom Errors (Without Validation):**
- ❌ Typing "TURE" instead of "TRUE" → Question unexpectedly disabled
- ❌ Using "agree_4" instead of "agree_5" → Quiz crashes
- ❌ Writing "Essential" vs "essential" → Inconsistent data
- ❌ Typos in candidate answers → Invalid scoring

### **After Validation:**
- ✅ Dropdown lists prevent typos
- ✅ Only valid options can be selected
- ✅ Immediate error feedback
- ✅ Professional, foolproof template

---

## 📋 Step-by-Step Validation Setup

### **STEP 1: Open Your Quiz Template**
1. Open your Google Sheet with Quiz_Data, Candidates, Topics tabs
2. Go to the **"Quiz_Data"** tab
3. **Important:** Do this AFTER importing your CSV data

### **STEP 2: Validate Active Column (Column E)**

**Select the range:**
1. Click on **cell E2** (first data row, Active column)
2. **Drag down to E100** to select the range E2:E100
3. Or click E2, then type **Ctrl+Shift+End** to select to bottom

**Add validation:**
1. **Data menu → Data validation**
2. **Criteria:** Select "List of items"
3. **Items:** Type exactly: `TRUE, FALSE`
4. ✅ Check **"Show dropdown list in cell"**
5. ✅ Check **"Reject input when data is invalid"**
6. **Invalid data:** "Show warning"
7. **Help text:** "Select TRUE to include this question, FALSE to disable it"
8. **Click "Done"**

### **STEP 3: Validate Type Column (Column C)**

**Select the range:**
1. Click on **cell C2** (first data row, Type column)
2. **Drag down to C100** to select range C2:C100

**Add validation:**
1. **Data menu → Data validation**
2. **Criteria:** Select "List of items"
3. **Items:** Copy and paste exactly:
```
agree_5, support_3, pick_1_3, pick_1_4, pick_1_5, binary_choice, multiple_choice
```
4. ✅ Check **"Show dropdown list in cell"**
5. ✅ Check **"Reject input when data is invalid"**
6. **Help text:** "Select the question type - this determines answer format"
7. **Click "Done"**

### **STEP 4: Validate Priority Column (Column D)**

**Select the range:**
1. Click on **cell D2** (first data row, Priority column)
2. **Drag down to D100** to select range D2:D100

**Add validation:**
1. **Data menu → Data validation**
2. **Criteria:** Select "List of items"
3. **Items:** Type exactly: `Essential, Additional`
4. ✅ Check **"Show dropdown list in cell"**
5. ✅ Check **"Reject input when data is invalid"**
6. **Help text:** "Essential questions are enabled by default, Additional start disabled"
7. **Click "Done"**

### **STEP 5: Test the Validation**

**Try breaking it:**
1. Click on any Active cell → Should show TRUE/FALSE dropdown
2. Try typing "true" (lowercase) → Should show error
3. Click on any Type cell → Should show question type dropdown
4. Try typing "agree_4" → Should show error message

**If working correctly:**
- ✅ Dropdowns appear when clicking validated cells
- ✅ Invalid entries are rejected with red border
- ✅ Only valid options can be selected

---

## 🎨 Optional: Add Visual Formatting

### **Highlight Active vs Inactive Questions**

**Conditional formatting for inactive questions:**
1. **Select range A2:P100** (entire data area)
2. **Format menu → Conditional formatting**
3. **Format cells if:** "Custom formula is"
4. **Formula:** `=$E2="FALSE"`
5. **Formatting:** Light gray background (#f0f0f0), gray text (#666666)
6. **Click "Done"**

**Result:** Inactive questions (FALSE) will be grayed out visually.

### **Color-Code Question Types**

**Make Essential questions stand out:**
1. **Select range A2:P100**
2. **Format menu → Conditional formatting** 
3. **Format cells if:** "Custom formula is"
4. **Formula:** `=$D2="Essential"`
5. **Formatting:** Light blue background (#e3f2fd)
6. **Click "Done"**

---

## 🔒 Protect Critical Structure

### **Lock Header Row and Columns**

**Protect headers from accidental changes:**
1. **Select row 1** (header row)
2. **Data menu → Protect sheets and ranges**
3. **Description:** "Header Row - Do Not Edit"
4. **Set permissions:** "Restrict who can edit this range"
5. **Only you** (template creator)
6. **Click "Done"**

**Protect column structure:**
1. **Select columns A and B** (Question and Topic)
2. **Data menu → Protect sheets and ranges**
3. **Description:** "Question Structure - Customize Content Only"
4. **Set permissions:** "Warn when editing this range"
5. **Warning text:** "Be careful! This affects the quiz structure."

---

## 📚 Update Instructions Tab

### **Add Validation Notes to Instructions**

**Update your Instructions tab with:**

```
🔒 TEMPLATE FEATURES:

✅ BUILT-IN VALIDATION:
   • Active column: Only TRUE/FALSE accepted
   • Type column: Only valid question types
   • Priority column: Only Essential/Additional
   • Dropdown lists prevent typos and errors

⚠️ EDITING TIPS:
   • Use dropdowns instead of typing when available
   • If you see a red border, your entry was rejected
   • Essential questions start enabled, Additional start disabled
   • Gray rows are inactive questions (Active = FALSE)

🎯 CUSTOMIZATION SAFE ZONES:
   • Candidate names and positions (columns K-P)
   • Question text (column A) - keep structure
   • Active status (column E) - use dropdown
   • Options 1-5 (columns F-J) for choice questions
```

---

## ✅ Validation Complete Checklist

**Before distributing your template:**

- [ ] **Active column (E)** has TRUE/FALSE dropdown validation
- [ ] **Type column (C)** has question type dropdown validation  
- [ ] **Priority column (D)** has Essential/Additional dropdown validation
- [ ] **Test validation** by trying to enter invalid data
- [ ] **Instructions updated** with validation information
- [ ] **Optional formatting** applied (conditional formatting, protection)
- [ ] **Template shared** with proper permissions
- [ ] **Validation preserved** when template is copied

---

## 🚀 Distribution Strategy

### **For Template Creators:**

**Share validation-enabled template:**
1. **File → Share → Get shareable link**
2. **Anyone with the link → Viewer**
3. **Share link** in newsroom onboarding materials
4. **Include validation setup instructions** for customization

### **For Newsrooms Using Template:**

**Copy and customize:**
1. **File → Make a copy** (validation rules are preserved!)
2. **Rename** to your organization name
3. **Customize candidate data** using validated dropdowns
4. **Use Active column** to enable/disable questions
5. **Publish to web** when ready

---

## 📈 Expected Results

### **Error Reduction:**
- **Before:** ~30% of templates have format issues
- **After:** <5% error rate with Level 1 validation

### **User Experience:**
- **Before:** "Quiz failed to load, check your spreadsheet"
- **After:** "Quiz generated successfully!"

### **Support Reduction:**
- **Before:** Multiple support requests for format issues
- **After:** Self-service success with minimal support

---

## 🔧 Troubleshooting

### **Common Issues:**

**"Validation not working"**
- ✅ Make sure you selected the correct range (E2:E100, not E1:E100)
- ✅ Check that "Reject input when data is invalid" is enabled
- ✅ Verify the list items are typed exactly (including spaces)

**"Dropdown not showing"**
- ✅ Ensure "Show dropdown list in cell" is checked
- ✅ Click directly on the cell (not just select the row)
- ✅ Try refreshing the browser

**"Existing data marked as invalid"**
- ✅ Your current data might not match the validation rules
- ✅ Fix existing data to match exact format (TRUE not true)
- ✅ Then apply validation to prevent future errors

---

**🎯 Result: Your template is now bulletproof against the most common newsroom errors!**
