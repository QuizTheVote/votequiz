# BUILD MASTER GOOGLE SHEET TEMPLATE - STEP BY STEP

## Overview
We're building the actual Google Sheet that newsrooms will copy to create their election quizzes. This is the real template with our SVO questions and sample candidates.

---

## Step 1: Create New Google Sheet

1. Go to **sheets.google.com**
2. Click **"+ Blank"** 
3. **Name it**: "Quiz The Vote - Base Template"

---

## Step 2: Sheet 1 - "Instructions"

1. **Rename "Sheet1"** to **"Instructions"**
2. **Enter this content in A1** (merge cells A1:H15):

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

## Step 3: Sheet 2 - "Quiz_Data" (Main Data)

1. **Add new sheet** (+ button at bottom)
2. **Name it**: "Quiz_Data"
3. **Set up these exact column headers** in Row 1:

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Question | Topic | Type | Priority | Active | Option1 | Option2 | Option3 | Option4 | Option5 | Ronald | Pria | Marcus | Linda | Carla | Ian |

4. **Enter the question data** starting in Row 2:

**Essential Questions (Active=TRUE):**

Row 2:
```
A2: A community receives an unexpected budget surplus. How should it be used?
B2: economy
C2: pick_1_4
D2: Essential
E2: TRUE
F2: Distribute equally to all residents
G2: Invest in projects that benefit most people
H2: Reward highest taxpayers with rebates
I2: Fund competitive grants for improvements
J2: [leave empty]
K2: Distribute equally to all residents
L2: Invest in projects that benefit most people
M2: Reward highest taxpayers with rebates
N2: Fund competitive grants for improvements
O2: Invest in projects that benefit most people
P2: Distribute equally to all residents
```

Row 3:
```
A3: A hospital has limited resources and must prioritize patient care. What principle should guide decisions?
B3: healthcare
C3: pick_1_4
D3: Essential
E3: TRUE
F3: First-come, first-served
G3: Greatest medical need
H3: Social contribution and value
I3: Ability to pay for care
J3: [leave empty]
K3: Greatest medical need
L3: Greatest medical need
M3: First-come, first-served
N3: Social contribution and value
O3: Ability to pay for care
P3: Greatest medical need
```

Row 4:
```
A4: When it comes to taxation, I believe in policies that prioritize...
B4: economy
C4: pick_1_3
D4: Essential
E4: TRUE
F4: Shared prosperity and equality
G4: Economic growth and opportunity
H4: Individual responsibility and merit
I4: [leave empty]
J4: [leave empty]
K4: Shared prosperity and equality
L4: Shared prosperity and equality
M4: Economic growth and opportunity
N4: Individual responsibility and merit
O4: Individual responsibility and merit
P4: Economic growth and opportunity
```

Row 5:
```
A5: Climate change solutions should focus on...
B5: environment
C5: pick_1_3
D5: Essential
E5: TRUE
F5: Government regulations and collective action
G5: Individual lifestyle changes and education
H5: Market-based solutions and innovation
I5: [leave empty]
J5: [leave empty]
K5: Government regulations and collective action
L5: Government regulations and collective action
M5: Individual lifestyle changes and education
N5: Market-based solutions and innovation
O5: Individual lifestyle changes and education
P5: Market-based solutions and innovation
```

Row 6:
```
A6: Education funding should be designed to...
B6: education
C6: pick_1_3
D6: Essential
E6: TRUE
F6: Ensure equal outcomes for all students
G6: Provide equal opportunities with varied outcomes
H6: Reward excellence and create competitive advantage
I6: [leave empty]
J6: [leave empty]
K6: Ensure equal outcomes for all students
L6: Provide equal opportunities with varied outcomes
M6: Provide equal opportunities with varied outcomes
N6: Reward excellence and create competitive advantage
O6: Reward excellence and create competitive advantage
P6: Provide equal opportunities with varied outcomes
```

**Additional Questions (Active=FALSE):**

Row 7:
```
A7: Communities should support new businesses and economic development.
B7: economy
C7: agree_5
D7: Additional
E7: FALSE
F7: [leave empty]
G7: [leave empty]
H7: [leave empty]
I7: [leave empty]
J7: [leave empty]
K7: 3
L7: 4
M7: 4
N7: 5
O7: 2
P7: 3
```

Row 8:
```
A8: The most important social priority should be...
B8: general
C8: pick_1_2
D8: Additional
E8: FALSE
F8: Reducing inequality
G8: Promoting individual success
H8: [leave empty]
I8: [leave empty]
J8: [leave empty]
K8: Reducing inequality
L8: Reducing inequality
M8: Promoting individual success
N8: Promoting individual success
O8: Promoting individual success
P8: Reducing inequality
```

Row 9:
```
A9: What are your top priorities for society?
B9: general
C9: multiple_choice
D9: Additional
E9: FALSE
F9: Ensuring equal access to services
G9: Building community solidarity
H9: Protecting individual rights
I9: Promoting economic competition
J9: Maintaining social order
K9: Ensuring equal access to services,Building community solidarity
L9: Ensuring equal access to services,Protecting individual rights
M9: Protecting individual rights,Promoting economic competition
N9: Protecting individual rights,Promoting economic competition
O9: Maintaining social order,Promoting economic competition
P9: Building community solidarity,Protecting individual rights
```

Row 10:
```
A10: Government support for underrepresented groups should be...
B10: general
C10: support_3
D10: Additional
E10: FALSE
F10: [leave empty]
G10: [leave empty]
H10: [leave empty]
I10: [leave empty]
J10: [leave empty]
K10: 3
L10: 3
M10: 2
N10: 1
O10: 1
P10: 2
```

Row 11:
```
A11: Success should be measured by...
B11: general
C11: binary_choice
D11: Additional
E11: FALSE
F11: Collective goals
G11: Individual success
H11: [leave empty]
I11: [leave empty]
J11: [leave empty]
K11: Collective goals
L11: Collective goals
M11: Individual success
N11: Individual success
O11: Individual success
P11: Collective goals
```

---

## Step 4: Sheet 3 - "Candidates"

1. **Add new sheet**, name it "Candidates"
2. **Column headers** in Row 1:

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| id | name | party | photo | bio | website |

3. **Enter candidate data** starting in Row 2:

```
Row 2: candidate1 | Ronald the Radical | Progressive Alliance | https://lh3.googleusercontent.com/d/1vpiozHoC6UudPBAMK72mR_xF5ef2CyvS=w400 | Advocates for transformative change through bold progressive policies, including wealth redistribution and expanded government programs. | https://example.com/ronald

Row 3: candidate2 | Pria the Progressive | Democratic Coalition | https://lh3.googleusercontent.com/d/1FKVSWpI4R7zeexj50mrpYMTHWThAadhA=w400 | Supports progressive reforms with practical implementation, focusing on social justice, environmental protection, and expanded public services. | https://example.com/pria

Row 4: candidate3 | Marcus the Moderate | Centrist Coalition | https://lh3.googleusercontent.com/d/1pgz3uGi4INKsuSEtqWKE3teT2iZuyMRu=w400 | Seeks balanced solutions that bridge partisan divides, emphasizing pragmatic approaches to complex policy challenges. | https://example.com/marcus

Row 5: candidate4 | Linda the Libertarian | Freedom Party | https://lh3.googleusercontent.com/d/1rG_Io2hnu5dhTkBb9SeT-8RNovQygRYw=w400 | Champions individual liberty and minimal government intervention, supporting free market solutions and personal responsibility. | https://example.com/linda

Row 6: candidate5 | Carla the Conservative | Traditional Values Party | https://lh3.googleusercontent.com/d/1YJRegnhDJ0TZwLJDVypaYk6J6MQQEocJ=w400 | Defends traditional values and fiscal responsibility, advocating for strong defense, law and order, and limited government spending. | https://example.com/carla

Row 7: candidate6 | Incoherent Ian | Contradictory Coalition | https://lh3.googleusercontent.com/d/1a6L3PJXc-u8tMan-uPBP2S9PT-RcEskM=w400 | Takes unpredictable positions across the political spectrum, somehow managing to contradict himself on most major issues. | https://example.com/ian
```

---

## Step 5: Sheet 4 - "Topics"

1. **Add new sheet**, name it "Topics"
2. **Column headers** in Row 1:

| A | B | C | D |
|---|---|---|---|
| id | name | description | category |

3. **Enter topic data**:

```
Row 2: economy | Economy | How should society allocate resources and structure economic relationships? | general
Row 3: healthcare | Healthcare | How should healthcare resources be distributed and prioritized? | general  
Row 4: environment | Environment | How should environmental challenges be addressed? | general
Row 5: education | Education | How should education be funded and organized? | general
Row 6: general | General Values | How should society balance individual needs with collective goals? | general
```

---

## Step 6: Format and Finalize

1. **Bold all header rows** in each sheet
2. **Freeze top row** in each sheet (View → Freeze → 1 row)
3. **Auto-resize columns** to fit content
4. **Reorder sheets**: Instructions, Quiz_Data, Candidates, Topics

---

## Step 7: Publish the Sheet

1. **File → Share → Publish to web**
2. **Select**: "Entire Document"
3. **Format**: "Link" 
4. **Click "Publish"**
5. **Copy the published URL**
6. **Extract Sheet ID** (the long string between `/d/` and `/edit`)

---

## Test URL Format:
```
http://localhost:5173/?sheet=YOUR_SHEET_ID&svo=true
```

**This will be our Base Template that newsrooms copy!**