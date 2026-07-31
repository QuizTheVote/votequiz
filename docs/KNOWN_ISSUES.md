# Known Issues

Audited 2026-07-31 against commit `78f66b5` (tagged `v2.4.0`), the state
deployed since 2025-10-20. Every item below was reproduced, not inferred.

## Blockers

### 1. Results screen renders nothing when any question is `Active = FALSE`

The function that advances to the results step counts *all* questions, while
the guard that decides whether to draw the results step counts only *active*
questions:

- `src/routes/+page.svelte:199` — `currentQuestionIndex = quizData.questions.length + 1`
- `src/routes/+page.svelte:231` — `showResults = ... currentQuestionIndex === activeQuestions.length + 1`

When the two disagree, no branch in the template matches and `<main>` renders
empty. Reproduce with `?svo=true&demo=true`: the bundled sample data has 10
questions with 5 inactive, so the app jumps to index 11 while the results
screen waits for index 6.

Introduced by `9d1eb75` ("CRITICAL FIX: Only display and score active
questions"), which added the active-question filter but only half-migrated the
step indexing.

**Why production still works:** both the demo sheet and the Base Template
currently have every row set to `Active = TRUE`, so the two counts coincide by
accident. The bug fires the first time a newsroom deactivates a question —
which the template instructions actively encourage.

### 2. Non-SVO mode reports every candidate as a non-responder

The results screen splits candidates on a participation rate:

- `src/routes/+page.svelte:31-32` — filters on `(c.participationRate || 0) >= 0.5`

Only the SVO scorers populate that field (`src/lib/scorer.ts:397` and `:520`).
The legacy `calculateMatches` and `calculateWeightedMatches` do not, so
`|| 0` sends every candidate into the "Additional Candidates" bucket labelled
"Did not respond to survey", and no match percentages are shown at all.

Reproduce at <https://quizthevote.github.io/votequiz/> with no parameters, or
with `?demo=true`. Introduced by `21f66b4`.

## Bugs

### 3. Every navigation link on the About, Methodology, and Newsroom pages 404s

The hrefs are root-relative and carry a `.html` suffix, so they both discard
the `/votequiz` base path and fail to match the built route names (`/about`,
not `/about.html`):

- `src/routes/about/+page.svelte:16-18`, `:75`
- `src/routes/methodology/+page.svelte:16-18`, `:147`
- `src/routes/newsroom/+page.svelte:107-109`, `:356`

Confirmed dead:

```
404  https://quizthevote.github.io/about.html
404  https://quizthevote.github.io/methodology.html
404  https://quizthevote.github.io/newsroom.html
404  https://quizthevote.github.io/
```

The "Try the Demo" buttons have the same defect
(`about:78`, `methodology:144`, `newsroom:359`), so they 404 rather than
reaching the demo. The build already warns about all of this on every deploy.

### 4. `candidate.website` does not exist

`src/routes/+page.svelte:433-441` guards on and links to `candidate.website`.
The `Candidate` interface has `link_url` and `link_text`; there is no
`website` field, so the link never renders in the Additional Candidates block.
`svelte-check` flags this.

### 5. Inactive questions leak into the answer comparison

`src/lib/components/EnhancedResults.svelte:33-36` filters questions by topic
but not by `active`, so the "View Answers" panel lists questions the user was
never asked and attributes them as unanswered.

### 6. The embed builder prefers the wrong Google Sheets URL form

Found 2026-07-31 while verifying U7. The generator on
`quizthevote.com/build-your-quiz/` extracts the sheet id like this:

```js
m=u.match(/\/spreadsheets\/d\/e\/([\w-]+)/); if(m)return m[1];   // checked FIRST
m=u.match(/\/spreadsheets\/d\/([\w-]+)/);   if(m)return m[1];
```

The `/d/e/` form is the **published-to-web** URL, and it is tested first. A
newsroom that follows the instructions — which tell them to publish the
`Quiz_Data` tab to the web — and then pastes the URL from that publish dialog
gets its `2PACX-...` token extracted instead of the sheet id. Those tokens run
to roughly 89 characters, so they fail the app's own guard at
`src/lib/sheets.ts:156`, which requires 30 to 50 characters. The voter then sees
the generic "Failed to load quiz data" message with no indication that the wrong
URL was pasted.

This is why every instruction document insists on copying the browser address
bar URL rather than the published one. The builder should prefer the plain
`/spreadsheets/d/<id>` form and reject a `2PACX-` token with a specific message.

Fixing it requires a WordPress edit (see U8 in `UNKNOWNS.md`). The duplicate
generator in this repo at `src/routes/newsroom/+page.svelte:64` has the same
job and should be reconciled or removed.

### 7. Results page overflows the recommended iframe height on mobile

Found 2026-07-31 while verifying U12. At a 390x844 viewport against the demo
sheet, the results step reports a `scrollHeight` of **967px** with all six
candidates collapsed. The builder's default iframe height is 900px, and its
slider tops out at 1200px.

So the default embed already clips the results on a phone before the voter
expands anything. Expanding a candidate to see topic matches makes it
substantially taller. Either the embed needs to resize itself to its content
(`postMessage` from the app to the parent page) or the default height needs to
account for the tallest step.

## Maintenance

- **`npm run check` fails with 10 errors** and is not run by CI. Two of those
  errors are issue 4 above.
- **No tests of any kind.** One end-to-end run of "answer everything, see
  results" would have caught issues 1 and 2.
- **`tabletop` is still a runtime dependency** and is imported at the top of
  `src/lib/sheets.ts`, so it ships to every visitor. Tabletop.js is abandoned
  and targets a retired Google Sheets API, which means the entire non-SVO
  `?sheet=` code path can only fail. Removing it and the legacy path deletes
  roughly 250 lines.
- **Verbose `console.log` output in production**, including a reactive block
  that logs candidate classification on every update.
- **CI pins Node 18**, which is end of life. Browser data (`caniuse-lite`) is
  over a year stale.
- **No `npm run lint`** and no lint config.

## Not tracked in version control

The WordPress embed-generator JavaScript on quizthevote.com exists only in the
WordPress admin. The Base Template spreadsheet lives in Google Drive; only a
snapshot is committed under `template/`.
