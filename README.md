# Election Quiz App

A customizable election candidate matching application that helps voters find candidates who align with their political positions.

## Features

- **Quiz Interface**: Presents political position questions to users
- **Matching Algorithm**: Uses weighted cosine similarity to match users to candidates
- **Topic Importance**: Users can rank which political topics matter most to them
- **Detailed Results**: Shows overall match percentage and topic-by-topic breakdown
- **Data Management**: Connects to Google Sheets for easy content management
- **Responsive Design**: Works on mobile, tablet, and desktop devices

## Demo Data

The app includes a fun Star Wars-themed demo dataset featuring characters like Padmé Amidala, Sheev Palpatine, Bail Organa, and others with political positions that match their personalities in the films.

## Setup & Configuration

### Option 1: Using Google Sheets (Recommended for Production)

1. Create a Google Sheet with the following tabs:
   - **Candidates**: Columns: `id`, `name`, `party`, `photo`, `bio`, `website`
   - **Questions**: Columns: `id`, `text`, `topic`, `explanation`, `type` (optional: "general" or "local")
   - **CandidateAnswers**: Columns: `candidateId`, `questionId`, `value` (1-5)
   - **Topics**: Columns: `id`, `name`, `description`, `category` (optional: "general" or "local")
   - **TopicImportance** (optional): Columns: `candidateId`, `topicId`, `weight` (1-10)

2. Make your Google Sheet public:
   - File → Share → Publish to Web → Publish entire document

3. Get your Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit
   ```

4. Update the `SHEET_ID` constant in `src/routes/+page.svelte` and set `USE_SAMPLE_DATA = false`

### Option 2: Using Sample Data (Quick Demo)

Set `USE_SAMPLE_DATA = true` in `src/routes/+page.svelte` to use the included Star Wars demo data.

## Development

1. Install dependencies:
```bash
   npm install
   ```

2. Start the development server:
```bash
npm run dev
   ```

3. Open your browser to http://localhost:5173/

## Data Preparation

We've included a data preparation Excel template in the `data-prep` folder that you can use to prepare your data before importing it into Google Sheets.

## Deployment

### Option 1: Static Site (Recommended)

The app is configured for static site deployment, making it easy to host on services like Netlify, Vercel, GitHub Pages, or any static hosting provider.

1. Build the application:
```bash
npm run build
```

2. The build output will be in the `build` directory, ready to deploy to any static hosting service.

### Option 2: Server-Side Rendering

If you need server-side rendering, modify the `svelte.config.js` file to use the appropriate adapter for your hosting provider (Node.js, Deno, Cloudflare, etc.).

## Customization

- **Design**: Modify Tailwind styles in the component files
- **Questions**: Update your Google Sheet with custom questions
- **Logic**: Adjust the matching algorithm in `src/lib/scorer.ts`
- **Topics**: Add or modify topics in your Google Sheet

## License

MIT

## Credits

Built with SvelteKit and Tailwind CSS.
