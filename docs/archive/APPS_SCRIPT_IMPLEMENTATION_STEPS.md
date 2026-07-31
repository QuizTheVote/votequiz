# APPS SCRIPT IMPLEMENTATION STEPS
## Adding Candidate Survey Generator to Base Template

### 🎯 **Objective**
Replace the existing Apps Script in the Base Template with our complete version that includes both the custom menu toolkit AND the new candidate survey generation features.

---

## 📋 **Step-by-Step Implementation**

### **Step 1: Access Apps Script**
1. **Open Base Template:** https://docs.google.com/spreadsheets/d/1XtS_4-k5yDvgBT_CAqYR9nsUXK9B5aREZPKaALF2LsE/edit
2. **Navigate to:** Extensions → Apps Script
3. **You should see:** Existing custom menu toolkit code

### **Step 2: Replace All Code**
1. **Select all existing code** (Ctrl+A / Cmd+A)
2. **Delete it completely**
3. **Copy the complete code** from `UPDATED_APPS_SCRIPT_WITH_SURVEY.md`
4. **Paste the new code**

### **Step 3: Save and Authorize**
1. **Save:** Ctrl+S / Cmd+S
2. **Click "Review Permissions"** when prompted
3. **Authorize the script** to access:
   - Google Sheets (existing)
   - Google Forms (NEW - for survey generation)
   - Email sending (NEW - for candidate outreach)

### **Step 4: Test the New Menu**
1. **Go back to the spreadsheet**
2. **Refresh the page** (F5)
3. **Check the Quiz Tools menu** - should now show:
   - 📋 Check Template Health
   - 🎨 Apply Standard Formatting  
   - 🔧 Reset Validation Rules
   - 📊 Generate Summary
   - **📝 Generate Candidate Survey** ← NEW
   - **📧 Email Survey to Candidates** ← NEW  
   - **🔄 Sync Survey Responses** ← NEW
   - 🚀 Prepare for Publishing
   - 💾 Create Backup
   - ❓ Get Help

### **Step 5: Test Survey Generation**
1. **Go to Quiz_Data sheet**
2. **Click Quiz Tools → "📝 Generate Candidate Survey"**
3. **Should create a Google Form** with your active questions
4. **Verify form creation** and get the survey URL

---

## 🆕 **New Features Added**

### **📝 Generate Candidate Survey**
- **Reads active questions** from Quiz_Data sheet
- **Creates professional Google Form** with matching question types
- **Maps question types correctly:**
  - `agree_5` → 1-5 scale with labels
  - `support_3` → 1-3 scale with labels  
  - `binary_choice` → Multiple choice with options
  - `pick_1_4` → Radio buttons with options
  - `multiple_choice` → Checkboxes for multiple selection
- **Adds candidate info fields** (name, email, campaign contact)
- **Creates "Survey_Responses" sheet** for data collection
- **Provides survey URL** for candidate distribution

### **📧 Email Survey to Candidates**
- **Shows survey URL** for manual distribution
- **Provides email template** with professional messaging
- **Includes suggested subject line** and follow-up instructions

### **🔄 Sync Survey Responses**
- **Reads responses** from Survey_Responses sheet
- **Maps answers to candidate columns** (K-P)
- **Handles different question types** appropriately
- **Creates candidate columns** automatically
- **Validates and formats** responses

---

## 🔐 **New Permissions Required**

The script will request additional permissions for:

### **Google Forms API:**
- **Create forms** - To generate candidate surveys
- **Modify forms** - To set up question types and validation
- **Read form responses** - To collect candidate answers

### **Email Services:**
- **Send emails** - For candidate outreach (future feature)
- **Read email templates** - For professional messaging

### **Advanced Sheets:**
- **Create new sheets** - For Survey_Responses
- **Modify multiple sheets** - For candidate data mapping

---

## ✅ **Success Indicators**

After implementation, you should see:

1. **✅ New menu items** appear in Quiz Tools
2. **✅ Survey generation** creates Google Form successfully  
3. **✅ Form questions** match your Quiz_Data questions
4. **✅ Response collection** works automatically
5. **✅ Candidate data** syncs to Quiz_Data sheet

---

## 🚨 **Troubleshooting**

### **If permissions fail:**
- **Try again** - Sometimes needs multiple attempts
- **Check Google account** - Must be same as sheet owner
- **Clear cache** - Refresh browser and try again

### **If menu doesn't appear:**
- **Refresh spreadsheet** (F5)
- **Check script saved** properly
- **Verify no syntax errors** in Apps Script editor

### **If survey generation fails:**
- **Check active questions** exist in Quiz_Data
- **Verify question types** are valid
- **Ensure proper sheet permissions**

---

## 🎯 **Ready to Implement?**

The complete code is ready in `UPDATED_APPS_SCRIPT_WITH_SURVEY.md`. This will make Quiz The Vote the ONLY platform with fully automated candidate data collection!

**Let's do this!** 🚀
