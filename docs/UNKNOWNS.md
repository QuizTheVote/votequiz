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

### U4. How stale is the CSV feed? — PARTIALLY RESOLVED

The app fetches from exactly one endpoint (`src/lib/sheets.ts:116`):

```
https://docs.google.com/spreadsheets/d/<id>/gviz/tq?tqx=out:csv&sheet=<tab>
```

Fetched its headers on 2026-07-31 against `1Y2Bprk...`:

```
cache-control: no-cache, no-store, max-age=0, must-revalidate
pragma: no-cache
expires: Mon, 01 Jan 1990 00:00:00 GMT
```

Google explicitly forbids caching this response, and returns no `age` or `etag`.
So there is no HTTP-level staleness: a browser reload should always fetch afresh.
The expected answer to "how long until my edit shows up" is therefore
"immediately, on reload", not the multi-minute delay that the published-to-web
`/pub?output=csv` endpoint is known for. The app does not use `/pub`.

Still unconfirmed: whether Google applies internal propagation delay upstream of
the cache headers. To close, change one cell at a known time and poll the URL
above until the value changes. Worth doing once, because the answer goes into
newsroom-facing instructions and deadline behaviour depends on it.

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

Note: Phase D validation shipped ahead of this inventory, covering the three
known cases plus missing columns. U11 remains open because the untested cases
may need additional checks, not because the shipped ones are unverified.

---

## Handoff: what closing these needs from you

Everything below needs a Google or WordPress login. Each item is ordered by
value per minute spent. The single highest-value action is the scratch sheet in
step 2, because it unblocks both U3 and U11.

### 1. Export the installed Apps Script (closes U1, ~2 minutes)

Open sheet `1B08mC5xl_crFRbNnOIKnPWvlSl1U9v_NDeLq73wa3o4` → Extensions → Apps
Script. In the editor, select all of `Code.gs`, copy, and paste into a file at
`apps-script/Code.installed.gs`. That is all — the diff is mechanical from there.
If the editor shows more than one `.gs` file, export each one and say so.

### 2. Make one scratch sheet, unpublished (closes U3, unblocks U11, ~3 minutes)

On the builder page, click Copy Template. On the copy: Share → General access →
"Anyone with the link", role Viewer. Do **not** touch File → Share → Publish to
web. Paste the resulting sheet ID here.

If the app loads it, the publish-to-web step can be deleted from every
instruction document, which removes both the step most likely to lose a
non-technical newsroom and the trigger for the issue 6 URL bug.

### 3. Time one edit (closes U4, ~5 minutes of waiting)

In any sheet you own, change one `Quiz_Data` question's text and note the clock
time. Tell me the sheet ID, the cell, and the time. I will poll until it changes
and record the real number.

### 4. Run the candidate survey flow once (closes U5, ~10 minutes)

On the scratch copy from step 2, run Quiz Tools → Generate Candidate Survey,
open the Form it creates, submit one response as a fake candidate, then run Quiz
Tools → Sync Survey Responses. Report whether the answers landed in the correct
`Quiz_Data` column, and paste any error dialog verbatim.

Worth knowing before you rely on it: `emailSurveyToCandidates` in `Code.gs` only
displays a message template. It does not send mail.

### 5. Export the WordPress snippets (closes U8, ~5 minutes)

WP admin → the Headers and Footers plugin (docs mention `footer_code.txt` and
`BuildYourQuiz_code.txt`). Copy each snippet into this repo under `wordpress/`.
Until these are tracked, a WordPress edit can break embed generation for every
newsroom with no history and nobody to notice.

### 6. Answer from memory (closes U2 and U6, no clicking)

Fill in the blanks. "Live" means a real audience can reach it today.

| Spreadsheet ID | What it is for | Live or abandoned | Google account that owns it |
| --- | --- | --- | --- |
| `1B08mC5xl_crFRbNnOIKnPWvlSl1U9v_NDeLq73wa3o4` | Base template newsrooms copy | live | ? |
| `1Y2BprkPQC_9RNwZGQLPo5kLWS5lGqAyKFBOOJMJCeFA` | Homepage demo | live | ? |
| ? | ? | ? | ? |

Also needed:

- Are any real newsroom quizzes live right now? If yes, which sheets, on whose
  site, and is an election imminent? This sets how cautiously anything deploys.
- Did the survey generator ever create Google Forms that still exist?
- `template/archive/` holds an "At-Large Copy" and a "fish election quiz",
  which suggests at least two derived quizzes once existed. Do they still?
