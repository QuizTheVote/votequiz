# Election Candidate Matching Quiz

A customizable quiz application that helps voters find candidates who align with their political positions. Designed for newsrooms and civic organizations.

## Features

- Interactive quiz interface with political position questions
- Advanced matching algorithm using weighted cosine similarity
- Topic importance ranking to personalize results
- Detailed results with topic-by-topic breakdown
- Google Sheets integration for easy content management
- Responsive design for all devices

## Quick Start

### Development
```bash
npm install
npm run dev
```

Open http://localhost:5173/ to view the app.

### Data Configuration

The app can use either Google Sheets for live data or sample data for testing.

**Using Google Sheets (Production):**

1. Create a Google Sheet with these tabs:
   - **Candidates**: `id`, `name`, `party`, `photo`, `bio`, `website`
   - **Questions**: `id`, `text`, `topic`, `explanation`
   - **CandidateAnswers**: `candidateId`, `questionId`, `value` (1-5 scale)
   - **Topics**: `id`, `name`, `description`

2. Publish your sheet: File → Share → Publish to Web

3. Update `SHEET_ID` in `src/routes/+page.svelte` and set `USE_SAMPLE_DATA = false`

**Using Sample Data (Demo):**

Set `USE_SAMPLE_DATA = true` in `src/routes/+page.svelte` to use included demo data.

## Deployment

### Static Site Deployment (Recommended)

Build for static hosting:
```bash
npm run build
```

Deploy the `build` directory to Netlify, Vercel, GitHub Pages, or any static host.

### Alternative Deployment

For server-side rendering, modify `svelte.config.js` to use the appropriate adapter.

## Customization

- **Styling**: Edit Tailwind classes in component files
- **Algorithm**: Modify matching logic in `src/lib/scorer.ts`
- **Data**: Update Google Sheet structure as needed

## Built With

- SvelteKit
- Tailwind CSS
- TypeScript

## License

MIT 