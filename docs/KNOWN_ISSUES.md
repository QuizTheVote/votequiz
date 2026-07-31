# Known Issues

Originally audited 2026-07-31 against commit `78f66b5` (tagged `v2.4.0`), the
state deployed since 2025-10-20. Every item was reproduced, not inferred.

Updated 2026-07-31 after the fixes described in [UNKNOWNS.md](UNKNOWNS.md) and
the commits on branch `chore/consolidate-docs`. Fixed items are kept, marked, and
dated, because the audit trail is the point: several of these were introduced by
a change that looked safe.

## Fixed

### 1. Results screen renders nothing when any question is `Active = FALSE` — FIXED

The function that advanced to the results step counted *all* questions, while the
guard that decided whether to draw the results step counted only *active* ones.
When the two disagreed no branch matched and `<main>` rendered empty.

Introduced by `9d1eb75` ("CRITICAL FIX: Only display and score active
questions"), which added the active-question filter but only half-migrated the
step indexing.

Production had been spared only because the demo sheet and Base Template had
every row set to `Active = TRUE`, so the counts coincided by accident. It would
have fired the first time a newsroom deactivated a question, which the template
instructions encourage.

Both counts now come from `activeQuestions`. Covered by
`tests/quiz-flow.spec.ts`, which runs against a fixture that deliberately has 5
of 10 questions inactive.

### 2. Non-SVO mode reported every candidate as a non-responder — FIXED

The results screen split candidates on `(c.participationRate || 0) >= 0.5`, but
only the SVO scorers populated that field. On the legacy path `|| 0` sent every
candidate into the "Additional Candidates" bucket labelled "Did not respond to
survey", with no percentages at all. This is what the bare production URL showed.

A missing rate is now treated as absence of evidence rather than proof of
non-response. The legacy path has since been deleted outright (see 8).

### 3. Every navigation link on the About, Methodology and Newsroom pages 404ed — FIXED

The hrefs were root-absolute, so they discarded the `/votequiz` base path:

```
404  https://quizthevote.github.io/about.html
404  https://quizthevote.github.io/methodology.html
404  https://quizthevote.github.io/newsroom.html
404  https://quizthevote.github.io/
```

The `.html` suffix was not the problem, since adapter-static does emit those
files; the missing base path was. The "Try the Demo" buttons had the same defect.

The three pages now share one `SiteNav` component and route every href through
`base`. The build's `handleHttpError` is set to `fail`, so a recurrence breaks
the build rather than printing a warning nobody reads. Verified by clicking every
link in a production preview.

### 4. `candidate.website` did not exist — FIXED

The results screen guarded on and linked to `candidate.website`. The `Candidate`
interface has `link_url` and `link_text`, so no link ever rendered. Now reads
`link_url` with `link_text` as the label.

### 5. Inactive questions leaked into the answer comparison — FIXED

`EnhancedResults.svelte` filtered questions by topic but not by `active`, so the
View Answers panel listed questions nobody was asked and attributed them as
unanswered by every candidate. Now filtered.

### 8. Tabletop and the legacy non-SVO path — REMOVED

`tabletop` was a runtime dependency imported at the top of `src/lib/sheets.ts`,
so it shipped to every visitor. Tabletop.js is abandoned and targets a retired
Google Sheets API, so the non-SVO `?sheet=` path could only fail — and it was the
default whenever `svo=true` was absent.

Deleted along with `fetchSheetData`, `calculateMatches`,
`calculateWeightedMatches`, the duplicate 5-point question markup and the non-SVO
fixture, for a net reduction of about 735 lines. Everything now parses as SVO and
the `svo` parameter is an accepted no-op, so existing embeds keep working.

### 9. An absent or lowercase `Active` column emptied the quiz — FIXED

`active: row.Active === 'TRUE' || row.Active === true` meant a sheet with no
`Active` column marked every question inactive, and so did `true`, `Yes` or
`TRUE ` with a trailing space. The result was a quiz with nothing to ask.

Parsing is now tolerant of case and of yes/1, and an absent column means all
questions are active. A sheet where every question really is inactive now reports
that as an error rather than rendering an empty quiz.

## Open

### 6. The WordPress embed builder prefers the wrong Google Sheets URL form

Found while verifying U7. The generator on `quizthevote.com/build-your-quiz/`
extracts the sheet id like this:

```js
m=u.match(/\/spreadsheets\/d\/e\/([\w-]+)/); if(m)return m[1];   // checked FIRST
m=u.match(/\/spreadsheets\/d\/([\w-]+)/);   if(m)return m[1];
```

The `/d/e/` form is the **published-to-web** URL and it is tested first. A
newsroom that follows the instructions, which tell them to publish the
`Quiz_Data` tab, and then pastes the URL from that publish dialog gets its
`2PACX-...` token extracted instead of the sheet id. Those tokens run to roughly
89 characters and the app requires 30 to 50, so the voter sees a generic failure
with no indication of the cause.

This is why every instruction document insists on copying the address bar URL. A
tool that has to be documented around is a tool that should reject the bad input.

**Status:** the in-app copy of this generator
(`src/routes/newsroom/+page.svelte`) is fixed, and a corrected drop-in
replacement for WordPress is committed at
`wordpress/build-your-quiz.fixed.js`. Deploying it needs WP admin access, so it
remains open. See [../wordpress/README.md](../wordpress/README.md).

### 7. Results page overflows the recommended iframe height on mobile

Found while verifying U12. At a 390x844 viewport against the demo sheet, the
results step reports a `scrollHeight` of **967px** with all six candidates
collapsed. The builder's default iframe height is 900px and its slider tops out
at 1200px, so the default embed clips the results on a phone before the voter
expands anything. Expanding a candidate makes it substantially taller.

The real fix is for the app to post its height to the parent page and for the
embed snippet to listen, so the iframe follows its content. Raising the default
only moves the threshold.

### 10. Three implementations of the embed URL builder

The same string concatenation exists in the WordPress page, in
`src/routes/newsroom/+page.svelte`, and in the docs. They have already drifted:
the in-app version's Copy Template button pointed at sheet
`1XtS_4-k5yDvgBT_CAqYR9nsUXK9B5aREZPKaALF2LsE` while the live builder uses
`1B08mC5xl_crFRbNnOIKnPWvlSl1U9v_NDeLq73wa3o4`. Both now use `1B08mC5`, but
**which template is correct has not been confirmed** — see U2.

Worth deciding whether the in-app `/newsroom` page or the WordPress page is the
real builder, and deleting the other.

### 11. Two `<main>` elements on the quiz page

`src/routes/+layout.svelte` and `src/routes/+page.svelte` each declare one, so
the quiz page nests a `<main>` inside a `<main>`. That is invalid and confuses
screen readers and any tooling that looks for the main landmark.

## Maintenance

- **`npm run check` passes** (was 10 errors). CI now runs it, plus the Playwright
  suite, as a gate on deploy.
- **CI runs Node 22** (was end-of-life Node 18); `.nvmrc` records it.
- **Browser data (`caniuse-lite`) is over a year stale.** `npx update-browserslist-db@latest`.
- **No `npm run lint`** and no lint config.
- **Three `svelte-check` warnings remain**: a drag handler without an ARIA role
  in `TopicImportanceRanker.svelte`, an unassociated form label in
  `newsroom/+page.svelte`, and the `@apply` at-rule, which is a false positive.
- **The `elex-quiz-app/` directory** at the workspace root is an untouched
  `npx sv create` scaffold, still serving "Welcome to SvelteKit". It is not in
  any git repository, so deleting it cannot be undone from history. Awaiting a
  decision.

## Not tracked in version control

- The Base Template spreadsheet lives in Google Drive; only a snapshot is
  committed under `template/`.
- The Apps Script lives in Google's editor. `apps-script/Code.gs` is a committed
  extraction that has never been diffed against what is installed (U1). `clasp`
  is now configured to make that a two-way sync.
- The WordPress generator is captured under `wordpress/` from the live page, but
  the source of record is still in WP admin (U8).
