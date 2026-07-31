# BASE TEMPLATE GOOGLE SHEET STRUCTURE

## Overview
This document defines the exact structure for the Base Template Google Sheet that newsrooms will copy to create their own election quizzes using the SVO (Social Value Orientation) framework.

---

## Sheet 1: "Instructions"

**Purpose:** Clear, non-technical setup guide for newsrooms

### Content:

```
ELECTION QUIZ TEMPLATE - QUICK START GUIDE

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
   • Copy the published URL
   • Use our quiz generator at: [PLATFORM_URL]
   • Enter your Sheet ID when prompted

📋 WHAT'S INCLUDED:
   • 5 Essential SVO questions (2-3 min quiz)
   • 5 Additional questions (4-5 min quiz total)
   • 6 sample candidate archetypes
   • Scientific framework based on 40+ years of psychology research

❓ NEED HELP?
   • Full instructions: See "Setup Guide" tab
   • Technical support: [SUPPORT_EMAIL]
   • Documentation: [DOCS_URL]

⚠️ IMPORTANT: 
   • Keep the column structure unchanged
   • Only modify candidate names, positions, and Active status
   • Essential questions are pre-enabled; Additional questions start disabled
```

---

## Sheet 2: "Quiz_Data" (Main Data Sheet)

**Purpose:** Single sheet containing all quiz data with new SVO structure

### Column Structure:

| Column | Description | Example | Notes |
|--------|------------|---------|-------|
| Question | The question text | "A community receives an unexpected budget surplus..." | Keep concise but clear |
| Topic | Question category | "economy" | Must match Topics sheet |
| Type | Question format | "pick_1_4" | See supported types below |
| Priority | Question importance | "Essential" | Essential or Additional |
| Active | Enable/disable | TRUE | TRUE to include, FALSE to skip |
| Option1 | First choice | "Distribute equally to all residents" | For choice/multiple questions |
| Option2 | Second choice | "Invest in projects that benefit most people" | For choice/multiple questions |
| Option3 | Third choice | "Reward highest taxpayers with rebates" | For choice/multiple questions |
| Option4 | Fourth choice | "Fund competitive grants for improvements" | For choice/multiple questions |
| Option5 | Fifth choice | | For 5-option questions only |
| Ronald McDonald | Candidate 1 position | "Distribute equally to all residents" | Must match option text exactly |
| Pria Progressive | Candidate 2 position | "Invest in projects that benefit most people" | Must match option text exactly |
| Marcus Moderate | Candidate 3 position | "Reward highest taxpayers with rebates" | Must match option text exactly |
| Linda Liberal | Candidate 4 position | "Fund competitive grants for improvements" | Must match option text exactly |
| Carla Conservative | Candidate 5 position | "Distribute equally to all residents" | Must match option text exactly |
| Ian Independent | Candidate 6 position | "Invest in projects that benefit most people" | Must match option text exactly |

### Supported Question Types:

- **agree_5**: 5-point agreement scale (Strongly Disagree to Strongly Agree)
- **support_3**: 3-point support scale (Less Support, Same Level, More Support)  
- **pick_1_3**: Choose one from 3 options
- **pick_1_4**: Choose one from 4 options
- **pick_1_5**: Choose one from 5 options
- **binary_choice**: Choose between 2 options
- **multiple_choice**: Select multiple options (comma-separated)

### Sample Data (First 3 rows):

```
Question | Topic | Type | Priority | Active | Option1 | Option2 | Option3 | Option4 | Option5 | Ronald McDonald | Pria Progressive | Marcus Moderate | Linda Liberal | Carla Conservative | Ian Independent
A community receives an unexpected budget surplus. How should it be used? | economy | pick_1_4 | Essential | TRUE | Distribute equally to all residents | Invest in projects that benefit most people | Reward highest taxpayers with rebates | Fund competitive grants for improvements | | Distribute equally to all residents | Invest in projects that benefit most people | Invest in projects that benefit most people | Reward highest taxpayers with rebates | Fund competitive grants for improvements | Distribute equally to all residents
A hospital has limited resources and must prioritize patient care. What principle should guide decisions? | healthcare | pick_1_4 | Essential | TRUE | First-come, first-served | Greatest medical need | Social contribution and value | Ability to pay for care | | Greatest medical need | Greatest medical need | First-come, first-served | Ability to pay for care | Social contribution and value | Ability to pay for care
When it comes to taxation, I believe in policies that prioritize... | economy | pick_1_3 | Essential | TRUE | Shared prosperity and equality | Economic growth and opportunity | Individual responsibility and merit | | | Shared prosperity and equality | Shared prosperity and equality | Economic growth and opportunity | Individual responsibility and merit | Individual responsibility and merit | Economic growth and opportunity
```

---

## Sheet 3: "Candidates"

**Purpose:** Candidate information and photos

### Column Structure:

| Column | Description | Example | Notes |
|--------|------------|---------|-------|
| id | Unique identifier | "candidate1" | Used internally for matching |
| name | Candidate name | "Ronald McDonald" | **IMPORTANT:** Must exactly match Quiz_Data column header |
| party | Political party | "Progressive Alliance" | Can be generic or actual |
| photo | Image URL | "https://..." | Public URL or Google Drive link |
| bio | Brief description | "Advocates for transformative change..." | 1-2 sentences |
| website | Campaign website | "https://example.com/ronald" | Optional |

### Sample Data:

```
id | name | party | photo | bio | website
candidate1 | Ronald the Radical | Progressive Alliance | https://lh3.googleusercontent.com/d/1vpiozHoC6UudPBAMK72mR_xF5ef2CyvS=w400 | Advocates for transformative change through bold progressive policies, including wealth redistribution and expanded government programs. | https://example.com/ronald
candidate2 | Pria the Progressive | Democratic Coalition | https://lh3.googleusercontent.com/d/1FKVSWpI4R7zeexj50mrpYMTHWThAadhA=w400 | Supports progressive reforms with practical implementation, focusing on social justice, environmental protection, and expanded public services. | https://example.com/pria
candidate3 | Marcus the Moderate | Centrist Coalition | https://lh3.googleusercontent.com/d/1pgz3uGi4INKsuSEtqWKE3teT2iZuyMRu=w400 | Seeks balanced solutions that bridge partisan divides, emphasizing pragmatic approaches to complex policy challenges. | https://example.com/marcus
```

---

## Sheet 4: "Topics"

**Purpose:** Topic definitions and descriptions

### Column Structure:

| Column | Description | Example | Notes |
|--------|------------|---------|-------|
| id | Unique identifier | "economy" | Must match Quiz_Data Topic column |
| name | Display name | "Economy & Resources" | User-friendly name |
| description | Topic explanation | "How should society allocate resources..." | Brief explanation |
| category | Topic category | "general" | Usually "general" |

### Sample Data:

```
id | name | description | category
economy | Economy & Resources | How should society allocate resources and structure economic relationships? | general
healthcare | Healthcare | How should healthcare resources be distributed and prioritized? | general
environment | Environment | How should environmental challenges be addressed? | general
education | Education | How should education be funded and organized? | general
social | Social Policy | How should society balance individual needs with collective goals? | general
government | Government Role | What should be the priorities and scope of government? | general
```

---

## Sheet 5: "Setup Guide" (Detailed Instructions)

**Purpose:** Comprehensive setup instructions for newsrooms

### Content Structure:

1. **Understanding SVO Framework**
   - What makes this different from other political quizzes
   - Why SVO questions are more effective
   - Scientific backing and research

2. **Customization Guide**
   - How to research candidate positions
   - Best practices for neutral question wording
   - When to enable/disable Additional questions

3. **Technical Setup**
   - Publishing the sheet to web
   - Getting the Sheet ID
   - Testing the quiz

4. **Troubleshooting**
   - Common setup errors
   - Data validation tips
   - Contact information

---

## Implementation Notes

### For Developers:

1. **Sheet Parsing**: Need to update `fetchSheetData()` to support new single-sheet structure OR create conversion function
2. **Backward Compatibility**: Maintain support for old format during transition
3. **Validation**: Add validation for new question types and structure
4. **Error Handling**: Provide helpful error messages for common template issues

### For Newsrooms:

1. **Candidate Research**: Include guidance on finding reliable candidate position data
2. **Legal Considerations**: Add disclaimers about editorial independence
3. **Accessibility**: Ensure quiz works on mobile devices
4. **Analytics**: Consider basic usage tracking for newsrooms

---

## Next Steps

1. **Create Actual Google Sheet**: Build the template with this exact structure
2. **Test End-to-End**: Verify full workflow from copy to deployment
3. **Update Parser**: Modify code to handle new sheet structure
4. **Documentation**: Create setup videos and detailed guides
5. **Beta Testing**: Test with real newsrooms before launch

---

**Template URL**: [TO BE CREATED]
**Last Updated**: [DATE]
**Version**: 2.0 (SVO Framework) 