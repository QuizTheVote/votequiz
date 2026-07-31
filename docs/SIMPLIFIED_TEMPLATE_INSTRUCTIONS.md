🗳️ QUIZ THE VOTE - NEWSROOM TEMPLATE

Create engaging candidate matching quizzes for your audience.
Help voters connect with candidates based on policy positions, not party labels.

📋 GETTING STARTED

1) MAKE YOUR COPY
   • File → Make a Copy
   • Rename to: “[Your Organization] Election Quiz 2025”
   • This is your editable version

2) DESIGN YOUR QUIZ
   • Focus on clear, neutral, specific policy questions (5–10 total)
   • Group by topics important to your community (3–7 topics)
   • Keep language concise and non-leading
   • Explain to candidates that non-answers will be shown transparently

3) WHAT TO GATHER ABOUT CANDIDATES
   • Name (as on ballot), party
   • Professional headshot photo (publicly accessible URL)
   • Brief bio (2–3 sentences)
   • Website or coverage link (link_url) + custom button text (link_text)
   • Responses to your quiz questions

🧩 QUESTION TYPES SUPPORTED

   • agree_5: Strongly Disagree → Strongly Agree
   • support_3: Less Support → Same Level → More Support
   • binary_choice: Support / Oppose
   • pick_1_3/4/5: Select one
   • multiple_choice: Select all that apply (use pipe “|” between selections)

🗂️ CUSTOMIZE IN THE SHEET

Quiz_Data (questions)
   • Column A: Question text
   • Column B: Topic
   • Column C: Type (agree_5, support_3, binary_choice, pick_1_3/4/5, multiple_choice)
   • Column D: Priority (Essential/Additional)
   • Column E: Active (TRUE/FALSE)
   • Columns F–J: Options for multiple_choice / pick_1_x
   • Columns K–P: Candidate responses
     - For multiple_choice answers, separate selections with pipe “|”
       Example: Healthcare access|Economic growth, job creation|Education funding
       (Commas inside a label are fine; “|” is the separator)

Topics
   • id, name, description
   • Topic weighting scales correctly regardless of the number of topics

Candidates
   • id, name, party, photo, bio, link_url, link_text
   • Photo URLs: Google Drive sharing links are OK — they are auto‑converted to direct image URLs. Other public image hosts also work.
   • link_text controls the candidate button text (e.g., “Visit Website”, “Read Our Coverage”)

📨 COLLECT CANDIDATE RESPONSES

   • Use “🗳️ Quiz Tools” → “📝 Generate Candidate Survey”
   • Send the Google Form to all candidates
   • Responses map directly to the candidate columns
   • Review and verify responses before publishing

⚠️ NON‑PARTICIPATION HANDLING

   • Only answered questions count toward match scores
   • Missing candidate answers are clearly shown with yellow highlighting (“⚠ NO CANDIDATE ANSWER PROVIDED”)
   • Candidates who answer ≥50% appear in main results; others are shown separately

✅ QUALITY CONTROL CHECKLIST

   • Run “🗳️ Quiz Tools” → “📋 Check Template Health”
   • Ensure at least 5 active questions with complete candidate responses
   • Confirm multiple_choice uses pipe “|” separators
   • Verify photos render (public URLs), links work (https://), and link_text looks right
   • Take the quiz on mobile and desktop to spot UI issues

🚀 PUBLISH & DEPLOY

   1) Make sheet viewable:
      • Share → Anyone with the link → Viewer
   2) Publish the data as CSV:
      • Click the “Quiz_Data” tab
      • File → Share → Publish to web → Quiz_Data sheet → CSV → Publish
   3) Copy your browser’s address bar URL (format: docs.google.com/spreadsheets/d/YOUR_ID/edit)
      • Do NOT use the “published” URL from the dialog
   4) Go to: https://www.quizthevote.com/build-your-quiz/
      • Paste your browser URL to generate embed code
   5) Embed the code in your site/CMS and test

🛠️ PROFESSIONAL TOOLS INCLUDED

   • Template health checking and error detection
   • Automatic formatting and organization
   • One‑click publishing prep
   • Data validation and basic backups

🔐 GOOGLE SECURITY NOTICE (FIRST RUN ONLY)

   • When you click “🗳️ Quiz Tools” the first time, Google may show “Google hasn’t verified this app”
   • Click “Advanced” → “Go to Quiz The Vote – Base Template (unsafe)” → “Allow”
   • This is normal for custom scripts within your own copy; the script only formats/validates this spreadsheet

📊 BEHIND THE SCENES (WHAT USERS SEE)

   • Agree/support answers display as readable labels (no raw numbers)
   • Yellow highlight for missing candidate answers
   • Topic ranking weights scale correctly across any number of topics
   • Transparent candidate participation indicators

🆘 SUPPORT

   • Technical help: https://www.quizthevote.com/contact-quizthevote/
   • Include your Google Sheet URL in support requests
   • Platform demo: https://www.quizthevote.com/#demo
