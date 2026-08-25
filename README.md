# Quiz The Vote

**Help voters connect with candidates based on policy, not party.**

Quiz The Vote is a tool for newsrooms to create engaging candidate matching quizzes that help voters discover candidates based on actual policy positions and local issues.

## For Newsrooms

Create meaningful voter-candidate connections with our easy-to-use platform:

- **Quick Setup:** Ready to customize in minutes using Google Sheets
- **No Coding Required:** Simple template-based approach  
- **Fully Customizable:** Add your candidates and local issues
- **Mobile Responsive:** Works on all devices
- **Easy Embedding:** Simple iframe embed for your website

## Features

- **"Social Value Orientation" Framework Default Quiz:** Based in research at the intersection of psychology and sociopolitical choice
- **Multiple Question Types:** Agreement scales, multiple choice, binary options
- **Smart Matching Algorithm:** Weighted similarity calculations for accurate results
- **Topic Importance Ranking:** Users can prioritize issues that matter most
- **Professional Results Display:** Clean, shareable candidate match percentages
- **Google Sheets Integration:** Use familiar tools for content management

## Get Started

**For Newsrooms:**
1. Visit [QuizTheVote.com](https://www.quizthevote.com/build-your-quiz/)
2. Copy our template to your Google Drive
3. Add your local candidates and customize questions
4. Publish and embed on your website

**Live Demo:**
- **Try the quiz:** [quizthevote.github.io/votequiz](https://quizthevote.github.io/votequiz/?svo=true&demo=true)
- **See it in action:** [QuizTheVote.com/#demo](https://www.quizthevote.com/#demo)

## Technical Details

Built with modern web technologies for reliability and performance:

- **Frontend:** SvelteKit + TypeScript
- **Styling:** Tailwind CSS
- **Data Source:** Google Sheets (CSV API)
- **Deployment:** GitHub Pages (Static Site)
- **Matching Algorithm:** Per-question similarity, then a mean, weighted by topic ranking

## Repository Layout

| Path | Contents |
| --- | --- |
| `src/` | The SvelteKit quiz application |
| `tests/` | Playwright end-to-end tests, run by CI as a gate on deploy |
| `docs/` | Documentation — **start at [`docs/README.md`](docs/README.md)** |
| `docs/archive/` | Superseded documents, kept for history. Do not trust for current behaviour. |
| `apps-script/` | The Google Apps Script bound to the Base Template sheet |
| `template/` | Snapshots of the Base Template spreadsheet |
| `wordpress/` | The embed generator from quizthevote.com/build-your-quiz/ |

Known bugs and open work are tracked in
[`docs/KNOWN_ISSUES.md`](docs/KNOWN_ISSUES.md). Unverified assumptions, each with
a test and an owner, are tracked in [`docs/UNKNOWNS.md`](docs/UNKNOWNS.md).

## Development

```bash
npm install
npm run dev      # http://localhost:5173, no base path in dev
npm run check    # svelte-check; must be clean
npm test         # Playwright, desktop and mobile
npm run build    # fails if any prerendered link 404s
```

Useful URLs against a dev server:

| URL | What it does |
| --- | --- |
| `/?sheet=<id>` | Loads a real sheet. `svo=true` is accepted but no longer needed. |
| `/?demo=true` | Built-in fixture, which includes inactive questions on purpose |
| `/?sheet=<id>&debug=true` | Also shows non-critical spreadsheet advisories |
| `/?title=Some%20Race` | Replaces the header text |
| `/?header=false` | Removes the header, for embedding |

## Support

- **Website:** [QuizTheVote.com](https://www.quizthevote.com)
- **About:** [QuizTheVote.com/about](https://www.quizthevote.com/about-quizthevote/)
- **Contact:** [QuizTheVote.com/contact](https://www.quizthevote.com/contact)
- **Documentation:** Comprehensive setup guides included

---

**© 2025 QuizTheVote | Improving democracy by helping voters make informed decisions**
