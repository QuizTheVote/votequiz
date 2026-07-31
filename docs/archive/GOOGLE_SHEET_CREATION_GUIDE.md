# GOOGLE SHEET TEMPLATE CREATION GUIDE

## Step-by-Step Instructions for Building the SVO Election Quiz Template

---

## Step 1: Create New Google Sheet

1. Go to **sheets.google.com**
2. Click **"+ Blank"** to create new spreadsheet
3. **Name it**: "Election Quiz Template - SVO Framework"

---

## Step 2: Sheet 1 - "Instructions"

1. **Rename "Sheet1"** to **"Instructions"**
2. **Merge cells A1:F10** for the main content area
3. **Enter this content in A1:**

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

## Step 3: Sheet 2 - "Quiz_Data" (Main Data)

1. **Add new sheet** (+ button at bottom)
2. **Name it**: "Quiz_Data"
3. **Set up column headers** in Row 1:

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Question | Topic | Type | Priority | Active | Option1 | Option2 | Option3 | Option4 | Option5 | Ronald | Pria | Marcus | Linda | Carla | Ian |

4. **Enter this data** (copy row by row):

### Row 2:
- **A2**: A community receives an unexpected budget surplus. How should it be used?
- **B2**: economy
- **C2**: pick_1_4
- **D2**: Essential
- **E2**: TRUE
- **F2**: Distribute equally to all residents
- **G2**: Invest in projects that benefit most people
- **H2**: Reward highest taxpayers with rebates
- **I2**: Fund competitive grants for improvements
- **J2**: [leave empty]
- **K2**: Distribute equally to all residents
- **L2**: Invest in projects that benefit most people
- **M2**: Invest in projects that benefit most people
- **N2**: Reward highest taxpayers with rebates
- **O2**: Fund competitive grants for improvements
- **P2**: Distribute equally to all residents

### Row 3:
- **A3**: A hospital has limited resources and must prioritize patient care. What principle should guide decisions?
- **B3**: healthcare
- **C3**: pick_1_4
- **D3**: Essential
- **E3**: TRUE
- **F3**: First-come, first-served
- **G3**: Greatest medical need
- **H3**: Social contribution and value
- **I3**: Ability to pay for care
- **J3**: [leave empty]
- **K3**: Greatest medical need
- **L3**: Greatest medical need
- **M3**: First-come, first-served
- **N3**: Ability to pay for care
- **O3**: Social contribution and value
- **P3**: Ability to pay for care

### Row 4:
- **A4**: When it comes to taxation, I believe in policies that prioritize...
- **B4**: economy
- **C4**: pick_1_3
- **D4**: Essential
- **E4**: TRUE
- **F4**: Shared prosperity and equality
- **G4**: Economic growth and opportunity
- **H4**: Individual responsibility and merit
- **I4**: [leave empty]
- **J4**: [leave empty]
- **K4**: Shared prosperity and equality
- **L4**: Shared prosperity and equality
- **M4**: Economic growth and opportunity
- **N4**: Individual responsibility and merit
- **O4**: Individual responsibility and merit
- **P4**: Economic growth and opportunity

### Row 5:
- **A5**: Climate change solutions should focus on...
- **B5**: environment
- **C5**: pick_1_3
- **D5**: Essential
- **E5**: TRUE
- **F5**: Government regulations and collective action
- **G5**: Individual lifestyle changes and education
- **H5**: Market-based solutions and innovation
- **I5**: [leave empty]
- **J5**: [leave empty]
- **K5**: Government regulations and collective action
- **L5**: Government regulations and collective action
- **M5**: Market-based solutions and innovation
- **N5**: Individual lifestyle changes and education
- **O5**: Market-based solutions and innovation
- **P5**: Government regulations and collective action

### Row 6:
- **A6**: Education funding should be designed to...
- **B6**: education
- **C6**: pick_1_3
- **D6**: Essential
- **E6**: TRUE
- **F6**: Ensure equal outcomes for all students
- **G6**: Provide equal opportunities with varied outcomes
- **H6**: Reward excellence and create competitive advantage
- **I6**: [leave empty]
- **J6**: [leave empty]
- **K6**: Ensure equal outcomes for all students
- **L6**: Provide equal opportunities with varied outcomes
- **M6**: Provide equal opportunities with varied outcomes
- **N6**: Reward excellence and create competitive advantage
- **O6**: Reward excellence and create competitive advantage
- **P6**: Reward excellence and create competitive advantage

### Row 7 (Additional Questions - Disabled):
- **A7**: Communities should support new businesses and economic development.
- **B7**: economy
- **C7**: agree_5
- **D7**: Additional
- **E7**: FALSE
- **F7**: [leave empty]
- **G7**: [leave empty]
- **H7**: [leave empty]
- **I7**: [leave empty]
- **J7**: [leave empty]
- **K7**: 3
- **L7**: 4
- **M7**: 4
- **N7**: 5
- **O7**: 5
- **P7**: 2

### Row 8:
- **A8**: Should government prioritize reducing inequality or promoting individual achievement?
- **B8**: social
- **C8**: binary_choice
- **D8**: Additional
- **E8**: FALSE
- **F8**: Reducing inequality
- **G8**: Promoting individual achievement
- **H8**: [leave empty]
- **I8**: [leave empty]
- **J8**: [leave empty]
- **K8**: Reducing inequality
- **L8**: Reducing inequality
- **M8**: Promoting individual achievement
- **N8**: Promoting individual achievement
- **O8**: Promoting individual achievement
- **P8**: Reducing inequality

### Row 9:
- **A9**: Which of these should be the top priorities for government? (Select all that apply)
- **B9**: government
- **C9**: multiple_choice
- **D9**: Additional
- **E9**: FALSE
- **F9**: Ensuring equal access to services
- **G9**: Protecting individual rights
- **H9**: Promoting economic competition
- **I9**: Building community solidarity
- **J9**: Supporting personal responsibility
- **K9**: Ensuring equal access to services,Building community solidarity
- **L9**: Ensuring equal access to services,Protecting individual rights
- **M9**: Protecting individual rights,Promoting economic competition
- **N9**: Protecting individual rights,Supporting personal responsibility
- **O9**: Promoting economic competition,Supporting personal responsibility
- **P9**: Ensuring equal access to services,Promoting economic competition,Supporting personal responsibility

### Row 10:
- **A10**: The government should do more to help struggling individuals and families.
- **B10**: social
- **C10**: support_3
- **D10**: Additional
- **E10**: FALSE
- **F10**: [leave empty]
- **G10**: [leave empty]
- **H10**: [leave empty]
- **I10**: [leave empty]
- **J10**: [leave empty]
- **K10**: 3
- **L10**: 3
- **M10**: 2
- **N10**: 1
- **O10**: 1
- **P10**: 3

### Row 11:
- **A11**: Should communities focus more on collective goals or individual success?
- **B11**: social
- **C11**: binary_choice
- **D11**: Additional
- **E11**: FALSE
- **F11**: Collective goals
- **G11**: Individual success
- **H11**: [leave empty]
- **I11**: [leave empty]
- **J11**: [leave empty]
- **K11**: Collective goals
- **L11**: Collective goals
- **M11**: Individual success
- **N11**: Individual success
- **O11**: Individual success
- **P11**: Collective goals

---

## Step 4: Sheet 3 - "Candidates"

1. **Add new sheet**, name it **"Candidates"**
2. **Set up headers** in Row 1:

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| id | name | party | photo | bio | website |

3. **Enter candidate data**:

### Row 2:
- **A2**: candidate1
- **B2**: Ronald the Radical
- **C2**: Progressive Alliance
- **D2**: https://lh3.googleusercontent.com/d/1vpiozHoC6UudPBAMK72mR_xF5ef2CyvS=w400
- **E2**: Advocates for transformative change through bold progressive policies, including wealth redistribution and expanded government programs.
- **F2**: https://example.com/ronald

### Row 3:
- **A3**: candidate2
- **B3**: Pria the Progressive
- **C3**: Democratic Coalition
- **D3**: https://lh3.googleusercontent.com/d/1FKVSWpI4R7zeexj50mrpYMTHWThAadhA=w400
- **E3**: Supports progressive reforms with practical implementation, focusing on social justice, environmental protection, and expanded public services.
- **F3**: https://example.com/pria

### Row 4:
- **A4**: candidate3
- **B4**: Marcus the Moderate
- **C4**: Centrist Coalition
- **D4**: https://lh3.googleusercontent.com/d/1pgz3uGi4INKsuSEtqWKE3teT2iZuyMRu=w400
- **E4**: Seeks balanced solutions that bridge partisan divides, emphasizing pragmatic approaches to complex policy challenges.
- **F4**: https://example.com/marcus

### Row 5:
- **A5**: candidate4
- **B5**: Linda the Libertarian
- **C5**: Freedom Party
- **D5**: https://lh3.googleusercontent.com/d/1rG_Io2hnu5dhTkBb9SeT-8RNovQygRYw=w400
- **E5**: Champions individual liberty and minimal government intervention, supporting free markets and personal responsibility.
- **F5**: https://example.com/linda

### Row 6:
- **A6**: candidate5
- **B6**: Carla the Conservative
- **C6**: Traditional Values Party
- **D6**: https://lh3.googleusercontent.com/d/1YJRegnhDJ0TZwLJDVypaYk6J6MQQEocJ=w400
- **E6**: Defends traditional values and fiscal responsibility, advocating for strong defense, law and order, and limited government spending.
- **F6**: https://example.com/carla

### Row 7:
- **A7**: candidate6
- **B7**: Incoherent Ian
- **C7**: Contradictory Coalition
- **D7**: https://lh3.googleusercontent.com/d/1a6L3PJXc-u8tMan-uPBP2S9PT-RcEskM=w400
- **E7**: Takes unpredictable positions across the political spectrum, somehow managing to contradict himself on most major issues.
- **F7**: https://example.com/ian

---

## Step 5: Sheet 4 - "Topics"

1. **Add new sheet**, name it **"Topics"**
2. **Set up headers** in Row 1:

| A | B | C | D |
|---|---|---|---|
| id | name | description | category |

3. **Enter topic data**:

### Row 2:
- **A2**: economy
- **B2**: Economy & Resources
- **C2**: How should society allocate resources and structure economic relationships?
- **D2**: general

### Row 3:
- **A3**: healthcare
- **B3**: Healthcare
- **C3**: How should healthcare resources be distributed and prioritized?
- **D3**: general

### Row 4:
- **A4**: environment
- **B4**: Environment
- **C4**: How should environmental challenges be addressed?
- **D4**: general

### Row 5:
- **A5**: education
- **B5**: Education
- **C5**: How should education be funded and organized?
- **D5**: general

### Row 6:
- **A6**: social
- **B6**: Social Policy
- **C6**: How should society balance individual needs with collective goals?
- **D6**: general

### Row 7:
- **A7**: government
- **B7**: Government Role
- **C7**: What should be the priorities and scope of government?
- **D7**: general

---

## Step 6: Sheet 5 - "Setup Guide"

1. **Add new sheet**, name it **"Setup Guide"**
2. **Merge cells A1:F20** and add comprehensive setup instructions
3. **Enter this content**:

```
COMPREHENSIVE SETUP GUIDE

Understanding the SVO Framework:
The Social Value Orientation framework measures fundamental psychological orientations that predict political behavior better than surface-level policy questions.

Essential vs Additional Questions:
- Essential questions (5): Core SVO measures, always enabled
- Additional questions (5): Extended analysis, enable as needed

Question Types Supported:
- agree_5: 5-point agreement scale
- support_3: 3-point support scale
- pick_1_3/4/5: Choose one from multiple options
- binary_choice: Choose between two options
- multiple_choice: Select multiple options

Customization Instructions:
1. Research candidate positions from official sources
2. Match candidate answers to exact option text
3. Use TRUE/FALSE in Active column to enable/disable questions
4. Keep column structure unchanged

Publishing Steps:
1. File → Share → Publish to web
2. Select "Entire Document" 
3. Choose "Link" format
4. Copy the published link
5. Extract Sheet ID from URL

Troubleshooting:
- Ensure all candidate answers match option text exactly
- Check that Active column uses TRUE/FALSE (not true/false)
- Verify sheet is published to web (not just shared)
```

---

## Step 7: Final Setup

1. **Reorder sheets** by dragging tabs:
   - Instructions (first)
   - Quiz_Data (second)
   - Candidates (third)
   - Topics (fourth)
   - Setup Guide (last)

2. **Format the sheets**:
   - Bold all header rows
   - Freeze header rows (View → Freeze → 1 row)
   - Auto-resize columns to fit content
   - Add light border formatting for readability

3. **Test the structure**:
   - Verify all data is entered correctly
   - Check that candidate answers match option text exactly
   - Ensure Essential questions have Active=TRUE
   - Ensure Additional questions have Active=FALSE

---

## Step 8: Publish and Test

1. **File → Share → Publish to web**
2. **Select**: "Entire Document"
3. **Format**: "Link"
4. **Click "Publish"**
5. **Copy the published URL**
6. **Extract Sheet ID** from URL (the long string between `/d/` and `/edit`)

---

## Next Steps

Once the sheet is created and published:
1. Test that the published URL is accessible
2. Update our app's sheet parser to read this new format
3. Test end-to-end: Sheet → SVO Quiz → Results

---

**Template Status**: Ready for Creation
**Estimated Time**: 30-45 minutes
**Complexity**: Medium (lots of data entry, but straightforward) 