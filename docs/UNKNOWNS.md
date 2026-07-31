# Unknown register

Tracks every belief about this system that has not been verified, with a defined
test and an owner for each. Opened 2026-07-31.

Rule: nothing moves to RESOLVED on the strength of a document or an inference.
It needs a fetch, a browser run, or a code read that was actually performed.

## Named artifacts

- Repo: `github.com/QuizTheVote/votequiz`, deployed to `quizthevote.github.io/votequiz/`
- Base Template sheet, what newsrooms copy: `1B08mC5xl_crFRbNnOIKnPWvlSl1U9v_NDeLq73wa3o4`
- Homepage demo sheet, embedded on quizthevote.com: `1Y2BprkPQC_9RNwZGQLPo5kLWS5lGqAyKFBOOJMJCeFA`
- Builder page: `quizthevote.com/build-your-quiz/`

Confirmed 2026-07-31 that the "Copy Template" button on the builder page points
at `1B08mC5...`, so that is definitively the template newsrooms receive.

---

## RESOLVED

### U7. What the builder page generates — RESOLVED

Read the public HTML of `quizthevote.com/build-your-quiz/`. The live generator
is a self-contained script at the `#qtv-generator` anchor:

```js
var BASE="https://quizthevote.github.io/votequiz/";
function extractId(u){u=(u||"").trim();var m;
  m=u.match(/\/spreadsheets\/d\/e\/([\w-]+)/); if(m)return m[1];
  m=u.match(/\/spreadsheets\/d\/([\w-]+)/);   if(m)return m[1];
  m=u.match(/[?&]sheet=([\w-]+)/);            if(m)return m[1];
  if(/^[\w-]{20,}$/.test(u))return u; return null;}
function srcFor(id){return BASE+"?sheet="+id+"&svo=true";}
```

Findings:

- The generated URL is always `?sheet=<id>&svo=true`. It never sets `demo` or
  `header`.
- Height slider runs 600 to 1200, default 900.
- Attribution text "Powered by QuizTheVote" is emitted outside the iframe.
- **The published-to-web URL form is checked first.** See issue 6 in
  `KNOWN_ISSUES.md` — this is a bug, and the setup instructions walk newsrooms
  straight into it.
- A second, older generator also exists in the page and does append `&title=`.
  The live one does not, so `title` is currently unreachable through the builder.

There is also a third, duplicate generator inside this repo at
`src/routes/newsroom/+page.svelte:64`. Three implementations of the same string
concatenation will drift.

### U9. URL parameter behaviour — RESOLVED

Verified by driving the deployed app in a browser, not from docs.

- `sheet=<id>` loads that sheet. The id must match `^[a-zA-Z0-9-_]{30,50}$`
  (`src/lib/sheets.ts:156`) or the app throws before fetching.
- `svo=true` selects the SVO parser and scorer. Required for any real sheet.
  The builder always sets it.
- `demo=true` forces the built-in sample data and **overrides `sheet`**.
  Verified: with both set, the first question was "A community receives an
  unexpected budget surplus..." from sample data, not the sheet's "What is the
  top issue facing the city?".
- Omitting `sheet` behaves identically to `demo=true`
  (`useSampleData = ... || !sheetId`, `src/routes/+page.svelte:54`).
- `title=<text>` replaces the header text. Verified: `title=Springfield%202026%20Council%20Race`
  rendered exactly that, and the ballot-box emoji disappeared, because the emoji
  is only shown when the title is the literal default (`Navbar.svelte`).
- `header=false` removes the header element entirely. Verified.

### U10. Is the legacy non-SVO path reachable? — RESOLVED

Effectively dead, but reachable by accident.

- `fetchSheetData` (Tabletop) is called from exactly one place,
  `src/routes/+page.svelte:78`, and only when `svo=true` is absent.
- Neither the WordPress builder nor the in-repo generator ever omits
  `svo=true`, so no generated embed can reach it.
- It is still the **default** for a hand-written `?sheet=ID`, and it cannot work:
  Tabletop targets a retired Google Sheets API.

Safe to delete. When removing it, `?sheet=` without `svo=true` should parse as
SVO rather than falling back, so the flag becomes a no-op kept for compatibility
with embeds already in the wild.

### U12. Mobile and iframe behaviour — RESOLVED

Verified at 390x844, deviceScaleFactor 3, mobile emulation on, against the real
demo sheet.

- No horizontal overflow at any step (`scrollWidth > clientWidth` was false).
- No clipped text; tap targets are full-width.
- The Rank Topics screen correctly serves the mobile layout with Move Up and
  Move Down buttons rather than drag handles.
- The full flow completed and produced percentages.
- **Results page height was 967px** with six candidates all collapsed. The
  builder's default iframe height is 900px, so the results step already
  overflows on a phone before anyone expands a candidate. See issue 7 in
  `KNOWN_ISSUES.md`.

---

## OPEN

### U1. Does the installed Apps Script match `apps-script/Code.gs`? — OPEN

Needs Google access. `apps-script/Code.gs` was extracted from a markdown
transcript dated 2025-10-14 and has never been compared with what is running.

To close: open sheet `1B08mC5...`, Extensions then Apps Script, select all, and
save the contents to a file. A diff against `apps-script/Code.gs` settles it.
If they differ, the installed version is authoritative.

### U2. Full inventory of Google artifacts — OPEN

Needs Google access. Unknown: how many sheets exist, which are live versus
abandoned, whether the survey generator has created Google Forms, and which
Google account owns each item.

To close: list, for each spreadsheet, its ID, its purpose, whether anything
points at it, and the owning account. The two known IDs are above.

### U3. Is "Publish to web" required, or is link sharing enough? — OPEN

Partial evidence only. Sheet `1Y2Bprk...` serves CSV over the `gviz` endpoint
successfully, and the `/spreadsheets/d/e/<id>/pub` form returns 404 for it. That
404 is not proof, because published sheets use a different opaque token, so the
test was inconclusive.

To close: make a fresh copy of the template, set sharing to "Anyone with the
link, Viewer", do **not** publish it, and hand over the ID. If the app loads it,
the publish step can be removed from every instruction document. This matters
because publishing is the step most likely to lose a non-technical user, and it
is also what triggers the U7 bug.

### U4. How stale is the CSV feed? — OPEN

Google caches these responses. The delay between editing a sheet and the quiz
reflecting it is unmeasured, and newsrooms will hit it on deadline.

To close: change one cell at a known time, then poll
`https://docs.google.com/spreadsheets/d/<id>/gviz/tq?tqx=out:csv&sheet=Quiz_Data`
until the value changes, and record the elapsed time.

### U5. Does the candidate survey flow work end to end? — OPEN

Needs Google access. `Code.gs` contains `generateCandidateSurvey`,
`syncSurveyResponses`, `findOrCreateCandidateColumn` and `mapAnswersToQuestions`,
but none has been observed running. Note that `emailSurveyToCandidates` only
displays a template; it does not send mail.

To close: on a scratch copy, run Generate Candidate Survey, submit a response
through the resulting Form, then run Sync Survey Responses, and confirm the
answers land in the right `Quiz_Data` column.

### U6. Are any real newsroom quizzes live right now? — OPEN

Business knowledge only you have. This determines how cautiously anything gets
deployed. `template/archive/` contains an "At-Large Copy" and a "fish election
quiz" snapshot, which suggests at least two derived quizzes existed.

### U8. Where does the WordPress code live, and can it be tracked? — OPEN

The generator JavaScript is served inline from `build-your-quiz/`, so its output
is verified (U7), but the source of record sits in WP admin, reportedly via a
Headers and Footers plugin with `footer_code.txt` and `BuildYourQuiz_code.txt`.

To close: export those snippets so they can be committed here. Until then, a WP
edit can silently break embed generation with no history and no review.

### U11. Complete inventory of silent failure modes — OPEN

Blocked on a scratch sheet from U3. The intent is to deliberately break one
thing at a time and record exactly what the voter sees: candidate name mismatch,
trailing whitespace in a name, unknown topic id, renamed column, comma instead
of pipe in multiple choice, lowercase `true` in `Active`, and a missing tab.

Three are already known to fail silently: the `website` versus `link_url`
rename removes the candidate link with no warning, an unused topic id lets
voters rank something that has no effect, and an unmatched candidate name yields
a zero score. The rest need confirming before the Phase D validation is written,
so that it covers real failures rather than imagined ones.
