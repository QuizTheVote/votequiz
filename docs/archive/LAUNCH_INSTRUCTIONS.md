# ELECTION QUIZ APP - LAUNCH INSTRUCTIONS

## Quick Launch (2 commands)

```bash
cd elex-quiz-app-tailwind
npm run dev
```

## What This Does
- Starts the development server
- App runs at: **http://localhost:5173**
- Uses Star Wars demo data by default
- Full election quiz with drag-and-drop topic ranking

## URLs to Access
- **Main App**: http://localhost:5173
- **Demo Mode**: http://localhost:5173?demo=true
- **With Google Sheet**: http://localhost:5173?sheet=YOUR_SHEET_ID

## To Stop the App
Press `Ctrl + C` in the terminal where it's running

## If You Get Errors
1. Make sure you're in the right directory: `elex-quiz-app-tailwind`
2. Run `npm install` first if dependencies are missing
3. Check that port 5173 isn't already in use

## What's Working
- ✅ Star Wars demo quiz (5 candidates, 7 questions)
- ✅ Topic importance drag-and-drop ranking
- ✅ Enhanced results with candidate details
- ✅ Google Sheets integration (when sheet ID provided)
- ✅ Responsive design (mobile/desktop)

## File Structure
```
elex-quiz-app-tailwind/
├── src/routes/+page.svelte (main app)
├── src/lib/components/ (quiz components)
├── src/lib/sampleData.ts (Star Wars demo)
└── package.json (dependencies)
```

**That's it. Just run those 2 commands and go to localhost:5173** 